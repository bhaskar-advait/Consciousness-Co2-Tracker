// =====================================================
// CONSCIOUSNESS WITH BHASKAR
// FINAL SCRIPT
// =====================================================

const questions = [

    // =================================================
    // Q1
    // =================================================
    {
        en: "Do you often compare yourself with others?",
        hi: "क्या आप अक्सर दूसरों से अपनी तुलना करते हैं?",

        options: {
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
        },

        scores: [-4, -2, 0, 2, 4]
    },


    // =================================================
    // Q2 — MY LIFE, MY CHOICE
    // =================================================
    {
        en: "\"My Life, My Choice\" — but until when?",

        hi: "“मेरी ज़िंदगी, मेरी पसंद” — लेकिन कब तक?",

        options: {

            en: [
                "It is my life and my decisions. I should have complete freedom to live according to my choice.",
                "I should have freedom to live according to my choice as long as it does not harm others — such as the environment, animals, human health, human rights, etc.",
                "What should we say? Look after yourself. Whatever others do is their matter.",
                "I do not want to answer because questioning my beliefs may hurt my ego.",
                "Everyone should have the freedom to live according to their own way."
            ],

            hi: [
                "मेरी ज़िंदगी है और मेरे फैसले हैं। मुझे अपनी पसंद के अनुसार जीने की पूरी स्वतंत्रता होनी चाहिए।",
                "मुझे अपनी पसंद के अनुसार जीने की स्वतंत्रता होनी चाहिए, जब तक उससे दूसरों—जैसे पर्यावरण, पशुओं, मानव स्वास्थ्य, मानव अधिकार आदि—को नुकसान न पहुँचे।",
                "हम क्या बोलें? अपना देखो बस, दूसरे कुछ भी करें।",
                "मैं इसका उत्तर नहीं देना चाहता क्योंकि अपने विश्वासों पर सवाल करना मेरे अहंकार को चोट पहुँचा सकता है।",
                "सबको अपने हिसाब से जीने की स्वतंत्रता होनी चाहिए।"
            ]
        },

        scores: [-4, 4, -4, 2, -2]
    },


    // =================================================
    // Q3
    // =================================================
    {
        en: "Are you willing to change your opinion when you discover that you were wrong?",
        hi: "जब आपको पता चलता है कि आप गलत थे, क्या आप अपनी सोच बदलने के लिए तैयार रहते हैं?",

        options: {
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
        },

        scores: [4, 2, 0, -2, -4]
    },


    // =================================================
    // Q4
    // =================================================
    {
        en: "Do you usually question what you hear instead of blindly believing it?",
        hi: "क्या आप सुनी हुई बातों पर आँख बंद करके विश्वास करने के बजाय उन पर प्रश्न करते हैं?",

        options: {
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
        },

        scores: [4, 2, 0, -2, -4]
    },


    // =================================================
    // Q5 — MEAT QUESTION
    // =================================================
    {
        en: "What would you say about people who eat meat and people who, even knowing that something wrong is happening, still remain silent?",

        hi: "जो लोग मांस खाते हैं और जो लोग यह जानते हुए भी कि यह गलत हो रहा है, फिर भी चुप रहते हैं—आप उनके बारे में क्या कहना चाहेंगे?",

        options: {

            en: [
                "They eat meat because of conditioning from childhood, so they should not be blamed for eating meat.",

                "People who have families and children have to live according to their circumstances; how will they support their families?",

                "As a human being, they should try to understand their actions and their effects. If, even after understanding the harm, they knowingly refuse to think about it or change, their behaviour goes against their human capacity for discernment.",

                "Why should we say anything about them? It is their life and they can do whatever they want.",

                "I am like that myself, so what can I say?"
            ],

            hi: [
                "वे बचपन से मिली conditioning के कारण मांस खाते हैं, इसलिए उनके मांस खाने के लिए उन्हें दोष नहीं देना चाहिए।",

                "जिन लोगों के परिवार और बच्चे हैं, उन्हें अपनी परिस्थितियों के अनुसार जीना पड़ता है; वे अपने परिवार का पालन-पोषण कैसे करेंगे?",

                "एक मनुष्य होने के नाते उन्हें अपने कर्मों और उनके प्रभाव को समझने का प्रयास करना चाहिए। यदि नुकसान को समझने के बाद भी वे जानबूझकर उस पर विचार करने या बदलने से इनकार करते हैं, तो उनका व्यवहार उनकी मानवीय विवेक-क्षमता के विरुद्ध जाता है।",

                "हम उनके बारे में क्यों कुछ कहें? उनकी ज़िंदगी है और वे जो चाहें करें।",

                "मैं स्वयं वैसा हूँ, तो मैं क्या ही बोलूँ?"
            ]
        },

        scores: [-4, -4, 4, -2, 2],

        explanations: {

            en: [
                "Conditioning from childhood can explain why a person eats meat, but it does not automatically make the behaviour right. A terrorist may also be taught from childhood to kill people, but does that make killing people right just because he was taught it? No. Similarly, simply saying that someone was taught to eat meat from childhood is not enough to justify the behaviour.",

                "Having a family and children may explain someone's circumstances, but it does not by itself answer whether the action is right or wrong.",

                "A human being should try to understand their actions and their effects. If someone understands the harm and still knowingly refuses to question or change, this assessment gives this response the highest score.",

                "Saying that it is someone's life and they can do whatever they want avoids questioning the effect of their actions.",

                "This response recognises that the person is also doing the same thing. It shows some self-awareness, but simply recognising it does not complete the process of questioning the behaviour."
            ],

            hi: [
                "बचपन की conditioning यह explain कर सकती है कि कोई व्यक्ति मांस क्यों खाता है, लेकिन केवल conditioning के कारण उसका व्यवहार सही नहीं हो जाता। ऐसे तो एक terrorist को भी बचपन से लोगों को मारना सिखाया जाता है, तो क्या सिर्फ इसलिए उसका लोगों को मारना सही हो जाएगा? नहीं। इसी तरह, केवल यह कहना कि “उसे बचपन से मांस खाना सिखाया गया है” उसके व्यवहार को सही ठहराने के लिए पर्याप्त नहीं है।",

                "जिन लोगों के परिवार और बच्चे हैं, उनकी परिस्थितियाँ उनके व्यवहार को explain कर सकती हैं, लेकिन केवल परिवार की जिम्मेदारी यह तय नहीं करती कि कोई व्यवहार सही है या गलत।",

                "एक मनुष्य को अपने कर्मों और उनके प्रभाव को समझने का प्रयास करना चाहिए। यदि नुकसान को समझने के बाद भी कोई व्यक्ति जानबूझकर उस पर प्रश्न करने या बदलने से इनकार करता है, तो इस मूल्यांकन में इस उत्तर को सबसे अधिक अंक दिए जाते हैं।",

                "यह कहना कि यह उसकी ज़िंदगी है और वह जो चाहे करे, उसके कर्मों के प्रभाव पर प्रश्न करने से बचता है।",

                "यह उत्तर यह स्वीकार करता है कि व्यक्ति स्वयं भी वैसा ही कर रहा है। इसमें कुछ आत्म-जागरूकता दिखाई देती है, लेकिन केवल इसे स्वीकार कर लेना अपने व्यवहार पर प्रश्न करने की प्रक्रिया को पूरा नहीं करता।"
            ]
        }
    },


    // =================================================
    // Q6
    // =================================================
    {
        en: "Do you find it difficult to accept that someone you love has their own freedom?",
        hi: "क्या आपके लिए यह स्वीकार करना कठिन होता है कि जिससे आप प्रेम करते हैं, उसे अपनी स्वतंत्रता है?",

        options: {
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
        },

        scores: [-4, -2, 0, 2, 4]
    },


    // =================================================
    // Q7
    // =================================================
    {
        en: "Do you regularly observe your own thoughts and emotions?",
        hi: "क्या आप नियमित रूप से अपने विचारों और भावनाओं को देखते और समझते हैं?",

        options: {
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
        },

        scores: [4, 2, 0, -2, -4]
    },


    // =================================================
    // Q8
    // =================================================
    {
        en: "Do you avoid telling the truth when it may damage your image?",
        hi: "क्या आप तब सच बोलने से बचते हैं जब उससे आपकी छवि को नुकसान पहुँच सकता है?",

        options: {
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
        },

        scores: [-4, -2, 0, 2, 4]
    },


    // =================================================
    // Q9
    // =================================================
    {
        en: "Do you think about the impact of your lifestyle on animals and nature?",
        hi: "क्या आप अपने जीवन जीने के तरीके के प्रभाव के बारे में पशुओं और प्रकृति के संदर्भ में सोचते हैं?",

        options: {
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
        },

        scores: [4, 2, 0, -2, -4]
    },


    // =================================================
    // Q10 — WOMEN EMPOWERMENT
    // =================================================
    {
        en: "\"Girls are equal to boys.\" Does this sentence show women's empowerment?",

        hi: "“लड़कियाँ लड़कों के बराबर हैं।” क्या यह वाक्य महिला सशक्तिकरण को दर्शाता है?",

        options: {
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
        },

        scores: [-4, -4, 0, 2, 4],

        explanations: {

            en: "\"Girls are equal to boys\" — this sentence itself shows that you are assuming that boys are bigger or stronger. Suppose a boy has failed the tenth grade and is a delinquent or a thug, while a girl of the same age is an MBBS doctor. Can there be any comparison between that boy and girl? No. So if you have to compare, compare at the level of consciousness. Anyone can be weak — a boy or a girl. The one who is unconscious is weak.",

            hi: "“लड़कियाँ लड़कों के बराबर हैं” — इस वाक्य से ही यह पता चलता है कि आप यह मान रहे हैं कि हाँ, लड़के बड़े होते हैं, मजबूत होते हैं। कोई लड़का दसवीं में असफल है, आवारा है, गुंडा है, वहीं एक लड़की एमबीबीएस डॉक्टर है, उसी उम्र की, तो अब उस लड़के और लड़की में कोई तुलना हो सकती है क्या? नहीं न? तो तुलना करनी भी है तो चेतना के स्तर पर करो। कमजोर तो कोई भी हो सकता है, लड़का भी, लड़की भी। जो अचेतन है, वह कमजोर है।"
        }
    }
];


// =====================================================
// STATE
// =====================================================

let selectedLanguage = "en";
let voiceEnabled = false;

let currentQuestion = 0;

let answers =
    Array(questions.length).fill(null);

let assessmentActive = false;


// =====================================================
// LANGUAGE SELECTION
// =====================================================

function showLanguageSelection() {

    assessmentActive = false;

    document.querySelector(".hero").innerHTML = `

        <h2>Choose Your Language</h2>

        <div class="navigation">

            <button onclick="selectLanguage('en')">
                English
            </button>

            <button onclick="selectLanguage('hi')">
                हिन्दी
            </button>

            <button onclick="selectLanguage('voice')">
                🔊 Voice Assistance
            </button>

        </div>
    `;
}


// =====================================================
// SELECT LANGUAGE
// =====================================================

function selectLanguage(language) {

    if (language === "voice") {

        voiceEnabled = true;

        showVoiceLanguageSelection();

        return;
    }

    voiceEnabled = false;

    selectedLanguage = language;

    showLanguageHome();
}


// =====================================================
// VOICE LANGUAGE
// =====================================================

function showVoiceLanguageSelection() {

    assessmentActive = false;

    document.querySelector(".hero").innerHTML = `

        <h2>🔊 Voice Assistant</h2>

        <div class="navigation">

            <button onclick="chooseVoiceLanguage('en')">
                English
            </button>

            <button onclick="chooseVoiceLanguage('hi')">
                हिन्दी
            </button>

        </div>
    `;

    setTimeout(() => {

        speakText(
            "Choose English or Hindi."
        );

    }, 300);
}


function chooseVoiceLanguage(language) {

    selectedLanguage = language;

    voiceEnabled = true;

    showLanguageHome();

}


// =====================================================
// HOME
// =====================================================

function showLanguageHome() {

    assessmentActive = false;

    if (selectedLanguage === "hi") {

        document.querySelector(".hero").innerHTML = `

            <h2>स्वागत है</h2>

            <p>
                स्वयं को समझें।
                अपनी धारणाओं पर प्रश्न करें।
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
                Understand yourself.
                Question your beliefs.
                Live consciously.
            </p>

            <button onclick="startAssessment()">
                Start Assessment
            </button>

        `;
    }


    if (voiceEnabled) {

        setTimeout(() => {

            if (selectedLanguage === "hi") {

                speakText(
                    "मूल्यांकन शुरू करने के लिए बटन दबाएँ।"
                );

            } else {

                speakText(
                    "Press the Start Assessment button to begin."
                );
            }

        }, 300);
    }
}


// =====================================================
// START
// =====================================================

function startAssessment() {

    currentQuestion = 0;

    answers =
        Array(questions.length).fill(null);

    assessmentActive = true;

    showQuestion();
}


// =====================================================
// SHOW QUESTION
// =====================================================

function showQuestion() {

    assessmentActive = true;

    const question =
        questions[currentQuestion];

    const language =
        selectedLanguage;

    const options =
        question.options[language];

    let optionsHTML = "";


    for (let i = 0; i < options.length; i++) {

        const checked =
            answers[currentQuestion] === i
                ? "checked"
                : "";

        const letter =
            String.fromCharCode(65 + i);


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
                — ${options[i]}

            </label>

        `;
    }


    document.querySelector(".hero").innerHTML = `

        <p>

            ${
                language === "hi"
                ? `प्रश्न ${currentQuestion + 1} / ${questions.length}`
                : `Question ${currentQuestion + 1} of ${questions.length}`
            }

        </p>


        <h2>
            ${question[language]}
        </h2>


        <div class="options">

            ${optionsHTML}

        </div>


        ${
            voiceEnabled
            ? `
                <p class="voice-instruction">

                    ${
                        language === "hi"
                        ? "विकल्प चुनने के लिए A, B, C, D या E दबाएँ।"
                        : "Press A, B, C, D, or E to choose an option."
                    }

                </p>
            `
            : ""
        }


        <div class="navigation">

            ${
                currentQuestion > 0
                ? `
                    <button onclick="previousQuestion()">
                        ${
                            language === "hi"
                            ? "पिछला"
                            : "Previous"
                        }
                    </button>
                `
                : ""
            }


            ${
                currentQuestion < questions.length - 1

                ? `
                    <button onclick="nextQuestion()">
                        ${
                            language === "hi"
                            ? "अगला"
                            : "Next"
                        }
                    </button>
                `

                : `
                    <button onclick="showReview()">
                        ${
                            language === "hi"
                            ? "अपने उत्तरों की समीक्षा करें"
                            : "Review Your Answers"
                        }
                    </button>
                `
            }

        </div>

    `;


    // VOICE
    if (voiceEnabled) {

        let voiceText = "";


        if (language === "hi") {

            voiceText =
                `प्रश्न ${currentQuestion + 1}। ${question.hi}। `;

            options.forEach((option, index) => {

                const letter =
                    String.fromCharCode(65 + index);

                voiceText +=
                    `विकल्प ${letter}। ${option}।`;
            });

            voiceText +=
                "विकल्प चुनने के लिए A, B, C, D या E दबाएँ।";

        } else {

            voiceText =
                `Question ${currentQuestion + 1}. ${question.en}. `;

            options.forEach((option, index) => {

                const letter =
                    String.fromCharCode(65 + index);

                voiceText +=
                    `Option ${letter}. ${option}.`;
            });

            voiceText +=
                "Press A, B, C, D, or E to choose an option.";
        }


        setTimeout(() => {

            speakText(voiceText);

        }, 300);
    }
}


// =====================================================
// SAVE ANSWER
// =====================================================

function saveAnswer(optionNumber) {

    answers[currentQuestion] =
        optionNumber;


    if (voiceEnabled) {

        const option =
            questions[currentQuestion]
                .options[selectedLanguage][optionNumber];

        const letter =
            String.fromCharCode(
                65 + optionNumber
            );


        if (selectedLanguage === "hi") {

            speakText(
                `आपने विकल्प ${letter} चुना है।`
            );

        } else {

            speakText(
                `You selected option ${letter}.`
            );
        }
    }
}


// =====================================================
// KEYBOARD
// =====================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            !voiceEnabled ||
            !assessmentActive
        ) {
            return;
        }


        const key =
            event.key.toLowerCase();


        const optionKeys = {

            a: 0,
            b: 1,
            c: 2,
            d: 3,
            e: 4

        };


        // A-E
        if (
            Object.prototype.hasOwnProperty.call(
                optionKeys,
                key
            )
        ) {

            answers[currentQuestion] =
                optionKeys[key];

            showQuestion();

            return;
        }


        // N
        if (key === "n") {

            nextQuestion();

            return;
        }


        // P
        if (key === "p") {

            previousQuestion();

            return;
        }


        // R
        if (key === "r") {

            showReview();

            return;
        }


        // SPACE
        if (event.code === "Space") {

            event.preventDefault();

            repeatCurrentQuestion();

            return;
        }

    }
);


// =====================================================
// REPEAT
// =====================================================

function repeatCurrentQuestion() {

    if (!voiceEnabled) {
        return;
    }

    showQuestion();
}


// =====================================================
// NEXT
// =====================================================

function nextQuestion() {

    if (
        answers[currentQuestion] === null
    ) {

        if (voiceEnabled) {

            speakText(

                selectedLanguage === "hi"

                ? "कृपया पहले एक विकल्प चुनें।"

                : "Please choose an option first."

            );

        } else {

            alert(

                selectedLanguage === "hi"

                ? "कृपया पहले एक विकल्प चुनें।"

                : "Please select an answer first."

            );
        }

        return;
    }


    if (
        currentQuestion <
        questions.length - 1
    ) {

        currentQuestion++;

        showQuestion();

    } else {

        showReview();
    }
}


// =====================================================
// PREVIOUS
// =====================================================

function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();
    }
}


// =====================================================
// REVIEW
// =====================================================

function showReview() {

    const unanswered =
        answers.findIndex(
            answer => answer === null
        );


    if (unanswered !== -1) {

        currentQuestion =
            unanswered;

        showQuestion();

        return;
    }


    assessmentActive = false;


    const language =
        selectedLanguage;


    let reviewHTML = "";


    for (
        let i = 0;
        i < questions.length;
        i++
    ) {

        const letter =
            String.fromCharCode(
                65 + answers[i]
            );


        const option =
            questions[i]
                .options[language][answers[i]];


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
                    }

                    :

                    ${letter} — ${option}

                </strong>

                <br><br>

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

        ${reviewHTML}


        <button onclick="finalSubmit()">

            ${
                language === "hi"
                ? "अंतिम सबमिट"
                : "Final Submit"
            }

        </button>

    `;


    if (voiceEnabled) {

        speakText(

            language === "hi"

            ? "अपने उत्तरों की समीक्षा करें। अंतिम सबमिट करने से पहले अपने उत्तरों को ध्यान से देखें।"

            : "Review your answers carefully before final submission."

        );
    }
}


// =====================================================
// EDIT
// =====================================================

function editQuestion(questionNumber) {

    currentQuestion =
        questionNumber;

    showQuestion();
}


// =====================================================
// FINAL SUBMIT
// =====================================================

function finalSubmit() {

    let rawScore = 0;


    // DIRECT SCORE
    for (
        let i = 0;
        i < answers.length;
        i++
    ) {

        rawScore +=
            questions[i].scores[answers[i]];
    }


    // -40 TO +40
    const consciousnessScore =
        Math.round(
            (rawScore / 40) * 100
        );


    const language =
        selectedLanguage;


    // =================================================
    // FINAL SCORE CRITERIA
    // =================================================

    let level = "";


    if (consciousnessScore >= 90) {

        level =
            language === "hi"
            ? "उच्च जागरूकता"
            : "High Awareness";

    }

    else if (consciousnessScore >= 70) {

        level =
            language === "hi"
            ? "अच्छी जागरूकता"
            : "Good Awareness";

    }

    else if (consciousnessScore >= 50) {

        level =
            language === "hi"
            ? "थोड़ा सुधार चाहिए"
            : "Some Improvement Needed";

    }

    else if (consciousnessScore >= 33) {

        level =
            language === "hi"
            ? "कम जागरूकता"
            : "Low Awareness";

    }

    else if (consciousnessScore >= 0) {

        level =
            language === "hi"
            ? "बहुत कम जागरूकता"
            : "Very Low Awareness";

    }

    else {

        level =
            language === "hi"
            ? "अचेतन"
            : "Unconscious";
    }


    // =================================================
    // RESULT
    // =================================================

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
                ? "आपका चेतना स्कोर"
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

                ? "यह स्कोर आपके उत्तरों के आधार पर आत्मचिंतन के लिए है।"

                : "This score is based on your answers and is intended for self-reflection."
            }

        </p>


        <hr>


        <h2>

            ${
                language === "hi"
                ? "आपके उत्तर"
                : "Your Answers"
            }

        </h2>


        ${createResultExplanations()}


        <button onclick="showLanguageHome()">

            ${
                language === "hi"
                ? "फिर से शुरू करें"
                : "Take Assessment Again"
            }

        </button>

    `;


    assessmentActive = false;


    if (voiceEnabled) {

        setTimeout(() => {

            speakText(

                language === "hi"

                ? `मूल्यांकन पूरा हुआ। आपका चेतना स्कोर ${consciousnessScore} प्रतिशत है। ${level}।`

                : `Assessment completed. Your Consciousness Score is ${consciousnessScore} percent. ${level}.`

            );

        }, 500);
    }
}


// =====================================================
// RESULT EXPLANATIONS
// =====================================================

function createResultExplanations() {

    const language =
        selectedLanguage;


    let html = "";


    for (
        let i = 0;
        i < questions.length;
        i++
    ) {

        const question =
            questions[i];


        const answer =
            answers[i];


        const option =
            question.options[language][answer];


        const score =
            question.scores[answer];


        let explanation = "";


        // Q5 explanations
        if (
            question.explanations &&
            question.explanations[language]
        ) {

            explanation =
                question.explanations[language][answer];

        }

        // Generic explanation for questions
        else {

            if (score > 0) {

                explanation =
                    language === "hi"

                    ? "इस मूल्यांकन के ढाँचे में यह उत्तर अधिक जागरूक प्रतिक्रिया को दर्शाता है।"

                    : "In this assessment's framework, this response represents a more conscious response.";

            }

            else if (score < 0) {

                explanation =
                    language === "hi"

                    ? "इस मूल्यांकन के ढाँचे में यह उत्तर कम जागरूक प्रतिक्रिया को दर्शाता है।"

                    : "In this assessment's framework, this response represents a less conscious response.";

            }

            else {

                explanation =
                    language === "hi"

                    ? "इस उत्तर को तटस्थ अंक दिए गए हैं।"

                    : "This response receives a neutral score.";
            }
        }


        html += `

            <div class="review-question">

                <h3>

                    ${
                        language === "hi"
                        ? `प्रश्न ${i + 1}`
                        : `Question ${i + 1}`
                    }

                </h3>


                <p>
                    ${question[language]}
                </p>


                <p>

                    <strong>

                        ${
                            language === "hi"
                            ? "आपका उत्तर"
                            : "Your Answer"
                        }

                    </strong>

                </p>


                <p>
                    ${option}
                </p>


                <p>

                    <strong>

                        ${
                            language === "hi"
                            ? "अंक"
                            : "Score"
                        }

                        :

                        ${score > 0 ? "+" : ""}${score}

                    </strong>

                </p>


                <p>

                    <strong>

                        ${
                            language === "hi"
                            ? "क्यों?"
                            : "Why this score?"
                        }

                    </strong>

                </p>


                <p>
                    ${explanation}
                </p>

            </div>

        `;
    }


    return html;
}


// =====================================================
// VOICE
// =====================================================

function speakText(text) {

    if (
        !voiceEnabled ||
        !("speechSynthesis" in window)
    ) {
        return;
    }


    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(text);


    speech.lang =
        selectedLanguage === "hi"
        ? "hi-IN"
        : "en-IN";


    speech.rate = 0.85;

    speech.pitch = 1;

    speech.volume = 1;


    window.speechSynthesis.speak(
        speech
    );
}
