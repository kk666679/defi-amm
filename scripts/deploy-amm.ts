import { network } from "hardhat";

const { ethers } = await network.create("localhost");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const A = await ethers.getContractFactory("TokenA");
  const tokenA = await A.deploy();
  await tokenA.waitForDeployment();

  const B = await ethers.getContractFactory("TokenB");
  const tokenB = await B.deploy();
  await tokenB.waitForDeployment();

  const M = await ethers.getContractFactory("SimpleAMM");
  const amm = await M.deploy(await tokenA.getAddress(), await tokenB.getAddress());
  await amm.waitForDeployment();

  console.log("TokenA:", await tokenA.getAddress());
  console.log("TokenB:", await tokenB.getAddress());
  console.log("AMM   :", await amm.getAddress());

  const amt = ethers.parseEther("10000");
  await (await tokenA.approve(await amm.getAddress(), amt)).wait();
  await (await tokenB.approve(await amm.getAddress(), amt)).wait();
  await (await amm.addLiquidity(amt, amt)).wait();
  console.log("Liquidity added: 10,000 / 10,000");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
