import { useQuery } from '@tanstack/react-query';
import fetchStack, { StackDetailQueryProps } from './fetchStack';

const useStack = ({ id, address }: Partial<StackDetailQueryProps>) => {
  const { data, isLoading } = useQuery({
    queryKey: ['stacks', address, id],
    queryFn: async () =>
      (address && id && fetchStack({ address, id })) || undefined,
    enabled: !!address && !!id,
  });

  return {
    data,
    isLoading: id ? isLoading : false,
  };
};

export default useStack;
