import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const searchPath = '/modules';
const searchQuery = 'keyword';

const Search = () => {
  const router = useRouter();

  const defaultValue = useMemo(() => {
    if (router.pathname !== searchPath) {
      return '';
    }

    return router.query[searchQuery];
  }, [router.pathname, router.query]);

  return (
    <Input.Search
      size="large"
      placeholder="Search account, module name or function name"
      allowClear
      enterButton={<SearchOutlined />}
      defaultValue={defaultValue}
      onSearch={(value) => {
        const queryString = value ? `?${searchQuery}=${value}` : '';
        router.push(searchPath + queryString);
      }}
    />
  );
};

export default Search;
