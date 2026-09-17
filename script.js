/* =========================================================
   CONSCIOUSNESS WITH BHASKAR
   Complete script.js
   ========================================================= */

let currentLanguage = "en";
let voiceMode = false;
let voiceLanguage = "en";

let currentQuestion = 0;
let answers = Array(10).fill(null);

let voices = [];

/* =========================================================
   QUESTIONS
   ========================================================= */

const questions = [

    /* -----------------------------------------------------
       Q1
    ----------------------------------------------------- */
    {
        id: 1,

        question: {
            en: "Do you often compare yourself with others?",
            hi: "क्या आप अक्सर दूसरों से अपनी तुलना करते हैं?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [-4, -2, 0, 2, 4],

        bestOption: 4,

        why: {
            en: [
                "Constant comparison can keep attention trapped in what others are doing instead of understanding oneself.",
                "Comparison can still keep the mind dependent on others for self-evaluation.",
                "This neither clearly accepts nor rejects the habit of comparison.",
                "Reducing comparison moves attention more towards self-understanding.",
                "This option rejects comparison and directs attention towards understanding oneself."
            ],

            hi: [
                "लगातार तुलना करने से ध्यान स्वयं को समझने के बजाय दूसरों पर अटक सकता है।",
                "तुलना मन को अपने मूल्यांकन के लिए दूसरों पर निर्भर रख सकती है।",
                "यह विकल्प तुलना करने की आदत को न स्पष्ट रूप से स्वीकार करता है, न अस्वीकार।",
                "तुलना को कम करना ध्यान को स्वयं को समझने की ओर ले जाता है।",
                "यह विकल्प तुलना को अस्वीकार करता है और ध्यान स्वयं को समझने की ओर ले जाता है।"
            ]
        },

        quote: {
            en: "Comparison often leads only to superficial changes.",
            hi: "तुलना अक्सर केवल सतही बदलावों तक ले जाती है।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/on-youtube/ecf4b3c"
        }
    },


    /* -----------------------------------------------------
       Q2
    ----------------------------------------------------- */
    {
        id: 2,

        question: {
            en: "\"My Life, My Choice\" — but until when?",
            hi: "\"मेरी ज़िंदगी, मेरी पसंद\" — लेकिन कब तक?"
        },

        options: {
            en: [
                "It is my life and my decisions. I should have complete freedom to live according to my choices.",
                "I should have freedom to live according to my choices as long as it does not harm others — such as the environment, animals, human health, human rights, etc.",
                "Why should we care? I should live my way and others can do whatever they want.",
                "I do not want to answer because questioning my beliefs may hurt my ego.",
                "Everyone should have freedom to live according to their own choices."
            ],

            hi: [
                "मेरी ज़िंदगी है और मेरे फैसले हैं। मुझे अपनी पसंद के अनुसार जीने की पूरी स्वतंत्रता होनी चाहिए।",
                "मुझे अपनी पसंद के अनुसार जीने की स्वतंत्रता होनी चाहिए, जब तक उससे दूसरों—जैसे पर्यावरण, पशुओं, मानव स्वास्थ्य, मानव अधिकार आदि—को नुकसान न पहुँचे।",
                "हम क्या बोलें? अपना देखो बस, दूसरे कुछ भी करें।",
                "मैं इसका उत्तर नहीं देना चाहता क्योंकि अपने विश्वासों पर सवाल करना मेरे अहंकार को चोट पहुँचा सकता है।",
                "सबको अपने हिसाब से जीने की स्वतंत्रता होनी चाहिए।"
            ]
        },

        scores: [-4, 4, -4, 2, -2],

        bestOption: 1,

        why: {
            en: [
                "Personal freedom does not automatically mean that every consequence of a choice is acceptable.",
                "This option recognises personal freedom while also considering the rights and freedom of others.",
                "Ignoring the effects of one's choices on others removes responsibility from the idea of freedom.",
                "Refusing to question one's beliefs can itself become a barrier to understanding freedom.",
                "Freedom is important, but this statement does not address the possible impact of one's choices on others."
            ],

            hi: [
                "व्यक्तिगत स्वतंत्रता का अर्थ यह अपने-आप नहीं है कि किसी भी चुनाव का हर परिणाम स्वीकार्य हो।",
                "यह विकल्प व्यक्तिगत स्वतंत्रता के साथ-साथ दूसरों के अधिकार और स्वतंत्रता को भी ध्यान में रखता है।",
                "अपने चुनावों के प्रभाव को पूरी तरह नज़रअंदाज़ करना स्वतंत्रता से जिम्मेदारी को अलग कर देता है।",
                "अपने विश्वासों पर प्रश्न करने से इनकार करना स्वयं स्वतंत्रता को समझने में बाधा बन सकता है।",
                "स्वतंत्रता महत्वपूर्ण है, लेकिन यह कथन अपने चुनावों के दूसरों पर प्रभाव की बात नहीं करता।"
            ]
        },

        personalExplanationByOption: {
            hi: {
                0: `ऐसे तो आतंकवादी भी सही है, चोर भी सही है, बलात्कारी भी सही है क्योंकि उनकी ज़िंदगी उनकी पसंद है। आतंकवादी भी हिंसा ही कर रहा है, मांस खाने वाला भी हिंसा ही कर रहा है।`
            },

            en: {
                0: `By this logic, a terrorist is also right, a thief is also right, and a rapist is also right because it is their life and their choice. A terrorist is also committing violence, and a person who eats meat is also committing violence.`
            }
        },

        quote: {
            en: "Freedom is to be free of both—firstly others and secondly, and more importantly, yourself.",
            hi: "स्वतंत्रता का अर्थ दूसरों से और उससे भी अधिक महत्वपूर्ण रूप से स्वयं से मुक्त होना है।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/en/articles/how-to-move-to-freedom-from-slavery-1_6fd7036"
        }
    },


    /* -----------------------------------------------------
       Q3
    ----------------------------------------------------- */
    {
        id: 3,

        question: {
            en: "Are you willing to change your opinion when you discover that you were wrong?",
            hi: "जब आपको पता चलता है कि आप गलत थे, क्या आप अपनी सोच बदलने के लिए तैयार रहते हैं?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [4, 2, 0, -2, -4],

        bestOption: 0,

        why: {
            en: [
                "Being willing to examine and change one's view when it is shown to be wrong requires openness to inquiry.",
                "Some openness is present, but it is weaker than a clear willingness to change when wrong.",
                "This leaves the attitude towards changing one's view undecided.",
                "Refusing to change after recognising an error can keep a mistaken belief intact.",
                "Rejecting change even after discovering an error places the belief above inquiry."
            ],

            hi: [
                "गलत होने का पता चलने पर अपनी सोच को जाँचने और बदलने की तैयारी प्रश्न करने की openness दिखाती है।",
                "कुछ openness दिखाई देती है, लेकिन गलत साबित होने पर बदलने की स्पष्ट तैयारी से कम।",
                "यह सोच बदलने के प्रति स्पष्ट रुख नहीं बताता।",
                "गलती समझ आने के बाद भी सोच न बदलना गलत विश्वास को बनाए रख सकता है।",
                "गलती पता चलने के बाद भी बदलाव को अस्वीकार करना विश्वास को प्रश्न से ऊपर रखता है।"
            ]
        },

        quote: {
            en: "How do I know? Just by enquiring; just by seeing.",
            hi: "मैं कैसे जानूँ? बस प्रश्न करके; बस देखकर।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/en/articles/in-the-middle-of-conditioning-how-do-i-get-real-freedom-with-youth-1_ab39fae"
        }
    },


    /* -----------------------------------------------------
       Q4
    ----------------------------------------------------- */
    {
        id: 4,

        question: {
            en: "Do you usually question what you hear instead of blindly believing it?",
            hi: "क्या आप सुनी हुई बातों पर आँख बंद करके विश्वास करने के बजाय उन पर प्रश्न करते हैं?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [4, 2, 0, -2, -4],

        bestOption: 0,

        why: {
            en: [
                "Questioning what you hear instead of accepting it blindly encourages inquiry and examination.",
                "This shows some willingness to question, though not consistently.",
                "This does not clearly show whether you question or blindly accept information.",
                "Accepting information without enough questioning can leave beliefs unexamined.",
                "Blindly accepting what you hear leaves little space for inquiry."
            ],

            hi: [
                "सुनी हुई बात को आँख बंद करके स्वीकार करने के बजाय प्रश्न करना जाँच और समझ की ओर ले जाता है।",
                "यह कुछ हद तक प्रश्न करने की इच्छा दिखाता है, लेकिन लगातार नहीं।",
                "यह स्पष्ट नहीं करता कि आप प्रश्न करते हैं या बिना जाँच स्वीकार करते हैं।",
                "पर्याप्त प्रश्न किए बिना बात स्वीकार करने से विश्वास बिना जाँच के रह सकता है।",
                "सुनी हुई बात को आँख बंद करके स्वीकार करना प्रश्न करने की जगह बहुत कम छोड़ता है।"
            ]
        },

        quote: {
            en: "How do I know? Just by enquiring; just by seeing.",
            hi: "मैं कैसे जानूँ? बस प्रश्न करके; बस देखकर।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/en/articles/in-the-middle-of-conditioning-how-do-i-get-real-freedom-with-youth-1_ab39fae"
        }
    },


    /* -----------------------------------------------------
       Q5
    ----------------------------------------------------- */
    {
        id: 5,

        question: {
            en: "What would you say about people who eat meat and people who, even knowing that something wrong is happening, still remain silent?",
            hi: "जो लोग मांस खाते हैं और जो लोग यह जानते हुए भी कि यह गलत हो रहा है, फिर भी चुप रहते हैं—आप उनके बारे में क्या कहना चाहेंगे?"
        },

        options: {
            en: [
                "They eat meat because of conditioning received from childhood, so they should not be blamed for eating meat.",
                "People who have families and children have to live according to their circumstances; how will they support their families?",
                "As human beings, they should try to understand their actions and their effects. If they understand the harm and still deliberately refuse to examine or change it, their behaviour goes against their capacity for human discernment.",
                "Why should we say anything about them? It is their life and they can do whatever they want.",
                "I am myself like that, so what can I say?"
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

        bestOption: 2,

        why: {
            en: [
                "Conditioning can explain a behaviour, but explanation alone does not establish that the behaviour is right.",
                "Personal circumstances can influence choices, but circumstances alone do not remove the need to examine one's actions and their effects.",
                "This option asks a person to examine actions, consequences and responsibility rather than simply accepting conditioning.",
                "Freedom to choose does not automatically remove responsibility for the consequences of a choice.",
                "Recognising one's own contradiction can be honest, but stopping there does not move towards examination or change."
            ],

            hi: [
                "Conditioning किसी व्यवहार को समझा सकती है, लेकिन केवल explanation से वह व्यवहार सही सिद्ध नहीं हो जाता।",
                "व्यक्तिगत परिस्थितियाँ चुनावों को प्रभावित कर सकती हैं, लेकिन वे अपने-आप कर्मों और उनके प्रभाव को समझने की जिम्मेदारी समाप्त नहीं करतीं।",
                "यह विकल्प व्यक्ति को अपने कर्म, उनके प्रभाव और अपनी जिम्मेदारी को समझने की ओर ले जाता है।",
                "चुनाव करने की स्वतंत्रता किसी चुनाव के परिणामों की जिम्मेदारी को अपने-आप समाप्त नहीं करती।",
                "अपनी ही contradiction को स्वीकार करना ईमानदार हो सकता है, लेकिन वहीं रुक जाना समझ या बदलाव की ओर नहीं ले जाता।"
            ]
        },

        personalExplanationByOption: {

            hi: {
                0: `बचपन की conditioning यह explain कर सकती है कि कोई व्यक्ति मांस क्यों खाता है, लेकिन केवल conditioning के कारण उसका व्यवहार सही नहीं हो जाता। ऐसे तो एक terrorist को भी बचपन से लोगों को मारना सिखाया जाता है, तो क्या सिर्फ इसलिए उसका लोगों को मारना सही हो जाएगा? नहीं। इसी तरह, केवल यह कहना कि “उसे बचपन से मांस खाना सिखाया गया है” उसके व्यवहार को सही ठहराने के लिए पर्याप्त नहीं है।`
            },

            en: {
                0: `Childhood conditioning can explain why a person eats meat, but conditioning alone does not make the behaviour right. A terrorist may also be taught from childhood to kill people, but does that make killing people right simply because it was taught to him? No. Similarly, merely saying that “he was taught to eat meat from childhood” is not enough to justify his behaviour.`
            }
        },

        quote: {
            en: "Be attentive so that one knows that one is acting out of conditioning.",
            hi: "सजग रहो ताकि पता रहे कि तुम conditioning के कारण कार्य कर रहे हो।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/en/articles/how-to-move-to-freedom-from-slavery-1_6fd7036"
        }
    },


    /* -----------------------------------------------------
       Q6
    ----------------------------------------------------- */
    {
        id: 6,

        question: {
            en: "Do you find it difficult to accept that someone you love has their own freedom?",
            hi: "क्या आपके लिए यह स्वीकार करना कठिन होता है कि जिससे आप प्रेम करते हैं, उसे अपनी स्वतंत्रता है?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [-4, -2, 0, 2, 4],

        bestOption: 4,

        why: {
            en: [
                "Difficulty accepting another person's freedom can turn love into attachment or control.",
                "Some difficulty with another person's freedom can still create attachment and control.",
                "This leaves your position towards another person's freedom unclear.",
                "Accepting another person's freedom reduces the tendency to control them.",
                "This clearly accepts that someone you love is still an individual with their own freedom."
            ],

            hi: [
                "दूसरे व्यक्ति की स्वतंत्रता स्वीकार करने में कठिनाई प्रेम को attachment या control में बदल सकती है।",
                "दूसरे की स्वतंत्रता को लेकर कुछ कठिनाई भी attachment और control पैदा कर सकती है।",
                "यह दूसरे व्यक्ति की स्वतंत्रता के प्रति आपका स्पष्ट रुख नहीं बताता।",
                "दूसरे व्यक्ति की स्वतंत्रता स्वीकार करना उसे नियंत्रित करने की प्रवृत्ति को कम करता है।",
                "यह स्पष्ट रूप से स्वीकार करता है कि जिससे आप प्रेम करते हैं, उसकी अपनी स्वतंत्रता भी है।"
            ]
        },

        quote: {
            en: "Freedom is to be free of both—firstly others and secondly, and more importantly, yourself.",
            hi: "स्वतंत्रता का अर्थ दूसरों से और उससे भी अधिक महत्वपूर्ण रूप से स्वयं से मुक्त होना है।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/en/articles/how-to-move-to-freedom-from-slavery-1_6fd7036"
        }
    },


    /* -----------------------------------------------------
       Q7
    ----------------------------------------------------- */
    {
        id: 7,

        question: {
            en: "Do you regularly observe your own thoughts and emotions?",
            hi: "क्या आप नियमित रूप से अपने विचारों और भावनाओं को देखते और समझते हैं?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [4, 2, 0, -2, -4],

        bestOption: 0,

        why: {
            en: [
                "Regular observation of thoughts and emotions can help a person see their own tendencies and conditioning.",
                "Some observation is present, but it is less consistent.",
                "This does not clearly show a practice of self-observation.",
                "Avoiding observation leaves thoughts and emotions less examined.",
                "Rejecting self-observation leaves little room to understand one's own mental patterns."
            ],

            hi: [
                "विचारों और भावनाओं का नियमित observation व्यक्ति को अपनी tendencies और conditioning को देखने में मदद कर सकता है।",
                "कुछ observation मौजूद है, लेकिन यह लगातार नहीं है।",
                "यह self-observation की स्पष्ट आदत नहीं दिखाता।",
                "Observation से बचने पर विचार और भावनाएँ कम जाँची जाती हैं।",
                "Self-observation को अस्वीकार करने से अपनी मानसिक प्रवृत्तियों को समझने की संभावना कम हो जाती है।"
            ]
        },

        quote: {
            en: "By keeping a close watch on our thoughts and emotions, we can discern underlying tendencies.",
            hi: "अपने विचारों और भावनाओं पर ध्यानपूर्वक नज़र रखने से हम अपनी भीतर की प्रवृत्तियों को समझ सकते हैं।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/on-youtube/9913604"
        }
    },


    /* -----------------------------------------------------
       Q8
    ----------------------------------------------------- */
    {
        id: 8,

        question: {
            en: "Do you avoid telling the truth when it may damage your image?",
            hi: "क्या आप तब सच बोलने से बचते हैं जब उससे आपकी छवि को नुकसान पहुँच सकता है?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [-4, -2, 0, 2, 4],

        bestOption: 4,

        why: {
            en: [
                "Avoiding truth to protect an image places image above truthfulness.",
                "Choosing image over truth can keep a person dependent on external approval.",
                "This does not clearly show whether truth or image has priority.",
                "Reducing the tendency to hide truth shows greater commitment to truthfulness.",
                "Refusing to avoid truth merely to protect an image gives truthfulness priority over image."
            ],

            hi: [
                "छवि बचाने के लिए सत्य से बचना छवि को सत्य से ऊपर रखता है।",
                "सत्य के बजाय छवि चुनना व्यक्ति को बाहरी approval पर निर्भर रख सकता है।",
                "यह स्पष्ट नहीं करता कि सत्य महत्वपूर्ण है या छवि।",
                "सत्य छिपाने की प्रवृत्ति कम करना सत्य के प्रति अधिक प्रतिबद्धता दिखाता है।",
                "केवल अपनी छवि बचाने के लिए सत्य से न बचना सत्य को छवि से ऊपर रखता है।"
            ]
        },

        quote: {
            en: "Satyam — truthfulness.",
            hi: "सत्यम् — सत्य।",
            person: "Sri Krishna — Bhagavad Gita 16.2",
            url: "https://www.gitasupersite.iitk.ac.in/srimad?etgb=1&field_chapter_value=16&field_nsutra_value=2&language=dv&setgb=1"
        }
    },


    /* -----------------------------------------------------
       Q9
    ----------------------------------------------------- */
    {
        id: 9,

        question: {
            en: "Do you think about the impact of your lifestyle on animals and nature?",
            hi: "क्या आप अपने जीवन जीने के तरीके के प्रभाव के बारे में पशुओं और प्रकृति के संदर्भ में सोचते हैं?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [4, 2, 0, -2, -4],

        bestOption: 0,

        why: {
            en: [
                "Considering how one's lifestyle affects other beings and nature encourages broader awareness of consequences.",
                "Some consideration is present, though it may not be consistent.",
                "This leaves the level of consideration unclear.",
                "Ignoring such effects reduces attention to the consequences of one's lifestyle.",
                "Rejecting consideration of impacts leaves important consequences outside the reflection."
            ],

            hi: [
                "अपने जीवन के प्रभाव को दूसरे जीवों और प्रकृति के संदर्भ में देखना परिणामों के प्रति व्यापक जागरूकता दिखाता है।",
                "कुछ consideration मौजूद है, लेकिन यह लगातार नहीं भी हो सकती।",
                "यह स्पष्ट नहीं करता कि आप इन प्रभावों के बारे में कितना सोचते हैं।",
                "इन प्रभावों को नज़रअंदाज़ करना जीवनशैली के परिणामों पर ध्यान कम करता है।",
                "प्रभावों पर विचार करने से इनकार करना महत्वपूर्ण परिणामों को reflection से बाहर कर देता है।"
            ]
        },

        quote: {
            en: "He who hates no creature, who is friendly and compassionate to all.",
            hi: "जो किसी भी प्राणी से द्वेष नहीं करता और सबके प्रति मैत्रीपूर्ण तथा करुणामय है।",
            person: "Sri Krishna — Bhagavad Gita 12.13",
            url: "https://www.gitasupersite.iitk.ac.in/srimad?choose=1&field_chapter_value=12&field_nsutra_value=13&language=dv&setgb=1"
        }
    },


    /* -----------------------------------------------------
       Q10
    ----------------------------------------------------- */
    {
        id: 10,

        question: {
            en: "\"Girls are equal to boys.\" Does this sentence show women's empowerment?",
            hi: "“लड़कियाँ लड़कों के बराबर हैं।” क्या यह वाक्य महिला सशक्तिकरण को दर्शाता है?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [-4, -4, 0, 2, 4],

        bestOption: 4,

        why: {
            en: [
                "This accepts the sentence without questioning the assumption behind the comparison.",
                "This still accepts the comparison between girls and boys as the basis of empowerment.",
                "This neither accepts nor rejects the comparison.",
                "This begins to question whether comparison with boys is the right basis for empowerment.",
                "This questions whether empowerment should be defined merely through comparison with boys."
            ],

            hi: [
                "यह वाक्य comparison के पीछे छिपी assumption को question किए बिना स्वीकार करता है।",
                "यह भी empowerment को लड़कों के साथ comparison के आधार पर स्वीकार करता है।",
                "यह comparison को न स्वीकार करता है, न अस्वीकार।",
                "यह प्रश्न उठाना शुरू करता है कि empowerment का आधार लड़कों से comparison होना चाहिए या नहीं।",
                "यह प्रश्न करता है कि empowerment को केवल लड़कों के साथ comparison से ही क्यों परिभाषित किया जाए।"
            ]
        },

        personalExplanationByOption: {

            hi: {
                0: `“लड़कियाँ लड़कों के बराबर हैं” — इस वाक्य से ही यह पता चलता है कि आप यह मान रहे हैं कि हाँ, लड़के बड़े होते हैं, मजबूत होते हैं। कोई लड़का दसवीं में असफल है, आवारा है, गुंडा है, वहीं एक लड़की एमबीबीएस डॉक्टर है, उसी उम्र की, तो अब उस लड़के और लड़की में कोई तुलना हो सकती है क्या? नहीं न? तो तुलना करनी भी है तो चेतना के स्तर पर करो। कमजोर तो कोई भी हो सकता है, लड़का भी, लड़की भी। जो अचेतन है, वह कमजोर है।`
            },

            en: {
                0: `"Girls are equal to boys" — this sentence itself shows that you are assuming that boys are bigger or stronger. Suppose a boy has failed the tenth grade and is a delinquent or a thug, while a girl of the same age is an MBBS doctor. Can there be any comparison between that boy and girl? No. So if comparison has to be made, make it at the level of consciousness. Anyone can be weak — a boy or a girl. The one who is unconscious is weak.`
            }
        },

        quote: {
            en: "The only plane where true equality exists is that of consciousness.",
            hi: "सच्ची समानता का स्तर चेतना का है।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/on-youtube/b1f1507"
        }
    }

];


/* =========================================================
   LANGUAGE HELPERS
   ========================================================= */

function t(obj) {
    if (!obj) return "";
    return obj[currentLanguage] || obj.en || "";
}

function getOptionText(question, index) {
    return question.options[currentLanguage][index];
}


/* =========================================================
   HTML SECURITY
   ========================================================= */

function escapeHTML(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   START / LANGUAGE
   ========================================================= */

function showLanguageSelection() {

    document.body.innerHTML = `
        <div class="language-screen">

            <div class="language-card">

                <h1>Consciousness with Bhaskar</h1>

                <p>
                    Choose your language
                </p>

                <div class="language-buttons">

                    <button onclick="selectLanguage('en', false)">
                        English
                    </button>

                    <button onclick="selectLanguage('hi', false)">
                        हिन्दी
                    </button>

                    <button onclick="showVoiceLanguageSelection()">
                        🎙️ Voice Assistant
                    </button>

                </div>

            </div>

        </div>
    `;
}


function showVoiceLanguageSelection() {

    document.body.innerHTML = `
        <div class="language-screen">

            <div class="language-card">

                <h1>🎙️ Voice Assistant</h1>

                <p>
                    Choose the language for the voice assistant
                </p>

                <div class="language-buttons">

                    <button onclick="selectLanguage('en', true)">
                        English Voice
                    </button>

                    <button onclick="selectLanguage('hi', true)">
                        हिन्दी Voice
                    </button>

                </div>

            </div>

        </div>
    `;
}


function selectLanguage(language, useVoice) {

    currentLanguage = language;
    voiceMode = useVoice;
    voiceLanguage = language;

    currentQuestion = 0;
    answers = Array(questions.length).fill(null);

    renderQuestion();

    if (voiceMode) {
        setTimeout(() => {

            speak(
                language === "en"
                    ? "Voice Assistant activated. Select an answer using A, B, C, D or E."
                    : "वॉइस असिस्टेंट सक्रिय है। A, B, C, D या E दबाकर उत्तर चुनें।"
            );

        }, 700);
    }
}


/* =========================================================
   QUESTION SCREEN
   ========================================================= */

function renderQuestion() {

    const q = questions[currentQuestion];

    const optionLetters = ["A", "B", "C", "D", "E"];

    document.body.innerHTML = `

        <div class="assessment-container">

            <div class="assessment-header">

                <h1>Consciousness with Bhaskar</h1>

                <div class="progress">
                    ${currentQuestion + 1} / ${questions.length}
                </div>

            </div>

            <div class="question-card">

                <h2>
                    ${escapeHTML(t(q.question))}
                </h2>

                <div class="options">

                    ${q.options[currentLanguage].map((option, index) => `

                        <button
                            class="option-button ${answers[currentQuestion] === index ? "selected" : ""}"
                            onclick="selectAnswer(${index})"
                        >

                            <span class="option-letter">
                                ${optionLetters[index]}
                            </span>

                            <span>
                                ${escapeHTML(option)}
                            </span>

                        </button>

                    `).join("")}

                </div>

            </div>

            <div class="navigation">

                <button
                    onclick="previousQuestion()"
                    ${currentQuestion === 0 ? "disabled" : ""}
                >
                    ${currentLanguage === "en" ? "← Previous" : "← पिछला"}
                </button>

                ${
                    currentQuestion === questions.length - 1

                    ? `
                        <button
                            onclick="finishAssessment()"
                            ${answers[currentQuestion] === null ? "disabled" : ""}
                        >
                            ${currentLanguage === "en" ? "See Result" : "परिणाम देखें"}
                        </button>
                    `

                    : `
                        <button
                            onclick="nextQuestion()"
                            ${answers[currentQuestion] === null ? "disabled" : ""}
                        >
                            ${currentLanguage === "en" ? "Next →" : "अगला →"}
                        </button>
                    `
                }

            </div>

            ${
                voiceMode

                ? `
                    <div class="voice-controls">

                        <p>
                            ${
                                currentLanguage === "en"
                                    ? "Voice Controls: A/B/C/D/E = Answer • N = Next • P = Previous • R = Review • Space = Repeat"
                                    : "वॉइस कंट्रोल: A/B/C/D/E = उत्तर • N = अगला • P = पिछला • R = Review • Space = दोहराएँ"
                            }
                        </p>

                        <button onclick="repeatQuestion()">
                            🔊 ${
                                currentLanguage === "en"
                                    ? "Repeat Question"
                                    : "प्रश्न दोहराएँ"
                            }
                        </button>

                    </div>
                `
                : ""
            }

        </div>
    `;

    if (voiceMode) {
        setTimeout(() => speakCurrentQuestion(), 300);
    }
}




/* =========================================================
   ANSWER SELECTION
   ========================================================= */

function selectAnswer(index) {

    answers[currentQuestion] = index;

    renderQuestion();
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function nextQuestion() {

    if (answers[currentQuestion] === null) return;

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        renderQuestion();

    } else {

        finishAssessment();
    }
}


function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;

        renderQuestion();
    }
}


/* =========================================================
   SCORE
   ========================================================= */

function calculateScore() {

    let total = 0;

    answers.forEach((answer, index) => {

        if (answer !== null) {

            total += questions[index].scores[answer];
        }
    });

    return total;
}


function calculatePercentage(score) {

    return Math.round((score / 40) * 100);
}


function getClassification(percentage) {

    if (percentage >= 90) {

        return {
            en: "High Awareness",
            hi: "उच्च जागरूकता"
        };
    }


    if (percentage >= 70) {

        return {
            en: "Good Awareness",
            hi: "अच्छी जागरूकता"
        };
    }


    if (percentage >= 50) {

        return {
            en: "Some Improvement Needed",
            hi: "थोड़ा सुधार चाहिए"
        };
    }


    if (percentage >= 33) {

        return {
            en: "Low Awareness",
            hi: "कम जागरूकता"
        };
    }


    if (percentage >= 0) {

        return {
            en: "Very Low Awareness",
            hi: "बहुत कम जागरूकता"
        };
    }


    return {
        en: "Unconscious",
        hi: "अचेतन"
    };
}


/* =========================================================
   FINISH
   ========================================================= */

function finishAssessment() {

    if (answers.includes(null)) {

        alert(
            currentLanguage === "en"
                ? "Please answer all questions first."
                : "कृपया पहले सभी प्रश्नों के उत्तर दें।"
        );

        return;
    }


    const score = calculateScore();

    const percentage = calculatePercentage(score);

    const classification = getClassification(percentage);


    renderResult(score, percentage, classification);


    if (voiceMode) {

        setTimeout(() => {

            speak(
                currentLanguage === "en"
                    ? `Your Consciousness Score is ${percentage} percent. Your assessment result is ${classification.en}.`
                    : `आपका Consciousness Score ${percentage} प्रतिशत है। आपका परिणाम ${classification.hi} है।`
            );

        }, 800);
    }
}


/* =========================================================
   RESULT SCREEN
   ========================================================= */

function renderResult(score, percentage, classification) {

    document.body.innerHTML = `

        <div class="result-container">

            <div class="result-header">

                <h1>
                    Consciousness with Bhaskar
                </h1>

                <h2>
                    ${
                        currentLanguage === "en"
                            ? "Your Consciousness Assessment Result"
                            : "आपका Consciousness Assessment Result"
                    }
                </h2>

            </div>


            <div class="score-card">

                <div class="score-number">
                    ${percentage}%
                </div>

                <div class="score-label">
                    ${escapeHTML(classification[currentLanguage])}
                </div>

                <div class="raw-score">
                    ${
                        currentLanguage === "en"
                            ? `Raw Score: ${score} / 40`
                            : `Raw Score: ${score} / 40`
                    }
                </div>

            </div>


            <div class="result-note">

                ${
                    currentLanguage === "en"

                    ? "This assessment is for self-reflection. It is not a scientific or clinical diagnosis."

                    : "यह assessment आत्म-चिंतन के लिए है। यह कोई वैज्ञानिक या clinical diagnosis नहीं है।"
                }

            </div>


            <div class="answer-review">

                <h2>

                    ${
                        currentLanguage === "en"
                            ? "Question-wise Reflection"
                            : "प्रश्नवार Reflection"
                    }

                </h2>


                ${questions
                    .map((q, index) =>
                        renderQuestionReview(q, index)
                    )
                    .join("")
                }

            </div>


            <div class="final-message">

                <h2>

                    ${
                        currentLanguage === "en"
                            ? "Question yourself. Observe yourself. Live consciously."
                            : "स्वयं से प्रश्न करें। स्वयं को देखें। सचेत होकर जिएँ।"
                    }

                </h2>

            </div>


            <div class="gita-community">

                <h2>

                    ${
                        currentLanguage === "en"
                            ? "Want to explore the Gita deeper?"
                            : "गीता को और गहराई से समझना चाहते हैं?"
                    }

                </h2>


                <p>

                    ${
                        currentLanguage === "en"
                            ? "Join Acharya Prashant's Gita community to know yourself."
                            : "स्वयं को जानने के लिए आचार्य प्रशांत की गीता community से जुड़ें।"
                    }

                </p>


                <a
                    href="https://acharyaprashant.org/en/gita/referral?referrerId=2131173a-44bc-4023-a22d-05d8aeb45638"
                    target="_blank"
                    rel="noopener noreferrer"
                >

                    ${
                        currentLanguage === "en"
                            ? "Join Gita Community ↗"
                            : "गीता Community से जुड़ें ↗"
                    }

                </a>

            </div>

        </div>
    `;
}


/* =========================================================
   QUESTION REVIEW
   ========================================================= */

function renderQuestionReview(q, index) {

    const selected = answers[index];

    const isBest = selected === q.bestOption;

    const selectedText = getOptionText(q, selected);

    const bestText = getOptionText(q, q.bestOption);


    const statusClass = isBest
        ? "review-correct"
        : "review-wrong";


    const statusIcon = isBest
        ? "✓"
        : "✕";


    const statusTitle = isBest

        ? (
            currentLanguage === "en"
                ? "More Conscious Option"
                : "इस मूल्यांकन में अधिक सचेत विकल्प"
        )

        : (
            currentLanguage === "en"
                ? "Not the More Conscious Option"
                : "इस मूल्यांकन में अधिक सचेत विकल्प नहीं"
        );


    const whyText =
        q.why[currentLanguage][selected];


    /* -----------------------------------------------------
       PERSONAL EXPLANATION + QUOTE
       ----------------------------------------------------- */

    let explanationHTML = "";


    const personalExplanation =
        q.personalExplanationByOption &&
        q.personalExplanationByOption[currentLanguage] &&
        q.personalExplanationByOption[currentLanguage][selected];


    /*
       If a personal explanation exists,
       show it first.
    */

    if (personalExplanation) {

        explanationHTML += `

            <div class="personal-explanation">

                <h4>

                    ${
                        currentLanguage === "en"
                            ? "Bhaskar's Explanation"
                            : "भास्कर की व्याख्या"
                    }

                </h4>

                <p>

                    ${escapeHTML(personalExplanation)}

                </p>

            </div>

        `;
    }


    /*
       Always show the existing quote and source.
       This means Q2, Q5 and Q10 will now show:

       1. Bhaskar's Explanation
       2. Quote
       3. Source

       Other questions will simply show:
       Quote + Source
    */

    const quoteText = q.quote[currentLanguage];


    explanationHTML += `

        <div class="quote-box">

            <div class="quote-text">

                “${escapeHTML(quoteText)}”

            </div>


            <div class="quote-person">

                — ${escapeHTML(q.quote.person)}

            </div>


            <div class="source-box">

                <span class="source-icon">
                    🔗
                </span>


                <span>

                    ${
                        currentLanguage === "en"
                            ? "Source:"
                            : "स्रोत:"
                    }

                </span>


                <a
                    href="${q.quote.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                >

                    ${escapeHTML(q.quote.person)} ↗

                </a>

            </div>

        </div>

    `;


    return `

        <div class="review-card ${statusClass}">


            <div class="review-question-number">

                ${
                    currentLanguage === "en"
                        ? `Question ${q.id}`
                        : `प्रश्न ${q.id}`
                }

            </div>


            <h3>

                ${escapeHTML(t(q.question))}

            </h3>


            <div class="selected-answer">

                <strong>

                    ${
                        currentLanguage === "en"
                            ? "Your Answer:"
                            : "आपका उत्तर:"
                    }

                </strong>


                <span>

                    ${escapeHTML(selectedText)}

                </span>

            </div>


            <div class="review-status">

                <span class="status-icon">

                    ${statusIcon}

                </span>


                <span>

                    ${statusTitle}

                </span>

            </div>


            <div class="why-box">

                <h4>

                    ${
                        isBest

                            ? (
                                currentLanguage === "en"
                                    ? "Why this is considered more conscious"
                                    : "इसे अधिक सचेत विकल्प क्यों माना गया है"
                            )

                            : (
                                currentLanguage === "en"
                                    ? "Why this answer is not considered more conscious"
                                    : "इस उत्तर को अधिक सचेत विकल्प क्यों नहीं माना गया"
                            )
                    }

                </h4>


                <p>

                    ${escapeHTML(whyText)}

                </p>

            </div>


            ${
                !isBest

                    ? `

                        <div class="more-conscious-answer">

                            <strong>

                                ${
                                    currentLanguage === "en"
                                        ? "More Conscious Option:"
                                        : "अधिक सचेत विकल्प:"
                                }

                            </strong>


                            <span>

                                ${escapeHTML(bestText)}

                            </span>

                        </div>

                    `

                    : ""
            }


            ${explanationHTML}


        </div>

    `;
}


/* =========================================================
   RESTART
   ========================================================= */

function restartAssessment() {

    currentQuestion = 0;

    answers = Array(questions.length).fill(null);

    renderQuestion();
}


/* =========================================================
   VOICE SYNTHESIS
   ========================================================= */

function loadVoices() {

    if ("speechSynthesis" in window) {

        voices = speechSynthesis.getVoices();
    }
}


if ("speechSynthesis" in window) {

    speechSynthesis.onvoiceschanged = loadVoices;

    loadVoices();
}


function getBestVoice(language) {

    if (!voices.length) return null;


    if (language === "hi") {

        return (

            voices.find(v =>
                v.lang &&
                v.lang.toLowerCase().startsWith("hi")
            ) || null

        );
    }


    return (

        voices.find(v =>
            v.lang &&
            v.lang.toLowerCase().startsWith("en")
        ) || null

    );
}


function speak(text) {

    if (!voiceMode) return;


    if (!("speechSynthesis" in window)) {

        alert(

            currentLanguage === "en"

                ? "Voice synthesis is not supported in this browser."

                : "इस browser में voice synthesis supported नहीं है।"

        );

        return;
    }


    speechSynthesis.cancel();


    const utterance =
        new SpeechSynthesisUtterance(text);


    utterance.lang =

        currentLanguage === "hi"

            ? "hi-IN"

            : "en-US";


    utterance.rate = 0.9;

    utterance.pitch = 1;

    utterance.volume = 1;


    const voice =
        getBestVoice(currentLanguage);


    if (voice) {

        utterance.voice = voice;
    }


    speechSynthesis.speak(utterance);
}


/* =========================================================
   VOICE QUESTION
   ========================================================= */

function speakCurrentQuestion() {

    if (!voiceMode) return;


    const q = questions[currentQuestion];


    let text =
        t(q.question) + ". ";


    q.options[currentLanguage].forEach(
        (option, index) => {

            text +=
                `${String.fromCharCode(65 + index)}. ${option}. `;
        }
    );


    text +=

        currentLanguage === "en"

            ? "Choose your answer."

            : "अपना उत्तर चुनें।";


    speak(text);
}


function repeatQuestion() {

    speakCurrentQuestion();
}


/* =========================================================
   VOICE RESULT REVIEW
   ========================================================= */

function speakCurrentReview() {

    if (!voiceMode) return;


    const q = questions[currentQuestion];

    const selected = answers[currentQuestion];


    if (selected === null) {

        speak(

            currentLanguage === "en"

                ? "You have not selected an answer yet."

                : "आपने अभी उत्तर नहीं चुना है।"

        );

        return;
    }


    const selectedText =
        getOptionText(q, selected);


    const isBest =
        selected === q.bestOption;


    const text =

        currentLanguage === "en"

            ? `Your answer is ${selectedText}. ${
                isBest
                    ? "This is the more conscious option in this assessment."
                    : "This is not the more conscious option in this assessment."
              }`

            : `आपका उत्तर है ${selectedText}। ${
                isBest
                    ? "यह इस मूल्यांकन में अधिक सचेत विकल्प है।"
                    : "यह इस मूल्यांकन में अधिक सचेत विकल्प नहीं है।"
              }`;


    speak(text);
}


/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (!voiceMode) return;


        const key =
            event.key.toLowerCase();


        /* A-E answer */

        const answerMap = {

            a: 0,
            b: 1,
            c: 2,
            d: 3,
            e: 4

        };


        if (answerMap.hasOwnProperty(key)) {

            selectAnswer(answerMap[key]);

            return;
        }


        /* Next */

        if (key === "n") {

            if (answers[currentQuestion] !== null) {

                nextQuestion();
            }

            return;
        }


        /* Previous */

        if (key === "p") {

            previousQuestion();

            return;
        }


        /* Review */

        if (key === "r") {

            speakCurrentReview();

            return;
        }


        /* Repeat */

        if (event.code === "Space") {

            event.preventDefault();

            repeatQuestion();

            return;
        }

    }
);


/* =========================================================
   INITIAL LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
           index.html already contains the landing page.
           The Start button calls showLanguageSelection().
        */

    }
);

