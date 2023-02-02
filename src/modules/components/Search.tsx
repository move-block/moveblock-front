import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const searchPath = '/modules';
const searchQuery = 'keyword';

const Search = ({ onSearch }: { onSearch?: (keyword: string) => void }) => {
  const router = useRouter();

  const defaultValue = useMemo(() => {
    if (router.pathname !== searchPath) {
      return '';
    }

    return router.query[searchQuery];
  }, [router.pathname, router.query]);

  const handleSearch =
    onSearch ||
    ((value) => {
      const queryString = value ? `?${searchQuery}=${value}` : '';
      router.push(searchPath + queryString);
    });

  return (
    <Input.Search
      size="large"
      placeholder="Search account, module name or function name"
      allowClear
      enterButton={<SearchOutlined />}
      defaultValue={defaultValue}
      onSearch={handleSearch}
    />
  );
};

export default Search;
