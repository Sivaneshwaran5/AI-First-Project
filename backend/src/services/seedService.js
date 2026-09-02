const User = require('../models/User');
const Meeting = require('../models/Meeting');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase(force = false) {
  try {
    const meetingCount = await Meeting.countDocuments();
    if (meetingCount > 0 && !force) {
      console.log(`[Seed Service] Database already contains ${meetingCount} meetings. Skipping seed.`);
      return;
    }

    console.log('[Seed Service] Seeding database with rich demo sales meetings...');

    // Clear existing collections if force is true
    if (force) {
      await User.deleteMany({});
      await Meeting.deleteMany({});
    }

    // 1. Create Demo Users
    let demoRep = await User.findOne({ email: 'alex@salesai.com' });
    if (!demoRep) {
      demoRep = await User.create({
        name: 'Alex Carter',
        email: 'alex@salesai.com',
        password: 'password123',
        role: 'Sales Rep',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'Apex Intelligence Corp',
      });
    }

    let demoManager = await User.findOne({ email: 'elena@salesai.com' });
    if (!demoManager) {
      demoManager = await User.create({
        name: 'Elena Rostova',
        email: 'elena@salesai.com',
        password: 'password123',
        role: 'Sales Manager',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        organization: 'Apex Intelligence Corp',
      });
    }

    // 2. Demo Meetings
    const sampleMeetings = [
      {
        userId: demoRep._id,
        title: 'Enterprise Cloud Security Architecture & AI Copilot Migration',
        clientName: 'Sarah Vance (Chief Information Officer)',
        clientCompany: 'Apex Dynamics',
        salesRepName: 'Alex Carter',
        dealStage: 'Negotiation',
        dealValue: 120000,
        meetingDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        duration: 2160, // 36 mins
        audioUrl: '',
        audioFileName: 'apex_dynamics_cloud_security_call.mp3',
        audioMimeType: 'audio/mpeg',
        transcript: [
          {
            speaker: 'Alex Carter',
            role: 'Sales Rep',
            text: 'Hello Sarah, thank you for joining! Following up on our previous technical demo, today we are focusing on your SOC2 Type II requirements and our enterprise zero-trust connector.',
            timestamp: '00:00',
            sentiment: 'positive',
            intentScore: 70,
          },
          {
            speaker: 'Sarah Vance',
            role: 'Prospect',
            text: 'Thanks Alex. We reviewed the whitepaper with our security team. Our primary question is around data residency in AWS US-East and multi-tenant isolation.',
            timestamp: '01:15',
            sentiment: 'neutral',
            intentScore: 82,
          },
          {
            speaker: 'Alex Carter',
            role: 'Sales Rep',
            text: 'All audio and transcript data is encrypted at rest using customer-managed AWS KMS keys. Dedicated VPC peering ensures your data never traverses public networks.',
            timestamp: '02:45',
            sentiment: 'positive',
            intentScore: 88,
          },
          {
            speaker: 'Sarah Vance',
            role: 'Prospect',
            text: 'That checks all our Infosec boxes. In terms of licensing, if we commit to an annual 150-seat contract upfront, does that include premier 24/7 SLA and custom LLM tuning?',
            timestamp: '05:30',
            sentiment: 'positive',
            intentScore: 95,
          },
          {
            speaker: 'Alex Carter',
            role: 'Sales Rep',
            text: 'Yes! We bundle our Tier-1 Dedicated Solution Architect and custom ontology tuning for enterprise agreements above 100 seats.',
            timestamp: '06:50',
            sentiment: 'positive',
            intentScore: 96,
          },
          {
            speaker: 'Sarah Vance',
            role: 'Prospect',
            text: 'Terrific. Please send the revised Master Services Agreement and Redline draft to our legal counsel by Thursday. We want to execute before the quarter ends.',
            timestamp: '08:10',
            sentiment: 'positive',
            intentScore: 98,
          },
        ],
        summary: {
          executive: 'High-momentum closing call with CIO Sarah Vance at Apex Dynamics. Successfully satisfied Infosec multi-tenant encryption requirements. Sarah requested the final MSA redline for 150 enterprise seats ($120k ARR) with target execution before end of quarter.',
          keyPoints: [
            'Security audit requirements (SOC2 Type II, AWS KMS, VPC Peering) fully approved.',
            'Prospect expanding pilot from 50 seats to 150 seats across all regional sales hubs.',
            'Dedicated Solutions Architect and 24/7 SLA included in annual tier.',
            'Target contract execution within the current fiscal quarter.'
          ],
          prospectNeeds: [
            'Dedicated VPC peering and KMS encryption',
            '150-seat rollout with SSO and Okta integration',
            'Custom sales ontology and automated CRM syncing'
          ],
          nextStepsSummary: 'Send revised Master Services Agreement and Order Form to legal counsel by Thursday; coordinate provisioning kick-off.'
        },
        sentiment: {
          overall: 'positive',
          score: 89,
          breakdown: {
            positive: 78,
            neutral: 18,
            negative: 4,
          },
          timeline: [
            { minute: 2, sentimentScore: 70, topic: 'SOC2 & Infosec Clarifications' },
            { minute: 8, sentimentScore: 82, topic: 'Data Residency & AWS KMS' },
            { minute: 15, sentimentScore: 86, topic: 'Seat Expansion to 150 Users' },
            { minute: 22, sentimentScore: 92, topic: 'Enterprise SLA & Support' },
            { minute: 30, sentimentScore: 98, topic: 'Contract Redlines & Closing Plan' },
          ],
        },
        buyerIntent: {
          score: 94,
          level: 'Very High',
          winProbability: 92,
          signals: [
            'Explicitly requested final contract draft to execute before quarter close',
            'Increased seat count scope from 50 to 150 enterprise licenses',
            'Infosec security clearance confirmed without pending blockers'
          ],
          objections: [
            {
              objection: 'Multi-tenant isolation and AWS data residency guarantees',
              severity: 'High',
              status: 'Addressed',
              suggestedResponse: 'Presented AWS KMS dedicated VPC architecture and SOC2 Type II compliance audit packet.'
            }
          ],
          competitorsMentioned: ['Gong.io', 'SalesLoft'],
          budgetDiscussed: true,
        },
        actionItems: [
          {
            id: `act-${uuidv4().substring(0, 8)}`,
            task: 'Send final redline MSA and 150-seat Order Form to Apex Dynamics Legal',
            assignee: 'Alex Carter (Sales Rep)',
            priority: 'High',
            dueDate: new Date(Date.now() + 86400000 * 2),
            completed: false,
          },
          {
            id: `act-${uuidv4().substring(0, 8)}`,
            task: 'Coordinate AWS VPC Peering config checklist with Solutions Architecture team',
            assignee: 'Alex Carter (Sales Rep)',
            priority: 'Medium',
            dueDate: new Date(Date.now() + 86400000 * 3),
            completed: false,
          },
          {
            id: `act-${uuidv4().substring(0, 8)}`,
            task: 'Send Okta SSO SAML 2.0 configuration guide to IT Director',
            assignee: 'Technical Support Lead',
            priority: 'Low',
            dueDate: new Date(Date.now() + 86400000 * 1),
            completed: true,
            completedAt: new Date(),
          },
        ],
        coachingInsights: {
          strengths: [
            'Masterful handling of technical compliance questions without stalling momentum',
            'Upsold tier from 50 to 150 seats smoothly by tying in SLA value'
          ],
          improvements: [
            'Ensure legal turnaround timeline is formally confirmed with client procurement'
          ],
          talkRatio: {
            salesRepPercent: 38,
            prospectPercent: 62,
          },
          dealHealthStatus: 'Hot Deal',
        },
        tags: ['Enterprise', 'Security', 'Closed-Next-Week', 'Q3-P1'],
      },
      {
        userId: demoRep._id,
        title: 'FinTech Real-Time Payments API & Fraud Detection Demo',
        clientName: 'Marcus Thorne (VP Product)',
        clientCompany: 'PayStream Technologies',
        salesRepName: 'Alex Carter',
        dealStage: 'Demo',
        dealValue: 75000,
        meetingDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        duration: 1800,
        audioUrl: '',
        audioFileName: 'paystream_fintech_api_pitch.mp3',
        audioMimeType: 'audio/mpeg',
        transcript: [
          {
            speaker: 'Alex Carter',
            role: 'Sales Rep',
            text: 'Good afternoon Marcus! Excited to showcase how our real-time speech analytics flags chargeback disputes and high-risk sentiment during live support and sales calls.',
            timestamp: '00:00',
            sentiment: 'positive',
            intentScore: 65,
          },
          {
            speaker: 'Marcus Thorne',
            role: 'Prospect',
            text: 'Thanks Alex. We are currently handling 20,000 calls monthly across our merchant network. Our current latency with legacy transcription is 45 seconds, which is too slow for real-time alerts.',
            timestamp: '01:10',
            sentiment: 'neutral',
            intentScore: 78,
          },
          {
            speaker: 'Alex Carter',
            role: 'Sales Rep',
            text: 'Our edge streaming websocket endpoint processes audio chunks with sub-800ms latency, triggering immediate webhook web events directly into your fraud routing engine.',
            timestamp: '02:30',
            sentiment: 'positive',
            intentScore: 85,
          },
          {
            speaker: 'Marcus Thorne',
            role: 'Prospect',
            text: 'Sub-second latency is exactly our benchmark. What are the overage rates if our volume surges during Black Friday to 50,000 calls?',
            timestamp: '04:15',
            sentiment: 'neutral',
            intentScore: 84,
          },
          {
            speaker: 'Alex Carter',
            role: 'Sales Rep',
            text: 'We offer elastic burst pooling with zero penalty spikes—you simply pay the contracted tier rate per hour of audio processed.',
            timestamp: '05:40',
            sentiment: 'positive',
            intentScore: 90,
          },
        ],
        summary: {
          executive: 'Promising technical demo with Marcus Thorne at PayStream Technologies. Focused on replacing high-latency legacy transcription with sub-800ms streaming webhooks for fraud detection on 20,000 monthly merchant calls.',
          keyPoints: [
            'Current system has 45s latency bottleneck; platform satisfies sub-second threshold.',
            'Volume baseline: 20,000 monthly calls with Black Friday peak capacity need.',
            'Demonstrated elastic burst pooling pricing with no overage penalties.'
          ],
          prospectNeeds: [
            'Sub-second real-time streaming speech recognition',
            'Fraud and negative sentiment trigger webhooks',
            'High volume tier pricing with burst support'
          ],
          nextStepsSummary: 'Deliver API test sandbox key and conduct 5,000-call benchmark load test with engineering team.'
        },
        sentiment: {
          overall: 'positive',
          score: 76,
          breakdown: {
            positive: 68,
            neutral: 24,
            negative: 8,
          },
          timeline: [
            { minute: 1, sentimentScore: 62, topic: 'Intro & Call Volume Discovery' },
            { minute: 5, sentimentScore: 74, topic: 'Latency Benchmarking' },
            { minute: 12, sentimentScore: 82, topic: 'Live WebSocket Demo' },
            { minute: 18, sentimentScore: 78, topic: 'Surge Capacity & Burst Pricing' },
            { minute: 25, sentimentScore: 85, topic: 'Pilot Benchmark Agreement' },
          ],
        },
        buyerIntent: {
          score: 84,
          level: 'High',
          winProbability: 79,
          signals: [
            'Prospect confirmed existing provider cannot meet latency requirement',
            'Requested immediate API credentials for engineering benchmark'
          ],
          objections: [
            {
              objection: 'Overage pricing during high-volume seasonal spikes',
              severity: 'Medium',
              status: 'Addressed',
              suggestedResponse: 'Provided burst pooling model with flat rate guarantees.'
            }
          ],
          competitorsMentioned: ['Deepgram', 'AssemblyAI'],
          budgetDiscussed: true,
        },
        actionItems: [
          {
            id: `act-${uuidv4().substring(0, 8)}`,
            task: 'Provision PayStream API sandbox key with 5k benchmark hours',
            assignee: 'Alex Carter (Sales Rep)',
            priority: 'High',
            dueDate: new Date(Date.now() + 86400000 * 1),
            completed: false,
          },
          {
            id: `act-${uuidv4().substring(0, 8)}`,
            task: 'Schedule joint engineering sync with Marcus & lead backend architect',
            assignee: 'Alex Carter (Sales Rep)',
            priority: 'Medium',
            dueDate: new Date(Date.now() + 86400000 * 3),
            completed: false,
          }
        ],
        coachingInsights: {
          strengths: [
            'Highlighted core latency differentiator immediately',
            'Proactively addressed peak volume elasticity fears'
          ],
          improvements: [
            'Could qualify decision-making timeline for executive sign-off'
          ],
          talkRatio: {
            salesRepPercent: 48,
            prospectPercent: 52,
          },
          dealHealthStatus: 'Healthy',
        },
        tags: ['FinTech', 'API', 'High-Volume', 'Pipeline'],
      },
      {
        userId: demoRep._id,
        title: 'Global Logistics ERP Voice Intelligence & CRM Integration',
        clientName: 'David Chen (Director of Operations)',
        clientCompany: 'TransGlobal Freight Corp',
        salesRepName: 'Alex Carter',
        dealStage: 'Discovery',
        dealValue: 48000,
        meetingDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
        duration: 1950,
        audioUrl: '',
        audioFileName: 'transglobal_discovery_call.mp3',
        audioMimeType: 'audio/mpeg',
        transcript: [
          {
            speaker: 'Alex Carter',
            role: 'Sales Rep',
            text: 'Hello David, great to connect. I understand TransGlobal is looking to automate tracking updates and customer commitment extraction from dispatch calls.',
            timestamp: '00:00',
            sentiment: 'positive',
            intentScore: 55,
          },
          {
            speaker: 'David Chen',
            role: 'Prospect',
            text: 'Yes, Alex. Our dispatchers handle 500 carrier check-ins daily. But we are on an on-premise legacy SAP ERP system. Can your platform integrate without a 6-month consulting project?',
            timestamp: '01:20',
            sentiment: 'negative',
            intentScore: 45,
          },
          {
            speaker: 'Alex Carter',
            role: 'Sales Rep',
            text: 'We provide pre-built Kafka event bus connectors and SFTP batch ingestion workers that plug into on-prem SAP instances in under 5 business days.',
            timestamp: '02:50',
            sentiment: 'positive',
            intentScore: 68,
          },
          {
            speaker: 'David Chen',
            role: 'Prospect',
            text: 'That sounds promising, but I would need our IT Infrastructure Director and Chief Security Architect to inspect the SAP connector before we can approve a PoC.',
            timestamp: '04:30',
            sentiment: 'neutral',
            intentScore: 60,
          },
        ],
        summary: {
          executive: 'Initial discovery meeting with David Chen at TransGlobal Freight. Prospect is eager to capture dispatcher carrier commitments automatically, but has concerns about connecting to their legacy on-premise SAP ERP.',
          keyPoints: [
            'Operational volume: 500 dispatcher carrier check-in calls per day.',
            'Key friction point: On-premise SAP ERP integration security approval.',
            'Agreed to provide technical architecture blueprint for SAP connector.'
          ],
          prospectNeeds: [
            'Rapid connector for legacy SAP ERP',
            'Automated extraction of driver ETA and delivery commitments',
            'Carrier dispute sentiment alerts'
          ],
          nextStepsSummary: 'Send SAP ERP connector architecture document and schedule technical call with IT Infrastructure Director.'
        },
        sentiment: {
          overall: 'neutral',
          score: 54,
          breakdown: {
            positive: 45,
            neutral: 38,
            negative: 17,
          },
          timeline: [
            { minute: 1, sentimentScore: 50, topic: 'Call Objectives' },
            { minute: 6, sentimentScore: 42, topic: 'On-premise SAP Complexity' },
            { minute: 14, sentimentScore: 60, topic: 'Kafka & SFTP Connectors' },
            { minute: 22, sentimentScore: 58, topic: 'IT Stakeholder Review Needed' },
            { minute: 28, sentimentScore: 64, topic: 'Follow-up Planning' },
          ],
        },
        buyerIntent: {
          score: 62,
          level: 'Medium',
          winProbability: 58,
          signals: [
            'Clear operational pain with 500 daily manual carrier logs',
            'Willing to introduce IT leadership if connector docs satisfy requirements'
          ],
          objections: [
            {
              objection: 'Friction and timeline of on-premise legacy SAP ERP integration',
              severity: 'High',
              status: 'Open',
              suggestedResponse: 'Provide SAP-certified connector whitepaper and client case study.'
            }
          ],
          competitorsMentioned: ['Verint', 'NICE Systems'],
          budgetDiscussed: false,
        },
        actionItems: [
          {
            id: `act-${uuidv4().substring(0, 8)}`,
            task: 'Send SAP ERP integration architectural whitepaper and data flow diagram',
            assignee: 'Alex Carter (Sales Rep)',
            priority: 'High',
            dueDate: new Date(Date.now() + 86400000 * 2),
            completed: false,
          },
          {
            id: `act-${uuidv4().substring(0, 8)}`,
            task: 'Follow up with David to book IT Director technical review session',
            assignee: 'Alex Carter (Sales Rep)',
            priority: 'Medium',
            dueDate: new Date(Date.now() + 86400000 * 4),
            completed: false,
          }
        ],
        coachingInsights: {
          strengths: [
            'Quickly clarified Kafka and SFTP alternatives for legacy architectures'
          ],
          improvements: [
            'Should have asked for the IT Director name and email directly during the call'
          ],
          talkRatio: {
            salesRepPercent: 52,
            prospectPercent: 48,
          },
          dealHealthStatus: 'At Risk',
        },
        tags: ['Logistics', 'SAP', 'Discovery', 'Technical-Review'],
      },
      {
        userId: demoRep._id,
        title: 'HealthTech HIPAA Compliance & Automated Clinical Sales AI',
        clientName: 'Dr. Emily Watson (Chief Medical Officer)',
        clientCompany: 'BioHealth Systems Network',
        salesRepName: 'Alex Carter',
        dealStage: 'Closing',
        dealValue: 145000,
        meetingDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        duration: 2400,
        audioUrl: '',
        audioFileName: 'biohealth_hipaa_closing_session.mp3',
        audioMimeType: 'audio/mpeg',
        transcript: [
          {
            speaker: 'Alex Carter',
            role: 'Sales Rep',
            text: 'Good morning Dr. Watson! Thrilled to reconnect. We have received the signed Business Associate Agreement (BAA) from your compliance office.',
            timestamp: '00:00',
            sentiment: 'positive',
            intentScore: 90,
          },
          {
            speaker: 'Dr. Emily Watson',
            role: 'Prospect',
            text: 'Good morning Alex. Yes, our legal team was very impressed with your zero-retention PHI redaction layer. Our clinical directors are eager to roll this out across all 12 regional clinics.',
            timestamp: '01:05',
            sentiment: 'positive',
            intentScore: 96,
          },
          {
            speaker: 'Alex Carter',
            role: 'Sales Rep',
            text: 'That is fantastic! We have reserved your dedicated medical speech model cluster, ensuring sub-100ms latency for all medical terminology and ICD-10 diagnostic codes.',
            timestamp: '02:20',
            sentiment: 'positive',
            intentScore: 98,
          },
          {
            speaker: 'Dr. Emily Watson',
            role: 'Prospect',
            text: 'Excellent. I have already countersigned the final enterprise contract and dispatched it via DocuSign this morning. Looking forward to our launch next Monday!',
            timestamp: '03:45',
            sentiment: 'positive',
            intentScore: 100,
          }
        ],
        summary: {
          executive: 'Celebratory closing call with Dr. Emily Watson at BioHealth Systems. Business Associate Agreement (BAA) and full enterprise agreement ($145k ARR) countersigned for 12 regional clinical networks with launch scheduled for next Monday.',
          keyPoints: [
            'Zero-retention PHI redaction layer fully cleared by compliance & legal.',
            'BAA and 12-clinic enterprise contract countersigned via DocuSign.',
            'Dedicated medical speech model cluster provisioned with ICD-10 recognition.'
          ],
          prospectNeeds: [
            'Strict HIPAA compliance with signed BAA',
            'Zero-retention PHI de-identification',
            'Rapid clinical staff onboarding across 12 clinics'
          ],
          nextStepsSummary: 'Initiate clinical onboarding kick-off and configure Epic EHR medical record connector.'
        },
        sentiment: {
          overall: 'positive',
          score: 96,
          breakdown: {
            positive: 92,
            neutral: 8,
            negative: 0,
          },
          timeline: [
            { minute: 1, sentimentScore: 88, topic: 'BAA Verification' },
            { minute: 10, sentimentScore: 94, topic: 'PHI Redaction Protocol' },
            { minute: 20, sentimentScore: 98, topic: 'Clinic Rollout Schedule' },
            { minute: 30, sentimentScore: 100, topic: 'Contract Execution & Toast' },
          ],
        },
        buyerIntent: {
          score: 99,
          level: 'Very High',
          winProbability: 99,
          signals: [
            'Contract and BAA signed and returned via DocuSign',
            'Target clinic launch date finalized for next Monday'
          ],
          objections: [],
          competitorsMentioned: [],
          budgetDiscussed: true,
        },
        actionItems: [
          {
            id: `act-${uuidv4().substring(0, 8)}`,
            task: 'Send Welcome Kit and Epic EHR connector setup guide to IT Director',
            assignee: 'Alex Carter (Sales Rep)',
            priority: 'High',
            dueDate: new Date(Date.now() + 86400000 * 1),
            completed: true,
            completedAt: new Date(),
          },
          {
            id: `act-${uuidv4().substring(0, 8)}`,
            task: 'Host Clinical Director onboarding webinar on Monday at 10:00 AM EST',
            assignee: 'Customer Success Team',
            priority: 'High',
            dueDate: new Date(Date.now() + 86400000 * 5),
            completed: false,
          }
        ],
        coachingInsights: {
          strengths: [
            'Exemplary deal execution from discovery to closing in under 3 weeks',
            'Proactive BAA compliance preparation prevented legal bottlenecks'
          ],
          improvements: [
            'Capture case study / testimonial quote from Dr. Watson post-launch'
          ],
          talkRatio: {
            salesRepPercent: 40,
            prospectPercent: 60,
          },
          dealHealthStatus: 'Hot Deal',
        },
        tags: ['HealthTech', 'HIPAA', 'Won', 'Strategic'],
      }
    ];

    await Meeting.insertMany(sampleMeetings);
    console.log(`[Seed Service] Seeded ${sampleMeetings.length} realistic sales intelligence meetings successfully!`);
  } catch (err) {
    console.error('[Seed Service] Seeding error:', err);
  }
}

module.exports = { seedDatabase };
