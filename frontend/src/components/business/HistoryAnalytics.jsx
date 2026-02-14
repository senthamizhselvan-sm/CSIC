import { useState } from 'react';
import '../../styles/business/HistoryAnalytics.css';

export default function HistoryAnalytics({ token }) {
  const [dateRange, setDateRange] = useState('7days');
  const [searchTerm, setSearchTerm] = useState('');

  const metrics = {
    totalVerifications: 1247,
    approvedRate: 89.4,
    rejectedRate: 10.6,
    avgTime: 8,
    successTrend: 2.3,
    complianceScore: 100
  };

  consthistoryRecords = [
    { date: 'Feb 10', time: '14:32', requestId: 'VF-AB123', purpose: 'Hotel Check-In', attributes: 'Age, Nationality', result: 'APPROVED', responseTime: '2 min 15 sec' },
    { date: 'Feb 10', time: '14:15', requestId: 'VF-AB120', purpose: 'Age Gate', attributes: 'Age 21+', result: 'APPROVED', responseTime: '1 min 42 sec' },
    { date: 'Feb 10', time: '13:45', requestId: 'VF-AB119', purpose: 'Account Opening', attributes: 'Age, Name', result: 'REJECTED', responseTime: '1 min 05 sec' },
    { date: 'Feb 10', time: '13:30', requestId: 'VF-AB118', purpose: 'Hotel Check-In', attributes: 'Age, Nationality', result: 'APPROVED', responseTime: '3 min 22 sec' },
    { date: 'Feb 10', time: '11:15', requestId: 'VF-AB117', purpose: 'KYC Compliance', attributes: 'Age, Residency', result: 'APPROVED', responseTime: '4 min 10 sec' }
  ];

  return (
    <div className="history-analytics">
      <h1 className="bp-page-title">Verification Analytics & History</h1>

      {/* ANALYTICS DASHBOARD */}
      <div className="bp-card">
        <h3 className="bp-card-title"><i className="bi bi-graph-up"></i> Analytics Dashboard</h3>

        <div className="bp-metrics-dashboard">
          <div className="bp-metric-card">
            <div className="bp-metric-label">Total Verifications</div>
            <div className="bp-metric-value-large">{metrics.totalVerifications.toLocaleString()}</div>
          </div>
          <div className="bp-metric-card">
            <div className="bp-metric-label">Approved Rate</div>
            <div className="bp-metric-value-large">{metrics.approvedRate}%</div>
          </div>
          <div className="bp-metric-card">
            <div className="bp-metric-label">Rejected Rate</div>
            <div className="bp-metric-value-large">{metrics.rejectedRate}%</div>
          </div>
          <div className="bp-metric-card">
            <div className="bp-metric-label">Avg. Time to Approve</div>
            <div className="bp-metric-value-large">{metrics.avgTime} secs</div>
          </div>
          <div className="bp-metric-card">
            <div className="bp-metric-label">Success Rate Trend</div>
            <div className="bp-metric-value-large bp-trend-up">↗ {metrics.successTrend}%</div>
          </div>
          <div className="bp-metric-card">
            <div className="bp-metric-label">Compliance Score</div>
            <div className="bp-metric-value-large bp-score-perfect">{metrics.complianceScore}/100</div>
          </div>
        </div>

        <button className="bp-link-btn">View Detailed Reports →</button>
      </div>

      {/* INTERACTIVE TIMELINE */}
      <div className="bp-card">
        <h3 className="bp-card-title">Interactive Timeline (Last 30 Days)</h3>
        <div className="bp-chart-placeholder">
          <div className="bp-chart-visual">
            <i className="bi bi-bar-chart-fill"></i> [Line chart showing daily verification volume, approval rates, and response times]
          </div>
          <div className="bp-chart-legend">
            <span className="bp-legend-item">
              <span className="bp-legend-dot" style={{backgroundColor: '#10b981'}}></span>
              Approved
            </span>
            <span className="bp-legend-item">
              <span className="bp-legend-dot" style={{backgroundColor: '#ef4444'}}></span>
              Rejected
            </span>
            <span className="bp-legend-item">
              <span className="bp-legend-dot" style={{backgroundColor: '#3b82f6'}}></span>
              Avg Response Time
            </span>
          </div>
        </div>
        <p className="bp-chart-hint">Hover over any date for detailed breakdown</p>
      </div>

      {/* DETAILED HISTORY TABLE */}
      <div className="bp-card">
        <h3 className="bp-card-title">Detailed History</h3>

        <div className="bp-table-controls">
          <input
            type="text"
            className="bp-search-input"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="bp-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <button className="bp-btn bp-btn-secondary bp-btn-small">Export CSV</button>
          <button className="bp-btn bp-btn-secondary bp-btn-small">Export PDF</button>
        </div>

        <div className="bp-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Request</th>
                <th>Purpose</th>
                <th>Attributes</th>
                <th>Result</th>
                <th>Response Time</th>
              </tr>
            </thead>
            <tbody>
              {historyRecords.map((record, idx) => (
                <tr key={idx}>
                  <td>{record.date}</td>
                  <td>{record.time}</td>
                  <td>{record.requestId}</td>
                  <td>{record.purpose}</td>
                  <td>{record.attributes}</td>
                  <td>
                    <span className={`bp-status-badge bp-status-${record.result.toLowerCase()}`}>
                      {record.result === 'APPROVED' ? <i className="bi bi-check-circle-fill"></i> : <i className="bi bi-x-circle-fill"></i>} {record.result}
                    </span>
                  </td>
                  <td>{record.responseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bp-pagination">
          <span>Rows per page: 
            <select className="bp-select-inline">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </span>
          <span>1-25 of 1,247</span>
          <button className="bp-btn bp-btn-secondary bp-btn-small">◀ Previous</button>
          <button className="bp-btn bp-btn-secondary bp-btn-small">Next ▶</button>
        </div>

        <div className="bp-compliance-logging">
          <h4>Compliance-Friendly Logging</h4>
          <div className="bp-logging-info">
            <div><i className="bi bi-check-circle-fill text-success"></i> Logged: Request ID, purpose, attributes, result, timestamps</div>
            <div><i className="bi bi-x-circle-fill text-danger"></i> Not Logged: User identity, ID numbers, birthdates, photos, addresses</div>
          </div>
        </div>

        <div className="bp-card-actions">
          <button className="bp-btn bp-btn-secondary">Generate Monthly Report</button>
          <button className="bp-btn bp-btn-secondary">Download Audit Trail</button>
          <button className="bp-btn bp-btn-secondary">Archive History</button>
        </div>
      </div>
    </div>
  );
}
