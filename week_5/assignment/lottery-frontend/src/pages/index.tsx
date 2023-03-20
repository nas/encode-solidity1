import Head from 'next/head'
import { Button, Col, Container, Form, Nav, Navbar, Row, useAccordionButton} from 'react-bootstrap';
import { Wallet } from '@/components/common/wallet';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import * as lotteryJson from "./../assets/Lottery.json";
import * as lotteryTokenJson from "./../assets/LotteryToken.json";
import {usePrepareContractWrite, useContractWrite, useNetwork, useAccount, useSigner} from 'wagmi';
import { GetServerSideProps } from 'next';


let provider: ethers.providers.Provider;
let lotteryContract: ethers.Contract;
let tokenContract: ethers.Contract;

export default function Home({ apiKey, tokenRatio }: any) {

  // I am using InfuraProvider because somehow my Etherscan key
  // is not working.
  // Feel free to switct the provider to EtherscanProvider
  provider = new ethers.providers.InfuraProvider(
    'goerli',
    apiKey,
  );

  const lotteryContractAddress = String(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

  lotteryContract = new ethers.Contract(
    lotteryContractAddress,
    lotteryJson.abi,
    provider,
  ); 

  const tokenAddress = lotteryContract.paymentToken();

  tokenContract = new ethers.Contract(
    tokenAddress,
    lotteryTokenJson.abi,
    provider
  )


  const { chain} = useNetwork();
  const { address, isConnected } = useAccount()

  const [requestLot, setRequestLot] = useState('')
  const [isOpen, setIsOpen] = useState()
  const [betNumbers, setBetNumbers] = useState("1")
  const [lotTokens, setLotTokens] = useState('')
  const [lotteryOwner, setLotteryOwner] = useState('')
  const [betDuration, setBetDuration] = useState('')
  const [closingTime, setClosingTime] = useState(0)

  const { config } = usePrepareContractWrite({
    address: lotteryContractAddress as any,
    abi: lotteryJson.abi,
    functionName: "purchaseTokens",
    chainId: chain?.id,
    args: [
      {
        value: requestLot ? ethers.utils.parseEther(requestLot).div(tokenRatio) : 0,
        gasLimit: 100000,
      },
    ],
  });
  const contractWrite = useContractWrite(config);

  const purchaseTokens = async () => {
    try {
      console.log(config)
      console.log("Ready to transact?", contractWrite.write)
      const data = await contractWrite.writeAsync?.();
      console.log("Data",data)
    } catch (e) {
      console.log(e)
    }
  }

  const {data: signer} = useSigner();

  const placeBets = async () => {

    if (signer) {
      try {
        const tokenWrite = tokenContract.connect(signer)
        
        await tokenWrite
          .approve(lotteryContract.address, ethers.constants.MaxUint256);
      
        const lotteryWrite =  lotteryContract.connect(signer)
        const tx = await lotteryWrite.betMany(betNumbers);
        console.log(`Bets placed (${tx})\n`);

      } catch (e) {
        console.log(e)
      }

    } else {
      alert("connect your wallet first")
    }
  }

  const openBets = async () => {

    if (signer) {
      try {
        const lotteryWrite =  lotteryContract.connect(signer)
        const currentBlock = await provider.getBlock("latest");
        console.log(currentBlock, betDuration)

        const tx = await lotteryWrite.openBets(currentBlock.timestamp + Number(betDuration));
        console.log(`Bets opened (${tx})`);
      } catch (e) {
        console.log(e)
      }

    } else {
      alert("connect your wallet first")
    }
  }

  const closeLottery = async () => {
    if (signer) {
      try {
        const lotteryWrite =  lotteryContract.connect(signer)

        const tx = await lotteryWrite.closeLottery();
        console.log(`Lottery closed (${tx})`);
      } catch (e) {
        console.log(e)
      }

    } else {
      alert("connect your wallet first")
    }
  }

  useEffect(() => {
    const lotterySate = async () => {
      setIsOpen(await lotteryContract.betsOpen())
      setLotteryOwner(await lotteryContract.owner())
    }
    const getLotTokens = async () => {
      let formattedBalance: any;
      if (address) {
        try {
        const bal = await tokenContract.balanceOf(address)
        formattedBalance = await ethers.utils.formatEther(bal)
        } catch(e) {
          formattedBalance = 1
          console.log(e)
        }
      } else {
        formattedBalance = 0
      }
      console.log({apiKey})
      setLotTokens(`${formattedBalance} LOT`)

      setClosingTime(await lotteryContract.betsClosingTime());
    }
    lotterySate();
    getLotTokens();
  }, [isConnected, address])

  const closingMessage = () => {
    const closingTimeDate = new Date(closingTime.toNumber() * 1000);
    return `Lottery closes at ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()}`
  }

  return (
    <>
      <Head>
        <title>Lottery App</title>
        <meta name="description" content="Lottery App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        <Navbar bg="light" variant="light">
          <Container>
            <Navbar.Brand href="#home">Lottery App </Navbar.Brand>
            <Nav >
              <Nav.Link href="/account">Account</Nav.Link>
            </Nav>
            <Nav >
              <Wallet/>
            </Nav>
          </Container>
        </Navbar>

        <Container>
          <Row className='mt-2 bg-info border p-4'>
            <Col>
            {lotteryOwner && `Lottery owner address: ${lotteryOwner}`}
            <Row >
              <Col sm={3}>
                <Form.Control id="betDuration" placeholder="duration in secs" onChange={event => setBetDuration(event.target.value)}/>
              </Col>

              <Col xs="auto" >
                <Button type="submit" disabled={!isConnected } onClick={async () => await openBets()}>Open Lottery</Button>
              </Col>
            </Row>
            </Col>
          </Row>
        </Container>

        <Container>
          <Row className='mt-2 border p-2'>
            <Col>Lottery is {isOpen ? ` Open. ${closingMessage()}` : ' Closed'}</Col>
          </Row>
        </Container>

        <Container>
          <Row className='mt-2 bg-info border p-4 bg-warning'>
            <Col>
            {lotTokens} {!isConnected && "(Connect wallet to view your LOTs)"}
            </Col>
          </Row>
        </Container>
        <Container className='mt-5 bg-light py-4'>
            <Row >
              <Col sm={3}>
                <Form.Control id="purchaseToken" placeholder="LOT" onChange={event => setRequestLot(event.target.value)}/>
              </Col>

              <Col xs="auto" >
                <Button type="submit" disabled={!isConnected || !contractWrite.write || !requestLot } onClick={async () => await purchaseTokens()}>Request Tokens</Button>
              </Col>

              <Col xs="auto" >
                <Button type="submit" disabled={!isOpen} onClick={async () => await placeBets()}>Bet Once</Button>
              </Col>
            </Row>

            <Row className='mt-2'>
              <Col sm={3}>
                <Form.Select id="inlineFormInputName" placeholder="Number" onChange={event => setBetNumbers(event.target.value)}>
                  <option>Number of bets</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                  <option value="4">Four</option>
                  <option value="5">Five</option>
                </Form.Select>
              </Col>

              <Col xs="auto" >
                <Button type="submit" disabled={!isOpen} >Place Bets</Button>
              </Col>
            </Row>
        </Container>


        <Container>
          <Row className='mt-2 bg-info border p-4 bg-warning'>
            <Col>
                <Button type="submit" disabled={!isOpen} onClick={async () => await closeLottery()}>CloseLottery</Button>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  ctx
) => {

    const TOKEN_RATIO = 100
    // const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY 
    const apiKey = process.env.INFURA_API_KEY
    return {
      props: {
        apiKey,
        tokenRatio: TOKEN_RATIO
      },
    };
  }
