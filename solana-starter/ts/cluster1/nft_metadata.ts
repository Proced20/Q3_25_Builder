import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFileSync } from "fs";

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

// Load wallet from JSON file (same method as working script)
const secret = JSON.parse(readFileSync("wallet/turbin-wallet.json", "utf8")) as number[];
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        console.log("Wallet pubkey:", signer.publicKey.toString());
        
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        // Use the image URI from your successful upload
        const image = "https://gateway.irys.xyz/2V6RWu6xWPAKvLmBfDUbmebrbr1KoucVgtF4CjBP1KcP";
        const metadata = {
            name: "My Awesome NFT",
            symbol: "MYNFT",
            description: "This is my first NFT created with Solana, GAWDDD",
            image: image,
            attributes: [
                {trait_type: 'type', value: 'png'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: [signer.publicKey]
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
