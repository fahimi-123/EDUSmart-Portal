// ==========================================
// 1. SUPABASE CONNECTION CONFIG
// ==========================================
const supabaseUrl = 'https://tywtoszodekrkyopjpal.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5d3Rvc3pvZGVrcmt5b3BqcGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0OTgxNzcsImV4cCI6MjA5NTA3NDE3N30.Licadtyc4jVkWjwpo3Pxo9y_1XSVkEkX0xJHuJEYIus';

const client = supabase.createClient(supabaseUrl, supabaseKey);

// Default name placeholder
const TARGET_STUDENT_NAME = "Ahmad Razif bin Abdullah"; 

document.addEventListener('DOMContentLoaded', () => {
    fetchStudentReport();
});

// ==========================================
// 2. DATA EXTRACTION ENGINE WITH FALLBACKS
// ==========================================
async function fetchStudentReport() {
    console.log("Attempting database request check...");
    
    // First: Attempt exact target user lookup matches
    let response = await client
        .from('teacher')
        .select('*')
        .eq('student_name', TARGET_STUDENT_NAME);

    // Dynamic Fallback Catch: If the target name doesn't exist, fetch the last submitted row instead
    if (response.error || !response.data || response.data.length === 0) {
        console.warn("Exact match not found or request failed. Pulling fallback records instead...");
        response = await client
            .from('teacher')
            .select('*')
            .limit(1);
    }

    // Process output values
    if (response.data && response.data.length > 0) {
        const studentRecord = response.data[0];
        console.log("Record located successfully:", studentRecord);
        renderStudentProfile(studentRecord);
        renderReportTable(studentRecord);
    } else {
        console.error("Database connection failed or table completely empty:", response.error);
        document.getElementById('report-card-body').innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; color:#e11d48; padding: 20px;">
                    <strong>Database Access Blocked</strong><br>
                    <small style="color: #64748b;">Check your Supabase table settings for Row Level Security (RLS).</small>
                </td>
            </tr>`;
    }
}

// ==========================================
// 3. DISPLAY ENGINE RENDERING
// ==========================================
function renderStudentProfile(student) {
    document.getElementById('header-student-name').innerText = `${student.student_name} · 4 Amanah`;
    document.getElementById('profile-student-name').innerText = student.student_name;

    const subjects = [
        student.bahasa_melayu || 0, 
        student.english || 0, 
        student.math || 0, 
        student.sejarah || 0, 
        student.sains || 0
    ];
    const rawAverage = subjects.reduce((a, b) => a + b, 0) / 5;
    const cleanAverage = Math.round(rawAverage);

    const lType = student.learner_type || "Fast Learner";
    const learnerClass = lType === 'Fast Learner' ? 'badge-purple' : 'badge-yellow';

    document.getElementById('profile-badges').innerHTML = `
        <span class="badge ${learnerClass}">⚡ ${lType}</span>
        <span class="badge badge-green">Overall Avg: ${cleanAverage}%</span>
    `;

    if (lType === "Fast Learner") {
        document.getElementById('teacher-comment').innerText = "Shows exceptional performance across core evaluation tracks. Excellent analytical focus.";
    } else {
        document.getElementById('teacher-comment').innerText = "Attentive in classroom tracks. Needs targeted practice modules to reinforce difficult subject benchmarks.";
    }
}

function renderReportTable(student) {
    const tableBody = document.getElementById('report-card-body');
    
    const trackingSchema = [
        { label: 'Bahasa Melayu', score: student.bahasa_melayu || 0 },
        { label: 'English', score: student.english || 0 },
        { label: 'Mathematics', score: student.math || 0 },
        { label: 'Sejarah', score: student.sejarah || 0 },
        { label: 'Sains', score: student.sains || 0 }
    ];

    let htmlRows = '';

    trackingSchema.forEach(item => {
        const totalScore = item.score;
        const testWeight = Math.round(totalScore * 0.3);
        const examWeight = Math.round(totalScore * 0.7);
        const gradeStr = calculateSchoolGrade(totalScore);
        const pillColorClass = totalScore >= 80 ? 'score-green' : (totalScore >= 50 ? 'score-yellow' : 'score-red');

        htmlRows += `
            <tr>
                <td class="subject-name">${item.label}</td>
                <td><span class="score-pill ${pillColorClass}">${testWeight}</span></td>
                <td><span class="score-pill ${pillColorClass}">${examWeight}</span></td>
                <td class="grade-text"><strong>${gradeStr} (${totalScore}%)</strong></td>
            </tr>
        `;
    });

    tableBody.innerHTML = htmlRows;
}

function calculateSchoolGrade(score) {
    if (score >= 85) return 'A';
    if (score >= 70) return 'B';
    if (score >= 50) return 'C';
    if (score >= 40) return 'D';
    return 'G';
}