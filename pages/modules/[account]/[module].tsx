import { Skeleton, Spin, Tabs, Typography } from 'antd';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next/types';
import { useCallback, useEffect } from 'react';
import { atom, useResetRecoilState, useSetRecoilState } from 'recoil';
import { MoveModule } from 'src/MoveFunction';
import Container from '~common/components/Container';
import Abi from '~modules/components/Abi';
import Functions from '~modules/components/Functions';
import ModuleInfo from '~modules/components/ModuleInfo';
import useModule from '~modules/hooks/useModule';
import useWallet from '~common/hooks/useWallet';

export const moduleAtom = atom<MoveModule>({
  key: 'module',
  default: {
    address: '',
    name: '',
    alias: '',
    description: '',
    github_url: '',
    rev: '',
    subdir: '',
    bytecode: [],
    friends: [],
    moveModule: {},
    moveFunctions: [],
  },
});

export const authAtom = atom({ key: 'auth', default: { hasAuth: false } });

const ModuleDetail = ({
  accountAddress,
  moduleName,
  selectedFunction,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const setModule = useSetRecoilState(moduleAtom);
  const resetModule = useResetRecoilState(moduleAtom);
  const setAuth = useSetRecoilState(authAtom);

  const { checkAuth } = useWallet();
  const { data, isLoading } = useModule({
    account: accountAddress,
    moduleName,
  });

  const updateAuth = useCallback(async () => {
    (await checkAuth(accountAddress))
      ? setAuth({ hasAuth: true })
      : setAuth({ hasAuth: false });
  }, [accountAddress, checkAuth, setAuth]);

  useEffect(() => {
    if (data) {
      setModule(data);
      updateAuth();
    } else {
      resetModule();
    }
  }, [data, resetModule, setModule, updateAuth]);

  return (
    <Container className="gap-4">
      <h1>
        Module:{' '}
        <Skeleton
          className="inline-block w-fit"
          active
          title={{
            width: '4rem',
          }}
          paragraph={false}
          loading={isLoading}
        >
          {data?.name}
        </Skeleton>
      </h1>
      <div>
        <Tabs
          className="module-detail-tabs"
          defaultActiveKey={selectedFunction ? 'functions' : 'info'}
          type="card"
          items={[
            {
              label: 'Moudle Info',
              key: 'info',
              children: isLoading ? <Spin /> : <ModuleInfo />,
            },
            {
              label: 'ABI',
              key: 'abi',
              children: isLoading ? <Spin /> : <Abi />,
            },
            {
              label: 'Functions',
              key: 'functions',
              children: isLoading ? (
                <Spin />
              ) : (
                <Functions selectedFunction={selectedFunction} />
              ),
            },
          ]}
        />
      </div>
    </Container>
  );
};

export default ModuleDetail;

interface ServerProps {
  accountAddress: string;
  moduleName: string;
  selectedFunction: string;
}
export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const { account, module, function: selectedFunction } = context.query;

  return {
    props: {
      accountAddress: (account as string) || '',
      moduleName: (module as string) || '',
      selectedFunction: (selectedFunction as string) || '',
    },
  };
};
