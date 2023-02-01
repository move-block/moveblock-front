import { MoveFunction } from 'src/MoveFunction';
import type {
  AccountRawData,
  MoveFunctionRawData,
  PaginatedQueryProps,
} from '../../Api';

export interface QueryProps extends PaginatedQueryProps {
  keyword?: string;
}

interface Data {
  module_function: MoveFunctionRawData;
  account_detail: null | AccountRawData;
}

const fetchFunctions = async (queryProps: QueryProps) => {
  const params = Object.entries(queryProps).filter(([_key, value]) => !!value);
  const searchParams = new URLSearchParams(params);
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
        },
        account_detail,
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
      })
    ) as MoveFunction[],
  };
};

export default fetchFunctions;
