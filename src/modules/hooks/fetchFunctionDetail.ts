import { MoveFunctionWithDetailRawData } from 'src/Api';
import { MoveFunctionWithDetail } from 'src/MoveFunction';

export interface QueryProps {
  fullFunctionName: string;
}

export const parseFullFunctionName = (fullFunctionName: string) => {
  const functionParseRegex = /0x(\w+)::(\w+)::(\w+)/; // 0xAddress::module::function

  const parseResult = functionParseRegex.exec(fullFunctionName);
  if (!parseResult) {
    return null;
  }

  const [, address, moduleName, functionName] = parseResult;
  const fullAddress = `0x${address.padStart(64, '0')}`;

  return {
    address,
    fullAddress,
    moduleName,
    functionName,
  };
};

const fetchFunctionDetail = async ({ fullFunctionName }: QueryProps) => {
  const parseResult = parseFullFunctionName(fullFunctionName);

  if (!parseResult) {
    return null;
  }

  const { fullAddress, moduleName, functionName } = parseResult;

  const response = await fetch(
    `/api/functions/${fullAddress}/${moduleName}/${functionName}`
  );
  const data = await response.json();

  if (!data) {
    return null;
  }

  const {
    module_function: { id, module_name, generic_type_params, params },
    function_detail,
  } = data as MoveFunctionWithDetailRawData;

  const {
    description,
    param_names,
    generic_type_params: generic_param_names,
  } = function_detail || {};

  return {
    id,
    name: functionName,
    module: {
      name: module_name,
    },
    account: {
      address: fullAddress,
    },
    description,
    params: (params || []).map((type, index) => ({
      type,
      name: param_names?.[index],
    })),
    genericTypeParams: (generic_type_params || []).map((param, index) => ({
      ability: JSON.stringify(param),
      name: generic_param_names?.[index],
    })),
  } as MoveFunctionWithDetail;
};

export default fetchFunctionDetail;
