

// Is code ko Dashboard.tsx mein replace karle
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import auth from "@react-native-firebase/auth";

export const Dashboard = ({ navigation }: any) => {
    const [username, setUsername] = useState('User');
    const [jobRole, setJobRole] = useState('');
    const [experience, setExperience] = useState('Fresher');
    const [skills, setSkills] = useState('');

    useEffect(() => {
        const user = auth().currentUser;
        if (user) {
            const rawName = user.displayName || user.email?.split('@')[0] || 'User';
            const cleanName = rawName.replace(/[^a-zA-Z ]/g, '').trim();
            setUsername(cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase());
        }
    }, []);

    const startInterview = () => {
        if (!jobRole || !skills) {
            Alert.alert("Please fill all details!");
            return;
        }
        // AI ko bhejte waqt pura context bhej rahe hain
        const interviewContext = {
            userName: username,
            targetRole: jobRole,
            experienceLevel: experience,
            userSkills: skills
        };
        navigation.navigate("Interview", { context: interviewContext });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 50}}>
            <Text style={styles.mainTitle}>Setup Your Interview</Text>
            
            {/* User Greeting */}
            <View style={styles.greetCard}>
                <Text style={styles.greetText}>Welcome, {username}!</Text>
                <Text style={styles.subGreet}>Let's prepare your AI Interviwer.</Text>
            </View>

            {/* Input 1: Job Role */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Target Job Role</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="e.g. Frontend Developer" 
                    value={jobRole}
                    onChangeText={setJobRole}
                />
            </View>

            {/* Input 2: Experience (Modern Buttons) */}
            <Text style={styles.label}>Experience Level</Text>
            <View style={styles.row}>
                {['Fresher', 'Junior', 'Senior'].map((level) => (
                    <TouchableOpacity 
                        key={level}
                        style={[styles.chip, experience === level && styles.selectedChip]}
                        onPress={() => setExperience(level)}
                    >
                        <Text style={[styles.chipText, experience === level && styles.selectedChipText]}>{level}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Input 3: Skills */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Detailed Skills</Text>
                <TextInput 
                    style={[styles.input, {height: 80}]} 
                    placeholder="e.g. React Native, Redux, REST APIs" 
                    multiline
                    value={skills}
                    onChangeText={setSkills}
                />
            </View>

            <TouchableOpacity style={styles.startBtn} onPress={startInterview}>
                <Text style={styles.startBtnText}>Start Professional Interview</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 20 }, // Dark Theme for "Khatarnak" look
    mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 40, marginBottom: 20 },
    greetCard: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 15, marginBottom: 25 },
    greetText: { fontSize: 20, color: '#BB86FC', fontWeight: 'bold' },
    subGreet: { color: '#aaa', marginTop: 5 },
    inputGroup: { marginBottom: 20 },
    label: { color: '#eee', marginBottom: 8, fontSize: 16, fontWeight: '600' },
    input: { backgroundColor: '#2C2C2C', borderRadius: 10, padding: 15, color: '#fff', fontSize: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    chip: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, borderColor: '#BB86FC' },
    selectedChip: { backgroundColor: '#BB86FC' },
    chipText: { color: '#BB86FC' },
    selectedChipText: { color: '#000', fontWeight: 'bold' },
    startBtn: { backgroundColor: '#03DAC6', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    startBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});