import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { readFileSync } from "fs";
import base58 from "bs58";

// Load wallet using the same method as your working scripts
const secret = JSON.parse(readFileSync("wallet/turbin-wallet.json", "utf8")) as number[];
const umi = createUmi("https://api.devnet.solana.com");

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {
    let tx = await createNft(umi, {
        mint,
        name: "BIRDAWWGIN BROS",
        uri: "https://gateway.irys.xyz/67qEy9o6CBY2KT8cPozs2wefL2JiVQof4aZKdmjxb1vQ", // actual metadata URI
        sellerFeeBasisPoints: percentAmount(5),
        symbol: "Pajeet",
    });

    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);

    console.log(`Successfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
    console.log("Mint Address: ", mint.publicKey);
})();