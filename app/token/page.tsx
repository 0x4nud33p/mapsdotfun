"use client";

import TokenScanner, { TokenScannerProps } from "@/components/TokenScanner";

const mockData: TokenScannerProps = {
  tokenMetadata: {
    name: "MapsDotFun Token",
    symbol: "MAPS",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
    totalSupply: 1000000000,
    liquidityPool: "0x8Ac76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    topHolders: [
      {
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
        balance: 250000000,
        percent: 25,
      },
      {
        address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        balance: 150000000,
        percent: 15,
      },
      {
        address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        balance: 120000000,
        percent: 12,
      },
      {
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        balance: 80000000,
        percent: 8,
      },
      {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        balance: 50000000,
        percent: 5,
      },
    ],
    risk: {
      centralization: "medium",
      liquidity: "locked",
      transfers: "low",
    },
  },
  holders: [
    {
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
      balance: 250000000,
      connections: [
        "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      ],
    },
    {
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      balance: 150000000,
      connections: [
        "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
      ],
    },
    {
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      balance: 120000000,
      connections: [
        "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
        "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      ],
    },
    {
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      balance: 80000000,
      connections: [
        "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      ],
    },
    {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      balance: 50000000,
      connections: ["0x6B175474E89094C44Da98b954EedeAC495271d0F"],
    },
    {
      address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
      balance: 45000000,
      connections: [
        "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
      ],
    },
    {
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      balance: 40000000,
      connections: ["0x514910771AF9Ca656af840dff83E8264EcF986CA"],
    },
    {
      address: "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
      balance: 35000000,
      connections: [
        "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
        "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
      ],
    },
    {
      address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
      balance: 30000000,
      connections: ["0x8E870D67F660D95d5be530380D0eC0bd388289E1"],
    },
    {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      balance: 28000000,
      connections: ["0xE41d2489571d322189246DaFA5ebDe1F4699F498"],
    },
    {
      address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
      balance: 25000000,
      connections: ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"],
    },
    {
      address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
      balance: 22000000,
      connections: ["0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD"],
    },
    {
      address: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
      balance: 20000000,
      connections: ["0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2"],
    },
    {
      address: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
      balance: 18000000,
      connections: ["0x408e41876cCCDC0F92210600ef50372656052a38"],
    },
    {
      address: "0x408e41876cCCDC0F92210600ef50372656052a38",
      balance: 15000000,
      connections: ["0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e"],
    },
    {
      address: "0xba100000625a3754423978a60c9317c58a424e3D",
      balance: 12000000,
      connections: [],
    },
    {
      address: "0x1f573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      balance: 10000000,
      connections: [],
    },
    {
      address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
      balance: 8000000,
      connections: [],
    },
  ],
};

export default function page() {
  return <TokenScanner {...mockData} />;
}
