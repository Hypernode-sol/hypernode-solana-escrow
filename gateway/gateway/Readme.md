# Hypernode Gateway

REST API + Prometheus metrics + CLI + LangChain plugin to interface with the Hypernode escrow smart contract on Solana.

---

## 📦 Project Structure

```
gateway/
├── server.js              # Express server with /start, /release, /metrics
├── metrics.js             # Prometheus metrics (prom-client)
├── Dockerfile             # Lightweight deployment container
├── ecosystem.config.json  # PM2 deployment config
├── openapi.yaml           # OpenAPI 3.0 schema
```

## 🚀 API Endpoints

### `POST /start`
Start an escrow job.
```json
{
  "cid": "<ipfs-cid>",
  "amount": 1000000,
  "provider": "<solana-public-key>"
}
```
**Response:** `{ "escrow": "<public-key>" }`

### `POST /release`
Release funds after delivery.
```json
{
  "escrow": "<escrow-public-key>",
  "provider": "<solana-public-key>"
}
```
**Response:** `{ "released": true }`

### `GET /metrics`
Prometheus scrape endpoint with counters:
- `hypernode_jobs_started_total`
- `hypernode_jobs_released_total`

## 🛠 Setup

### Requirements
- Node.js ≥ 18
- Solana CLI and local validator
- Anchor CLI and wallet funded on `localnet`

### Install & Run
```bash
cd gateway
npm install
node server.js
```

### Using PM2
```bash
pm install -g pm2
pm2 start ecosystem.config.json
```

### Using Docker
```bash
docker build -t hypernode-gateway .
docker run -p 4000:4000 --env ANCHOR_PROVIDER_URL=http://localhost:8899 hypernode-gateway
```

---

## 🤖 LangChain Plugin
Use `langchain_hypernode_tool.py` to register:
- `start_hypernode_job`
- `release_hypernode_payment`

See `examples/langchain_hypernode_agent.py`

## 💻 CLI Tool
`cli/hypernodectl.ts`
```bash
npx tsx cli/hypernodectl.ts start --cid <cid> --amount <lamports> --provider <pubkey>
npx tsx cli/hypernodectl.ts release --escrow <pubkey> --provider <pubkey>
```

---

## 📄 License
MIT — Hypernode Network
