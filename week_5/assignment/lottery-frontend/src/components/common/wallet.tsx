import { Button } from 'react-bootstrap';
import { useBalance } from 'wagmi'
import { useNetwork } from 'wagmi'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
 
const shortAddress = (address:string): string => {
  return `${address.substring(0,4)}...${address.substring(address.length-4,address.length)}`
}

export const Wallet = () => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { data, isError, isLoading } = useBalance({address, chainId:chain?.id, watch:true})

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
 
  return (
    <div>
      { isConnected ? 
      (
        <>
        <Button className="btn-danger" onClick={() => disconnect()}>
          Disconnect (${shortAddress(String(address))})
        </Button>
        {chain && <div>Connected to {chain.name}</div>}
        <div>{isLoading && "Fetching balance..."}</div>
        <div>{isError && "Error fetching balance"}</div>
        Balance: {data?.formatted} {data?.symbol}
        </>
  )
        :
        <Button onClick={() => connect()}>Connect Wallet</Button>
      }
    </div>
  )
}