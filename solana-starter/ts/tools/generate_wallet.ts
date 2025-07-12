import { Keypair } from "@solana/web3.js";
import { writeFileSync } from "fs";

// Generate a new keypair
const keypair = Keypair.generate();

// Convert to array format for JSON storage
const walletArray = Array.from(keypair.secretKey);

// Save to wallet directory
writeFileSync(
  "./cluster1/wallet/turbin-wallet.json",
  JSON.stringify(walletArray, null, 2)
);

console.log("Wallet generated successfully!");
console.log("Public Key:", keypair.publicKey.toString());
console.log("Wallet saved to: ./cluster1/wallet/turbin-wallet.json"); 