import { ethers } from "hardhat";

async function main() {
  const Factory = await ethers.getContractFactory("SimpleNft");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();
  console.log("SimpleNft deployed to:", await contract.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
