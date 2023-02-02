import { MoveFunctionWithDetail } from 'src/MoveFunction';
import {
  AccountRawData,
  ModuleRawData,
  MoveFunctionWithDetailRawData,
} from '../../Api';

export interface QueryProps {
  moduleName: string;
  account: string;
}

interface Data {
  move_module_with_detail: {
    move_module: ModuleRawData;
    module_detail: any;
  };
  account_detail: null | AccountRawData;
  functions_with_detail: MoveFunctionWithDetailRawData[];
}

const fetchModule = async ({ moduleName, account }: QueryProps) => {
  const response = await fetch(
    `/api/modules?name=${moduleName}&account=${account}`
  );
  const data = await response.json();
  const {
    move_module_with_detail: { move_module, module_detail },
    account_detail,
    functions_with_detail,
  } = data as Data;

  return {
    address: move_module.address,
    name: move_module.name,
    alias: account_detail?.alias || '',
    description: module_detail?.description || '',
    github_url: module_detail?.github_url || '',
    rev: module_detail?.rev || '',
    subdir: module_detail?.subdir || '',
    bytecode: move_module.bytecode,
    friends: move_module.friends,
    moveModule: move_module,
    moveFunctions: functions_with_detail.map(
      ({
        module_function: {
          id,
          name,
          visibility,
          is_entry,
          module_name,
          module_address,
          generic_type_params,
          params,
          return_types,
        },
        function_detail,
      }) => ({
        id,
        name,
        visibility,
        isEntry: is_entry,
        genericTypeParams: generic_type_params.map((param, index) => ({
          ability: JSON.stringify(param),
          name: function_detail?.generic_type_params?.[index],
        })),
        params: params.map((param, index) => ({
          type: param,
          name: function_detail?.param_names?.[index],
        })),
        returnTypes: return_types,
        module: {
          name: module_name,
        },
        account: {
          address: module_address,
          alias: account_detail?.alias || '',
        },
        description: function_detail?.description || '',
      })
    ) as MoveFunctionWithDetail[],
  };
};

export default fetchModule;
