import { Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import LogoImage from '~public/logo_white.png';
import ConnectWallet from './ConnectWallet';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
const wallets = [new PetraWallet()];
const menuItems = [
  {
    href: '/modules',
    label: 'Explore Modules',
  },
  {
    href: '/stacks',
    label: 'Block Stack',
  },
];

const Gnb = () => {
  const router = useRouter();

  return (
    <Header className="max-sm:px-2 flex items-center justify-center gap-4 h-[110px]">
      <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
        <Link href="/">
          <Image src={LogoImage} alt="Move Block logo" />
        </Link>
        <Menu
          className="bg-transparent m-0 min-w-0 flex-auto"
          mode="horizontal"
          theme="dark"
          selectedKeys={[router.pathname]}
          items={[
            ...menuItems.map(({ href, label }) => ({
              key: href,
              label: (
                <Link href={href}>
                  <span className="text-h5">{label}</span>
                </Link>
              ),
            })),
            {
              key: 'help',
              label: (
                <a
                  href="https://www.notion.so/Move-Block-9deb30eef70240b5bf86634f06716ffd"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="text-h5">Help</span>
                </a>
              ),
            },
          ]}
        />

        <ConnectWallet responsive />
      </AptosWalletAdapterProvider>
    </Header>
  );
};

export default Gnb;
