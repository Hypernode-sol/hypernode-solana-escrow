
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HypernodeEscrow } from "../target/types/hypernode_escrow";
import { assert } from "chai";

describe("hypernode-escrow", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.HypernodeEscrow as Program<HypernodeEscrow>;

  it("Initializes and releases an escrow", async () => {
    const client = provider.wallet;
    const providerKeypair = anchor.web3.Keypair.generate();

    const escrow = anchor.web3.Keypair.generate();

    const tx = await program.methods
      .startJob("cid-test", new anchor.BN(1_000_000))
      .accounts({
        escrow: escrow.publicKey,
        client: client.publicKey,
        provider: providerKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([escrow])
      .rpc();

    let escrowAccount = await program.account.escrowAccount.fetch(escrow.publicKey);
    assert.strictEqual(escrowAccount.cid, "cid-test");
    assert.strictEqual(escrowAccount.amount.toNumber(), 1_000_000);

    const releaseTx = await program.methods
      .releasePayment()
      .accounts({
        escrow: escrow.publicKey,
        client: client.publicKey,
        provider: providerKeypair.publicKey,
      })
      .rpc();

    escrowAccount = await program.account.escrowAccount.fetch(escrow.publicKey);
    assert.isTrue(escrowAccount.released);
  });
});
