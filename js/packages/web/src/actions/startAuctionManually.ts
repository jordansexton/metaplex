import { Connection, Keypair, TransactionInstruction } from '@solana/web3.js';
import { startAuction } from '../models/metaplex';
import { notify, sendTransactionWithRetry, WalletSender } from '@oyster/common';
import { AuctionView } from '../hooks';

export async function startAuctionManually(
  connection: Connection,
  wallet: WalletSender,
  auctionView: AuctionView,
) {
  try {
    const signers: Keypair[] = [];
    const instructions: TransactionInstruction[] = [];

    await startAuction(
      auctionView.vault.pubkey,
      auctionView.auctionManager.authority,
      instructions,
    );

    await sendTransactionWithRetry(connection, wallet, instructions, signers);

    notify({
      message: 'Auction started',
      type: 'success',
    });
  } catch (e) {
    notify({
      message: 'Transaction failed...',
      description: 'Failed to start the auction',
      type: 'error',
    });
    return Promise.reject(e);
  }
}
