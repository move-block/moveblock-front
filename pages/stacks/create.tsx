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
        const { id } = await createStack({ stack });

        router.replace(`/stacks/${id}`);
      }}
    />
  );
};

export default StackCreatePage;
