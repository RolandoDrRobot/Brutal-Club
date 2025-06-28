import React, { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from '../contexts/StarknetProvider';
import { Text, Button } from '@/components/ui';

export function ConnectWallet() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const controller = connectors[0];
  const [username, setUsername] = useState();
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!address || !controller?.username) return;
    controller.username()?.then((n) => setUsername(n));
  }, [address, controller]);

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#4F46E5',
    color: '#F5F5DC',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s',
  };

  const containerStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    background: 'rgba(0, 0, 0, 0.8)',
    padding: '20px',
    borderRadius: '12px',
    color: '#F5F5DC',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await connect({ connector: controller });
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div style={containerStyle}>
      {address && (
        <>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
            Account: {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          {username && (
            <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>
              Username: {username}
            </p>
          )}
        </>
      )}
      {address ? (
        <button 
          style={{ ...buttonStyle, backgroundColor: '#DC2626' }} 
          onClick={() => disconnect()}
          onMouseOver={(e) => e.target.style.backgroundColor = '#B91C1C'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#DC2626'}
        >
          Disconnect
        </button>
      ) : (
        <>
          <Text size="sm" style={{
            color: '#F5F5DC',
            textAlign: 'center',
            marginBottom: '15px',
            fontFamily: 'Anton, sans-serif'
          }}>
            Connect your wallet to play Fight Club
          </Text>
          
          <Button
            onClick={handleConnect}
            loading={connecting}
            style={{
              background: 'linear-gradient(45deg, #fc3f31, #8B0000)',
              border: '2px solid #fc3f31',
              color: '#F5F5DC',
              fontFamily: 'Anton, sans-serif',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}
            size="lg"
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </>
      )}
    </div>
  );
} 