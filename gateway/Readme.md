# 🧾 Hypernode Solana Escrow

Smart contract + tools for managing trustless, automated payments for computational jobs on the Hypernode Network using the Solana blockchain.

---

## 📦 Contents

```
├── programs/hypernode-escrow/     # Anchor smart contract (Rust)
├── sdk/                           # TypeScript SDK to interact with the contract
├── tests/                         # Mocha tests for contract
├── cli/                           # CLI tool to invoke start/release
├── plugins/                       # LangChain tool integration
├── scripts/                       # Node.js script wrappers for automation
├── examples/                      # LangChain agent usage example
├── gateway/                       # Optional HTTP API + metrics service
```

## ⚙️ Smart Contract

Program logic written in Rust using [Anchor framework](https://book.anchor-lang.com/).

### Features
- `start_job`: locks SOL from client in escrow for a job (by CID)
- `release_payment`: client releases funds to provider upon task completion

### Location
```rust
programs/hypernode-escrow/src/lib.rs
```

Build:
```bash
anchor build
```

Test:
```bash
anchor test
```

---

## 🧪 TypeScript SDK

```ts
import { HypernodeEscrowClient } from './sdk/hypernodeEscrowClient';
```
- Easily invoke `startJob`, `releasePayment`, `getEscrow`
- Used by gateway, CLI, and plugins

---

## 🔧 CLI Tool: `hypernodectl`

```
npx tsx cli/hypernodectl.ts start --cid <cid> --amount <lamports> --provider <pubkey>
npx tsx cli/hypernodectl.ts release --escrow <pubkey> --provider <pubkey>
```

---

## 🤖 LangChain Plugin

Use within AI agents to automate payment flow:
```py
from langchain_hypernode_tool import StartHypernodeJobTool, ReleaseHypernodePaymentTool
```
- See: `examples/langchain_hypernode_agent.py`

---

## 🌐 HTTP Gateway (Optional)

REST API in `gateway/server.js` exposes:
- `POST /start`
- `POST /release`
- `GET /metrics` (Prometheus-compatible)

Includes:
- `openapi.yaml`
- `metrics.js`
- `Dockerfile`, `ecosystem.config.json`

Run:
```bash
node gateway/server.js
# or
pm2 start gateway/ecosystem.config.json
```

---

## 🧪 Test Coverage

Run tests:
```bash
anchor test
```

Sample test file: `tests/hypernode-escrow.ts`

---

## 🪪 License
MIT © Hypernode Network
