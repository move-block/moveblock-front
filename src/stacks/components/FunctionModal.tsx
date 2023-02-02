import { CloseOutlined } from '@ant-design/icons';
import { Button, Modal, Pagination } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';
import { truncateWalletAddress } from '~common/utils';
import Search from '~modules/components/Search';
import useFunctions from '~modules/hooks/useFunctions';

interface FunctionMeta {
  accountAddress: string;
  moduleName: string;
  functionName: string;
  paramLength: number;
  genericParamLength: number;
}
interface ModuleRowType {
  key: number;
  functionName: string;
  moduleName: string;
  account: {
    address: string;
    alias?: string;
  };
  description: string;
  blockMeta: FunctionMeta;
}

const PAGE_SIZE = 6;
const INTIAL_PAGE = 1;

const FunctionModal = ({
  isOpen,
  onAdd,
  onClose,
}: {
  isOpen: boolean;
  onAdd: (blockMeta: FunctionMeta) => void;
  onClose: () => void;
}) => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(INTIAL_PAGE);

  const columns: ColumnsType<ModuleRowType> = [
    {
      title: 'Account',
      key: 'account',
      dataIndex: 'account',
      render: ({ address, alias }) => (
        <div>
          <div>{truncateWalletAddress(address)}</div>
          <div className="text-footnote text-primary">{alias}</div>
        </div>
      ),
      className: 'rounded-l-[10px]',
    },
    { title: 'Module', key: 'module', dataIndex: 'moduleName' },
    {
      title: 'Function',
      key: 'function',
      dataIndex: 'functionName',
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '',
      key: 'stack',
      dataIndex: 'blockMeta',
      render: (blockMeta) => (
        <Button
          type="primary"
          onClick={() => {
            onAdd(blockMeta);
            onClose();
            setKeyword('');
          }}
        >
          Stack
        </Button>
      ),
      className: 'rounded-r-[10px]',
    },
  ];

  const {
    data: { data, totalCount },
    isLoading,
  } = useFunctions({
    keyword,
    offset: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    isEntry: true,
  });
  const dataSource: ModuleRowType[] = data.map(
    ({
      id,
      name,
      module,
      account,
      description,
      params,
      genericTypeParams,
    }) => ({
      key: id,
      functionName: name,
      moduleName: module.name,
      account,
      description: description || '',
      blockMeta: {
        accountAddress: account.address,
        moduleName: module.name,
        functionName: name,
        paramLength: params.length,
        genericParamLength: genericTypeParams?.length || 0,
      },
    })
  );

  useEffect(() => {
    setPage(INTIAL_PAGE);
  }, [keyword]);

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onClose}
      closeIcon={<div />}
      width="80%"
      className="function-modal overflow-auto"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-start">
          <Search onSearch={(keyword) => setKeyword(keyword)} />
          <button onClick={() => onClose()}>
            <CloseOutlined />
          </button>
        </div>
        <Table
          className="border-collapse"
          columns={columns}
          dataSource={dataSource}
          loading={isLoading}
          pagination={{
            position: [],
          }}
        />
        <Pagination
          className="flex items-center justify-center"
          total={totalCount}
          pageSize={PAGE_SIZE}
          showSizeChanger={false}
          current={page}
          onChange={(page) => setPage(page)}
        />
      </div>
    </Modal>
  );
};

export default FunctionModal;
