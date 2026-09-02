const Meeting = require('../models/Meeting');

// @desc Get aggregated sales intelligence dashboard analytics
// @route GET /api/analytics/dashboard
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const meetings = await Meeting.find().sort('meetingDate');

    if (meetings.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalMeetings: 0,
          totalPipelineValue: 0,
          avgSentimentScore: 0,
          avgBuyerIntent: 0,
          avgWinProbability: 0,
          actionItemsStats: { total: 0, completed: 0, pending: 0, highPriority: 0 },
          sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
          sentimentTrends: [],
          dealStageDistribution: [],
          objectionsBreakdown: [],
          competitorMentions: [],
          topDeals: [],
        },
      });
    }

    // Calculations
    const totalMeetings = meetings.length;
    const totalPipelineValue = meetings.reduce((acc, m) => acc + (m.dealValue || 0), 0);

    const avgSentimentScore = Math.round(
      meetings.reduce((acc, m) => acc + (m.sentiment?.score || 50), 0) / totalMeetings
    );

    const avgBuyerIntent = Math.round(
      meetings.reduce((acc, m) => acc + (m.buyerIntent?.score || 50), 0) / totalMeetings
    );

    const avgWinProbability = Math.round(
      meetings.reduce((acc, m) => acc + (m.buyerIntent?.winProbability || 50), 0) / totalMeetings
    );

    // Aggregate Action Items
    let totalActionItems = 0;
    let completedActionItems = 0;
    let highPriorityActionItems = 0;

    meetings.forEach((m) => {
      (m.actionItems || []).forEach((item) => {
        totalActionItems++;
        if (item.completed) completedActionItems++;
        if (item.priority === 'High' && !item.completed) highPriorityActionItems++;
      });
    });

    const pendingActionItems = totalActionItems - completedActionItems;

    // Aggregate Sentiment Breakdown
    const avgPositive = Math.round(
      meetings.reduce((acc, m) => acc + (m.sentiment?.breakdown?.positive || 0), 0) / totalMeetings
    );
    const avgNeutral = Math.round(
      meetings.reduce((acc, m) => acc + (m.sentiment?.breakdown?.neutral || 0), 0) / totalMeetings
    );
    const avgNegative = Math.round(
      meetings.reduce((acc, m) => acc + (m.sentiment?.breakdown?.negative || 0), 0) / totalMeetings
    );

    // Sentiment Trends Timeline
    const sentimentTrends = meetings.map((m, index) => ({
      callIndex: index + 1,
      title: m.clientCompany || m.title,
      date: new Date(m.meetingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sentiment: m.sentiment?.score || 60,
      buyerIntent: m.buyerIntent?.score || 65,
      winProbability: m.buyerIntent?.winProbability || 60,
    }));

    // Deal Stage Distribution
    const stageMap = {};
    meetings.forEach((m) => {
      const stage = m.dealStage || 'Discovery';
      stageMap[stage] = (stageMap[stage] || 0) + 1;
    });

    const dealStageDistribution = Object.keys(stageMap).map((stage) => ({
      stage,
      count: stageMap[stage],
      value: meetings.filter((m) => m.dealStage === stage).reduce((sum, item) => sum + (item.dealValue || 0), 0),
    }));

    // Objections Analysis
    const objectionsList = [];
    meetings.forEach((m) => {
      (m.buyerIntent?.objections || []).forEach((obj) => {
        objectionsList.push({
          objection: obj.objection,
          severity: obj.severity,
          status: obj.status,
          company: m.clientCompany,
          meetingId: m._id,
        });
      });
    });

    // Competitor Mentions Count
    const competitorMap = {};
    meetings.forEach((m) => {
      (m.buyerIntent?.competitorsMentioned || []).forEach((comp) => {
        if (comp && comp.trim()) {
          competitorMap[comp] = (competitorMap[comp] || 0) + 1;
        }
      });
    });

    const competitorMentions = Object.keys(competitorMap).map((comp) => ({
      name: comp,
      count: competitorMap[comp],
    }));

    // Top Opportunities
    const topDeals = meetings
      .sort((a, b) => (b.dealValue || 0) - (a.dealValue || 0))
      .slice(0, 5)
      .map((m) => ({
        id: m._id,
        title: m.title,
        clientCompany: m.clientCompany,
        clientName: m.clientName,
        dealStage: m.dealStage,
        dealValue: m.dealValue,
        intentScore: m.buyerIntent?.score,
        sentiment: m.sentiment?.overall,
        winProbability: m.buyerIntent?.winProbability,
        actionItemsPending: (m.actionItems || []).filter((i) => !i.completed).length,
      }));

    res.status(200).json({
      success: true,
      data: {
        totalMeetings,
        totalPipelineValue,
        avgSentimentScore,
        avgBuyerIntent,
        avgWinProbability,
        actionItemsStats: {
          total: totalActionItems,
          completed: completedActionItems,
          pending: pendingActionItems,
          highPriority: highPriorityActionItems,
          completionRate: totalActionItems > 0 ? Math.round((completedActionItems / totalActionItems) * 100) : 0,
        },
        sentimentBreakdown: {
          positive: avgPositive,
          neutral: avgNeutral,
          negative: avgNegative,
        },
        sentimentTrends,
        dealStageDistribution,
        objectionsBreakdown: objectionsList,
        competitorMentions,
        topDeals,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardAnalytics };
