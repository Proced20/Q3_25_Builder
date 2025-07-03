import wallet from "./wallet/turbin-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    updateMetadataAccountV2,
    updateV1,
    fetchMetadataFromSeeds
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("4RPBMqhbDUeTMUihH8FnAhbQamA2qbNwZs59rYcsbJCo");

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = { 
            mint: mint,
            mintAuthority: signer,
            payer: signer,
            updateAuthority: signer.publicKey,
        }

       
        let data: DataV2Args = {
            name: "Sir can I plz submit stilll",
            symbol: "PLZ",
            uri: "https://gateway.lighthouse.storage/ipfs/bafkreidkkfppkqvrax4wilh6dgx3p2yctpoyw5v47v3i5l3fxukwtp4zmi",
            sellerFeeBasisPoints: 1,
            creators: null,
            collection: null,
            uses: null
        }

        // let args: CreateMetadataAccountV3InstructionArgs = {
        //     data: data,
        //     isMutable: true,
        //     collectionDetails: null
        // }

        // let tx = createMetadataAccountV3(
        //     umi,
        //     {
        //         ...accounts,
        //         ...args
        //     }
        // )

        const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })

        //Update token info
        const update = await updateV1(umi, {mint, authority: signer, data: data}).sendAndConfirm(umi)
        console.log(`here: ${update.result}`);

        // let result = await tx.sendAndConfirm(umi);
        // console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
