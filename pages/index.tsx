import { Button, Typography } from 'antd';
import Link from 'next/link';
import Container from '~common/components/Container';
import Search from '~modules/components/Search';
import Image from 'next/image';
import Logo from '~public/logo_main.png';

export default function Home() {
  return (
    <div className="flex flex-1 flex-row justify-center items-center w-full max-w-8xl px-[80px]">
      <div className="flex-1">
        <Container className="max-w-2xl gap-[16px] justify-center flex">
          <h1 className="uppercase text-6xl text-white">
            Build Your Own
            <br />
            Aptos Program
            <br />
            without <span className="line-through decoration-4">Coding</span>
          </h1>
          <Typography.Paragraph className="text-h5 mb-2">
            Move Block indexes all modules on the Aptos network. Search amazing
            modules built in the Aptos Community, promote your module, and
            create your unique program without the hassle of coding.
          </Typography.Paragraph>
          <Search />
          <div>
            <Link href="/stacks">
              <Button
                type="primary"
                size="large"
                className="uppercase text-h5 px-[41px] py-[11px] mt-4 w-full justify-center align-middle"
              >
                Start Stacking
              </Button>
            </Link>
          </div>
        </Container>
      </div>

      <div className="flex-1">
        <Image
          src={Logo}
          alt="Move Block logo"
          className="w-[781px] h-[798px]"
        />
      </div>
    </div>
  );
}
