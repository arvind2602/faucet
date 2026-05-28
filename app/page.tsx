/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState } from 'react';
import { Button, Card, Col, Container, Row, Form } from 'react-bootstrap';
import { useWallet } from '@solana/wallet-adapter-react';

import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface IFaucetProps { }

export default function Faucet(props: IFaucetProps) {
  const { publicKey, connected } = useWallet();
  const [currentPubkey, setCurrentPubkey] = useState("");
  const [solAmount, setSolAmount] = useState<number>(1.0);
  const [isTestnet, setIsTestnet] = useState<boolean>(true);

  const testnetURL = clusterApiUrl(WalletAdapterNetwork.Testnet);
  const testnetConnection = new Connection(testnetURL);
  const devnetURL = clusterApiUrl(WalletAdapterNetwork.Devnet);
  const devnetConnection = new Connection(devnetURL);

  function handleSolChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSolAmount(parseFloat(event.target.value));
  }

  async function handleAirdropRequest() {
    if (!solAmount || solAmount <= 0) {
      toast.error("Invalid SOL amount.");
      return;
    }

    if (!publicKey && !currentPubkey) {
      toast.error("Public key is required.");
      return;
    }

    toast.info("Airdrop request sent!");
    try {
      const connection = isTestnet ? testnetConnection : devnetConnection;
      const targetPubkey = publicKey ? publicKey : new PublicKey(currentPubkey);

      await connection.requestAirdrop(targetPubkey, LAMPORTS_PER_SOL * solAmount);

      toast.success("Airdrop succeeded!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).toString()}`);
    }
  }

  return (
    <>
      <Container fluid="sm">
        <Row>
          <Col className='d-flex justify-content-center px-2 py-5'>
            <Card className='shadow' style={{ width: '48rem' }}>
              <Card.Header>
                <Card.Title>Airdrop Yourself SOL</Card.Title>
              </Card.Header>
              <Card.Body>
                <Container>
                  <Form>
                    <Form.Group as={Row} className='px-2 py-2'>
                      <Form.Label htmlFor='wallet-pubkey'>Public Key:</Form.Label>
                      <Form.Control
                        type='text'
                        disabled={!!publicKey}
                        value={publicKey ? publicKey.toBase58() : currentPubkey}
                        onChange={(e) => setCurrentPubkey(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group as={Row} className='px-2 py-2'>
                      <Form.Label htmlFor='sol-amount'>SOL</Form.Label>
                      <Form.Control
                        type='number'
                        defaultValue="1.0"
                        step="0.5"
                        onChange={handleSolChange}
                      />
                    </Form.Group>
                    <Form.Check
                      checked={isTestnet}
                      onChange={() => setIsTestnet(!isTestnet)}
                      type="switch"
                      label="Testnet"
                      id="testnet-switch"
                    />
                    <Form.Check
                      checked={!isTestnet}
                      onChange={() => setIsTestnet(!isTestnet)}
                      type="switch"
                      label="Devnet"
                      id="devnet-switch"
                    />
                  </Form>
                </Container>
              </Card.Body>
              <Card.Footer>
                <Container>
                  <Button
                    className='ml-auto'
                    variant='primary'
                    onClick={handleAirdropRequest}
                  >
                    Send
                  </Button>
                </Container>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
