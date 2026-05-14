import { ethers } from "hardhat";

// Supabase mock UUID
const mockTandaId = "d41f5312-214e-4030-8047-1a7743bcbc39";
// Convert UUID to uint256
const tandaIdUint = BigInt("0x" + mockTandaId.replace(/-/g, ""));

const MOCK_MXNB_ADDRESS = process.env.NEXT_PUBLIC_MXNB_TOKEN_ADDRESS || "";
const ESCROW_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || "";

async function main() {
  if (!MOCK_MXNB_ADDRESS || !ESCROW_ADDRESS) {
    throw new Error("Missing NEXT_PUBLIC_MXNB_TOKEN_ADDRESS or NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS in .env.local");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Seeding contracts with the deployer account:", deployer.address);
  console.log("MockMXNB:", MOCK_MXNB_ADDRESS);
  console.log("TandaEscrow:", ESCROW_ADDRESS);

  const mockMXNB = await ethers.getContractAt("MockMXNB", MOCK_MXNB_ADDRESS);
  const tandaEscrow = await ethers.getContractAt("TandaEscrow", ESCROW_ADDRESS);

  // We want to simulate 5 deposits of 500 MXNB
  const totalDeposit = ethers.parseUnits("2500", 18);
  const depositAmount = ethers.parseUnits("500", 18);

  console.log("\nStarting Seed Process from Deployer...");

  // 1. Ensure deployer has enough MXNB
  const balance = await mockMXNB.balanceOf(deployer.address);
  if (balance < totalDeposit) {
      console.log(`Minting ${ethers.formatUnits(totalDeposit, 18)} MXNB to deployer...`);
      let tx = await mockMXNB.mint(deployer.address, totalDeposit);
      await tx.wait();
  }

  // 2. Approve Escrow for total
  console.log(`Approving Escrow for ${ethers.formatUnits(totalDeposit, 18)} MXNB...`);
  let tx = await mockMXNB.approve(ESCROW_ADDRESS, totalDeposit);
  await tx.wait();

  // 3. Perform 5 separate deposits to simulate multiple members
  for (let i = 1; i <= 5; i++) {
      console.log(`Deposit ${i}/5: Depositing ${ethers.formatUnits(depositAmount, 18)} MXNB into Tanda ${mockTandaId}...`);
      let txDep = await tandaEscrow.deposit(tandaIdUint, depositAmount);
      await txDep.wait();
      console.log(`✅ Deposit ${i} successful. Tx Hash: ${txDep.hash}`);
  }

  const tandaBalance = await tandaEscrow.tandaBalances(tandaIdUint);
  console.log(`\n✅ Finished! Tanda ${mockTandaId} now has ${ethers.formatUnits(tandaBalance, 18)} MXNB in Escrow.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
