import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "./wallet/turbin-wallet.json"
import base58 from "bs58";
import { Token2022Account } from "@solana-program/token-2022";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    let tx = await createNft(umi, {
        mint,
        name: "Can i still join the Cohort",
        uri: "https://gateway.irys.xyz/DcnAYNm9ufDi7XL4cvZLw6TZLj7UrM8Apy4zLfsNpGWr",
        sellerFeeBasisPoints: percentAmount(5)
    })


    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();