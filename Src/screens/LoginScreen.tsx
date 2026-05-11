import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { TextInput } from "react-native"
import { useState } from "react"
import { StyleSheet } from "react-native"
import { ImageBackground } from "react-native"
import { Alert } from "react-native"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import React from 'react';
import { useNavigation } from "@react-navigation/native"

const authInstance = auth()

GoogleSignin.configure({
    webClientId: '597482047189-a41ogk032lv9sl79qb7c0ebn81114ebo.apps.googleusercontent.com'
});
export const LoginScreen = () => {

    const navigation = useNavigation()

    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLogin, setIsLogin] = useState(false);



    const handleLogin = async () => {
        if (!Email || !Password) {
            Alert.alert("Please enter the email and password")
            return;
        }
        try {
            await authInstance.signInWithEmailAndPassword(Email, Password)
            const user = authInstance.currentUser;
            if (user?.emailVerified) {
                navigation.navigate("Dashboard" as never)
            } else {
                Alert.alert("Please verify your email before logging in.")
            }
        }

        catch (error) {
            Alert.alert("Login failed")
        }
    }

    const handleSignUp = async () => {

        const emailPattern = /^[a-zA-Z0-9]+@gmail\.com$/;
        if (!Email || !Password || !confirmPassword) {
            Alert.alert("Please fill in all fields")
            return;
        }
        if (!emailPattern.test(Email)) {
            Alert.alert("Please enter a valid Gmail address")
            return;
        }
        if (Password !== confirmPassword) {
            Alert.alert("Passwords do not match")
            return;
        }
        try {
            const userCredential = await authInstance.createUserWithEmailAndPassword(Email, Password)
            Alert.alert("Sign up successful")
            await userCredential.user.sendEmailVerification()
            Alert.alert("Verification email sent. Please check your inbox.")
            setIsLogin(false)
        }
        catch (error) {
            Alert.alert("Sign up failed")
        }
    }


    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const response = await GoogleSignin.signIn();
            const idToken = response.data?.idToken;
            if (!idToken) {
                throw new Error("Google Sign-In failed: No ID token received");
            }
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            await authInstance.signInWithCredential(googleCredential);

            navigation.navigate("Dashboard" as never)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            Alert.alert("Google Sign-In failed", message);
        }
    }
    return (
        <ImageBackground source={require('../assets/image.png')} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }} >
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>

                <View style={styles.contener}>
                    <TextInput
                        placeholder="Enter the Email"
                        placeholderTextColor="#000"
                        value={Email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="emailAddress"
                        style={styles.input}
                    />

                    {isLogin && (
                        <TextInput
                            placeholder="Create the Password"
                            placeholderTextColor="#000"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                            style={styles.input}
                        />
                    )}

                    <TextInput
                        placeholder={isLogin ? "Confirm the Password" : "Enter the Password"}
                        placeholderTextColor="#000"
                        value={Password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="password"
                        style={styles.input}
                    />

                    <TouchableOpacity onPress={isLogin ? handleSignUp : handleLogin}>
                        <Text style={styles.button}>{isLogin ? "Sign Up" : "Login"}</Text>
                    </TouchableOpacity>


                    <View style={styles.buttoncontener}>
                        <Text style={{ color: "white" }}> {isLogin ? "Already have an account?" : "Don't have an account?"}</Text>
                        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                            <Text style={{ color: "blue" }}>{isLogin ? "Login" : "Sign Up"}</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={styles.googleButtonContainer}>
                        <TouchableOpacity onPress={handleGoogleSignIn}>
                            <Text style={styles.googletext}>Sign in with Google </Text>

                        </TouchableOpacity>
                    </View>
                </View>

            </SafeAreaView>
        </ImageBackground>
    )
}


const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#FFF",
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 10,
        color: "#000",
    },

    contener: {
        width: "80%",
        gap: 10,
    },
    button: {
        color: "#FFF",
        textAlign: "center",
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5
    },

    buttonText: {
        backgroundColor: "blue",
        padding: 10,
        marginTop: 10,
        borderRadius: 5
    },
    buttoncontener: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        marginTop: 10,

    },
    googleButtonContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    googletext: {
        color: "#0c0b0b",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 20,
    }
})