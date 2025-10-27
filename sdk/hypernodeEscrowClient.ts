
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import { HypernodeEscrow } from "../../target/types/hypernode_escrow";

export class HypernodeEscrowClient {
  private program: anchor.Program<HypernodeEscrow>;
  private provider: anchor.AnchorProvider;

  constructor(provider: anchor.AnchorProvider) {
    this.provider = provider;
    anchor.setProvider(provider);
    this.program = anchor.workspace.HypernodeEscrow as anchor.Program<HypernodeEscrow>;
  }

  async startJob(
    cid: string,
    amountLamports: number,
    providerPubkey: PublicKey,
    escrowKeypair: Keypair
  ): Promise<PublicKey> {
    await this.program.methods
      .startJob(cid, new anchor.BN(amountLamports))
      .accounts({
        escrow: escrowKeypair.publicKey,
        client: this.provider.wallet.publicKey,
        provider: providerPubkey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([escrowKeypair])
      .rpc();

    return escrowKeypair.publicKey;
  }

  async releasePayment(
    escrowPubkey: PublicKey,
    providerPubkey: PublicKey
  ): Promise<void> {
    await this.program.methods
      .releasePayment()
      .accounts({
        escrow: escrowPubkey,
        client: this.provider.wallet.publicKey,
        provider: providerPubkey,
      })
      .rpc();
  }

  async getEscrow(escrowPubkey: PublicKey) {
    return await this.program.account.escrowAccount.fetch(escrowPubkey);
  }
}
