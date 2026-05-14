import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractTransactionResponse } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TandaEscrow", function () {
  let mockMXNB: any;
  let tandaEscrow: any;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  const TANDA_ID = 1;
  const DEPOSIT_AMOUNT = ethers.parseUnits("1000", 18);

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const MockMXNBFactory = await ethers.getContractFactory("MockMXNB");
    mockMXNB = await MockMXNBFactory.deploy();

    const TandaEscrowFactory = await ethers.getContractFactory("TandaEscrow");
    tandaEscrow = await TandaEscrowFactory.deploy(await mockMXNB.getAddress());

    // Mint tokens to users
    await mockMXNB.mint(user1.address, ethers.parseUnits("5000", 18));
    await mockMXNB.mint(user2.address, ethers.parseUnits("5000", 18));
  });

  describe("Deposits", function () {
    it("Should allow a user to deposit MXNB into escrow", async function () {
      // Approve the escrow contract
      await mockMXNB.connect(user1).approve(await tandaEscrow.getAddress(), DEPOSIT_AMOUNT);

      // Deposit
      const tx = await tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT);
      await expect(tx)
        .to.emit(tandaEscrow, "DepositReceived")
        .withArgs(user1.address, TANDA_ID, DEPOSIT_AMOUNT);

      // Check balance
      expect(await mockMXNB.balanceOf(await tandaEscrow.getAddress())).to.equal(DEPOSIT_AMOUNT);
    });

    it("Should revert if deposit amount is zero", async function () {
      await expect(
        tandaEscrow.connect(user1).deposit(TANDA_ID, 0)
      ).to.be.revertedWith("Deposit amount must be greater than zero");
    });
  });

  describe("Payouts", function () {
    beforeEach(async function () {
      await mockMXNB.connect(user1).approve(await tandaEscrow.getAddress(), DEPOSIT_AMOUNT);
      await tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT);
      
      await mockMXNB.connect(user2).approve(await tandaEscrow.getAddress(), DEPOSIT_AMOUNT);
      await tandaEscrow.connect(user2).deposit(TANDA_ID, DEPOSIT_AMOUNT);
    });

    it("Should allow the admin to trigger a payout to the round winner", async function () {
      const payoutAmount = DEPOSIT_AMOUNT * 2n;

      const tx = await tandaEscrow.connect(owner).triggerPayout(user2.address, TANDA_ID, payoutAmount);
      await expect(tx)
        .to.emit(tandaEscrow, "PayoutExecuted")
        .withArgs(user2.address, TANDA_ID, payoutAmount);

      expect(await mockMXNB.balanceOf(await tandaEscrow.getAddress())).to.equal(0);
      expect(await mockMXNB.balanceOf(user2.address)).to.equal(ethers.parseUnits("6000", 18));
    });

    it("Should revert if a non-admin tries to trigger a payout", async function () {
      await expect(
        tandaEscrow.connect(user1).triggerPayout(user2.address, TANDA_ID, DEPOSIT_AMOUNT)
      ).to.be.revertedWithCustomError(tandaEscrow, "OwnableUnauthorizedAccount");
    });

    it("Should revert if there are insufficient funds", async function () {
      const excessiveAmount = ethers.parseUnits("10000", 18);
      await expect(
        tandaEscrow.connect(owner).triggerPayout(user2.address, TANDA_ID, excessiveAmount)
      ).to.be.revertedWith("Insufficient funds in escrow");
    });
  });
});
