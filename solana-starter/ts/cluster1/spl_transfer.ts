import { SystemProgram, Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, sendAndConfirmRawTransaction } from "@solana/web3.js"
import wallet from "./wallet/turbin-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { lamports } from "@metaplex-foundation/umi";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("4RPBMqhbDUeTMUihH8FnAhbQamA2qbNwZs59rYcsbJCo");

// Recipient address
const to = new PublicKey("KLSVUWkYYNkL4kWpc3R8VgKvL5Wd6rNbNo65hLBAPf9");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint,keypair.publicKey);
        
        const toAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);

        const signature = await transfer(connection, keypair, ata.address, toAta.address, keypair, 1);
        
       
        console.log(`Transaction was sent: ${signature}`);


        // Get the token account of the toWallet address, and if it does not exist, create it

        // Transfer the new token to the "toTokenAccount" we just created
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();