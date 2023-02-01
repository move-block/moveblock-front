import { useQuery } from '@tanstack/react-query';
import { PaginatedQueryProps } from 'src/Api';
import fetchStacks, { StackQueryProps } from '~stacks/hooks/fetchStacks';

const useStacks = ({
  address,
  offset,
  limit,
}: Partial<StackQueryProps> & PaginatedQueryProps) => {
  const { data, isLoading } = useQuery({
    queryKey: [
      'stacks',
      address,
      {
        offset,
        limit,
      },
    ],
    queryFn: async () =>
      (address && fetchStacks({ address, offset, limit })) || undefined,
    enabled: !!address,
    keepPreviousData: true,
  });

  return {
    data: {
      totalCount: data?.totalCount ?? 0,
      data: data?.data ?? [],
    },
    isLoading,
  };
};

export default useStacks;
