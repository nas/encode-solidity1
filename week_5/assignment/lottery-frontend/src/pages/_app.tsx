import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app';
import { WagmiConfig, createClient,configureChains, mainnet, goerli } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public'

const { provider, webSocketProvider } = configureChains(
  [mainnet, goerli],
  [publicProvider()],
)

const client = createClient({
  provider,
  webSocketProvider,
})

export default function App({ Component, pageProps }: AppProps) {
  return(
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
