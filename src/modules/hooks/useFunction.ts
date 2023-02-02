import { useQuery } from '@tanstack/react-query';
import fetchFunctionDetail from './fetchFunctionDetail';

const useFunction = (fullFunctionName: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['functionDetail', fullFunctionName],
    queryFn: () => fetchFunctionDetail({ fullFunctionName }),
    enabled: !!fullFunctionName,
  });

  return {
    data,
    isLoading,
  };
};

export default useFunction;
