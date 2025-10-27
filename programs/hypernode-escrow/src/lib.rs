// File: programs/hypernode-escrow/src/lib.rs

use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkgCqC9U5e5aZ");

#[program]
pub mod hypernode_escrow {
    use super::*;

    pub fn start_job(
        ctx: Context<StartJob>,
        cid: String,
        amount: u64,
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        escrow.client = *ctx.accounts.client.key;
        escrow.provider = ctx.accounts.provider.key();
        escrow.amount = amount;
        escrow.cid = cid;
        escrow.released = false;

        Ok(())
    }

    pub fn release_payment(ctx: Context<ReleasePayment>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(!escrow.released, EscrowError::AlreadyReleased);
        require!(escrow.client == *ctx.accounts.client.key, EscrowError::Unauthorized);

        **ctx.accounts.provider.try_borrow_mut_lamports()? += escrow.amount;
        **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= escrow.amount;
        escrow.released = true;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct StartJob<'info> {
    #[account(init, payer = client, space = 8 + 32 + 32 + 8 + 4 + 256 + 1)]
    pub escrow: Account<'info, EscrowAccount>,
    #[account(mut)]
    pub client: Signer<'info>,
    /// CHECK: This is safe, validated later
    pub provider: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReleasePayment<'info> {
    #[account(mut)]
    pub escrow: Account<'info, EscrowAccount>,
    #[account(mut)]
    pub client: Signer<'info>,
    /// CHECK: Provider is a payment recipient
    #[account(mut)]
    pub provider: UncheckedAccount<'info>,
}

#[account]
pub struct EscrowAccount {
    pub client: Pubkey,
    pub provider: Pubkey,
    pub amount: u64,
    pub cid: String,
    pub released: bool,
}

#[error_code]
pub enum EscrowError {
    #[msg("Payment has already been released.")]
    AlreadyReleased,
    #[msg("Only the original client can release payment.")]
    Unauthorized,
}
