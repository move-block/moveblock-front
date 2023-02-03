import { useRouter } from 'next/router';
import useWallet from '~common/hooks/useWallet';
import StackEditor from '~stacks/components/StackEditor';
import useStackMutation from '~stacks/hooks/useStackMutation';

const StackCreatePage = () => {
  const router = useRouter();

  const { account } = useWallet();
  const address = account?.address;

  const { create: createStack } = useStackMutation({
    address,
  });

  return (
    <StackEditor
      isNew
      onSubmit={async (stack) => {
        await createStack({ stack });
        // should redirect to the new stack with edit mode
        router.replace('/stacks');
      }}
    />
  );
};

export default StackCreatePage;
