import { Button, Pagination, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Visibility } from 'src/MoveFunction';
import Container from '~common/components/Container';
import { truncateWalletAddress } from '~common/utils';

import Search from '~modules/components/Search';
import useFunctions from '~modules/hooks/useFunctions';

interface ModuleRowType {
  key: number;
  functionName: string;
  visibility: Visibility;
  moduleName: string;
  account: {
    address: string;
    alias?: string;
  };
  detailAddress: string;
  isEntry: boolean;
}

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
  { title: 'Function', key: 'function', dataIndex: 'functionName' },
  { title: 'Visibility', key: 'visibility', dataIndex: 'visibility' },
  {
    title: 'is entry',
    key: 'isEntry',
    dataIndex: 'isEntry',
    render: (isEntry) => (isEntry ? 'Yes' : 'No'),
  },
  {
    title: '',
    key: 'detail',
    dataIndex: 'detailAddress',
    render: (detailAddress) => (
      <Link href={detailAddress}>
        <Button type="primary">Detail</Button>
      </Link>
    ),
    className: 'rounded-r-[10px]',
  },
];

const PAGE_SIZE = 10;
const INTIAL_PAGE = 1;

const Modules = () => {
  const router = useRouter();
  const [page, setPage] = useState(INTIAL_PAGE);

  const keyword = router.query.keyword as string;

  const {
    data: { data, totalCount },
    isLoading,
  } = useFunctions({
    keyword: router.query.keyword as string,
    offset: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
  });
  const dataSource: ModuleRowType[] = data.map(
    ({ id, name, visibility, module, account, isEntry }) => ({
      key: id,
      functionName: name,
      visibility,
      moduleName: module.name,
      account,
      isEntry,
      detailAddress: `/modules/${account.address}/${module.name}?function=${name}`,
    })
  );

  useEffect(() => {
    setPage(INTIAL_PAGE);
  }, [keyword]);

  return (
    <Container>
      <h1 className="uppercase">Module Explorer</h1>
      <Search />
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
    </Container>
  );
};

export default Modules;
