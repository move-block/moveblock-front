import { useQuery } from '@tanstack/react-query';
import fetchFunction from './fetchFunctionDetail';

const useFunction = (fullFunctionName: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['functionDetail', fullFunctionName],
    queryFn: () => fetchFunction({ fullFunctionName }),
    keepPreviousData: true,
  });

  return {
    data,
    isLoading,
  };
};

export default useFunction;
