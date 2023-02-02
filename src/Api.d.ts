export interface PaginatedQueryProps {
  offset?: number;
  limit?: number;
}

export interface MoveFunctionRawData {
  id: number;
  module_address: string;
  module_name: string;
  move_modules_transaction_version: number;
  move_modules_write_set_change_index: number;
  name: string;
  visibility: Visibility;
  is_entry: boolean;
  generic_type_params: Array<{
    constraints: string[];
  }>;
  params: string[];
  return_types: string[];
}

export interface AccountRawData {
  id: number;
  address: string;
  alias: string;
}

export interface ModuleRawData {
  transaction_version: number;
  write_set_change_index: number;
  transaction_block_height: number;
  name: string;
  address: string;
  bytecode: number[];
  friends: string[];
  exposed_functions: MoveFunctionRawData[];
  structs: any[];
  is_deleted: boolean;
  inserted_at: string;
}

export type MoveFunctionWithDetailRawData = {
  module_function: MoveFunctionRawData;
  function_detail: MoveFunctionDetailRawData | null;
};

interface MoveFunctionDetailRawData {
  id: number;
  address: string;
  module_name: string;
  function_name: string;
  description: string | null;
  param_names: string[] | null;
  generic_type_params: string[] | null;
}

export interface MoveBlockRawData {
  type: string;
  function: string;
  arguments: string[];
  type_arguments: string[];
}

export interface MoveStackRawData {
  id: number;
  address: string;
  name: string;
  stack: MoveBlockRawData[];
  last_edit_datetime: string;
}
