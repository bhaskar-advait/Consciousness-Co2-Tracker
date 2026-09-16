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

const optionNames = [
    "Strongly Agree",
    "Agree",
    "Neutral",
    "Disagree",
    "Strongly Disagree"
];

const scores = [-4, -2, 0, 2, 4];

let currentQuestion = 0;
let answers = Array(questions.length).fill(null);


// START ASSESSMENT

function startAssessment() {
    currentQuestion = 0;
    answers = Array(questions.length).fill(null);
    showQuestion();
}


// SHOW QUESTION

function showQuestion() {

    let selected = answers[currentQuestion];

    let optionsHTML = "";

    for (let i = 0; i < optionNames.length; i++) {

        let checked = selected === i ? "checked" : "";

        optionsHTML += `
            <label class="option">
                <input 
                    type="radio" 
                    name="answer"
                    value="${i}"
                    ${checked}
                    onchange="saveAnswer(${i})"
                >
                ${optionNames[i]}
            </label>
        `;
    }


    document.querySelector(".hero").innerHTML = `

        <p>
            Question ${currentQuestion + 1} of ${questions.length}
        </p>

        <h2>
            ${questions[currentQuestion]}
        </h2>

        <div class="options">
            ${optionsHTML}
        </div>

        <div class="navigation">

            ${
                currentQuestion > 0
                ? `<button onclick="previousQuestion()">Previous</button>`
                : ""
            }

            ${
                currentQuestion < questions.length - 1
                ? `<button onclick="nextQuestion()">Next</button>`
                : `<button onclick="showReview()">Review Answers</button>`
            }

        </div>
    `;
}


// SAVE ANSWER

function saveAnswer(optionNumber) {
    answers[currentQuestion] = optionNumber;
}


// NEXT QUESTION

function nextQuestion() {

    if (answers[currentQuestion] === null) {
        alert("Please select an answer first.");
        return;
    }

    currentQuestion++;

    showQuestion();
}


// PREVIOUS QUESTION

function previousQuestion() {

    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}


// REVIEW ANSWERS

function showReview() {

    let unanswered = answers.findIndex(answer => answer === null);

    if (unanswered !== -1) {

        alert(
            `Please answer Question ${unanswered + 1} before reviewing.`
        );

        currentQuestion = unanswered;
        showQuestion();

        return;
    }


    let reviewHTML = "";

    for (let i = 0; i < questions.length; i++) {

        reviewHTML += `
            <div class="review-question">

                <h3>Question ${i + 1}</h3>

                <p>${questions[i]}</p>

                <strong>
                    Your answer: ${optionNames[answers[i]]}
                </strong>

                <button onclick="editQuestion(${i})">
                    Edit Answer
                </button>

            </div>
        `;
    }


    document.querySelector(".hero").innerHTML = `

        <h2>Review Your Answers</h2>

        <p>
            Please check your answers carefully before submitting.
        </p>

        ${reviewHTML}

        <button onclick="finalSubmit()">
            Final Submit
        </button>

    `;
}


// EDIT QUESTION

function editQuestion(questionNumber) {

    currentQuestion = questionNumber;

    showQuestion();
}


// FINAL SUBMIT

function finalSubmit() {

    let rawScore = 0;

    for (let i = 0; i < answers.length; i++) {

        rawScore += scores[answers[i]];

    }


    let consciousnessScore =
        Math.round(((rawScore + 40) / 80) * 100);


    document.querySelector(".hero").innerHTML = `

        <h2>Assessment Completed!</h2>

        <h3>Your Consciousness Score</h3>

        <p style="font-size: 40px;">
            ${consciousnessScore} / 100
        </p>

        <p>
            Thank you for reflecting on your answers.
        </p>

    `;
} 

// LANGUAGE SYSTEM

let selectedLanguage = "en";
let voiceEnabled = false;


function selectLanguage(language) {

    if (language === "voice") {

        voiceEnabled = true;

        speakText(
            "Choose your language. अपनी भाषा चुनें।"
        );

        showLanguageOptions();

        return;
    }

    selectedLanguage = language;

    showLanguageHome();

    if (voiceEnabled) {

        if (selectedLanguage === "hi") {

            speakText(
                "आपने हिन्दी भाषा चुनी है।"
            );

        } else {

            speakText(
                "You have selected English."
            );
        }
    }
}


function showLanguageOptions() {

    document.querySelector(".hero").innerHTML = `

        <h2>Choose Your Language</h2>

        <p>अपनी भाषा चुनें</p>

        <button onclick="selectLanguage('en')">
            English
        </button>

        <button onclick="selectLanguage('hi')">
            हिन्दी
        </button>

    `;
}


function showLanguageHome() {

    if (selectedLanguage === "hi") {

        document.querySelector(".hero").innerHTML = `

            <h2>स्वागत है</h2>

            <p>
                स्वयं को समझें। अपनी conditioning पर प्रश्न करें।
                सचेत होकर जिएँ।
            </p>

            <button onclick="startAssessment()">
                मूल्यांकन शुरू करें
            </button>

        `;

    } else {

        document.querySelector(".hero").innerHTML = `

            <h2>Welcome</h2>

            <p>
                Understand yourself. Question your conditioning.
                Live consciously.
            </p>

            <button onclick="startAssessment()">
                Start Assessment
            </button>

        `;
    }
}


// VOICE SYSTEM

function speakText(text) {

    if (!voiceEnabled) {
        return;
    }

    if ("speechSynthesis" in window) {

        window.speechSynthesis.cancel();

        let speech = new SpeechSynthesisUtterance(text);

        if (selectedLanguage === "hi") {

            speech.lang = "hi-IN";

        } else {

            speech.lang = "en-IN";
        }

        speech.rate = 0.9;
        speech.pitch = 1;

        window.speechSynthesis.speak(speech);

    } else {

        alert("Voice assistance is not supported by this browser.");
    }
}
