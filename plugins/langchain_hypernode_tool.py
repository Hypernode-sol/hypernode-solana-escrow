
from langchain.tools import BaseTool
from typing import Optional, Type
from pydantic import BaseModel, Field
import subprocess
import os

class StartJobInput(BaseModel):
    cid: str = Field(..., description="IPFS CID of the computation payload")
    amount_lamports: int = Field(..., description="Amount to lock in the escrow (in lamports)")
    provider: str = Field(..., description="PublicKey of the provider node")

class ReleasePaymentInput(BaseModel):
    escrow: str = Field(..., description="Escrow account public key")
    provider: str = Field(..., description="PublicKey of the provider")

class StartHypernodeJobTool(BaseTool):
    name = "start_hypernode_job"
    description = "Creates an escrow on Solana to start a Hypernode computation job."
    args_schema: Type[BaseModel] = StartJobInput

    def _run(self, cid: str, amount_lamports: int, provider: str) -> str:
        escrow = subprocess.check_output([
            "node", "scripts/startJob.js", cid, str(amount_lamports), pro
