import { Button, Input } from 'antd';
import PageContainer from '~common/components/PageContainer';
import CenterContainer from '~common/components/CenterContainer';
import { useState } from 'react';
import usePetraWallet, { TransactionPayload } from '~common/hooks/useWallet';

const Authtest = () => {
  const { checkAuth } = usePetraWallet();
  const [moduleAddr, setModuleAddr] = useState<string | ''>('');

  const onChange = (e: any) => {
    setModuleAddr(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 place-content-center">
      <Input
        placeholder="Search account, module name or function name"
        value={moduleAddr}
        onChange={onChange}
      />
      <Button
        className="items-center mt-2"
        onClick={() => checkAuth(moduleAddr)}
      >
        Auth Check
      </Button>
    </div>
  );
};

const WalletSignTest = () => {
  const { getSignMessagePayload } = usePetraWallet();
  const [message, setMessage] = useState<string | ''>('');

  const onChange = (e: any) => {
    setMessage(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 place-content-center">
      <Input
        placeholder="Search account, module name or function name"
        value={message}
        onChange={onChange}
      />
      <Button
        className="items-center mt-2"
        onClick={() => getSignMessagePayload(message)}
      >
        Sign Message
      </Button>
    </div>
  );
};

const WalletSignTest2 = () => {
  const { simulateFunction } = usePetraWallet();
  const payload: TransactionPayload = {
    type_arguments: [],
    arguments: [
      '0x44ed46e3943de0ec15ea8edf0a40aa111dc82f8cfcdd82a712ad1352079f21b2',
      '100000000',
    ],
    function: '0x1::aptos_account::transfer',
  };
  return (
    <Button
      className="items-center mt-2"
      onClick={() => simulateFunction(payload)}
    >
      Test
    </Button>
  );
};

const WalletSignTest3 = () => {
  const { onSignAndSubmitTransaction, account } = usePetraWallet();
  const payload: TransactionPayload = {
    function: '0x1::coin::transfer',
    type_arguments: ['0x1::aptos_coin::AptosCoin'],
    arguments: [account?.address || '', 1], // 1 is in Octas
  };

  return (
    <Button
      className="items-center mt-2"
      onClick={() => onSignAndSubmitTransaction(payload)}
    >
      Test
    </Button>
  );
};

const ConnectWallet = () => {
  return (
    <PageContainer className="max-w-3xl">
      <CenterContainer>
        <Authtest />
        <WalletSignTest />
        <WalletSignTest2 />
        <WalletSignTest3 />
      </CenterContainer>
    </PageContainer>
  );
};

export default ConnectWallet;
