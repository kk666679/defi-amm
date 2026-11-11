import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

async function deployPool() {
  const [owner, trader] = await ethers.getSigners();
  const tokenA = await ethers.deployContract("TokenA");
  const tokenB = await ethers.deployContract("TokenB");
  const amm = await ethers.deployContract("SimpleAMM", [await tokenA.getAddress(), await tokenB.getAddress()]);
  const liquidity = ethers.parseEther("1000");
  await tokenA.approve(await amm.getAddress(), liquidity);
  await tokenB.approve(await amm.getAddress(), liquidity);
  await amm.addLiquidity(liquidity, liquidity);
  await tokenA.transfer(trader.address, ethers.parseEther("10"));
  await tokenB.transfer(trader.address, ethers.parseEther("10"));
  return { owner, trader, tokenA, tokenB, amm, liquidity };
}

describe("SimpleAMM", function () {
  it("executes a constant-product swap when the minimum output is met", async function () {
    const { trader, tokenA, tokenB, amm, liquidity } = await deployPool();
    const amountIn = ethers.parseEther("1");
    const amountOut = (amountIn * 997n * liquidity) / (liquidity * 1000n + amountIn * 997n);
    await tokenA.connect(trader).approve(await amm.getAddress(), amountIn);

    await expect(amm.connect(trader).swapAForBMinOut(amountIn, amountOut))
      .to.emit(amm, "Swap")
      .withArgs(trader.address, await tokenA.getAddress(), amountIn, amountOut);

    expect(await tokenB.balanceOf(trader.address)).to.equal(ethers.parseEther("10") + amountOut);
    expect(await amm.reserveA()).to.equal(liquidity + amountIn);
    expect(await amm.reserveB()).to.equal(liquidity - amountOut);
  });

  it("reverts and leaves reserves unchanged when slippage exceeds tolerance", async function () {
    const { trader, tokenA, amm, liquidity } = await deployPool();
    const amountIn = ethers.parseEther("1");
    const amountOut = (amountIn * 997n * liquidity) / (liquidity * 1000n + amountIn * 997n);
    await tokenA.connect(trader).approve(await amm.getAddress(), amountIn);

    await expect(amm.connect(trader).swapAForBMinOut(amountIn, amountOut + 1n))
      .to.be.revertedWithCustomError(amm, "SlippageExceeded")
      .withArgs(amountOut, amountOut + 1n);

    expect(await amm.reserveA()).to.equal(liquidity);
    expect(await amm.reserveB()).to.equal(liquidity);
  });
});
