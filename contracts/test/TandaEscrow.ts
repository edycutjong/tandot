import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TandaEscrow", function () {
  let mockMXNB: any;
  let tandaEscrow: any;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  const TANDA_ID = 1;
  const TANDA_ID_2 = 2;
  const DEPOSIT_AMOUNT = ethers.parseUnits("1000", 18);

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const MockMXNBFactory = await ethers.getContractFactory("MockMXNB");
    mockMXNB = await MockMXNBFactory.deploy();

    const TandaEscrowFactory = await ethers.getContractFactory("TandaEscrow");
    tandaEscrow = await TandaEscrowFactory.deploy(await mockMXNB.getAddress());

    // Mint tokens to users (owner is the MockMXNB owner)
    await mockMXNB.mint(user1.address, ethers.parseUnits("5000", 18));
    await mockMXNB.mint(user2.address, ethers.parseUnits("5000", 18));
  });

  // ─────────────────────────────────────────────────────────
  // Constructor
  // ─────────────────────────────────────────────────────────
  describe("Constructor", function () {
    it("Should set the correct payment token", async function () {
      expect(await tandaEscrow.paymentToken()).to.equal(await mockMXNB.getAddress());
    });

    it("Should set deployer as owner", async function () {
      expect(await tandaEscrow.owner()).to.equal(owner.address);
    });

    it("Should emit EscrowInitialized event", async function () {
      const TandaEscrowFactory = await ethers.getContractFactory("TandaEscrow");
      const tx = await TandaEscrowFactory.deploy(await mockMXNB.getAddress());
      await expect(tx.deploymentTransaction())
        .to.emit(tx, "EscrowInitialized")
        .withArgs(await mockMXNB.getAddress());
    });

    it("Should revert if payment token is zero address", async function () {
      const TandaEscrowFactory = await ethers.getContractFactory("TandaEscrow");
      await expect(
        TandaEscrowFactory.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid token address");
    });
  });

  // ─────────────────────────────────────────────────────────
  // Deposits
  // ─────────────────────────────────────────────────────────
  describe("Deposits", function () {
    it("Should allow a user to deposit MXNB into escrow", async function () {
      await mockMXNB.connect(user1).approve(await tandaEscrow.getAddress(), DEPOSIT_AMOUNT);

      const tx = await tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT);
      await expect(tx)
        .to.emit(tandaEscrow, "DepositReceived")
        .withArgs(user1.address, TANDA_ID, DEPOSIT_AMOUNT);

      // Check contract balance
      expect(await mockMXNB.balanceOf(await tandaEscrow.getAddress())).to.equal(DEPOSIT_AMOUNT);
    });

    it("Should track per-tanda balance correctly", async function () {
      await mockMXNB.connect(user1).approve(await tandaEscrow.getAddress(), DEPOSIT_AMOUNT);
      await tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT);

      expect(await tandaEscrow.tandaBalances(TANDA_ID)).to.equal(DEPOSIT_AMOUNT);
      expect(await tandaEscrow.tandaBalances(TANDA_ID_2)).to.equal(0);
    });

    it("Should track per-user per-tanda deposits", async function () {
      await mockMXNB.connect(user1).approve(await tandaEscrow.getAddress(), DEPOSIT_AMOUNT);
      await tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT);

      expect(await tandaEscrow.userDeposits(user1.address, TANDA_ID)).to.equal(DEPOSIT_AMOUNT);
      expect(await tandaEscrow.userDeposits(user2.address, TANDA_ID)).to.equal(0);
    });

    it("Should accumulate double deposits by the same user", async function () {
      const totalAmount = DEPOSIT_AMOUNT * 2n;
      await mockMXNB.connect(user1).approve(await tandaEscrow.getAddress(), totalAmount);

      await tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT);
      await tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT);

      expect(await tandaEscrow.tandaBalances(TANDA_ID)).to.equal(totalAmount);
      expect(await tandaEscrow.userDeposits(user1.address, TANDA_ID)).to.equal(totalAmount);
    });

    it("Should isolate balances between different tandas", async function () {
      await mockMXNB.connect(user1).approve(await tandaEscrow.getAddress(), DEPOSIT_AMOUNT * 2n);
      await tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT);
      await tandaEscrow.connect(user1).deposit(TANDA_ID_2, DEPOSIT_AMOUNT);

      expect(await tandaEscrow.tandaBalances(TANDA_ID)).to.equal(DEPOSIT_AMOUNT);
      expect(await tandaEscrow.tandaBalances(TANDA_ID_2)).to.equal(DEPOSIT_AMOUNT);
    });

    it("Should revert if deposit amount is zero", async function () {
      await expect(
        tandaEscrow.connect(user1).deposit(TANDA_ID, 0)
      ).to.be.revertedWith("Deposit amount must be greater than zero");
    });

    it("Should revert if user has not approved the transfer", async function () {
      // No approve() call — should fail on safeTransferFrom
      await expect(
        tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT)
      ).to.be.reverted;
    });

    it("Should revert if contract is paused", async function () {
      await tandaEscrow.connect(owner).pause();
      await mockMXNB.connect(user1).approve(await tandaEscrow.getAddress(), DEPOSIT_AMOUNT);

      await expect(
        tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT)
      ).to.be.revertedWithCustomError(tandaEscrow, "EnforcedPause");
    });
  });

  // ─────────────────────────────────────────────────────────
  // Payouts
  // ─────────────────────────────────────────────────────────
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

    it("Should decrement per-tanda balance on payout", async function () {
      await tandaEscrow.connect(owner).triggerPayout(user2.address, TANDA_ID, DEPOSIT_AMOUNT);

      expect(await tandaEscrow.tandaBalances(TANDA_ID)).to.equal(DEPOSIT_AMOUNT);
    });

    it("Should revert if a non-admin tries to trigger a payout", async function () {
      await expect(
        tandaEscrow.connect(user1).triggerPayout(user2.address, TANDA_ID, DEPOSIT_AMOUNT)
      ).to.be.revertedWithCustomError(tandaEscrow, "OwnableUnauthorizedAccount");
    });

    it("Should revert if recipient is zero address", async function () {
      await expect(
        tandaEscrow.connect(owner).triggerPayout(ethers.ZeroAddress, TANDA_ID, DEPOSIT_AMOUNT)
      ).to.be.revertedWith("Invalid recipient address");
    });

    it("Should revert if payout amount is zero", async function () {
      await expect(
        tandaEscrow.connect(owner).triggerPayout(user2.address, TANDA_ID, 0)
      ).to.be.revertedWith("Payout amount must be greater than zero");
    });

    it("Should revert if tanda has insufficient funds", async function () {
      const excessiveAmount = ethers.parseUnits("10000", 18);
      await expect(
        tandaEscrow.connect(owner).triggerPayout(user2.address, TANDA_ID, excessiveAmount)
      ).to.be.revertedWith("Insufficient tanda funds");
    });

    it("Should prevent cross-tanda fund leakage", async function () {
      // Tanda 1 has 2000 MXNB, Tanda 2 has 0
      // Attempting to payout from Tanda 2 should fail even though contract has funds
      await expect(
        tandaEscrow.connect(owner).triggerPayout(user2.address, TANDA_ID_2, DEPOSIT_AMOUNT)
      ).to.be.revertedWith("Insufficient tanda funds");
    });

    it("Should revert if contract is paused", async function () {
      await tandaEscrow.connect(owner).pause();

      await expect(
        tandaEscrow.connect(owner).triggerPayout(user2.address, TANDA_ID, DEPOSIT_AMOUNT)
      ).to.be.revertedWithCustomError(tandaEscrow, "EnforcedPause");
    });
  });

  // ─────────────────────────────────────────────────────────
  // Cancellation and Refunds
  // ─────────────────────────────────────────────────────────
  describe("Cancellation and Refunds", function () {
    beforeEach(async function () {
      await mockMXNB.connect(user1).approve(await tandaEscrow.getAddress(), DEPOSIT_AMOUNT);
      await tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT);
    });

    it("Should allow admin to cancel a tanda", async function () {
      const tx = await tandaEscrow.connect(owner).cancelTanda(TANDA_ID);
      await expect(tx)
        .to.emit(tandaEscrow, "TandaCanceled")
        .withArgs(TANDA_ID);

      expect(await tandaEscrow.tandaCanceled(TANDA_ID)).to.be.true;
    });

    it("Should revert if non-admin tries to cancel a tanda", async function () {
      await expect(
        tandaEscrow.connect(user1).cancelTanda(TANDA_ID)
      ).to.be.revertedWithCustomError(tandaEscrow, "OwnableUnauthorizedAccount");
    });

    it("Should revert if tanda is already canceled", async function () {
      await tandaEscrow.connect(owner).cancelTanda(TANDA_ID);
      await expect(
        tandaEscrow.connect(owner).cancelTanda(TANDA_ID)
      ).to.be.revertedWith("Tanda already canceled");
    });

    it("Should allow user to claim refund if tanda is canceled", async function () {
      await tandaEscrow.connect(owner).cancelTanda(TANDA_ID);
      
      const tx = await tandaEscrow.connect(user1).claimRefund(TANDA_ID);
      await expect(tx)
        .to.emit(tandaEscrow, "RefundClaimed")
        .withArgs(user1.address, TANDA_ID, DEPOSIT_AMOUNT);

      expect(await mockMXNB.balanceOf(await tandaEscrow.getAddress())).to.equal(0);
      expect(await mockMXNB.balanceOf(user1.address)).to.equal(ethers.parseUnits("5000", 18));
      expect(await tandaEscrow.tandaBalances(TANDA_ID)).to.equal(0);
      expect(await tandaEscrow.userDeposits(user1.address, TANDA_ID)).to.equal(0);
    });

    it("Should revert if user tries to claim refund for active tanda", async function () {
      await expect(
        tandaEscrow.connect(user1).claimRefund(TANDA_ID)
      ).to.be.revertedWith("Tanda is not canceled");
    });

    it("Should revert if user has no funds to claim", async function () {
      await tandaEscrow.connect(owner).cancelTanda(TANDA_ID);
      await expect(
        tandaEscrow.connect(user2).claimRefund(TANDA_ID)
      ).to.be.revertedWith("No funds to claim");
    });

    it("Should prevent double-refunds", async function () {
      await tandaEscrow.connect(owner).cancelTanda(TANDA_ID);
      await tandaEscrow.connect(user1).claimRefund(TANDA_ID);

      await expect(
        tandaEscrow.connect(user1).claimRefund(TANDA_ID)
      ).to.be.revertedWith("No funds to claim");
    });
  });

  // ─────────────────────────────────────────────────────────
  // Emergency Withdraw
  // ─────────────────────────────────────────────────────────
  describe("Emergency Withdraw", function () {
    it("Should allow owner to withdraw all funds", async function () {
      // Deposit some funds first
      await mockMXNB.connect(user1).approve(await tandaEscrow.getAddress(), DEPOSIT_AMOUNT);
      await tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT);

      const tx = await tandaEscrow.connect(owner).emergencyWithdraw();
      await expect(tx)
        .to.emit(tandaEscrow, "EmergencyWithdraw")
        .withArgs(owner.address, DEPOSIT_AMOUNT);

      expect(await mockMXNB.balanceOf(await tandaEscrow.getAddress())).to.equal(0);
      // Owner received: initial 10M (from MockMXNB deploy) - 5k (minted to user1) - 5k (minted to user2) + 1k (withdrawn)
      // But actually owner's initial mint is 10M, then they minted 5k to user1 and 5k to user2
      // So owner had 10M initially, minted 5k+5k from supply. Owner balance = 10M.
      // After emergency withdraw, owner gets +1k back
    });

    it("Should revert if called by non-owner", async function () {
      await mockMXNB.connect(user1).approve(await tandaEscrow.getAddress(), DEPOSIT_AMOUNT);
      await tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT);

      await expect(
        tandaEscrow.connect(user1).emergencyWithdraw()
      ).to.be.revertedWithCustomError(tandaEscrow, "OwnableUnauthorizedAccount");
    });

    it("Should revert if there are no funds to withdraw", async function () {
      await expect(
        tandaEscrow.connect(owner).emergencyWithdraw()
      ).to.be.revertedWith("No funds to withdraw");
    });
  });

  // ─────────────────────────────────────────────────────────
  // Pausable
  // ─────────────────────────────────────────────────────────
  describe("Pausable", function () {
    it("Should allow owner to pause and unpause", async function () {
      await tandaEscrow.connect(owner).pause();
      expect(await tandaEscrow.paused()).to.be.true;

      await tandaEscrow.connect(owner).unpause();
      expect(await tandaEscrow.paused()).to.be.false;
    });

    it("Should revert if non-owner tries to pause", async function () {
      await expect(
        tandaEscrow.connect(user1).pause()
      ).to.be.revertedWithCustomError(tandaEscrow, "OwnableUnauthorizedAccount");
    });

    it("Should allow deposits after unpause", async function () {
      await tandaEscrow.connect(owner).pause();
      await tandaEscrow.connect(owner).unpause();

      await mockMXNB.connect(user1).approve(await tandaEscrow.getAddress(), DEPOSIT_AMOUNT);
      await expect(
        tandaEscrow.connect(user1).deposit(TANDA_ID, DEPOSIT_AMOUNT)
      ).to.not.be.reverted;
    });
  });

  // ─────────────────────────────────────────────────────────
  // MockMXNB Access Control
  // ─────────────────────────────────────────────────────────
  describe("MockMXNB Access Control", function () {
    it("Should allow owner to mint", async function () {
      const amount = ethers.parseUnits("100", 18);
      await expect(
        mockMXNB.connect(owner).mint(user1.address, amount)
      ).to.not.be.reverted;
    });

    it("Should revert if non-owner tries to mint", async function () {
      const amount = ethers.parseUnits("100", 18);
      await expect(
        mockMXNB.connect(user1).mint(user1.address, amount)
      ).to.be.revertedWithCustomError(mockMXNB, "OwnableUnauthorizedAccount");
    });
  });
});
