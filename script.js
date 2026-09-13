const questions = [
    "Do you often compare yourself with others?",
    "When someone criticizes you, do you immediately become defensive?",
    "Are you willing to change your opinion when you discover that you were wrong?",
    "Do you usually question what you hear instead of blindly believing it?",
    "Do you sometimes buy things that you don't actually need?",
    "Do you find it difficult to accept that someone you love has their own freedom?",
    "Do you regularly observe your own thoughts and emotions?",
    "Do you avoid telling the truth when it may damage your image?",
    "Do you think about the impact of your lifestyle on animals and nature?",
    "Do you believe philosophy can help a person understand life and oneself?"
];

let currentQuestion = 0;
let totalScore = 0;

const scores = [-4, -2, 0, 2, 4];

function startAssessment() {
    currentQuestion = 0;
    totalScore = 0;
    showQuestion();
}

function showQuestion() {

    document.querySelector(".hero").innerHTML = `
        <p>Question ${currentQuestion + 1} of ${questions.length}</p>

        <h2>${questions[currentQuestion]}</h2>

        <div class="options">

            <button onclick="selectAnswer(0)">
                Strongly Agree
            </button>

            <button onclick="selectAnswer(1)">
                Agree
            </button>

            <button onclick="selectAnswer(2)">
                Neutral
            </button>

            <button onclick="selectAnswer(3)">
                Disagree
            </button>

            <button onclick="selectAnswer(4)">
                Strongly Disagree
            </button>

        </div>
    `;
}

function selectAnswer(optionNumber) {

    totalScore += scores[optionNumber];

    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {

    let consciousnessScore =
        Math.round(((totalScore + 40) / 80) * 100);

    document.querySelector(".hero").innerHTML = `
        <h2>Assessment Completed!</h2>

        <h3>Your Consciousness Score</h3>

        <p>${consciousnessScore} / 100</p>

        <p>Raw Score: ${totalScore}</p>
    `;
}