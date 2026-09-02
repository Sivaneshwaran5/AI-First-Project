const mongoose = require('mongoose');

const transcriptTurnSchema = new mongoose.Schema({
  speaker: { type: String, required: true },
  role: { type: String, enum: ['Sales Rep', 'Prospect', 'Other'], default: 'Prospect' },
  text: { type: String, required: true },
  timestamp: { type: String, default: '00:00' },
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'], default: 'neutral' },
  intentScore: { type: Number, min: 0, max: 100, default: 50 },
});

const objectionSchema = new mongoose.Schema({
  objection: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Addressed', 'Open', 'Blocked'], default: 'Open' },
  suggestedResponse: { type: String, default: '' },
});

const actionItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  task: { type: String, required: true },
  assignee: { type: String, default: 'Sales Rep' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
});

const meetingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    title: {
      type: String,
      required: [true, 'Meeting title is required'],
      trim: true,
    },
    clientName: {
      type: String,
      default: 'Key Decision Maker',
      trim: true,
    },
    clientCompany: {
      type: String,
      default: 'Acme Corp',
      trim: true,
    },
    salesRepName: {
      type: String,
      default: 'Alex Carter',
      trim: true,
    },
    dealStage: {
      type: String,
      enum: ['Discovery', 'Demo', 'Proposal', 'Negotiation', 'Closing', 'Won', 'Lost'],
      default: 'Demo',
    },
    dealValue: {
      type: Number,
      default: 25000,
    },
    meetingDate: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number, // duration in seconds
      default: 1800,
    },
    audioUrl: {
      type: String,
      default: '',
    },
    audioFileName: {
      type: String,
      default: '',
    },
    audioMimeType: {
      type: String,
      default: 'audio/mpeg',
    },
    transcript: [transcriptTurnSchema],
    summary: {
      executive: { type: String, default: '' },
      keyPoints: [{ type: String }],
      prospectNeeds: [{ type: String }],
      nextStepsSummary: { type: String, default: '' },
    },
    sentiment: {
      overall: { type: String, enum: ['positive', 'neutral', 'negative'], default: 'positive' },
      score: { type: Number, min: -100, max: 100, default: 65 }, // overall sentiment score (-100 to 100 or 0 to 100)
      breakdown: {
        positive: { type: Number, default: 65 },
        neutral: { type: Number, default: 25 },
        negative: { type: Number, default: 10 },
      },
      timeline: [
        {
          minute: Number,
          sentimentScore: Number, // 0 to 100
          topic: String,
        },
      ],
    },
    buyerIntent: {
      score: { type: Number, min: 0, max: 100, default: 78 },
      level: { type: String, enum: ['Low', 'Medium', 'High', 'Very High'], default: 'High' },
      signals: [{ type: String }],
      objections: [objectionSchema],
      winProbability: { type: Number, min: 0, max: 100, default: 72 },
      competitorsMentioned: [{ type: String }],
      budgetDiscussed: { type: Boolean, default: true },
    },
    actionItems: [actionItemSchema],
    coachingInsights: {
      strengths: [{ type: String }],
      improvements: [{ type: String }],
      talkRatio: {
        salesRepPercent: { type: Number, default: 45 },
        prospectPercent: { type: Number, default: 55 },
      },
      dealHealthStatus: {
        type: String,
        enum: ['Healthy', 'At Risk', 'Stalled', 'Hot Deal'],
        default: 'Healthy',
      },
    },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Search Indexing
meetingSchema.index({ title: 'text', clientCompany: 'text', clientName: 'text' });

module.exports = mongoose.model('Meeting', meetingSchema);
