import { QueryClient, useMutation } from '@tanstack/react-query';
import mutateModule, { ModuleMutationBody } from './mutateModule';
import useWallet from '~common/hooks/useWallet';

export interface ModuleMutationOptions {
  alias?: string;
  description?: string;
  github_url?: string;
  rev?: string;
  subdir?: string;
  name?: string;
  account?: string;
}

const useModuleMutation = () => {
  const { getSignMessagePayload } = useWallet();
  const queryClient = new QueryClient();

  const moduleMutation = useMutation({
    mutationFn: async ({
      alias,
      description,
      github_url,
      rev,
      subdir,
      name,
      account,
    }: ModuleMutationOptions) => {
      const { payload, public_key } = (await getSignMessagePayload(
        JSON.stringify({
          alias: alias,
          description: description,
          github_url: github_url,
          rev: rev,
          subdir: subdir,
        })
      )) || { payload: {}, public_key: '' };

      return mutateModule(
        { payload: payload, pubkey: public_key } as ModuleMutationBody,
        name || '',
        account || ''
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['modules'],
      });
    },
  });

  return moduleMutation;
};

export default useModuleMutation;
