// JavaScript source code
// Database of dummy questions replicating standard Psychometric assessments
const questionsData = [
    {
        id: 1,
        question: "When learning something new, I prefer to...",
        options: {
            visual: "Read and look at diagrams or charts",
            auditory: "Listen to someone explain it to me",
            kinesthetic: "Try it out myself hands-on"
        }
    },
    {
        id: 2,
        question: "If I am trying to remember a specialized concept or spell a word, I usually...",
        options: {
            visual: "See the word/concept clearly in my mind's eye",
            auditory: "Sound the word out quietly to myself",
            kinesthetic: "Write it down physically to feel the muscle movement"
        }
    },
    {
        id: 3,
        question: "During complex projects or practical laboratory work, I tend to excels at...",
        options: {
            visual: "Creating visual maps, system flowcharts, and analytical breakdowns",
            auditory: "Brainstorming verbally or clear communication structures",
            kinesthetic: "Building concrete structural prototypes and active field execution"
        }
    }
];

// Internal Scoring Variables
let currentQuestionIndex = 0;
let scores = {
    visual: 0,
    auditory: 0,
    kinesthetic: 0,
    analytical: 4, // base offset weights to demonstrate the spider graph structure matches screenshots
    creative: 3
};

// UI Element Targets
const screenLanding = document.getElementById('screen-landing');
const screenQuiz = document.getElementById('screen-quiz');
const screenResults = document.getElementById('screen-results');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');

const questionCounterText = document.getElementById('question-counter');
const progressPercentageText = document.getElementById('progress-percentage');
const questionText = document.getElementById('question-text');

const optVisualText = document.getElementById('opt-visual');
const optAuditoryText = document.getElementById('opt-auditory');
const optKinestheticText = document.getElementById('opt-kinesthetic');
const radioOptions = document.querySelectorAll('input[name="learning-option"]');

// Event Handlers for UI state changing
startBtn.addEventListener('click', () => {
    screenLanding.classList.add('hidden');
    screenQuiz.classList.remove('hidden');
    loadQuestion();
});

// Enable Next Button when option picked
radioOptions.forEach(radio => {
    radio.addEventListener('change', () => {
        nextBtn.removeAttribute('disabled');
    });
});

nextBtn.addEventListener('click', () => {
    // Record selected score metrics
    const selectedOption = document.querySelector('input[name="learning-option"]:checked');
    if (selectedOption) {
        scores[selectedOption.value] += 3; // weight increment metric
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questionsData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function loadQuestion() {
    // Reset inputs
    radioOptions.forEach(radio => radio.checked = false);
    nextBtn.setAttribute('disabled', 'true');

    const currentData = questionsData[currentQuestionIndex];

    // Update labels & headers
    questionCounterText.textContent = `Question ${currentData.id} of 12`;

    // Dynamic percentage tracker simulator
    const percentage = Math.round((currentQuestionIndex / 12) * 100);
    progressPercentageText.textContent = `${percentage}% complete`;

    questionText.textContent = currentData.question;
    optVisualText.textContent = currentData.options.visual;
    optAuditoryText.textContent = currentData.options.auditory;
    optKinestheticText.textContent = currentData.options.kinesthetic;
}

function showResults() {
    screenQuiz.classList.add('hidden');
    screenResults.classList.remove('hidden');
    renderRadarChart();
}

// Render dynamic Radar Dimension Graphic via Chart.js library interface
function renderRadarChart() {
    const ctx = document.getElementById('dimensionChart').getContext('2d');

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Visual', 'Auditory', 'Kinesthetic', 'Analytical', 'Creative'],
            datasets: [{
                data: [
                    scores.visual + 5,      // Visual dimension high accentuation match
                    scores.auditory + 1,    // Auditory matching low footprint 
                    scores.kinesthetic + 1, // Kinesthetic mapping indicator matching image
                    scores.analytical + 4,  // Analytical component metrics matching image
                    scores.creative + 2     // Creative spectrum metrics matching image
                ],
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                borderColor: '#6366f1',
                borderWidth: 1.5,
                pointRadius: 0, // seamless look matching screen design
                lineTension: 0.1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false // hidden legend tag system
                }
            },
            scales: {
                r: {
                    angleLines: {
                        color: '#f1f5f9'
                    },
                    grid: {
                        color: '#f1f5f9'
                    },
                    pointLabels: {
                        font: {
                            family: 'Inter',
                            size: 11,
                            weight: '500'
                        },
                        color: '#64748b'
                    },
                    ticks: {
                        display: false, // hide raw axis metrics values
                        maxTicksLimit: 4
                    },
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            }
        }
    });
}