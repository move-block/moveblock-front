import { QueryClient, useMutation } from '@tanstack/react-query';
import { FormType } from '~stacks/components/StackEditor';

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

  const updateMutation = useMutation({
    mutationFn: async ({ stack }: { stack: FormType }) => {
      if (!address) {
        throw new Error('Missing id or address');
      }

      if (id) {
        const response = await fetch(itemUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: stack.stackName,
            blocks: stack.blocks.map(
              ({ functionName, paramValues, genericParamValues }) => ({
                type: 'entry_function_payload',
                function: functionName,
                arguments: paramValues,
                type_arguments: genericParamValues,
              })
            ),
          }),
        });

        return response.ok;
      } else {
        const response = await fetch(listUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: stack.stackName,
            blocks: stack.blocks.map(
              ({ functionName, paramValues, genericParamValues }) => ({
                type: 'entry_function_payload',
                function: functionName,
                arguments: paramValues,
                type_arguments: genericParamValues,
              })
            ),
          }),
        });

        return response.ok;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['stacks', address]);
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

      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['stacks']);
    },
  });

  return {
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
  };
};

export default useStackMutation;
