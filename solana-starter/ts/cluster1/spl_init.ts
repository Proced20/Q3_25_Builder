import { Keypair, Connection, Commitment, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createInitializeMintInstruction, createInitializeAccount2Instruction, createMint, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
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

        //create mint address using createMint()
        createMintWrapped();



       //Unwrapped method of CreateMint() via creating transactions
        createMintUnwrapped();
       
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()


async function createMintWrapped(){
    const mintKey = Keypair.generate();

    const connection = new Connection("https://api.devnet.solana.com");

    
    let start = +new Date();
    const mint = await createMint(
        connection,
        keypair,
        keypair.publicKey,
        null,
        9,

    )
    let end = +new Date();

    console.log(`Time to run: ${end - start}`);

    console.log(`Mint address: ${mint.toBase58()}`); 

}

async function createMintUnwrapped(){

    let mintKey = Keypair.generate();

    let start = +new Date(); 
    const createAccountInstruction = SystemProgram.createAccount(
        {
            fromPubkey: keypair.publicKey,
            newAccountPubkey: mintKey.publicKey,
            space: MINT_SIZE,
            lamports: await getMinimumBalanceForRentExemptMint(connection),
            programId: TOKEN_2022_PROGRAM_ID
        }
    );

    const mintInstrust = createInitializeMintInstruction(
        mintKey.publicKey,
        9, 
        keypair.publicKey,
        keypair.publicKey,
        TOKEN_2022_PROGRAM_ID
    )

    const transaction = new Transaction().add(
        createAccountInstruction,
        mintInstrust
    );

    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair, mintKey]
    );
    let end = +new Date();
        console.log(`Time to run: ${end - start}`);


    console.log("Mint Address: ", mintKey.publicKey.toBase58());
    console.log("Transaction Signature: ", signature);
    
}

