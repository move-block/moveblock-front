import React from 'react';
import CheckAuth from '~common/components/CheckAuth';
import Unconnected from '~stacks/components/Unconnected';
import Container from '~common/components/Container';
import { MoreOutlined, PlusCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import Link from 'next/link';
import useStacks from '~stacks/hooks/useStacks';
import { Spin } from 'antd';
import HoverableItemContainer from '~common/components/HoverableItemContainer';
import useWallet from '~common/hooks/useWallet';
import { parseFullFunctionName } from '~modules/hooks/fetchFunctionDetail';

const MAX_BLOCKS_TRIM = 4;
const StacksPage = () => {
  const { account } = useWallet();
  const {
    data: { data: stacks, totalCount },
    isLoading,
  } = useStacks({
    address: account?.address,
  });

  return (
    <Container>
      <h1 className="uppercase">Block Stacks</h1>
      <div className="flex flex-wrap gap-4 justify-around">
        <Link href="/stacks/create">
          <HoverableItemContainer
            className="w-[350px] h-[350px] flex-col"
            _hover={
              <h2 className="text-inherit">
                Create a new
                <br />
                Block Stack
              </h2>
            }
          >
            <PlusCircleFilled className="text-primary text-[60px]" />
          </HoverableItemContainer>
        </Link>
        {isLoading && (
          <HoverableItemContainer className="w-[350px] h-[350px] flex-col">
            <Spin size="large" />
          </HoverableItemContainer>
        )}
        {stacks.map(({ id, stackName, blocks, lastEditedAt }) => (
          <Link key={id} href={`/stacks/${id}`}>
            <HoverableItemContainer
              className="w-[350px] h-[350px] flex-col"
              replace={true}
              _hover={
                <>
                  <h2 className="text-inherit">{stackName}</h2>
                  <div className="flex flex-col gap-2 items-center">
                    {blocks
                      .slice(0, MAX_BLOCKS_TRIM)
                      .map(({ functionName }, index) => (
                        <div
                          key={`${id}-${index}`}
                          className="bg-[#262626] py-1 px-2 rounded-[12px]"
                        >
                          {parseFullFunctionName(functionName)?.functionName}
                        </div>
                      ))}
                    {blocks.length > MAX_BLOCKS_TRIM && (
                      <MoreOutlined className="text-h4 opacity-50" />
                    )}
                  </div>
                </>
              }
            >
              <h2 className="text-inherit">{stackName}</h2>
              <div>Number of blocks: {blocks.length}</div>
              <div>Last edited: {dayjs(lastEditedAt).format('YYYY-MM-DD')}</div>
            </HoverableItemContainer>
          </Link>
        ))}
      </div>
    </Container>
  );
};

StacksPage.getLayout = (page: React.ReactElement) => {
  return <CheckAuth unconnected={<Unconnected />}>{page}</CheckAuth>;
};

export default StacksPage;
