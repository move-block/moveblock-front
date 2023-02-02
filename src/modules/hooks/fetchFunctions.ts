import { MoveFunctionWithDetail } from 'src/MoveFunction';
import type {
  AccountRawData,
  MoveFunctionDetailRawData,
  MoveFunctionRawData,
  PaginatedQueryProps,
} from '../../Api';

export interface QueryProps extends PaginatedQueryProps {
  keyword?: string;
  isEntry?: boolean;
}

interface Data {
  module_function: MoveFunctionRawData;
  account_detail?: AccountRawData;
  function_detail?: MoveFunctionDetailRawData;
}

const fetchFunctions = async ({
  limit,
  offset,
  keyword,
  isEntry,
}: QueryProps) => {
  const queryParams = {
    limit: limit?.toString(),
    offset: offset?.toString(),
    keyword: keyword,
    is_entry: isEntry ? 'true' : undefined,
  };
  const searchParams = new URLSearchParams(
    Object.entries(queryParams).filter(([_, value]) => !!value) as [
      string,
      string
    ][]
  );

  const response = await fetch(`/api/functions?${searchParams}`);
  const {
    data,
    pagination: { total_len },
  } = await response.json();

  return {
    totalCount: total_len,
    data: ((data || []) as Data[]).map(
      ({
        module_function: {
          id,
          module_name,
          module_address,
          name,
          visibility,
          is_entry,
          params,
          generic_type_params,
        },
        account_detail,
        function_detail,
      }) => ({
        id,
        name,
        visibility,
        isEntry: is_entry,
        module: {
          name: module_name,
        },
        account: {
          address: account_detail?.address || module_address,
          alias: account_detail?.alias || '',
        },
        description: function_detail?.description || '',
        params: params.map((type) => ({ type })),
        genericTypeParams: generic_type_params.map((ability) => ({
          ability: JSON.stringify(ability),
        })),
      })
    ) as MoveFunctionWithDetail[],
  };
};

export default fetchFunctions;
