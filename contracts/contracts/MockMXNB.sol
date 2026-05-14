// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockMXNB
 * @dev Mock stablecoin for testing the TandaEscrow flow.
 * Mint is restricted to the deployer (owner) to prevent demo sabotage on testnet.
 */
contract MockMXNB is ERC20, Ownable {
    constructor() ERC20("Mexican Peso Stablecoin", "MXNB") Ownable(msg.sender) {
        // Mint 10 million tokens to the deployer for testing
        _mint(msg.sender, 10_000_000 * 10 ** decimals());
    }

    /**
     * @dev Mint tokens for testing. Restricted to owner to prevent abuse on testnet.
     * @param to The address to mint tokens to.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
