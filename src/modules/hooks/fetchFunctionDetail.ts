import { MoveFunctionWithDetail } from 'src/MoveFunction';

export interface QueryProps {
  fullFunctionName: string;
}

interface Data {
  id: number;
  address: string;
  module_name: string;
  function_name: string;
  description: string | null;
  param_names: string[] | null;
  generic_type_params: any[] | null;
}

const fetchFunctionDetail = async ({ fullFunctionName }: QueryProps) => {
  const functionParseRegex = /0x(\w+)::(\w+)::(\w+)/; // 0xAddress::module::function

  const parseResult = functionParseRegex.exec(fullFunctionName);
  if (!parseResult) {
    throw new Error('Invalid function name');
  }

  const [, address, moduleName, functionName] = parseResult;
  const fullAddress = `0x${address.padStart(64, '0')}`;

  const response = await fetch(
    `/api/functions/${fullAddress}/${moduleName}/${functionName}`
  );
  const data = await response.json();

  if (!data) {
    return null;
  }

  const {
    id,
    module_name,
    function_name,
    description,
    param_names,
    generic_type_params,
  } = data as Data;

  return {
    id,
    name: function_name,
    module: {
      name: module_name,
    },
    account: {
      address: fullAddress,
    },
    description,
    params: (param_names || []).map((name) => {
      return { name };
    }),
    genericTypeParams: (generic_type_params || []).map((param, index) => ({
      ability: JSON.stringify(param),
    })),
  } as MoveFunctionWithDetail;
};

export default fetchFunctionDetail;
