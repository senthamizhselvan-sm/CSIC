const express = require('express');
const router = express.Router();
const Verification = require('../models/Verification');
const { auth, requireRole } = require('../middleware/auth');

const buildDateKey = (date) => date.toISOString().slice(0, 10);

router.get('/stats', auth, requireRole('business'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const businessId = req.user.userId;

    const totalVerificationsToday = await Verification.countDocuments({
      businessId,
      createdAt: { $gte: today }
    });

    const successfulVerifications = await Verification.countDocuments({
      businessId,
      createdAt: { $gte: today },
      status: 'approved'
    });

    const successRate = totalVerificationsToday
      ? Math.round((successfulVerifications / totalVerificationsToday) * 1000) / 10
      : 0;

    const totalAllTime = await Verification.countDocuments({ businessId });

    res.json({
      totalVerificationsToday,
      successfulVerifications,
      successRate,
      averageResponseTime: '8 seconds',
      totalAllTime
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/recent', auth, requireRole('business'), async (req, res) => {
  try {
    const businessId = req.user.userId;
    const verifications = await Verification.find({ businessId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const response = verifications.map((verification) => ({
      requestId: verification.requestId,
      status: verification.status,
      createdAt: verification.createdAt,
      approvedAt: verification.approvedAt,
      requestedData: verification.requestedData,
      sharedData: verification.status === 'approved' ? verification.sharedData : undefined
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/active', auth, requireRole('business'), async (req, res) => {
  try {
    const businessId = req.user.userId;
    const now = new Date();

    const verifications = await Verification.find({
      businessId,
      status: 'approved',
      proofExpiresAt: { $gt: now }
    })
      .sort({ proofExpiresAt: 1 })
      .lean();

    const response = verifications.map((verification) => ({
      requestId: verification.requestId,
      status: verification.status,
      requestedData: verification.requestedData,
      sharedData: verification.sharedData,
      proofId: verification.proofId,
      proofExpiresAt: verification.proofExpiresAt,
      approvedAt: verification.approvedAt
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/analytics', auth, requireRole('business'), async (req, res) => {
  try {
    const businessId = req.user.userId;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

    const verifications = await Verification.find({
      businessId,
      createdAt: { $gte: startDate }
    }).lean();

    const dailyCounts = {};
    const attributeCounts = {};
    const hourCounts = new Array(24).fill(0);

    let approvedCount = 0;
    let totalCount = 0;
    let totalProofMinutes = 0;
    let proofCount = 0;

    verifications.forEach((verification) => {
      totalCount += 1;

      const dayKey = buildDateKey(new Date(verification.createdAt));
      dailyCounts[dayKey] = (dailyCounts[dayKey] || 0) + 1;

      const hour = new Date(verification.createdAt).getHours();
      hourCounts[hour] += 1;

      (verification.requestedData || []).forEach((item) => {
        if (item?.field) {
          attributeCounts[item.field] = (attributeCounts[item.field] || 0) + 1;
        }
      });

      if (verification.status === 'approved') {
        approvedCount += 1;
        if (verification.approvedAt && verification.proofExpiresAt) {
          const minutes = (new Date(verification.proofExpiresAt) - new Date(verification.approvedAt)) / 60000;
          if (!Number.isNaN(minutes)) {
            totalProofMinutes += minutes;
            proofCount += 1;
          }
        }
      }
    });

    const verificationsByDay = [];
    for (let i = 0; i < 30; i += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const key = buildDateKey(date);
      verificationsByDay.push({
        date: key,
        count: dailyCounts[key] || 0
      });
    }

    const topRequestedAttributes = Object.entries(attributeCounts)
      .map(([attribute, count]) => ({ attribute, count }))
      .sort((a, b) => b.count - a.count);

    const approvalRate = totalCount
      ? Math.round((approvedCount / totalCount) * 1000) / 10
      : 0;

    const averageProofLifetime = proofCount
      ? Math.round((totalProofMinutes / proofCount) * 10) / 10
      : 0;

    const peakHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .filter((entry) => entry.count > 0)
      .sort((a, b) => b.count - a.count);

    res.json({
      verificationsByDay,
      topRequestedAttributes,
      approvalRate,
      averageProofLifetime,
      peakHours
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
