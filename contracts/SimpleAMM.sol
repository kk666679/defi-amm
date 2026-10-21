// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract SimpleAMM {
    IERC20 public immutable tokenA;
    IERC20 public immutable tokenB;
    uint256 public reserveA;
    uint256 public reserveB;
    event Swap(address indexed user, address tokenIn, uint256 amountIn, uint256 amountOut);
    event LiquidityAdded(uint256 amountA, uint256 amountB);
    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }
    function addLiquidity(uint256 amountA, uint256 amountB) external {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        reserveA += amountA;
        reserveB += amountB;
        emit LiquidityAdded(amountA, amountB);
    }
    function swapAForB(uint256 amountAIn) external returns (uint256 amountBOut) {
        tokenA.transferFrom(msg.sender, address(this), amountAIn);
        uint256 a = amountAIn * 997;
        amountBOut = (a * reserveB) / (reserveA * 1000 + a);
        reserveA += amountAIn;
        reserveB -= amountBOut;
        tokenB.transfer(msg.sender, amountBOut);
        emit Swap(msg.sender, address(tokenA), amountAIn, amountBOut);
    }
    function swapBForA(uint256 amountBIn) external returns (uint256 amountAOut) {
        tokenB.transferFrom(msg.sender, address(this), amountBIn);
        uint256 b = amountBIn * 997;
        amountAOut = (b * reserveA) / (reserveB * 1000 + b);
        reserveB += amountBIn;
        reserveA -= amountAOut;
        tokenA.transfer(msg.sender, amountAOut);
        emit Swap(msg.sender, address(tokenB), amountBIn, amountAOut);
    }
}
