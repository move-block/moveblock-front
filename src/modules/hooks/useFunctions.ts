import { useQuery } from '@tanstack/react-query';
import fetchFunctions, { QueryProps } from './fetchFunctions';

const useFunctions = ({
  keyword,
  offset,
  limit,
  isEntry = false,
}: QueryProps & {
  isEntry?: boolean;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [
      'functions',
      isEntry,
      {
        keyword,
        offset,
        limit,
      },
    ],
    queryFn: () => fetchFunctions({ keyword, offset, limit, isEntry }),
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
