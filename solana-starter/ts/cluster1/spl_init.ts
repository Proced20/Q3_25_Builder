import { Keypair, Connection, Commitment, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createMint, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import wallet from "./wallet/turbin-wallet.json"


// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Start here
        // const mint = ???

        //create mint address
        const mintKey = Keypair.generate();

        const connection = new Connection("https://api.devnet.solana.com");

        const mint = await createMint(
            connection,
            keypair,
            keypair.publicKey,
            null,
            9,

        )

        console.log(`Mint address: ${mint.toBase58()}`);

        /*
        const createAccountInstruction = SystemProgram.createAccount(
            {
                fromPubkey: keypair.publicKey,
                newAccountPubkey: mintKey.publicKey,
                space: MINT_SIZE,
                lamports: await getMinimumBalanceForRentExemptMint(connection),
                programId: TOKEN_2022_PROGRAM_ID
            }
        );

        const mintInstrust = createMint(
            connection,
            keypair,
            keypair.publicKey,
            keypair.publicKey,
            9, 
            mintKey
        )

      

        const transaction = new Transaction().add(
            createAccountInstruction,
            mintInstrust
        );

        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [keypair, mint]
        );

        console.log("Mint Address: ", mint.publicKey.toBase58());
        console.log("Transaction Signature: ", signature);
        */
       
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
