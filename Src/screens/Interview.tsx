// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, PermissionsAndroid, Platform } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import Tts from 'react-native-tts';
// import Voice from '@react-native-voice/voice';


// export const Interview = () => {
//     const route = useRoute();
//     const { context }: any = route.params;

//     const [aiText, setAiText] = useState("Initializing Interviewer...");
//     const [isListening, setIsListening] = useState(false);


//     useEffect(() => {
//         const init = async () => {
//             const hasPermission = await requestPermission();
//             if (hasPermission) {
//                 setupTTS();
//                 setupInterview();
//             } else {
//                 setAiText("Microphone permission denied.");
//             }
//         };
//         init();

//         // Voice Listeners Setup
//         Voice.onSpeechStart = () => setIsListening(true);
//         Voice.onSpeechEnd = () => setIsListening(false);
//         Voice.onSpeechResults = onSpeechResults;
//         Voice.onSpeechError = (e) => {
//             console.log("Voice Error:", e);
//             setIsListening(false);
//         };

//         return () => {
//             Tts.stop();
//             Voice.destroy().then(() => {
//                 Voice.removeAllListeners();
//             }).catch(e => console.log(e));
//         };
//     }, []);

//     const requestPermission = async () => {
//         if (Platform.OS === 'android') {
//             try {
//                 const granted = await PermissionsAndroid.request(
//                     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
//                 );
//                 return granted === PermissionsAndroid.RESULTS.GRANTED;
//             } catch (err) {
//                 return false;
//             }
//         }
//         return true;
//     };

//     const setupTTS = () => {
//         Tts.setDefaultLanguage('en-US');
//         Tts.setDefaultRate(0.5);
//     };

//     const setupInterview = async () => {
//         try {
//             const systemPrompt = `You are a professional HR interviewer. 
//         Candidate Name: ${context.userName || "Venu"}, 
//         Job Role: ${context.targetRole || "Software Developer"}. 
//         Action: Greet the candidate warmly and ask the first technical question about ${context.targetRole}.`;

//             await sendToAI(systemPrompt);
//         } catch (e) {
//             setAiText("Setup Failed. Restart the app.");
//         }
//     };

//     // ✅ Replace sendToAI with this
//     const sendToAI = async (userMessage: string) => {
//         try {
//             const response = await fetch(
//                 `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB_fh8LY9l04WIEj3vjdPbbkQ0CWetTrWE`,
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         contents: [{ parts: [{ text: userMessage }] }]
//                     })
//                 }
//             );

//             const data = await response.json();
//             console.log("Gemini Response:", JSON.stringify(data));

//             const text = data.candidates[0].content.parts[0].text;
//             setAiText(text);
//             Tts.stop();
//             Tts.speak(text);
//         } catch (error) {
//             console.error("Gemini Error:", error);
//             setAiText("Connection lost. Please check internet.");
//         }
//     };
//     const startListening = async () => {
//         Tts.stop();
//         try {
//             await Voice.start('en-US');
//         } catch (e) {
//             console.error("Start Voice Error:", e);
//         }
//     };

//     const stopListening = async () => {
//         try {
//             const isVoiceReady = useRef(false);
//             if (!isVoiceReady.current) return;
//             await Voice.stop();

//         } catch (e) {
//             console.error("Stop Voice Error:", e);
//         }
//     };

//     const onSpeechResults = (e: any) => {
//         if (e.value && e.value.length > 0) {
//             sendToAI(e.value[0]);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>{context.targetRole} Interview</Text>

//             <ScrollView style={styles.aiBox} contentContainerStyle={{ paddingBottom: 20 }}>
//                 <Text style={styles.aiText}>{aiText}</Text>
//             </ScrollView>

//             <View style={styles.controls}>
//                 <TouchableOpacity
//                     style={[styles.micBtn, isListening && styles.micBtnActive]}
//                     onPressIn={startListening}
//                     onPressOut={stopListening}
//                     activeOpacity={0.8}
//                 >
//                     <Text style={styles.micEmoji}>{isListening ? "🎙️" : "🎤"}</Text>
//                 </TouchableOpacity>

//                 <Text style={styles.infoText}>
//                     {isListening ? "I'm listening..." : "Hold to Talk"}
//                 </Text>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#0A0A0A', padding: 25, alignItems: 'center' },
//     header: { color: '#BB86FC', fontSize: 22, fontWeight: 'bold', marginTop: 40, letterSpacing: 1, textTransform: 'capitalize' },
//     aiBox: { backgroundColor: '#1A1A1A', width: '100%', borderRadius: 20, marginTop: 30, padding: 25, maxHeight: '50%' },
//     aiText: { color: '#E0E0E0', fontSize: 18, lineHeight: 28 },
//     controls: { alignItems: 'center', marginTop: 40 },
//     micBtn: { backgroundColor: '#121212', width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#BB86FC', elevation: 15 },
//     micBtnActive: { backgroundColor: '#BB86FC', borderColor: '#FFF' },
//     micEmoji: { fontSize: 35 },
//     infoText: { color: '#888', marginTop: 20, fontSize: 16 }
// });



import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';

const OPENROUTER_KEY = "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";

// ✅ CORRECT model name for OpenRouter
const MODEL = "google/gemini-2.0-flash-lite-001";

export const Interview = () => {
    const route = useRoute();
    const { context }: any = route.params;

    const [aiText, setAiText] = useState("Initializing Interviewer...");
    const [isListening, setIsListening] = useState(false);
    const voiceRef = useRef<any>(null); // ✅ Store Voice in ref to avoid null issues

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            const hasPermission = await requestPermission();
            if (!mounted) return;

            if (hasPermission) {
                setupTTS();
                await initVoice(); // ✅ Wait for voice to init
                setupInterview();
            } else {
                setAiText("Microphone permission denied.");
            }
        };

        init();

        return () => {
            mounted = false;
            Tts.stop();
            try {
                Voice.destroy().then(() => {
                    Voice.removeAllListeners();
                }).catch(() => {});
            } catch (e) {}
        };
    }, []);

    // ✅ Initialize Voice properly
const initVoice = async () => {
    try {
        // ✅ Remove isAvailable check - directly set listeners
        Voice.onSpeechStart = () => setIsListening(true);
        Voice.onSpeechEnd = () => setIsListening(false);
        Voice.onSpeechError = (e: any) => {
            console.log("Voice Error:", e);
            setIsListening(false);
        };
        Voice.onSpeechResults = (e: any) => {
            if (e.value && e.value.length > 0) {
                sendToAI(e.value[0]);
            }
        };
        voiceRef.current = Voice;
        console.log("Voice initialized successfully!"); // ✅ Check this in logs
    } catch (e) {
        console.log("Voice init error:", e);
    }
};

    const requestPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                return false;
            }
        }
        return true;
    };

    const setupTTS = () => {
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.5);
    };

    const setupInterview = async () => {
        const systemPrompt = `You are a professional HR interviewer. 
        Candidate Name: ${context.userName || "Venu"}, 
        Job Role: ${context.targetRole || "Software Developer"},
        Experience: ${context.experienceLevel || "Fresher"},
        Skills: ${context.userSkills || "General"}.
        Greet the candidate warmly and ask the first interview question. Keep it short and clear.`;

        await sendToAI(systemPrompt);
    };

    const sendToAI = async (userMessage: string) => {
        try {
            setAiText("Thinking...");

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENROUTER_KEY}`,
                    "HTTP-Referer": "https://jobmeet.app",
                    "X-Title": "JobMeet Interview"
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [{ role: "user", content: userMessage }],
                    max_tokens: 300
                }),
            });

            const data = await response.json();
            console.log("Response:", JSON.stringify(data));

            if (!response.ok) {
                console.error("API Error:", JSON.stringify(data));
                // ✅ Try fallback model if first fails
                await sendToAIFallback(userMessage);
                return;
            }

            const text = data?.choices?.[0]?.message?.content;
            if (!text) {
                setAiText("No response. Please try again.");
                return;
            }

            setAiText(text);
            Tts.stop();
            Tts.speak(text);
        } catch (error) {
            console.error("Fetch Error:", error);
            setAiText("Network error. Check internet.");
        }
    };

    // ✅ Fallback model if main model fails
    const sendToAIFallback = async (userMessage: string) => {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENROUTER_KEY}`,
                },
                body: JSON.stringify({
                    model: "mistralai/mistral-7b-instruct:free", // ✅ Free fallback model
                    messages: [{ role: "user", content: userMessage }],
                    max_tokens: 300
                }),
            });

            const data = await response.json();
            const text = data?.choices?.[0]?.message?.content;

            if (text) {
                setAiText(text);
                Tts.stop();
                Tts.speak(text);
            } else {
                setAiText("Error: " + JSON.stringify(data?.error || "Unknown error"));
            }
        } catch (e) {
            setAiText("Both models failed. Check API key.");
        }
    };

    // ✅ Fixed Voice start - using voiceRef
   const startListening = async () => {
    Tts.stop();
    
    // Safety check to see if the native module exists
    if (!Voice) {
        setAiText("Voice module not loaded. Restart the app.");
        return;
    }

    try {
        await Voice.start('en-US');
    } catch (e: any) {
        console.error("Start Voice Error:", e);
        // If you see "Speech recognition not available", the Google app is missing/disabled
    }
};

    // ✅ Fixed Voice stop - using voiceRef
    const stopListening = async () => {
        if (!voiceRef.current) return;
        try {
            await Voice.stop();
        } catch (e: any) {
            console.error("Stop Voice Error:", e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{context.targetRole} Interview</Text>

            <ScrollView style={styles.aiBox} contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.aiText}>{aiText}</Text>
            </ScrollView>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.micBtn, isListening && styles.micBtnActive]}
                    onPressIn={startListening}
                    onPressOut={stopListening}
                    activeOpacity={0.8}
                >
                    <Text style={styles.micEmoji}>{isListening ? "🎙️" : "🎤"}</Text>
                </TouchableOpacity>

                <Text style={styles.infoText}>
                    {isListening ? "I'm listening..." : "Hold to Talk"}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0A0A', padding: 25, alignItems: 'center' },
    header: { color: '#BB86FC', fontSize: 22, fontWeight: 'bold', marginTop: 40, letterSpacing: 1, textTransform: 'capitalize' },
    aiBox: { backgroundColor: '#1A1A1A', width: '100%', borderRadius: 20, marginTop: 30, padding: 25, maxHeight: '50%' },
    aiText: { color: '#E0E0E0', fontSize: 18, lineHeight: 28 },
    controls: { alignItems: 'center', marginTop: 40 },
    micBtn: { backgroundColor: '#121212', width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#BB86FC', elevation: 15 },
    micBtnActive: { backgroundColor: '#BB86FC', borderColor: '#FFF' },
    micEmoji: { fontSize: 35 },
    infoText: { color: '#888', marginTop: 20, fontSize: 16 }
});
// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, PermissionsAndroid, Platform } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import Tts from 'react-native-tts';
// import Voice from '@react-native-voice/voice';

// // ✅ OpenRouter API - No restrictions, Always works!
// const OPENROUTER_KEY = "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"; // 🔑 Paste your OpenRouter key here

// export const Interview = () => {
//     const route = useRoute();
//     const { context }: any = route.params;

//     const [aiText, setAiText] = useState("Initializing Interviewer...");
//     const [isListening, setIsListening] = useState(false);
//     const isVoiceReady = useRef(false); // ✅ Correct place - outside any function

//     useEffect(() => {
//         const init = async () => {
//             const hasPermission = await requestPermission();
//             if (hasPermission) {
//                 setupTTS();
//                 setupVoice();
//                 setupInterview();
//             } else {
//                 setAiText("Microphone permission denied.");
//             }
//         };
//         init();

//         return () => {
//             Tts.stop();
//             Voice.destroy().then(() => {
//                 isVoiceReady.current = false;
//                 Voice.removeAllListeners();
//             }).catch(e => console.log("Destroy error:", e));
//         };
//     }, []);

//     // ✅ Voice setup separately
//     const setupVoice = () => {
//         try {
//             Voice.onSpeechStart = () => setIsListening(true);
//             Voice.onSpeechEnd = () => setIsListening(false);
//             Voice.onSpeechResults = onSpeechResults;
//             Voice.onSpeechError = (e) => {
//                 console.log("Voice Error:", e);
//                 setIsListening(false);
//             };
//             isVoiceReady.current = true;
//         } catch (e) {
//             console.log("Voice setup error:", e);
//         }
//     };

//     const requestPermission = async () => {
//         if (Platform.OS === 'android') {
//             try {
//                 const granted = await PermissionsAndroid.request(
//                     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
//                 );
//                 return granted === PermissionsAndroid.RESULTS.GRANTED;
//             } catch (err) {
//                 return false;
//             }
//         }
//         return true;
//     };

//     const setupTTS = () => {
//         Tts.setDefaultLanguage('en-US');
//         Tts.setDefaultRate(0.5);
//     };

//     const setupInterview = async () => {
//         const systemPrompt = `You are a professional HR interviewer. 
//         Candidate Name: ${context.userName || "Venu"}, 
//         Job Role: ${context.targetRole || "Software Developer"},
//         Experience: ${context.experienceLevel || "Fresher"},
//         Skills: ${context.userSkills || "General"}.
//         Greet the candidate warmly and ask the first interview question. Keep it short.`;

//         await sendToAI(systemPrompt);
//     };

//     // ✅ Using OpenRouter - works without any restrictions
//     const sendToAI = async (userMessage: string) => {
//         try {
//             setAiText("Thinking...");

//             const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${OPENROUTER_KEY}`,
//                 },
//                 body: JSON.stringify({
//                     model: "google/gemini-2.0-flash-exp:free",
//                     messages: [{ role: "user", content: userMessage }]
//                 }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 console.error("API Error:", JSON.stringify(errorData));
//                 setAiText(`Error ${response.status}. Check your API key.`);
//                 return;
//             }

//             const data = await response.json();
//             console.log("OpenRouter Response:", JSON.stringify(data));

//             const text = data?.choices?.[0]?.message?.content;

//             if (!text) {
//                 setAiText("No response. Please try again.");
//                 return;
//             }

//             setAiText(text);
//             Tts.stop();
//             Tts.speak(text); // ✅ AI speaks the question
//         } catch (error) {
//             console.error("Fetch Error:", error);
//             setAiText("Network error. Please check internet.");
//         }
//     };

//     // ✅ Fixed - no useRef inside function!
//     const startListening = async () => {
//         Tts.stop();
//         if (!isVoiceReady.current) return;
//         try {
//             await Voice.start('en-US');
//         } catch (e) {
//             console.error("Start Voice Error:", e);
//         }
//     };

//     // ✅ Fixed - no useRef inside function!
//     const stopListening = async () => {
//         if (!isVoiceReady.current) return;
//         try {
//             await Voice.stop();
//         } catch (e) {
//             console.error("Stop Voice Error:", e);
//         }
//     };

//     const onSpeechResults = (e: any) => {
//         if (e.value && e.value.length > 0) {
//             sendToAI(e.value[0]); // ✅ User answer sent to AI
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>{context.targetRole} Interview</Text>

//             <ScrollView style={styles.aiBox} contentContainerStyle={{ paddingBottom: 20 }}>
//                 <Text style={styles.aiText}>{aiText}</Text>
//             </ScrollView>

//             <View style={styles.controls}>
//                 <TouchableOpacity
//                     style={[styles.micBtn, isListening && styles.micBtnActive]}
//                     onPressIn={startListening}
//                     onPressOut={stopListening}
//                     activeOpacity={0.8}
//                 >
//                     <Text style={styles.micEmoji}>{isListening ? "🎙️" : "🎤"}</Text>
//                 </TouchableOpacity>

//                 <Text style={styles.infoText}>
//                     {isListening ? "I'm listening..." : "Hold to Talk"}
//                 </Text>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#0A0A0A', padding: 25, alignItems: 'center' },
//     header: { color: '#BB86FC', fontSize: 22, fontWeight: 'bold', marginTop: 40, letterSpacing: 1, textTransform: 'capitalize' },
//     aiBox: { backgroundColor: '#1A1A1A', width: '100%', borderRadius: 20, marginTop: 30, padding: 25, maxHeight: '50%' },
//     aiText: { color: '#E0E0E0', fontSize: 18, lineHeight: 28 },
//     controls: { alignItems: 'center', marginTop: 40 },
//     micBtn: { backgroundColor: '#121212', width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#BB86FC', elevation: 15 },
//     micBtnActive: { backgroundColor: '#BB86FC', borderColor: '#FFF' },
//     micEmoji: { fontSize: 35 },
//     infoText: { color: '#888', marginTop: 20, fontSize: 16 }
// });