import { MoveStackRawData } from 'src/Api';
import { MoveStack } from 'src/MoveFunction';
import { StackQueryProps } from './fetchStacks';

export interface StackDetailQueryProps extends StackQueryProps {
  id: number;
}

const fetchStack = async ({ address, id }: StackDetailQueryProps) => {
  const response = await fetch(`/api/stacks/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'aptos-auth': address,
    },
  });
  const data: MoveStackRawData = await response.json();

  if (!data) {
    return undefined;
  }

  const { name, stack: blocks, last_edit_datetime } = data;

  return {
    id,
    stackName: name,
    lastEditedAt: last_edit_datetime,
    blocks: blocks.map(
      ({
        function: functionName,
        arguments: params,
        type_arguments: genericTypeParams,
      }) => ({
        functionName,
        params: params.map((arg) => ({
          value: arg,
        })),
        genericTypeParams: genericTypeParams.map((arg) => ({
          value: arg,
        })),
      })
    ),
  } as MoveStack;
};

export default fetchStack;
