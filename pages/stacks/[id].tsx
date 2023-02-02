import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next/types';
import StackEditor from '~stacks/components/StackEditor';

declare enum ExecutionStatus {
  IDLE,
  EXECUTING,
  EXECUTED,
}

const StackDetailPage = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <StackEditor id={id} />;
};

interface ServerProps {
  id: number;
}
export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const { id } = context.query;

  return {
    props: {
      id: parseInt(id as string),
    },
  };
};

export default StackDetailPage;
