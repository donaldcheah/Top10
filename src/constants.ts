import React, { createContext } from 'react'
export const CATEGORIES = [
    {
        "category_id": "",
        "name": "All"
    },
    {
        "category_id": "artificial-intelligence",
        "name": "Artificial Intelligence (AI)"
    },
    {
        "category_id": "binance-smart-chain",
        "name": "BNB Chain Ecosystem"
    },
    {
        "category_id": "cosmos-ecosystem",
        "name": "Cosmos Ecosystem"
    },
    {
        "category_id": "decentralized-finance-defi",
        "name": "Decentralized Finance (DeFi)"
    },
    {
        "category_id": "ethereum-ecosystem",
        "name": "Ethereum Ecosystem"
    },
    {
        "category_id": "exchange-based-tokens",
        "name": "Exchange-based Tokens"
    },
    {
        "category_id": "gaming",
        "name": "Gaming (GameFi)"
    },
    {
        "category_id": "harmony-ecosystem",
        "name": "Harmony Ecosystem"
    },
    {
        "category_id": "meme-token",
        "name": "Meme"
    },
    {
        "category_id": "metaverse",
        "name": "Metaverse"
    },
    {
        "category_id": "music",
        "name": "Music"
    },
    {
        "category_id": "non-fungible-tokens-nft",
        "name": "NFT"
    },
    {
        "category_id": "oracle",
        "name": "Oracle"
    },
    {
        "category_id": "play-to-earn",
        "name": "Play To Earn"
    },
    {
        "category_id": "privacy-coins",
        "name": "Privacy Coins"
    },
    {
        "category_id": "smart-contract-platform",
        "name": "Smart Contract Platform"
    },
    {
        "category_id": "terra-ecosystem",
        "name": "Terra Ecosystem"
    }


]


export type ThemeContextType = "light" | "dark";

export const ThemeContext = createContext<ThemeContextType>("light");