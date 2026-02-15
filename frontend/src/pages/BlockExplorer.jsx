import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import './BlockExplorer.css';

const BlockExplorer = () => {
  const { txHash } = useParams();
  const [txDetails, setTxDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/blockchain/transaction/${txHash}`);
        
        if (response.data.success) {
          setTxDetails(response.data.transaction);
        } else {
          setError('Transaction not found');
        }
      } catch (err) {
        console.error('Error fetching transaction:', err);
        setError(err.response?.data?.message || 'Failed to fetch transaction details');
      } finally {
        setLoading(false);
      }
    };

    if (txHash) {
      fetchTransactionDetails();
    }
  }, [txHash]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    });
  };

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  const formatTxHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  if (loading) {
    return (
      <div className="explorer-page">
        <div className="explorer-loading">
          <div className="loading-spinner">
            <i className="bi bi-arrow-clockwise" style={{ animation: 'spin 1s linear infinite', fontSize: '32px' }}></i>
          </div>
          <p>Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="explorer-page">
        <div className="explorer-error">
          <div className="error-icon">❌</div>
          <h2>Transaction Not Found</h2>
          <p>{error}</p>
          <Link to="/dashboard" className="back-link">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="explorer-page">
      <header className="explorer-header">
        <div className="header-content">
          <div className="header-left">
            <h1>⛓️ VerifyOnce Block Explorer</h1>
            <div className="network-badge">
              <span className="network-status">●</span>
              Ethereum (Simulated)
            </div>
          </div>
          <Link to="/dashboard" className="back-button">
            <i className="bi bi-arrow-left"></i>
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="explorer-content">
        <section className="tx-overview">
          <div className="section-header">
            <h2>Transaction Details</h2>
            <div className="tx-status">
              <span className="status-success">✅ Success</span>
            </div>
          </div>

          <div className="detail-grid">
            <DetailItem 
              label="Transaction Hash"
              value={txDetails.txHash}
              copyable
              onCopy={() => copyToClipboard(txDetails.txHash)}
            />
            <DetailItem 
              label="Status"
              value={<span className="status-success">✅ Success</span>}
            />
            <DetailItem 
              label="Block Number"
              value={txDetails.blockNumber}
              link={`/explorer/block/${txDetails.blockNumber}`}
            />
            <DetailItem 
              label="Timestamp"
              value={formatDateTime(txDetails.timestamp)}
            />
            <DetailItem 
              label="From"
              value={txDetails.from}
              address
            />
            <DetailItem 
              label="To"
              value={txDetails.to}
              address
            />
            <DetailItem 
              label="Gas Used"
              value={`${txDetails.gasUsed.toLocaleString()} gas`}
            />
            <DetailItem 
              label="Gas Price"
              value={txDetails.gasPrice}
            />
            <DetailItem 
              label="Transaction Fee"
              value={txDetails.transactionFee}
            />
            <DetailItem 
              label="Confirmations"
              value={`${txDetails.confirmations} blocks`}
            />
            <DetailItem 
              label="Position in Block"
              value={txDetails.position}
            />
            <DetailItem 
              label="Nonce"
              value={txDetails.nonce}
            />
          </div>
        </section>

        <section className="tx-data">
          <h3>Transaction Data</h3>
          <div className="code-block">
            <pre>
              {JSON.stringify(txDetails.inputData, null, 2)}
            </pre>
          </div>
        </section>

        <section className="security-info">
          <div className="info-box">
            <h4>🔒 Privacy & Security</h4>
            <p>
              This transaction anchors a proof hash to the blockchain.
              No personal information is stored on-chain.
              The proof itself is stored off-chain with end-to-end encryption.
            </p>
          </div>
          
          <div className="info-box">
            <h4>⚠️ Simulated Network</h4>
            <p>
              This is a simulated blockchain for demonstration purposes.
              Production version will use actual blockchain networks like Ethereum or Polygon.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, copyable, onCopy, link, address }) => {
  const renderValue = () => {
    if (React.isValidElement(value)) {
      return value;
    }

    if (address) {
      return (
        <span className="address-value">
          {typeof value === 'string' ? formatTxHash(value) : value}
        </span>
      );
    }

    if (link) {
      return (
        <Link to={link} className="link-value">
          {value}
        </Link>
      );
    }

    if (copyable) {
      return (
        <div className="copyable-value">
          <span className="hash-value">{formatTxHash(value)}</span>
          <button onClick={onCopy} className="copy-button">
            <i className="bi bi-clipboard"></i>
          </button>
        </div>
      );
    }

    return <span>{value}</span>;
  };

  const formatTxHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <div className="detail-item">
      <label className="detail-label">{label}:</label>
      <div className="detail-value">
        {renderValue()}
      </div>
    </div>
  );
};

export default BlockExplorer;
