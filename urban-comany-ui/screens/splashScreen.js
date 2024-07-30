import React, { useCallback } from "react";
import { View, StyleSheet, Image, BackHandler, Text } from "react-native";
import { Colors } from "../constants/styles";
import { useFocusEffect } from "@react-navigation/native";
import MyStatusBar from "../components/myStatusBar";

const SplashScreen = ({ navigation }) => {

    const backAction = () => {
        BackHandler.exitApp();
        return true;
    }

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [backAction])
    );

    setTimeout(() => {
        navigation.push('Onboarding');
    }, 2000);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={styles.pageStyle}>
                <Image
                    source={require('../assets/images/Sulopa_Whitelogo.png')}
                    style={{ height: 100.0, width: 230 }}
                />
                <Text style={{color: 'white', fontSize: 20, fontWeight: '500'}}>Urban Services</Text>
            </View>
        </View>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    pageStyle: {
        flex: 1,
        backgroundColor: Colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    }
});