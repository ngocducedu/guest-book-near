import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'
import * as nearAPI from 'near-api-js';
import NearWalletSelector from "@near-wallet-selector/core";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import nearWalletIconUrl from "@near-wallet-selector/near-wallet/assets/near-wallet-icon.png";
import senderIconUrl from "@near-wallet-selector/sender/assets/sender-icon.png";


const CONTRACT_NAME = 'guestbook.louiskate.testnet';
const nearConfig = getConfig(process.env.NEAR_ENV || 'testnet', CONTRACT_NAME);
// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  //window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['get_leaderboard_donate'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['add_mess_and_donate'],
  })

  const selector = await NearWalletSelector.init({
    network: "testnet",
    contractId: CONTRACT_NAME,
    wallets: [
      setupNearWallet({iconUrl: nearWalletIconUrl}),
      setupSender({iconUrl: senderIconUrl}),
  
    ],
  });

  window.selector = selector;

}

