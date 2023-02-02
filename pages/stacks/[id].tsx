import { useRouter } from 'next/router';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next/types';
import { useState } from 'react';
import useWallet from '~common/hooks/useWallet';
import ExecutionModal from '~stacks/components/ExecutionModal';
import StackEditor from '~stacks/components/StackEditor';
import useStack from '~stacks/hooks/useStack';
import useStackExecution from '~stacks/hooks/useStackExecution';
import useStackMutation from '~stacks/hooks/useStackMutation';

export enum ExecutionStatus {
  IDLE,
  EXECUTING,
  EXECUTED,
}

const StackDetailPage = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const { account } = useWallet();
  const address = account?.address;

  const { data: stack, isLoading } = useStack({
    id,
    address,
  });

  const { update: updateStack, delete: deleteStack } = useStackMutation({
    id,
    address,
  });

  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);
  const {
    executionStatus,
    byteCode,
    transactionHash,
    execute: executeStack,
  } = useStackExecution({
    id,
    address,
  });

  return (
    <>
      <StackEditor
        stack={stack}
        isLoading={isLoading}
        onSubmit={async (stack) => {
          await updateStack({ stack });
        }}
        onDelete={async () => {
          await deleteStack();
          router.replace('/stacks');
        }}
        onExecute={async () => {
          const executionResult = await executeStack();
          console.log('executionResult', executionResult);
          setIsExecutionModalOpen(true);
        }}
      />
      <ExecutionModal
        isOpen={isExecutionModalOpen}
        onClose={() => setIsExecutionModalOpen(false)}
        byteCode={byteCode}
        transactionHash={transactionHash}
      />
    </>
  );
};

interface ServerProps {
  id: number;
}
export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const { id } = context.query;

  return {
    props: {
      id: parseInt(id as string),
    },
  };
};

export default StackDetailPage;
