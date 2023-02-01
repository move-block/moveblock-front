import { useQuery } from '@tanstack/react-query';
import fetchModule, { QueryProps } from './fetchModule';

const useModule = ({ moduleName, account }: QueryProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['module', account, moduleName],
    queryFn: () => fetchModule({ moduleName, account }),
    enabled: !!moduleName && !!account,

  });
  return {
    data,
    isLoading,
  };
};

export default useModule;
