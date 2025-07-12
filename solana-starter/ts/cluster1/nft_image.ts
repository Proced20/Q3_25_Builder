import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";
import { readFileSync } from "fs";
import path from "path";

// these just read and load your wallet ()
const secret = JSON.parse(readFileSync("wallet/turbin-wallet.json", "utf8")) as number[];
const umi = createUmi("https://api.devnet.solana.com");

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const signer = createSignerFromKeypair(umi, keypair);

// Set signer
umi.use(signerIdentity(signer));
umi.use(irysUploader());

(async () => {
  try {
    console.log("Wallet pubkey:", signer.publicKey.toString());

    // load our image
    const imagePath = path.join(__dirname, "assets", "birddog.png");
    const imageBuffer = await readFile(imagePath);
    const image = createGenericFile(imageBuffer, "birddog.png", {
      contentType: "image/png",
      extension: "png",
    });

    // Upload to Irys
    const [uri] = await umi.uploader.upload([image]);
    console.log(" uploaded img URI:", uri);
  } catch (err: any) {
    console.error("uploade failed -_-:", err.message);
    if (err.getLogs) {
      console.log("Logs:", await err.getLogs());
    }
  }
})();
