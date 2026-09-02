const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

async function runE2ETests() {
  console.log('====================================================');
  console.log('🧪 RUNNING FULL-STACK SALES INTELLIGENCE E2E TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, extraInfo = '') => {
    if (condition) {
      console.log(`✅ PASS: ${testName} ${extraInfo}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} ${extraInfo}`);
      failed++;
    }
  };

  try {
    // 1. Health Check
    const healthRes = await fetch(`${BASE_URL}/health`).then(r => r.json());
    assert(healthRes.status === 'healthy', 'API Health Check Endpoint');

    // 2. Demo User Login
    const demoLoginRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'Sales Rep' }),
    }).then(r => r.json());
    assert(demoLoginRes.success && Boolean(demoLoginRes.token), 'Auth Demo Login (Sales Rep)', `Token: ${demoLoginRes.token?.substring(0, 15)}...`);
    const token = demoLoginRes.token;

    // 3. User Me Profile
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json());
    assert(meRes.success && meRes.user?.email === 'alex@salesai.com', 'Auth /me Profile Fetch', `User: ${meRes.user?.name}`);

    // 4. Meetings List
    const meetingsRes = await fetch(`${BASE_URL}/meetings`).then(r => r.json());
    assert(meetingsRes.success && meetingsRes.count >= 4, 'Get All Meetings', `Count: ${meetingsRes.count}`);
    const firstMeeting = meetingsRes.data[0];

    // 5. Single Meeting Details
    const meetingDetailRes = await fetch(`${BASE_URL}/meetings/${firstMeeting._id}`).then(r => r.json());
    assert(
      meetingDetailRes.success &&
      meetingDetailRes.data?.transcript?.length > 0 &&
      meetingDetailRes.data?.sentiment?.score !== undefined,
      'Get Single Meeting Details',
      `Title: "${meetingDetailRes.data?.title?.substring(0, 30)}..." | Turns: ${meetingDetailRes.data?.transcript?.length}`
    );

    // 6. Direct Transcript Text Analysis
    const textAnalysisRes = await fetch(`${BASE_URL}/meetings/analyze-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: 'E2E Automated Pitch Analysis',
        clientCompany: 'CyberVault Security',
        clientName: 'Robert Lang (CISO)',
        dealStage: 'Proposal',
        dealValue: 90000,
        transcriptText: `Alex Carter (Sales Rep): Hi Robert, thanks for meeting regarding our automated voice compliance engine.
Robert Lang (Prospect): Hi Alex. Our security board requires SOC2 Type II and on-premise KMS keys.
Alex Carter (Sales Rep): We fully support customer-managed AWS KMS and have active SOC2 Type II certification.
Robert Lang (Prospect): Outstanding. If you can deliver the BAA agreement this week, we will approve the $90k contract.`,
      }),
    }).then(r => r.json());

    assert(
      textAnalysisRes.success &&
      textAnalysisRes.data?.buyerIntent?.score > 0 &&
      textAnalysisRes.data?.actionItems?.length > 0,
      'Direct Transcript Analysis API',
      `Intent Score: ${textAnalysisRes.data?.buyerIntent?.score}% | Action Items: ${textAnalysisRes.data?.actionItems?.length}`
    );

    const newMeetingId = textAnalysisRes.data._id;
    const firstActionItem = textAnalysisRes.data.actionItems[0];

    // 7. Action Item Update (Toggle Completion)
    const toggleActionRes = await fetch(`${BASE_URL}/meetings/${newMeetingId}/action-items/${firstActionItem.id || firstActionItem._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ completed: true }),
    }).then(r => r.json());

    assert(
      toggleActionRes.success && toggleActionRes.data?.find(i => (i.id === firstActionItem.id || i._id === firstActionItem._id))?.completed === true,
      'Toggle Action Item Completed',
      'Action Item marked completed'
    );

    // 8. Add New Custom Action Item
    const addActionRes = await fetch(`${BASE_URL}/meetings/${newMeetingId}/action-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        task: 'Send AWS KMS security whitepaper to Robert Lang',
        assignee: 'Alex Carter',
        priority: 'High',
      }),
    }).then(r => r.json());

    assert(
      addActionRes.success && addActionRes.data?.some(i => i.task.includes('AWS KMS')),
      'Add Custom Action Item',
      'Task added to checklist'
    );

    // 9. Analytics Dashboard
    const analyticsRes = await fetch(`${BASE_URL}/analytics/dashboard`).then(r => r.json());
    assert(
      analyticsRes.success &&
      analyticsRes.data?.totalMeetings >= 5 &&
      analyticsRes.data?.totalPipelineValue > 0 &&
      analyticsRes.data?.sentimentTrends?.length > 0,
      'Aggregated Revenue Analytics API',
      `Total Deals: ${analyticsRes.data?.totalMeetings} | Pipeline: $${analyticsRes.data?.totalPipelineValue?.toLocaleString()} | Avg Intent: ${analyticsRes.data?.avgBuyerIntent}%`
    );

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runE2ETests();
