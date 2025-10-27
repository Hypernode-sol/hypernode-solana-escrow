
const anchor = require("@coral-xyz/anchor");
const { Keypair, PublicKey, SystemProgram } = require("@solana/web3.js");
const fs = require("fs");

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace.HypernodeEscrow;

(async () => {
  const [cid, amount, providerPubkeyStr] = process.argv.slice(2);
  const providerPubkey = new PublicKey(providerPubkeyStr);
  const escrowKeypair = Keypair.generate();

  await program.methods
    .startJob(cid, new anchor.BN(parseInt(amount)))
    .accounts({
      escrow: escrowKeypair.publicKey,
      client: provider.wallet.publicKey,
      provider: providerPubkey,
      systemProgram: SystemProgram.programId,
    })
    .signers([escrowKeypair])
    .rpc();

  console.log(escrowKeypair.publicKey.toBase58());
})();
