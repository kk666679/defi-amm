import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { network } from "hardhat";

const { ethers } = await network.create("localhost");

async function saveFrontendAddresses(addresses: Record<string, string>) {
  const envPath = resolve("frontend/.env.local");
  const existing = await readFile(envPath, "utf8").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return "";
    throw error;
  });
  const keys = Object.keys(addresses);
  const preserved = existing
    .split(/\r?\n/)
    .filter((line) => !keys.some((key) => line.startsWith(`${key}=`)));
  const next = [...preserved.filter(Boolean), ...keys.map((key) => `${key}=${addresses[key]}`)].join("\n");
  await writeFile(envPath, `${next}\n`, "utf8");
  console.log("Saved local contract addresses to frontend/.env.local (other existing values preserved).");
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const safeAddress = /^0x[0-9a-fA-F]{40}$/.test(deployer.address) ? deployer.address : "[invalid address]";
  console.log("Deployer:", safeAddress);

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

  await saveFrontendAddresses({
    NEXT_PUBLIC_AMM_ADDRESS: await amm.getAddress(),
    NEXT_PUBLIC_TOKEN_A_ADDRESS: await tokenA.getAddress(),
    NEXT_PUBLIC_TOKEN_B_ADDRESS: await tokenB.getAddress(),
  });
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
