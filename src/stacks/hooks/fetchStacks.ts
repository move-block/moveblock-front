import { MoveStackPreview } from 'src/MoveFunction';
import type { MoveStackRawData, PaginatedQueryProps } from '../../Api';

export interface StackQueryProps {
  address: string;
}
type QueryProps = StackQueryProps & PaginatedQueryProps;

const fetchStacks = async (queryProps: QueryProps) => {
  const params = Object.entries(queryProps).filter(([_key, value]) => !!value);
  const searchParams = new URLSearchParams(params);
  const response = await fetch(`/api/stacks?${searchParams}`);
  const {
    data,
    pagination: { total_len },
  } = await response.json();

  return {
    totalCount: total_len,
    data: (data as MoveStackRawData[]).map(
      ({ id, name, stack, last_edit_datetime }) => ({
        id,
        stackName: name,
        lastEditedAt: last_edit_datetime,
        blocks: stack.map(({ function: functionName }) => ({
          functionName: functionName,
        })),
      })
    ) as MoveStackPreview[],
  };
};

export default fetchStacks;
