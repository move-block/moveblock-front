import { Button, Typography } from 'antd';
import Link from 'next/link';
import Container from '~common/components/Container';
import Search from '~modules/components/Search';

export default function Home() {
  return (
    <Container className="max-w-3xl gap-[16px]">
      <h1 className="uppercase">
        Build Your Own
        <br />
        Aptos Program
        <br />
        without <span className="line-through decoration-4">Coding</span>
      </h1>
      <Typography.Paragraph className="text-h5 mb-2">
        Move Block indexes all modules on the Aptos network. Search amazing
        modules built in the Aptos Community, promote your module, and create
        your unique program without the hassle of coding.
      </Typography.Paragraph>
      <Search />
      <div>
        <Link href="/stacks">
          <Button
            type="primary"
            size="large"
            className="uppercase text-h5 px-[41px] py-[11px] mt-4"
          >
            Start Stacking
          </Button>
        </Link>
      </div>
    </Container>
  );
}
