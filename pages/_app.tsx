import { StyleProvider } from '@ant-design/cssinjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider, theme, Typography } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next/types';
import { ReactElement, ReactNode } from 'react';
import { RecoilRoot } from 'recoil';
import { BG_COLOR, gray, PRIMARY_COLOR, TEXT_COLOR } from 'src/colors';
import Gnb from '~common/components/Gnb';
import { Poppins } from '@next/font/google';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

import '~styles/globals.css';
import Footer from '~common/components/Footer';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const queryClient = new QueryClient();
const wallets = [new PetraWallet()];

const poppins = Poppins({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPageWithLayout;
}) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <RecoilRoot>
      <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
        <QueryClientProvider client={queryClient}>
          <StyleProvider hashPriority="high">
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                  borderRadius: 10,
                  colorPrimary: PRIMARY_COLOR,
                  colorTextBase: TEXT_COLOR,
                  colorBgBase: BG_COLOR,
                  fontSizeHeading1: 60,
                  lineHeightHeading1: 70 / 60,
                  fontFamily: poppins.style.fontFamily,
                },
                components: {
                  Typography: {
                    colorTextHeading: PRIMARY_COLOR,
                  },
                  Layout: {
                    colorBgHeader: 'transparent',
                  },
                  Menu: {
                    colorItemBgSelectedHorizontal: 'transparent',
                    colorItemTextSelectedHorizontal: PRIMARY_COLOR,
                    colorItemText: TEXT_COLOR,
                    colorItemTextHover: gray[6],
                  },
                  Button: {
                    colorBgContainer: gray[8],
                    colorBorder: 'none',
                    controlHeightLG: 46,
                  },
                  Input: {
                    lineWidth: 0.5,
                    colorBorder: gray[9],
                  },
                },
              }}
            >
              <Typography>
                <Layout className="min-h-screen">
                  <Gnb />
                  <Content className="flex-1 flex flex-col items-stretch px-[50px] max-sm:px-2">
                    {getLayout(<Component {...pageProps} />)}
                  </Content>
                  <Footer />
                </Layout>
              </Typography>
            </ConfigProvider>
          </StyleProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AptosWalletAdapterProvider>
    </RecoilRoot>
  );
}
