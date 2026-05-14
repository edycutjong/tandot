// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockMXNB
 * @dev Mock stablecoin for testing the TandaEscrow flow.
 */
contract MockMXNB is ERC20 {
    constructor() ERC20("Mexican Peso Stablecoin", "MXNB") {
        // Mint 10 million tokens to the deployer for testing
        _mint(msg.sender, 10_000_000 * 10 ** decimals());
    }

    /**
     * @dev Expose a public mint function to allow testing
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
