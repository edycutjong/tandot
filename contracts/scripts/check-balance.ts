import { ethers } from "hardhat";

async function main() {
    const [d] = await ethers.getSigners(); 
    console.log('Deployer balance:', ethers.formatEther(await ethers.provider.getBalance(d.address))); 
    
    const tx = await d.sendTransaction({
        to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        value: ethers.parseEther("0.001")
    });
    console.log("Tx hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("Status:", receipt?.status);
    
    console.log('User1 balance:', ethers.formatEther(await ethers.provider.getBalance('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')));
}

main();
