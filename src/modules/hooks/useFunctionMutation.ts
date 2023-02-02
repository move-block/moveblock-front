import { QueryClient, useMutation } from '@tanstack/react-query';
import useWallet from '~common/hooks/useWallet';

interface MutationProps {
  accountAddress: string;
  moduleName: string;
  functionName: string;
}

interface FunctionContent {
  description: string;
  paramNames: string[];
  genericParams: string[];
}

const useFunctionMutation = ({
  accountAddress,
  moduleName,
  functionName,
}: MutationProps) => {
  const { getSignMessagePayload } = useWallet();
  const queryClient = new QueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      description,
      paramNames,
      genericParams,
    }: FunctionContent) => {
      const sign = await getSignMessagePayload(
        JSON.stringify({
          description,
          param_names: paramNames,
          generic_type_params: genericParams,
        })
      );

      if (!sign) {
        console.log('Sign is null');
        return
      }

      const { payload, public_key } = sign;

      return fetch(
        `/api/functions?account_address=${accountAddress}&module_name=${moduleName}&function_name=${functionName}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payload,
            public_key,
          }),
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['functions'],
      });
    },
  });

  return mutation;
};

export default useFunctionMutation;
