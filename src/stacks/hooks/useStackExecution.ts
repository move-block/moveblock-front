import { useState } from 'react';
import usePetraWallet from '~common/hooks/useWallet';
import executeStack from './executeStack';

export enum ExecutionStatus {
  IDLE,
  EXECUTING,
  EXECUTED,
}

const useStackExecution = ({
  id,
  address,
}: {
  id?: number;
  address?: string;
}) => {
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>(
    ExecutionStatus.IDLE
  );

  const [byteCode, setByteCode] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const { getSignMessagePayload } = usePetraWallet();
  const { getBytecode, execute: _execute } = executeStack();

  const execute = async () => {
    if (!id || !address) {
      return;
    }

    setExecutionStatus(ExecutionStatus.EXECUTING);
    const byteCode = await getBytecode(address, id);
    if (byteCode === null || byteCode === undefined || byteCode === '') {
      alert('Execution failed');
      return;
    }
    setByteCode(byteCode);
    const sign = await getSignMessagePayload(byteCode);
    if (sign == null) return;

    // TODO show spinner
    const result = await _execute(address, id);
    setTransactionHash(result);
    setExecutionStatus(ExecutionStatus.EXECUTED);

    return result;
  };

  return {
    executionStatus,
    byteCode,
    transactionHash,
    execute,
  };
};

export default useStackExecution;
