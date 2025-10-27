
import { Command } from 'commander';
import * as anchor from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { HypernodeEscrowClient } from '../sdk/hypernodeEscrowClient';
import fs from 'fs';

const program = new Command();
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const client = new HypernodeEscrowClient(provider);

program
  .command('start')
  .requiredOption('-c, --cid <cid>', 'IPFS CID')
  .requiredOption('-a, --amount <lamports>', 'Amount in lamports')
  .requiredOption('-p, --provider <pubkey>', 'Provider public key')
  .action(async (opts) => {
    const kp = Keypair.generate();
    const escrow = await client.startJob(
      opts.cid,
      parseInt(opts.amount),
      new PublicKey(opts.provider),
      kp
    );
    console.log('Escrow started:', escrow.toBase58());
  });

program
  .command('release')
  .requiredOption('-e, --escrow <pubkey>', 'Escrow public key')
  .requiredOption('-p, --provider <pubkey>', 'Provider public key')
  .action(async (opts) => {
    await client.releasePayment(new PublicKey(opts.escrow), new PublicKey(opts.provider));
    console.log('Payment released for escrow:', opts.escrow);
  });

program.parse(process.argv);
