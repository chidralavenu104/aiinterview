import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/LoginScreen";
import { Dashboard } from "../screens/Dashbord";
import { Interview } from "../screens/Interview";

 // default export hai

const Stack = createStackNavigator();

export const RootNavigetion = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="Interview" component={Interview} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};