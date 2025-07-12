import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair } from "@metaplex-foundation/umi";

// cereate a devnet connection
// turbin3
const connection = new Connection('https://api.devnet.solana.com');
const umi = createUmi('https://api.devnet.solana.com');

const wallet = require('./wallet/turbin-wallet.json');
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

(async () => {
  try {
    // Get wallet public key
    const publicKey = new PublicKey(signer.publicKey);
    console.log("Wallet address:", publicKey.toString());
    
    // Check balance
    const balance = await connection.getBalance(publicKey);
    console.log("Balance:", balance / LAMPORTS_PER_SOL, "SOL");
    
    // If balance is less than 0.1 SOL, airdrop
    if (balance < 0.1 * LAMPORTS_PER_SOL) {
      console.log("Balance too low, requesting airdrop...");
      const signature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(signature);
      
      const newBalance = await connection.getBalance(publicKey);
      console.log("New balance after airdrop:", newBalance / LAMPORTS_PER_SOL, "SOL");
    } else {
      console.log("Balance is sufficient for transactions");
    }
  } catch (error) {
    console.error("Error:", error);
  }
})(); 