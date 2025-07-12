import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair } from "@metaplex-foundation/umi";

// Create connections
const connection = new Connection('https://api.devnet.solana.com');
const umi = createUmi('https://api.devnet.solana.com');

// Load wallet
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
    
    // Check if account exists and is initialized
    const accountInfo = await connection.getAccountInfo(publicKey);
    console.log("Account exists:", !!accountInfo);
    console.log("Account is executable:", accountInfo?.executable);
    console.log("Account owner:", accountInfo?.owner?.toString());
    
    if (balance < 0.01 * LAMPORTS_PER_SOL) {
      console.log("❌ Balance too low for transactions");
    } else {
      console.log("✅ Balance sufficient for transactions");
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
})(); 