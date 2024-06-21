import React, { useState, useCallback } from "react";
import { Text, BackHandler, StyleSheet, Image, View, Platform } from "react-native";
import { Colors, Fonts, Sizes } from "../constants/styles";
import HomeScreen from "../screens/home/homeScreen";
import ProfileScreen from "../screens/profile/profileScreen";
import NearByScreen from "../screens/nearBy/nearByScreen";
import AppointmentScreen from "../screens/appointment/appointmentScreen";
import { useFocusEffect } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyStatusBar from "./myStatusBar";

const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation }) => {

    const backAction = () => {
        if (Platform.OS === "ios") {
            navigation.addListener("beforeRemove", (e) => {
                e.preventDefault();
            });
        } else {
            backClickCount == 1 ? BackHandler.exitApp() : _spring();
            return true;
        }
    };

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            navigation.addListener("gestureEnd", backAction);
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", backAction);
                navigation.removeListener("gestureEnd", backAction);
            };
        }, [backAction])
    );

    function _spring() {
        setBackClickCount(1);
        setTimeout(() => {
            setBackClickCount(0)
        }, 1000)
    }

    const [backClickCount, setBackClickCount] = useState(0);

    return (
        <View style={{ flex: 1 }}>
            <MyStatusBar />
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: Colors.primaryColor,
                    tabBarInactiveTintColor: Colors.grayColor,
                    tabBarShowLabel: false,
                    tabBarHideOnKeyboard: true,
                    tabBarStyle: { backgroundColor: Colors.whiteColor, height: 65, },
                    tabBarItemStyle: { height: 65 }
                }}
            >
                <Tab.Screen
                    name={'Home'}
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color }) =>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={require('../assets/images/icons/home.png')}
                                    style={{ width: 22.0, height: 22.0, tintColor: color, resizeMode: 'contain' }}
                                />
                                <Text style={{ color: color, ...styles.labelStyle }}>
                                    Home
                                </Text>
                            </View>
                    }}
                />
                <Tab.Screen
                    name={'NearBy'}
                    component={NearByScreen}
                    options={{
                        tabBarIcon: ({ color }) =>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={require('../assets/images/icons/nearby.png')}
                                    style={{ width: 22.0, height: 22.0, tintColor: color, resizeMode: 'contain' }}
                                    resizeMode="contain"
                                />
                                <Text style={{ color: color, ...styles.labelStyle }}>
                                    NearBy
                                </Text>
                            </View>
                    }}
                />
                <Tab.Screen
                    name={'Appointment'}
                    component={AppointmentScreen}
                    options={{
                        tabBarIcon: ({ color }) =>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={require('../assets/images/icons/appointment.png')}
                                    style={{ width: 22.0, height: 22.0, tintColor: color, resizeMode: 'contain' }}
                                />
                                <Text style={{ color: color, ...styles.labelStyle }}>
                                    Appointment
                                </Text>
                            </View>
                    }}
                />
                <Tab.Screen
                    name={'Profile'}
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ color }) =>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={require('../assets/images/icons/profile.png')}
                                    style={{ width: 22.0, height: 22.0, tintColor: color, resizeMode: 'contain' }}
                                />
                                <Text style={{ color: color, ...styles.labelStyle }}>
                                    Profile
                                </Text>
                            </View>
                    }}
                />
            </Tab.Navigator>
            {exitInfo()}
        </View>
    )

    function exitInfo() {
        return (
            backClickCount == 1
                ?
                <View style={[styles.animatedView]}>
                    <Text style={{ ...Fonts.whiteColor12Medium }}>
                        Press back once again to exit
                    </Text>
                </View>
                :
                null
        )
    }
}

export default TabNavigator;

const styles = StyleSheet.create({
    animatedView: {
        backgroundColor: "#333333",
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
    },
    labelStyle: {
        fontSize: 13.0,
        fontFamily: 'Fahkwang_Bold',
        marginTop: Sizes.fixPadding - 7.0
    }
})