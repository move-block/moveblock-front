import { AccountRawData, MoveModuleRawData } from './Api';

export type Visibility = 'public' | 'friend';

interface MoveFunctionMeta {
  id: number;
  name: string;
  module: {
    name: string;
  };
  account: {
    address: string;
    alias?: string;
  };
}

interface MoveFunctionAccessInfo {
  visibility: Visibility;
  isEntry: boolean;
}

export type MoveFunction = MoveFunctionMeta & MoveFunctionAccessInfo;

type MoveFunctionParam = {
  type?: string;
  name?: string;
  value?: string;
};

type GenericTypeParam = {
  ability?: string;
  name?: string;
  value?: string;
};

export interface MoveFunctionDetail {
  description: string;
  params: MoveFunctionParam[];
  genericTypeParams?: GenericTypeParam[];
  returnTypes?: string[];
}

export type MoveFunctionWithDetail = MoveFunction & MoveFunctionDetail;

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

type MoveFunctionArguments = {
  params: (Partial<MoveFunctionParam> & {
    value: string;
  })[];
  genericTypeParams: (Partial<GenericTypeParam> & {
    value: string;
  })[];
};

export type MoveBlockPreview = {
  functionName: string;
};
export type MoveBlock = MoveBlockPreview &
  MoveFunctionArguments &
  Partial<MoveFunctionDetail>;

export interface MoveStackPreview {
  id: number;
  stackName: string;
  blocks: MoveBlockPreview[];
  lastEditedAt: string;
}

export interface MoveStack extends MoveStackPreview {
  blocks: MoveBlock[];
}
