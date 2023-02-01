import { geekblue as _geekblue } from '@ant-design/colors';

const geekblue = [undefined, ..._geekblue]; // for easier indexing

// neutral colors in @ant-design/colors are wrong
export const gray = [
  undefined,
  '#ffffff',
  '#fafafa',
  '#f5f5f5',
  '#f0f0f0',
  '#d9d9d9',
  '#bfbfbf',
  '#8c8c8c',
  '#595959',
  '#434343',
  '#262626',
  '#1f1f1f',
  '#141414',
  '#000000',
];

export const PRIMARY_COLOR = geekblue[5];
export const BG_COLOR = gray[11];
export const TEXT_COLOR = gray[4];
