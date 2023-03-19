import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Button, Col, InputGroup, Container, Form, Nav, Navbar, Row, Table } from 'react-bootstrap';
import { Wallet } from '@/components/common/wallet';


export default function Home() {
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

        <Container className='mt-5'>

          <Form>
            <Row >
              <Col sm={3}>
                <Form.Label htmlFor="inlineFormInputName" visuallyHidden>
                  Tokens
                </Form.Label>
                <Form.Control id="inlineFormInputName" placeholder="LOT" />
              </Col>

              <Col xs="auto" >
                <Button type="submit">Deposit</Button>
              </Col>
            </Row>
          </Form>

        </Container>
      </main>
    </>
  )
}
