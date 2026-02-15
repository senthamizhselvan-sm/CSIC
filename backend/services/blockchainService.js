/**
 * Blockchain Service - Simulated for MVP
 * Provides realistic blockchain anchoring simulation
 * Clean architecture for future real blockchain integration
 */

class BlockchainService {
  constructor() {
    // Maintain incrementing block counter for realism
    this.currentBlockNumber = 128000 + Math.floor(Math.random() * 10000);
    this.networks = ['Ethereum (Simulated)', 'Polygon (Simulated)', 'BSC (Simulated)'];
    this.currentNetwork = this.networks[0];
  }

  /**
   * Simulate anchoring a proof to blockchain
   * @param {Object} proofData - The proof to anchor
   * @returns {Object} Blockchain anchor metadata
   */
  async anchorProof(proofData) {
    // Simulate network delay (1-2 seconds)
    await this.simulateNetworkDelay(1000, 2000);

    // Generate fake transaction hash
    const txHash = this.generateTransactionHash();

    // Increment block number
    this.currentBlockNumber++;

    // Generate blockchain metadata
    const blockchainAnchor = {
      txHash: txHash,
      blockNumber: this.currentBlockNumber,
      network: this.currentNetwork,
      confirmed: true,
      confirmationTime: this.generateConfirmationTime(),
      gasUsed: this.generateGasUsed(),
      proofHash: this.generateProofHash(proofData),
      anchoredAt: new Date().toISOString(),
      status: 'SUCCESS',
      explorerUrl: this.getExplorerUrl(txHash),
      blockHash: this.generateTransactionHash(),
      from: '0xVerifyOnceAnchorContract',
      to: '0xProofRegistryContract',
      gasPrice: '20 Gwei',
      transactionFee: '0.00042 ETH'
    };

    return blockchainAnchor;
  }

  /**
   * Generate realistic transaction hash
   * Format: 0x followed by 64 hexadecimal characters
   */
  generateTransactionHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  /**
   * Generate SHA256-like proof hash
   */
  generateProofHash(proofData) {
    // Create deterministic-looking hash from proof ID
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  /**
   * Generate realistic gas used
   */
  generateGasUsed() {
    return Math.floor(21000 + Math.random() * 10000);
  }

  /**
   * Generate confirmation time (2-5 seconds)
   */
  generateConfirmationTime() {
    return (2 + Math.random() * 3).toFixed(1) + 's';
  }

  /**
   * Simulate network delay
   */
  simulateNetworkDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min) + min);
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Get fake block explorer URL
   */
  getExplorerUrl(txHash) {
    return `/explorer/${txHash}`;
  }

  /**
   * Simulate fetching transaction details (for explorer page)
   */
  async getTransactionDetails(txHash) {
    await this.simulateNetworkDelay(500, 1000);

    return {
      txHash: txHash,
      blockNumber: this.currentBlockNumber,
      from: '0xVerifyOnceAnchorContract',
      to: '0xProofRegistryContract',
      gasUsed: this.generateGasUsed(),
      gasPrice: '20 Gwei',
      transactionFee: '0.00042 ETH',
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      confirmations: Math.floor(Math.random() * 100) + 10,
      network: this.currentNetwork,
      blockHash: this.generateTransactionHash(),
      proofHash: this.generateProofHash({ id: txHash }),
      value: '0 ETH',
      nonce: Math.floor(Math.random() * 1000),
      position: Math.floor(Math.random() * 50),
      inputData: this.generateInputData()
    };
  }

  /**
   * Generate fake input data for transaction
   */
  generateInputData() {
    return {
      type: "PROOF_ANCHOR",
      proofHash: this.generateProofHash({ id: 'sample' }),
      timestamp: new Date().toISOString(),
      verifier: "encrypted",
      user: "encrypted"
    };
  }

  /**
   * Get block details (for future use)
   */
  async getBlockDetails(blockNumber) {
    await this.simulateNetworkDelay(300, 800);

    return {
      blockNumber: blockNumber,
      blockHash: this.generateTransactionHash(),
      timestamp: new Date().toISOString(),
      transactions: Math.floor(Math.random() * 200) + 50,
      gasUsed: Math.floor(Math.random() * 15000000) + 5000000,
      gasLimit: 15000000,
      miner: '0xMinerAddress...',
      difficulty: '12.5T',
      size: Math.floor(Math.random() * 50000) + 20000 + ' bytes'
    };
  }
}

// Export singleton instance
module.exports = new BlockchainService();