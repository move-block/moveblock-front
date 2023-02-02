import { QueryClient, useMutation } from '@tanstack/react-query';
import { FormType } from '~stacks/components/StackEditor';

const parseStack = (stack: FormType) => ({
  name: stack.stackName,
  blocks: stack.blocks.map(
    ({ functionName, paramValues, genericParamValues }) => ({
      type: 'entry_function_payload',
      function: functionName,
      arguments: paramValues,
      type_arguments: genericParamValues,
    })
  ),
});

const useStackMutation = ({
  id,
  address,
}: {
  id?: number;
  address?: string;
}) => {
  const queryClient = new QueryClient();
  const itemUrl = `/api/stacks/${id}?address=${address}`;
  const listUrl = `/api/stacks?address=${address}`;

  const createMutation = useMutation({
    mutationFn: async ({ stack }: { stack: FormType }) => {
      if (!address) {
        throw new Error('Missing id or address');
      }

      const response = await fetch(listUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parseStack(stack)),
      });

      if (!response.ok) {
        throw new Error('Failed to create stack');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['stacks', address]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ stack }: { stack: FormType }) => {
      if (!address) {
        throw new Error('Missing id or address');
      }

      const response = await fetch(itemUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parseStack(stack)),
      });

      if (!response.ok) {
        throw new Error('Failed to create stack');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['stacks', address, id]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id || !address) {
        throw new Error('Missing id or address');
      }

      const response = await fetch(itemUrl, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to create stack');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['stacks']);
    },
  });

  return {
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
  };
};

export default useStackMutation;
