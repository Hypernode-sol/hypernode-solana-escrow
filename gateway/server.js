
const express = require('express');
const anchor = require('@coral-xyz/anchor');
const { PublicKey, Keypair } = require('@solana/web3.js');
const { HypernodeEscrowClient } = require('../sdk/hypernodeEscrowClient');

const app = express();
app.use(express.json());

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const client = new HypernodeEscrowClient(provider);

app.post('/start', async (req, res) => {
  const { cid, amount, provider: providerKey } = req.body;
  const kp = Keypair.generate();
  try {
    const escrow = await client.startJob(
      cid,
      parseInt(amount),
      new PublicKey(providerKey),
      kp
    );
    res.json({ escrow: escrow.toBase58() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/release', async (req, res) => {
  const { escrow, provider: providerKey } = req.body;
  try {
    await client.releasePayment(
      new PublicKey(escrow),
      new PublicKey(providerKey)
    );
    res.json({ released: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Hypernode Gateway running on ${PORT}`));
