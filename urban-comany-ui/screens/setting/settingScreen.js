import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";

const SettingScreen = ({ navigation }) => {

    const [state, setState] = useState({
        notificationSwitch: true,
        callSwitch: false,
        locationSwitch: true,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        notificationSwitch,
        callSwitch,
        locationSwitch,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {settingTitle({ title: 'Settings' })}
                    <View style={{ marginBottom: Sizes.fixPadding + 3.0 }}>
                        {notificationsInfo()}
                        {callInfo()}
                        {locationInfo()}
                    </View>
                    {settingTitle({ title: 'General' })}
                    <View style={{ marginTop: Sizes.fixPadding + 3.0, }}>
                        <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor14Medium }}>
                            About app
                        </Text>
                        <Text
                            onPress={() => navigation.push('PrivacyPolicy')}
                            style={{
                                marginTop: Sizes.fixPadding - 5.0,
                                marginHorizontal: Sizes.fixPadding * 2.0,
                                ...Fonts.blackColor14Medium
                            }}
                        >
                            Privacy Policy
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </View>
    )

    function locationInfo() {
        return (
            <View style={styles.settingDetailWrapStyle}>
                <Text style={{ ...Fonts.blackColor14Medium }}>
                    Location
                </Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => updateState({ locationSwitch: !locationSwitch })}
                    style={{
                        backgroundColor: locationSwitch ? Colors.primaryColor : Colors.grayColor,
                        alignItems: locationSwitch ? 'flex-end' : 'flex-start',
                        ...styles.switchStyle,
                    }}>
                    <View style={styles.switchInnerCircleStyle} />
                </TouchableOpacity>
            </View>
        )
    }

    function callInfo() {
        return (
            <View style={styles.settingDetailWrapStyle}>
                <Text style={{ ...Fonts.blackColor14Medium }}>
                    Call
                </Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => updateState({ callSwitch: !callSwitch })}
                    style={{
                        backgroundColor: callSwitch ? Colors.primaryColor : Colors.grayColor,
                        alignItems: callSwitch ? 'flex-end' : 'flex-start',
                        ...styles.switchStyle,
                    }}>
                    <View style={styles.switchInnerCircleStyle} />
                </TouchableOpacity>
            </View>
        )
    }

    function notificationsInfo() {
        return (
            <View style={styles.settingDetailWrapStyle}>
                <Text style={{ ...Fonts.blackColor14Medium }}>
                    Notifications
                </Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => updateState({ notificationSwitch: !notificationSwitch })}
                    style={{
                        backgroundColor: notificationSwitch ? Colors.primaryColor : Colors.grayColor,
                        alignItems: notificationSwitch ? 'flex-end' : 'flex-start',
                        ...styles.switchStyle,
                    }}>
                    <View style={styles.switchInnerCircleStyle} />
                </TouchableOpacity>
            </View>
        )
    }

    function settingTitle({ title }) {
        return (
            <View style={styles.settingTitleWrapStyle}>
                <Text style={{ ...Fonts.blackColor15Bold }}>
                    {title}
                </Text>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons
                    name="arrow-back-ios"
                    size={22}
                    color={Colors.blackColor}
                    onPress={() => navigation.pop()}
                />
                <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor18Bold }}>
                    Setting
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 5.0
    },
    settingDetailWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: Sizes.fixPadding - 2.0,
    },
    settingTitleWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        paddingVertical: Sizes.fixPadding - 4.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding - 5.0,
        shadowColor:Colors.blackColor,
        shadowOpacity:0.1,
        shadowOffset:{width:0,height:1.5},
        shadowRadius:1,     
    },
    switchStyle: {
        width: 26.0,
        height: 17.0,
        borderRadius: 20.0,
        paddingHorizontal: Sizes.fixPadding - 8.0,
        justifyContent: 'center',
    },
    switchInnerCircleStyle: {
        width: 15.0,
        height: 15.0,
        borderRadius: 7.5,
        backgroundColor: Colors.whiteColor
    }
});

export default SettingScreen;