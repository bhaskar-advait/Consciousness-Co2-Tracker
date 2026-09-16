// ==========================================
// CONSCIOUSNESS WITH BHASKAR
// LANGUAGE + VOICE ASSISTANT + ASSESSMENT
// ==========================================


// QUESTIONS

const questions = [
    {
        en: "Do you often compare yourself with others?",
        hi: "क्या आप अक्सर दूसरों से अपनी तुलना करते हैं?",
        reverse: true
    },
    {
        en: "When someone criticizes you, do you immediately become defensive?",
        hi: "जब कोई आपकी आलोचना करता है, क्या आप तुरंत रक्षात्मक हो जाते हैं?",
        reverse: true
    },
    {
        en: "Are you willing to change your opinion when you discover that you were wrong?",
        hi: "जब आपको पता चलता है कि आप गलत थे, क्या आप अपनी सोच बदलने के लिए तैयार रहते हैं?",
        reverse: false
    },
    {
        en: "Do you usually question what you hear instead of blindly believing it?",
        hi: "क्या आप सुनी हुई बातों पर आँख बंद करके विश्वास करने के बजाय उन पर प्रश्न करते हैं?",
        reverse: false
    },
    {
        en: "Do you sometimes buy things that you don't actually need?",
        hi: "क्या आप कभी-कभी ऐसी चीज़ें खरीदते हैं जिनकी वास्तव में आपको आवश्यकता नहीं होती?",
        reverse: true
    },
    {
        en: "Do you find it difficult to accept that someone you love has their own freedom?",
        hi: "क्या आपके लिए यह स्वीकार करना कठिन होता है कि जिससे आप प्रेम करते हैं, उसे अपनी स्वतंत्रता है?",
        reverse: true
    },
    {
        en: "Do you regularly observe your own thoughts and emotions?",
        hi: "क्या आप नियमित रूप से अपने विचारों और भावनाओं को देखते और समझते हैं?",
        reverse: false
    },
    {
        en: "Do you avoid telling the truth when it may damage your image?",
        hi: "क्या आप तब सच बोलने से बचते हैं जब उससे आपकी छवि को नुकसान पहुँच सकता है?",
        reverse: true
    },
    {
        en: "Do you think about the impact of your lifestyle on animals and nature?",
        hi: "क्या आप अपने जीवन जीने के तरीके के प्रभाव के बारे में पशुओं और प्रकृति के संदर्भ में सोचते हैं?",
        reverse: false
    },
    {
        en: "Do you believe philosophy can help a person understand life and oneself?",
        hi: "क्या आपको लगता है कि दर्शन व्यक्ति को जीवन और स्वयं को समझने में मदद कर सकता है?",
        reverse: false
    }
];


// OPTIONS

const optionNames = {
    en: [
        "Strongly Agree",
        "Agree",
        "Neutral",
        "Disagree",
        "Strongly Disagree"
    ],

    hi: [
        "बिल्कुल सहमत",
        "सहमत",
        "तटस्थ",
        "असहमत",
        "बिल्कुल असहमत"
    ]
};


// SCORES

const scores = [-4, -2, 0, 2, 4];


// LANGUAGE

let selectedLanguage = "en";
let voiceEnabled = false;


// ASSESSMENT VARIABLES

let currentQuestion = 0;

let answers = Array(questions.length).fill(null);


// ==========================================
// LANGUAGE SELECTION
// ==========================================

function selectLanguage(language) {

    // VOICE ASSISTANT MODE

    if (language === "voice") {

        voiceEnabled = true;

        showVoiceLanguageSelection();

        return;
    }


    // NORMAL LANGUAGE MODE

    voiceEnabled = false;

    selectedLanguage = language;

    showLanguageHome();
}


// ==========================================
// VOICE LANGUAGE SELECTION
// ==========================================

function showVoiceLanguageSelection() {

    document.querySelector(".hero").innerHTML = `

        <h2>🔊 Voice Assistant</h2>

        <p>
            Choose the language you want to hear.
        </p>

        <p>
            अपनी पसंद की भाषा चुनें।
        </p>

        <button onclick="chooseVoiceLanguage('en')">
            English Voice
        </button>

        <button onclick="chooseVoiceLanguage('hi')">
            हिन्दी Voice
        </button>

    `;

    // Speak instruction

    setTimeout(() => {

        speakText(
            "Choose the language you want to hear. English or Hindi."
        );

    }, 300);
}


// ==========================================
// CHOOSE VOICE LANGUAGE
// ==========================================

function chooseVoiceLanguage(language) {

    selectedLanguage = language;

    voiceEnabled = true;

    showLanguageHome();

    setTimeout(() => {

        if (selectedLanguage === "hi") {

            speakText(
                "आपने हिन्दी भाषा चुनी है। मूल्यांकन शुरू करने के लिए बटन दबाएँ।"
            );

        } else {

            speakText(
                "You have selected English. Press Start Assessment to begin."
            );
        }

    }, 500);
}


// ==========================================
// LANGUAGE HOME
// ==========================================

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


// ==========================================
// START ASSESSMENT
// ==========================================

function startAssessment() {

    currentQuestion = 0;

    answers = Array(questions.length).fill(null);

    showQuestion();
}


// ==========================================
// SHOW QUESTION
// ==========================================

function showQuestion() {

    const question = questions[currentQuestion];

    const language = selectedLanguage;

    const names = optionNames[language];

    let optionsHTML = "";


    for (let i = 0; i < names.length; i++) {

        let checked = answers[currentQuestion] === i
            ? "checked"
            : "";

        let letter = String.fromCharCode(65 + i);


        optionsHTML += `

            <label class="option">

                <input
                    type="radio"
                    name="answer"
                    value="${i}"
                    ${checked}
                    onchange="saveAnswer(${i})"
                >

                <strong>${letter}</strong>
                — ${names[i]}

            </label>

        `;
    }


    let questionText = question[language];


    // NORMAL MODE

    if (!voiceEnabled) {

        document.querySelector(".hero").innerHTML = `

            <p>
                Question ${currentQuestion + 1}
                ${language === "hi" ? "में से" : "of"}
                ${questions.length}
            </p>

            <h2>
                ${questionText}
            </h2>

            <div class="options">

                ${optionsHTML}

            </div>

            <div class="navigation">

                ${
                    currentQuestion > 0
                    ? `<button onclick="previousQuestion()">
                        ${language === "hi" ? "पिछला" : "Previous"}
                       </button>`
                    : ""
                }

                ${
                    currentQuestion < questions.length - 1

                    ? `<button onclick="nextQuestion()">
                        ${language === "hi" ? "अगला" : "Next"}
                       </button>`

                    : `<button onclick="showReview()">
                        ${language === "hi"
                            ? "अपने उत्तरों की समीक्षा करें"
                            : "Review Your Answers"}
                       </button>`
                }

            </div>

        `;

        return;
    }


    // ======================================
    // VOICE ASSISTANT MODE
    // ======================================

    document.querySelector(".hero").innerHTML = `

        <p>
            ${
                language === "hi"
                ? `प्रश्न ${currentQuestion + 1} / ${questions.length}`
                : `Question ${currentQuestion + 1} of ${questions.length}`
            }
        </p>

        <h2>
            ${questionText}
        </h2>

        <div class="options">

            ${optionsHTML}

        </div>

        <p class="voice-instruction">

            ${
                language === "hi"
                ? "विकल्प चुनने के लिए A, B, C, D या E दबाएँ।"
                : "Press A, B, C, D, or E to choose an option."
            }

        </p>

        <div class="navigation">

            ${
                currentQuestion > 0
                ? `<button onclick="previousQuestion()">
                    ${language === "hi"
                        ? "पिछला"
                        : "Previous"}
                   </button>`
                : ""
            }

            ${
                currentQuestion < questions.length - 1

                ? `<button onclick="nextQuestion()">
                    ${language === "hi"
                        ? "अगला"
                        : "Next"}
                   </button>`

                : `<button onclick="showReview()">
                    ${language === "hi"
                        ? "अपने उत्तरों की समीक्षा करें"
                        : "Review Your Answers"}
                   </button>`
            }

        </div>

    `;


    // READ QUESTION + OPTIONS

    let voiceText = "";

    if (language === "hi") {

        voiceText =
            `प्रश्न ${currentQuestion + 1}। ${questionText}। `;

        for (let i = 0; i < names.length; i++) {

            let letter = String.fromCharCode(65 + i);

            voiceText +=
                `विकल्प ${letter}। ${names[i]}। `;
        }

        voiceText +=
            "विकल्प चुनने के लिए A, B, C, D या E दबाएँ।";

    } else {

        voiceText =
            `Question ${currentQuestion + 1}. ${questionText}. `;

        for (let i = 0; i < names.length; i++) {

            let letter = String.fromCharCode(65 + i);

            voiceText +=
                `Option ${letter}. ${names[i]}. `;
        }

        voiceText +=
            "Press A, B, C, D, or E to choose an option.";
    }


    setTimeout(() => {

        speakText(voiceText);

    }, 300);
}


// ==========================================
// SAVE ANSWER
// ==========================================

function saveAnswer(optionNumber) {

    answers[currentQuestion] = optionNumber;


    // VOICE CONFIRMATION

    if (voiceEnabled) {

        const names = optionNames[selectedLanguage];

        const letter =
            String.fromCharCode(65 + optionNumber);

        const selectedOption =
            names[optionNumber];


        if (selectedLanguage === "hi") {

            speakText(
                `आपने विकल्प ${letter}, ${selectedOption} चुना है।`
            );

        } else {

            speakText(
                `You selected option ${letter}, ${selectedOption}.`
            );
        }
    }
}


// ==========================================
// KEYBOARD CONTROLS
// ==========================================

document.addEventListener("keydown", function(event) {

    // Only active in Voice Assistant

    if (!voiceEnabled) {
        return;
    }


    const key = event.key.toLowerCase();


    // A - E

    const optionKeys = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4
    };


    if (optionKeys.hasOwnProperty(key)) {

        const optionNumber = optionKeys[key];

        answers[currentQuestion] = optionNumber;

        showQuestion();

        return;
    }


    // N = NEXT

    if (key === "n") {

        nextQuestion();

        return;
    }


    // P = PREVIOUS

    if (key === "p") {

        previousQuestion();

        return;
    }


    // R = REVIEW

    if (key === "r") {

        showReview();

        return;
    }


    // SPACE = REPEAT VOICE

    if (event.code === "Space") {

        repeatCurrentQuestion();

        return;
    }

});


// ==========================================
// REPEAT QUESTION
// ==========================================

function repeatCurrentQuestion() {

    if (!voiceEnabled) {
        return;
    }

    showQuestion();
}


// ==========================================
// NEXT QUESTION
// ==========================================

function nextQuestion() {

    if (answers[currentQuestion] === null) {

        if (voiceEnabled) {

            if (selectedLanguage === "hi") {

                speakText(
                    "कृपया पहले एक विकल्प चुनें।"
                );

            } else {

                speakText(
                    "Please choose an option first."
                );
            }

        } else {

            alert(
                selectedLanguage === "hi"
                ? "कृपया पहले एक विकल्प चुनें।"
                : "Please select an answer first."
            );
        }

        return;
    }


    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        showQuestion();

    } else {

        showReview();
    }
}


// ==========================================
// PREVIOUS QUESTION
// ==========================================

function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();
    }
}


// ==========================================
// REVIEW ANSWERS
// ==========================================

function showReview() {

    let unanswered =
        answers.findIndex(answer => answer === null);


    if (unanswered !== -1) {

        currentQuestion = unanswered;

        showQuestion();

        return;
    }


    const language = selectedLanguage;

    const names = optionNames[language];

    let reviewHTML = "";


    for (let i = 0; i < questions.length; i++) {

        let letter =
            String.fromCharCode(65 + answers[i]);


        reviewHTML += `

            <div class="review-question">

                <h3>
                    ${
                        language === "hi"
                        ? `प्रश्न ${i + 1}`
                        : `Question ${i + 1}`
                    }
                </h3>

                <p>
                    ${questions[i][language]}
                </p>

                <strong>
                    ${
                        language === "hi"
                        ? "आपका उत्तर"
                        : "Your Answer"
                    }:
                    ${letter} — ${names[answers[i]]}
                </strong>

                <button onclick="editQuestion(${i})">

                    ${
                        language === "hi"
                        ? "उत्तर बदलें"
                        : "Edit Answer"
                    }

                </button>

            </div>

        `;
    }


    document.querySelector(".hero").innerHTML = `

        <h2>
            ${
                language === "hi"
                ? "अपने उत्तरों की समीक्षा करें"
                : "Review Your Answers"
            }
        </h2>

        <p>
            ${
                language === "hi"
                ? "अंतिम सबमिट करने से पहले अपने उत्तरों को ध्यान से देखें।"
                : "Please check your answers carefully before final submission."
            }
        </p>

        ${reviewHTML}

        <button onclick="finalSubmit()">

            ${
                language === "hi"
                ? "अंतिम सबमिट"
                : "Final Submit"
            }

        </button>

    `;


    // VOICE REVIEW

    if (voiceEnabled) {

        let reviewVoice = "";

        if (language === "hi") {

            reviewVoice =
                "अपने उत्तरों की समीक्षा करें। ";

        } else {

            reviewVoice =
                "Preview your answers. ";
        }


        reviewVoice +=
            language === "hi"
            ? "आप अपने किसी भी उत्तर को बदल सकते हैं।"
            : "You can edit any of your answers before final submission.";


        setTimeout(() => {

            speakText(reviewVoice);

        }, 300);
    }
}


// ==========================================
// EDIT QUESTION
// ==========================================

function editQuestion(questionNumber) {

    currentQuestion = questionNumber;

    showQuestion();
}


// ==========================================
// FINAL SUBMIT
// ==========================================

function finalSubmit() {

    let rawScore = 0;


    for (let i = 0; i < answers.length; i++) {

        let answerScore = scores[answers[i]];


        // REVERSE SCORING

        if (questions[i].reverse) {

            answerScore = -answerScore;
        }


        rawScore += answerScore;
    }


    // ======================================
    // CONSCIOUSNESS SCORE
    // Raw Score: -40 to +40
    // Percentage: -100% to +100%
    // ======================================

    const consciousnessScore =
        Math.round((rawScore / 40) * 100);


    const language = selectedLanguage;


    let level = "";


    if (consciousnessScore >= 90) {

        level =
            language === "hi"
            ? "उच्च जागरूकता"
            : "High Awareness";

    } else if (consciousnessScore >= 70) {

        level =
            language === "hi"
            ? "बहुत अच्छी जागरूकता"
            : "Very Good Awareness";

    } else if (consciousnessScore >= 50) {

        level =
            language === "hi"
            ? "अच्छी जागरूकता"
            : "Good Awareness";

    } else if (consciousnessScore >= 30) {

        level =
            language === "hi"
            ? "सुधार की जरूरत है"
            : "Needs Improvement";

    } else if (consciousnessScore >= 0) {

        level =
            language === "hi"
            ? "बहुत सुधार चाहिए"
            : "Significant Improvement Needed";

    } else {

        level =
            language === "hi"
            ? "अचेतन"
            : "Unconscious";
    }


    document.querySelector(".hero").innerHTML = `

        <h2>
            ${
                language === "hi"
                ? "मूल्यांकन पूरा हुआ"
                : "Assessment Completed"
            }
        </h2>

        <h3>
            ${
                language === "hi"
                ? "आपका Consciousness Score"
                : "Your Consciousness Score"
            }
        </h3>

        <p style="font-size: 40px;">
            ${consciousnessScore}%
        </p>

        <h3>
            ${level}
        </h3>

        <p>
            ${
                language === "hi"
                ? "यह स्कोर आपके दिए गए उत्तरों के आधार पर आत्मचिंतन के लिए है।"
                : "This score is based on your answers and is intended for self-reflection."
            }
        </p>

    `;


    // VOICE RESULT

    if (voiceEnabled) {

        let resultVoice = "";

        if (language === "hi") {

            resultVoice =
                `मूल्यांकन पूरा हुआ। आपका Consciousness Score ${consciousnessScore} प्रतिशत है। ${level}।`;

        } else {

            resultVoice =
                `Assessment completed. Your Consciousness Score is ${consciousnessScore} percent. ${level}.`;
        }


        setTimeout(() => {

            speakText(resultVoice);

        }, 500);
    }
}


// ==========================================
// TEXT TO SPEECH
// ==========================================

function speakText(text) {

    if (!voiceEnabled) {
        return;
    }


    if (!("speechSynthesis" in window)) {

        return;
    }


    window.speechSynthesis.cancel();


    let speech =
        new SpeechSynthesisUtterance(text);


    if (selectedLanguage === "hi") {

        speech.lang = "hi-IN";

    } else {

        speech.lang = "en-IN";
    }


    speech.rate = 0.85;

    speech.pitch = 1;

    speech.volume = 1;


    window.speechSynthesis.speak(speech);
}
