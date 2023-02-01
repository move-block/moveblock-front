import { useQuery } from '@tanstack/react-query';
import fetchFunctions, { QueryProps } from './fetchFunctions';

const useFunctions = ({ keyword, offset, limit }: QueryProps) => {
  const { data, isLoading } = useQuery({
    queryKey: [
      'functions',
      {
        keyword,
        offset,
        limit,
      },
    ],
    queryFn: () => fetchFunctions({ keyword, offset, limit }),
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

export default useFunctions;
