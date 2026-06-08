// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TandaEscrow
 * @dev A secure escrow contract that holds MXNB tokens for rotating savings circles (tandas).
 * The AI-managed backend acts as the admin (owner) to trigger payouts based on verified
 * logic and trust scores.
 *
 * Security features:
 * - ReentrancyGuard: Prevents reentrant calls on deposit/payout
 * - Pausable: Emergency circuit breaker for all operations
 * - Ownable2Step: Safe two-step ownership transfer
 * - Per-tanda accounting: Isolated balance tracking prevents cross-tanda fund leakage
 */
contract TandaEscrow is Ownable2Step, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // The stablecoin used for the Tanda (e.g. MXNB)
    IERC20 public immutable paymentToken;

    // Per-tanda balance tracking — prevents cross-tanda fund leakage
    mapping(uint256 => uint256) public tandaBalances;

    // Per-user per-tanda deposit tracking — enables refund & audit
    mapping(address => mapping(uint256 => uint256)) public userDeposits;

    // Track canceled tandas to enable trustless user refunds
    mapping(uint256 => bool) public tandaCanceled;

    // Events
    /// @param user The address that deposited tokens
    /// @param tandaId The unique identifier of the tanda round
    /// @param amount The amount of tokens deposited
    event DepositReceived(address indexed user, uint256 indexed tandaId, uint256 amount);

    /// @param recipient The address that received the payout
    /// @param tandaId The unique identifier of the tanda round
    /// @param amount The amount of tokens paid out
    event PayoutExecuted(address indexed recipient, uint256 indexed tandaId, uint256 amount);

    /// @param owner The admin address that executed the emergency withdrawal
    /// @param amount The total amount of tokens withdrawn
    event EmergencyWithdraw(address indexed owner, uint256 amount);

    /// @param tandaId The unique identifier of the canceled tanda round
    event TandaCanceled(uint256 indexed tandaId);

    /// @param user The address that claimed the refund
    /// @param tandaId The unique identifier of the canceled tanda round
    /// @param amount The amount of tokens refunded
    event RefundClaimed(address indexed user, uint256 indexed tandaId, uint256 amount);

    /// @param token The address of the payment token configured at deployment
    event EscrowInitialized(address indexed token);

    /**
     * @param _paymentToken The address of the MXNB token contract.
     */
    constructor(address _paymentToken) Ownable(msg.sender) {
        require(_paymentToken != address(0), "Invalid token address");
        paymentToken = IERC20(_paymentToken);
        emit EscrowInitialized(_paymentToken);
    }

    /**
     * @dev Allows users to deposit MXNB tokens for a specific Tanda.
     * Ensure users have approved this contract to spend `amount` beforehand.
     * @param tandaId The unique ID of the Tanda round.
     * @param amount The amount of MXNB to deposit.
     */
    function deposit(uint256 tandaId, uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Deposit amount must be greater than zero");

        paymentToken.safeTransferFrom(msg.sender, address(this), amount);
        tandaBalances[tandaId] += amount;
        userDeposits[msg.sender][tandaId] += amount;
        emit DepositReceived(msg.sender, tandaId, amount);
    }

    /**
     * @dev Called by the AI backend (admin) to release funds to the round winner.
     * Payout is scoped to the specific tanda's balance — cannot drain other tandas.
     * @param recipient The address of the Tanda round winner.
     * @param tandaId The unique ID of the Tanda round.
     * @param amount The amount of MXNB to pay out.
     */
    function triggerPayout(address recipient, uint256 tandaId, uint256 amount) external onlyOwner nonReentrant whenNotPaused {
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Payout amount must be greater than zero");
        require(tandaBalances[tandaId] >= amount, "Insufficient tanda funds");

        tandaBalances[tandaId] -= amount;
        paymentToken.safeTransfer(recipient, amount);
        emit PayoutExecuted(recipient, tandaId, amount);
    }

    /**
     * @dev Cancels a tanda. Only callable by the admin (AI Backend).
     * @param tandaId The unique ID of the Tanda round.
     */
    function cancelTanda(uint256 tandaId) external onlyOwner whenNotPaused {
        require(!tandaCanceled[tandaId], "Tanda already canceled");
        tandaCanceled[tandaId] = true;
        emit TandaCanceled(tandaId);
    }

    /**
     * @dev Allows users to claim their refund if a tanda is canceled.
     * Shifts the gas cost of refunds from the admin to the user.
     * @param tandaId The unique ID of the Tanda round.
     */
    function claimRefund(uint256 tandaId) external nonReentrant whenNotPaused {
        require(tandaCanceled[tandaId], "Tanda is not canceled");
        uint256 amount = userDeposits[msg.sender][tandaId];
        require(amount > 0, "No funds to claim");

        userDeposits[msg.sender][tandaId] = 0;
        tandaBalances[tandaId] -= amount;
        
        paymentToken.safeTransfer(msg.sender, amount);
        emit RefundClaimed(msg.sender, tandaId, amount);
    }

    /**
     * @dev Emergency mechanism for the admin to withdraw all funds.
     * Use only in case of critical vulnerability or contract migration.
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");

        paymentToken.safeTransfer(owner(), balance);
        emit EmergencyWithdraw(owner(), balance);
    }

    /**
     * @dev Pauses all deposit and payout operations. Only callable by the admin.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses all operations. Only callable by the admin.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
