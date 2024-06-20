import React, { useState } from "react";
import { View, ScrollView, ImageBackground, Dimensions, StyleSheet, TouchableOpacity, Text, Keyboard } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Circle } from 'react-native-animated-spinkit';
import { Modal } from 'react-native-paper';
import MyStatusBar from "../../components/myStatusBar";
import OTPField from 'react-native-otp-field';

const { width } = Dimensions.get('window');

const VerificationScreen = ({ navigation }) => {

    const [otpInput, setotpInput] = useState('');
    const [isLoading, setisLoading] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <ImageBackground
                source={require('../../assets/images/bg.png')}
                style={{
                    flex: 1,
                    left: -width / 20.0,
                    alignSelf: 'stretch'
                }}
            >
                <View style={{ flex: 1, right: -width / 20.0 }}>
                    {header()}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {verifyInfo()}
                        {otpInfo()}
                        {getStartedButton()}
                    </ScrollView>
                </View>
            </ImageBackground>
            {loading()}
        </View>
    )

    function loading() {
        return (
            <Modal
                visible={isLoading}
                onDismiss={() => { }}
            >
                <View style={styles.dialogStyle}>
                    <Circle size={50} color={Colors.primaryColor} />
                    <Text style={{
                        ...Fonts.grayColor14Bold,
                        marginTop: Sizes.fixPadding * 2.5
                    }}>
                        Please Wait..
                    </Text>
                </View>
            </Modal>
        );
    }

    function getStartedButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    setisLoading(true)
                    setTimeout(() => {
                        setisLoading(false)
                        navigation.push('BottomTabBar')
                    }, 2000);
                }}
                style={styles.getStartedButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                    Get Started
                </Text>
            </TouchableOpacity>
        )
    }

    function otpInfo() {
        return (
            <View>
                <Text style={{ marginTop: Sizes.fixPadding + 5.0, textAlign: 'center', ...Fonts.blackColor14Bold }}>
                    Enter OTP code here
                </Text>
                <View style={{ marginHorizontal: Sizes.fixPadding * 5.0, marginTop: Sizes.fixPadding + 5.0, }}>
                    <OTPField
                        length={4}
                        value={otpInput}
                        onChange={(val) => {
                            setotpInput(val);
                            if (val.length == 4) {
                                Keyboard.dismiss();
                                setisLoading(true)
                                setTimeout(() => {
                                    setisLoading(false)
                                    navigation.push('BottomTabBar')
                                }, 2000);
                            }
                        }}
                        textFieldStyle={{ ...styles.textFieldStyle }}
                        cursorColor={Colors.primaryColor}
                        selectionColor={Colors.primaryColor}
                    />
                </View>
            </View>
        )
    }

    function verifyInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding, alignItems: 'center' }}>
                <Text style={{ ...Fonts.blackColor18Bold }}>
                    Verify your mobile number
                </Text>
                <Text style={{ textAlign: 'center', ...Fonts.blackColor13Medium }}>
                    {`We have an SMS with a code to\nnumber +91 8562312365`}
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
                    style={{ alignSelf: 'flex-start' }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 5.0,
    },
    getStartedButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding * 3.0,
    },
    textFieldStyle: {
        borderRadius: Sizes.fixPadding - 5.0,
        backgroundColor: Colors.whiteColor,
        ...Fonts.blackColor16Bold,
        width: width / 8.0,
        height: width / 8.0,
    },
    dialogStyle: {
        backgroundColor: Colors.whiteColor,
        alignItems: 'center',
        width: '85%',
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding * 2.0
    }
});

export default VerificationScreen;