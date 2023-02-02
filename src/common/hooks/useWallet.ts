import { useWallet, WalletReadyState } from '@aptos-labs/wallet-adapter-react';
import { AptosClient } from 'aptos';
import { API_BASE_URL } from '~consts';

export const DEVNET_NODE_URL = 'https://fullnode.devnet.aptoslabs.com/v1';
const aptosClient = new AptosClient(DEVNET_NODE_URL, {
  WITH_CREDENTIALS: false,
});

/*declare enum MoveFunctionVisibility {
  PRIVATE = "private",
  PUBLIC = "public",
  FRIEND = "friend"
}*/

export interface TransactionPayload {
  type: string;
  type_arguments: any[];
  arguments: any[];
  function: string;
}

//TODO : Delete console.log
const usePetraWallet = () => {
  const {
    connect,
    account,
    connected,
    disconnect,
    wallet,
    wallets,
    signAndSubmitTransaction,
    signMessage,
  } = useWallet();

  const connectPetra = async () => {
    const wallet = wallets[0];
    const isWalletReady =
      wallet.readyState === WalletReadyState.Installed ||
      wallet.readyState === WalletReadyState.Loadable;
    if (isWalletReady) {
      connect(wallets[0].name);
    } else {
      alert('Please install aptos wallet');
      window.open('https://petra.app/', `_blank`);
    }
  };

  const checkAuth = async (moduleAddr: string) => {
    if (connected && account != null && account.address == moduleAddr) {
      console.log('auth success');
      return true;
    }
    if (moduleAddr != null && moduleAddr != '') {
      const checkAuth = await checkAuthContains(moduleAddr);
      if (checkAuth === 'true') {
        console.log('auth success');
        return true;
      }
    }
    console.log('auth failed');
    return false;
  };

  const checkAuthContains = async (moduleAddr: string) => {
    const address = account?.address;
    const response = await fetch(
      `${API_BASE_URL}/accounts/${address}/contains/${moduleAddr} `
    );
    return await response.text();
  };

  const getSignMessagePayload = async (message: string) => {
    if (connected) {
      try {
        const nonce = 'a41';
        const response = await signMessage({
          message,
          nonce,
        });
        const result = {
          payload: response,
          public_key: account?.publicKey,
        };
        console.log(JSON.stringify(result));
        return result;
      } catch (e) {
        console.log(e);
        return null;
      }
    } else {
      alert('Please connect aptos wallet first.');
      return null;
    }
  };

  const onSignAndSubmitTransaction = async (payload: TransactionPayload) => {
    try {
      const response = await signAndSubmitTransaction(payload);
      await aptosClient.waitForTransaction(response?.hash || '');
      return {
        success: true,
      };
    } catch (error: any) {
      console.log('error', error);
      return null;
    }
  };

  const getSequenceNumber = async () => {
    const address = account?.address;
    const response = await fetch(
      `https://fullnode.devnet.aptoslabs.com/v1/accounts/${address}`
    );
    const data = await response.json();
    return data.sequence_number;
  };

  /*
  payload: TransactionPayload
  {
  payload : TransactionPayload = {
    type: "entry_function_payload",
    type_arguments: [],
    arguments: ["arg1", "arg2"],
    function: "module_address::module_name::function_name"
  }
  */
  const simulateFunction = async (payload: TransactionPayload) => {
    const seq = await getSequenceNumber();
    payload.type = 'entry_function_payload';
    const body = {
      sender: account?.address,
      sequence_number: seq,
      max_gas_amount: '2000000',
      gas_unit_price: '100',
      expiration_timestamp_secs: '32425224034',
      payload: payload,
      signature: {
        type: 'ed25519_signature',
        public_key: account?.publicKey,
        signature:
          '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      },
    };
    try {
      const response = await fetch(`/api/aptos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return {
        success: true,
        data: data,
        events: data[0].events,
      };
    } catch (error) {
      console.log('error', error);
      return null;
    }
  };

  // const onSignAndSubmitScript = async () =>{
  //   const payload: Types.ScriptPayload = {
  //     code: {
  //       abi:{
  //         name:"main",
  //         return:[],
  //         params:["&signer","u64"],
  //         visibility: MoveFunctionVisibility.PUBLIC,
  //         is_entry:true,
  //         generic_type_params:[]
  //
  //       },
  //       bytecode: "0x1::coin::transfer",
  //     },
  //     type_arguments: [],
  //     arguments: ["10000000"],
  //   };
  //   try {
  //     const response = await signAndSubmitTransaction(payload);
  //     await aptosClient.waitForTransaction(response?.hash || "");
  //     alert("success")
  //
  //   } catch (error: any) {
  //     console.log("error", error);
  //     alert("error")
  //   }
  // }

  //TODO : Delete this
  const test = async () => {
    // await connect();
    // const a = {description:"description of any module", github_url: "github.com"};
    // return getSignMessagePayload(JSON.stringify(a));
  };

  return {
    wallet,
    wallets,
    connect,
    disconnect,
    getSignMessagePayload,
    test,
    checkAuth,
    connectPetra,
    account,
    connected,
    onSignAndSubmitTransaction,
    getSequenceNumber,
    simulateFunction,
  };
};

export default usePetraWallet;
