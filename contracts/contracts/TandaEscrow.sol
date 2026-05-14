// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TandaEscrow
 * @dev A secure escrow contract that holds MXNB tokens for rotating savings circles (tandas).
 * The AI-managed backend acts as the admin (owner) to trigger payouts based on verified
 * logic and trust scores.
 */
contract TandaEscrow is Ownable {
    using SafeERC20 for IERC20;

    // The stablecoin used for the Tanda (e.g. MXNB)
    IERC20 public immutable paymentToken;

    // Events
    event DepositReceived(address indexed user, uint256 indexed tandaId, uint256 amount);
    event PayoutExecuted(address indexed recipient, uint256 indexed tandaId, uint256 amount);
    event EmergencyWithdraw(address indexed owner, uint256 amount);

    /**
     * @param _paymentToken The address of the MXNB token contract.
     */
    constructor(address _paymentToken) Ownable(msg.sender) {
        require(_paymentToken != address(0), "Invalid token address");
        paymentToken = IERC20(_paymentToken);
    }

    /**
     * @dev Allows users to deposit MXNB tokens for a specific Tanda.
     * Ensure users have approved this contract to spend `amount` beforehand.
     * @param tandaId The unique ID of the Tanda round.
     * @param amount The amount of MXNB to deposit.
     */
    function deposit(uint256 tandaId, uint256 amount) external {
        require(amount > 0, "Deposit amount must be greater than zero");

        paymentToken.safeTransferFrom(msg.sender, address(this), amount);
        emit DepositReceived(msg.sender, tandaId, amount);
    }

    /**
     * @dev Called by the AI backend (admin) to release funds to the round winner.
     * @param recipient The address of the Tanda round winner.
     * @param tandaId The unique ID of the Tanda round.
     * @param amount The amount of MXNB to pay out.
     */
    function triggerPayout(address recipient, uint256 tandaId, uint256 amount) external onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Payout amount must be greater than zero");
        
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance >= amount, "Insufficient funds in escrow");

        paymentToken.safeTransfer(recipient, amount);
        emit PayoutExecuted(recipient, tandaId, amount);
    }

    /**
     * @dev Emergency mechanism for the admin to withdraw stuck funds.
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");

        paymentToken.safeTransfer(owner(), balance);
        emit EmergencyWithdraw(owner(), balance);
    }
}
