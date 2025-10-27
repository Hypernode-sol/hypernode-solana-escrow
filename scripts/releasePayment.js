const anchor = require("@coral-xyz/anchor");
const { PublicKey } = require("@solana/web3.js");


const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);


const program = anchor.workspace.HypernodeEscrow;


(async () => {
const [escrowStr, providerStr] = process.argv.slice(2);
const escrowPubkey = new PublicKey(escrowStr);
const providerPubkey = new PublicKey(providerStr);


await program.methods
.releasePayment()
.accounts({
escrow: escrowPubkey,
client: provider.wallet.publicKey,
provider: providerPubkey,
})
.rpc();


console.log("Payment released for escrow:", escrowStr);
})();
