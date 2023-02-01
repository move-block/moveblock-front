import { StyleProvider } from '@ant-design/cssinjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider, Typography } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next/types';
import { ReactElement, ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

import '~styles/globals.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPageWithLayout;
}) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <StyleProvider hashPriority="high">
          <ConfigProvider>
            <Typography>
              <Layout className="min-h-screen">
                <Content className="flex-1 flex flex-col items-stretch">
                  {getLayout(<Component {...pageProps} />)}
                </Content>
              </Layout>
            </Typography>
          </ConfigProvider>
        </StyleProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  );
}
