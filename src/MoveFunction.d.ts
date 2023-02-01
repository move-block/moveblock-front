export type Visibility = 'public' | 'friend';

export interface MoveFunction {
  id: number;
  name: string;
  visibility: Visibility;
  isEntry: boolean;
  module: {
    name: string;
  };
  account: {
    address: string;
    alias: string;
  };
}

type MoveFunctionParam = {
  type: string;
  name?: string;
  value?: string;
};

type GenericTypeParam = {
  ability?: string;
  name?: string;
};

export interface MoveFunctionWithDetail extends MoveFunction {
  params: MoveFunctionParam[];
  genericTypeParams: GenericTypeParam[];
  returnTypes?: string[];
  description: string;
}

export interface MoveModule {
  address: string;
  name: string;
  alias: string;
  description: string;
  github_url: string;
  rev: string;
  subdir: string;
  bytecode: number[];
  friends: string[];
  moveModule: MoveModuleRawData;
  moveFunctions: MoveFunctionWithDetail[];
}
