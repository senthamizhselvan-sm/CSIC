/**
 * Blockchain API Routes - Simulated for MVP
 * Provides block explorer functionality
 */

const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchainService');

// Get transaction details for block explorer
router.get('/transaction/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;

    // Validate transaction hash format
    if (!txHash || !txHash.startsWith('0x') || txHash.length !== 66) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction hash format'
      });
    }

    const transactionDetails = await blockchainService.getTransactionDetails(txHash);

    return res.json({
      success: true,
      transaction: transactionDetails
    });
  } catch (err) {
    console.error('❌ Error fetching transaction details:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction details',
      error: err.message
    });
  }
});

// Get block details
router.get('/block/:blockNumber', async (req, res) => {
  try {
    const { blockNumber } = req.params;

    // Validate block number
    const blockNum = parseInt(blockNumber);
    if (isNaN(blockNum) || blockNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid block number'
      });
    }

    const blockDetails = await blockchainService.getBlockDetails(blockNum);

    return res.json({
      success: true,
      block: blockDetails
    });
  } catch (err) {
    console.error('❌ Error fetching block details:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch block details',
      error: err.message
    });
  }
});

// Get network status (for dashboard)
router.get('/status', async (req, res) => {
  try {
    return res.json({
      success: true,
      network: {
        name: 'Ethereum (Simulated)',
        status: 'online',
        blockHeight: 128000 + Math.floor(Math.random() * 10000),
        gasPrice: '20 Gwei',
        avgBlockTime: '12.5s',
        totalTransactions: Math.floor(Math.random() * 1000000) + 500000,
        activeNodes: Math.floor(Math.random() * 100) + 50
      }
    });
  } catch (err) {
    console.error('❌ Error fetching network status:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch network status',
      error: err.message
    });
  }
});

module.exports = router;