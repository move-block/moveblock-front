import { atom, useRecoilState } from 'recoil';

interface Wallet {
  address: string,
  publicKey: string
}


const walletAtom = atom<Wallet | null>({
  key: 'walletAtom',
  default: null,
});

//TODO : Delete console.log
const useWallet = () => {

  const [wallet, setWallet] = useRecoilState(walletAtom);

  const getAptosWallet = (): (any | null) => {
    if ('aptos' in window) {
      return window.aptos as any;
    } else {
      alert('Please install aptos wallet');
      window.open('https://petra.app/', `_blank`);
      return null;
    }
  };

  const connect = async () => {
    const aptos= getAptosWallet();
    if(aptos != null) {
        const thisWallet = await aptos.connect();
        setWallet(thisWallet);
        return thisWallet;
    }
  };

  const disconnect = () => {
    getAptosWallet().disconnect();
    setWallet(null);
  };

  const checkAuth = async (moduleAddr : string) => {
    const wallet = await connect();
    if(wallet != null && wallet.address == moduleAddr) {
      console.log('auth success');
      return true;
    }
    console.log('auth failed');
    return false;
  }

  const getSignMessagePayload = async (message: string) => {
    const wallet = await connect();
    const aptos = getAptosWallet();
    if(aptos != null) {
      try {
        const nonce = 'a41';
        const response = await aptos.signMessage({
          message,
          nonce,
        });

        const result ={
          payload : response,
          public_key : wallet.publicKey,
        }

       console.log(JSON.stringify(result));
        return result;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }

//TODO : Delete this
  const test = async () => {
    await connect();
    const a = {description:"description of any module", github_url: "github.com"};
    return getSignMessagePayload(JSON.stringify(a));
  }

  return {
    wallet,
    isConnected: !!wallet,
    connect,
    disconnect,
    getSignMessagePayload,
    test,
    checkAuth
  };

};

export default useWallet;