const scoreboardData = [
  { name: 'Ada Nwosu', klass: 'JSS1', test: 78, exam: 85, comment: 'Strong reasoning, support reading.' },
  { name: 'Bayo Okonkwo', klass: 'JSS2', test: 54, exam: 60, comment: 'Needs focus on algebra basics.' },
  { name: 'Chika Uche', klass: 'JSS3', test: 88, exam: 92, comment: 'Excellent progress, keep it up.' },
  { name: 'Damilola Ade', klass: 'JSS1', test: 69, exam: 72, comment: 'Practise exam technique.' },
  { name: 'Ese Ajayi', klass: 'JSS2', test: 94, exam: 97, comment: 'Top performer in the cohort.' }
];

const distributionData = [
  { label: 'Below Target', value: 12, color: '#f87171' },
  { label: 'Meets Target', value: 28, color: '#fbbf24' },
  { label: 'Exceeds Target', value: 45, color: '#4ade80' }
];

const averageData = [
  { subject: 'Mathematics', testAvg: 76, examAvg: 79 },
  { subject: 'English', testAvg: 68, examAvg: 72 },
  { subject: 'Science', testAvg: 73, examAvg: 77 }
];

const recommendations = [
  { subject: 'Mathematics', benchmark: 'Meets', note: 'Focus on question interpretation for weaker learners.' },
  { subject: 'English', benchmark: 'Below', note: 'Increase reading fluency sessions and vocabulary drills.' },
  { subject: 'Science', benchmark: 'Exceeds', note: 'Challenge top students with project-based tasks.' }
];

const leaderboardData = {
  Mathematics: [
    { position: 1, name: 'Chika Uche', score: 98 },
    { position: 2, name: 'Ese Ajayi', score: 94 },
    { position: 3, name: 'Ada Nwosu', score: 91 },
    { position: 4, name: 'Bayo Okonkwo', score: 84 },
    { position: 5, name: 'Damilola Ade', score: 79 }
  ],
  English: [
    { position: 1, name: 'Ese Ajayi', score: 95 },
    { position: 2, name: 'Chika Uche', score: 92 },
    { position: 3, name: 'Ada Nwosu', score: 90 },
    { position: 4, name: 'Damilola Ade', score: 83 },
    { position: 5, name: 'Bayo Okonkwo', score: 79 }
  ],
  Science: [
    { position: 1, name: 'Chika Uche', score: 96 },
    { position: 2, name: 'Ese Ajayi', score: 93 },
    { position: 3, name: 'Ada Nwosu', score: 89 },
    { position: 4, name: 'Damilola Ade', score: 82 },
    { position: 5, name: 'Bayo Okonkwo', score: 76 }
  ]
};

const performanceLabel = (average) => {
  if (average >= 85) return { label: 'Strong', tone: 'green' };
  if (average >= 65) return { label: 'Needs improvement', tone: 'amber' };
  return { label: 'Intervention', tone: 'red' };
};

function renderScoreboard(filter = 'All') {
  const body = document.getElementById('scoreboard-body');
  body.innerHTML = '';

  const rows = scoreboardData.filter((item) => filter === 'All' || item.klass === filter);

  rows.forEach((student, index) => {
    const average = Math.round((student.test + student.exam) / 2);
    const performance = performanceLabel(average);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.klass}</td>
      <td class="editable-cell" data-field="test" data-index="${index}">${student.test}</td>
      <td class="editable-cell" data-field="exam" data-index="${index}">${student.exam}</td>
      <td>${average}</td>
      <td><span class="score-tag ${performance.tone}">${performance.label}</span></td>
      <td><input class="comment-input" data-index="${index}" type="text" value="${student.comment}" /></td>
    `;
    body.appendChild(tr);
  });
}

function drawPieChart(canvas, data) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const radius = Math.min(width, height) * 0.38;
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.font = '600 14px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = -0.5 * Math.PI;

  data.forEach((item) => {
    const slice = (item.value / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();
    startAngle += slice;
  });

  let labelAngle = -0.5 * Math.PI;
  data.forEach((item) => {
    const slice = (item.value / total) * 2 * Math.PI;
    const labelX = centerX + Math.cos(labelAngle + slice / 2) * (radius + 26);
    const labelY = centerY + Math.sin(labelAngle + slice / 2) * (radius + 26);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`${item.label}: ${item.value}%`, labelX, labelY);
    labelAngle += slice;
  });
}

function drawBarChart(canvas, data) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const margin = 36;
  const maxValue = Math.max(...data.map((item) => Math.max(item.testAvg, item.examAvg)), 100);
  const barWidth = 28;
  const gap = 48;

  ctx.clearRect(0, 0, width, height);
  ctx.font = '600 12px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  data.forEach((item, index) => {
    const x = margin + index * gap + barWidth;
    const testHeight = ((item.testAvg / maxValue) * (height - margin * 2)) * 0.95;
    const examHeight = ((item.examAvg / maxValue) * (height - margin * 2)) * 0.95;

    ctx.fillStyle = '#6366f1';
    ctx.fillRect(x - 18, height - margin - testHeight, barWidth, testHeight);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + 6, height - margin - examHeight, barWidth, examHeight);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText(item.subject, x + barWidth / 2 - 6, height - margin + 18);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`${item.testAvg}%`, x - 8, height - margin - testHeight - 16);
    ctx.fillText(`${item.examAvg}%`, x + 14, height - margin - examHeight - 16);
  });
}

function renderRecommendations() {
  const list = document.getElementById('recommendation-list');
  list.innerHTML = '';

  recommendations.forEach((recommendation) => {
    const item = document.createElement('div');
    item.className = 'recommendation-item';
    const statusClass = recommendation.benchmark.toLowerCase();
    item.innerHTML = `
      <strong>${recommendation.subject}</strong>
      <span class="status ${statusClass}">${recommendation.benchmark}</span>
      <p>${recommendation.note}</p>
    `;
    list.appendChild(item);
  });
}

function populateLeaderboard(subject) {
  const topThree = leaderboardData[subject].slice(0, 3);
  document.getElementById('gold-name').textContent = topThree[0].name;
  document.getElementById('gold-score').textContent = `${topThree[0].score} pts`;
  document.getElementById('silver-name').textContent = topThree[1].name;
  document.getElementById('silver-score').textContent = `${topThree[1].score} pts`;
  document.getElementById('bronze-name').textContent = topThree[2].name;
  document.getElementById('bronze-score').textContent = `${topThree[2].score} pts`;

  const body = document.getElementById('leaderboard-body');
  body.innerHTML = leaderboardData[subject]
    .map((row) => `
      <tr>
        <td>${row.position}</td>
        <td>${row.name}</td>
        <td>${subject}</td>
        <td>${row.score}</td>
      </tr>
    `)
    .join('');
}

function wireEvents() {
  document.querySelectorAll('.nav-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.remove('active'));
      document.querySelectorAll('.portal-panel').forEach((panel) => panel.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(button.dataset.target).classList.add('active');
    });
  });

  document.getElementById('class-filter').addEventListener('change', (event) => {
    renderScoreboard(event.target.value);
  });

  document.getElementById('scoreboard-body').addEventListener('click', (event) => {
    const cell = event.target.closest('.editable-cell');
    if (!cell) return;
    const index = Number(cell.dataset.index);
    const field = cell.dataset.field;
    const student = scoreboardData[index];

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '100';
    input.value = student[field];
    input.className = 'inline-input';
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    const commit = () => {
      const value = Number(input.value);
      if (!Number.isFinite(value) || value < 0 || value > 100) {
        input.value = student[field];
      } else {
        student[field] = value;
      }
      renderScoreboard(document.getElementById('class-filter').value);
      drawPieChart(document.getElementById('distribution-chart'), distributionData);
      drawBarChart(document.getElementById('average-chart'), averageData);
    };

    input.addEventListener('blur', commit);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        input.blur();
      }
      if (event.key === 'Escape') {
        renderScoreboard(document.getElementById('class-filter').value);
      }
    });
  });

  document.getElementById('scoreboard-body').addEventListener('input', (event) => {
    const input = event.target.closest('.comment-input');
    if (input) {
      const index = Number(input.dataset.index);
      scoreboardData[index].comment = input.value;
    }
  });

  document.querySelectorAll('.subject-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.subject-tab').forEach((item) => item.classList.remove('active'));
      tab.classList.add('active');
      populateLeaderboard(tab.dataset.subject);
    });
  });
}

function init() {
  renderScoreboard();
  drawPieChart(document.getElementById('distribution-chart'), distributionData);
  drawBarChart(document.getElementById('average-chart'), averageData);
  renderRecommendations();
  populateLeaderboard('Mathematics');
  wireEvents();
}

window.addEventListener('DOMContentLoaded', init);
