---

title:  Leetcode股票问题
date:  2020-04-20 19:41:06
spoiler: Leetcode股票问题汇总

---

最近刷Leetcode发现了一个股票问题系列，总结一下


<!-- more -->

## 第一题 上手

[121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)


一个典型的动态规划问题，我们需要解决的问题是找到一个连续子序列，这个子序列首位差值最大。
定义`dp[i]`是以第`i`天卖出的最大收益，`price[i]`为第`i`天股票价格，则有:

```js
dp[i] = Math.max(0, dp[i - 1] + (price[i] - price[i - 1]))
```

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
const maxProfit = function (prices) {
  if (prices.length <= 1) {
    return 0;
  }
  const dp = Array.from({ length: prices.length }).fill(0);
  dp[0] = 0;
  let max = 0
  for (let index = 1; index < dp.length; index++) {
    const prev = prices[index - 1];
    const current = prices[index];
    const diff = (current -prev);
    dp[index] = Math.max(0, dp[index - 1] + diff);
    max = Math.max(dp[index], max)
  }
  return max
};

```
