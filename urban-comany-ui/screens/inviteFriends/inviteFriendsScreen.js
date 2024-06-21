import React, { useState, createRef } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";

const InviteFriendsScreen = ({ navigation }) => {

    const [state, setState] = useState({
        code: 'D1Q7PK',
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        code
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                    {suggestionForInviteFriends()}
                    {codeInfo()}
                    {shareButton()}
                </ScrollView>
            </View>
        </View>
    )

    function shareButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.shareButtonStyle}
                onPress={() => navigation.pop()}
            >
                <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                    Share
                </Text>
            </TouchableOpacity>
        )
    }

    function codeInfo() {

        const textInputRef = createRef();

        return (
            <View style={styles.codeInfoWrapStyle}>
                <TextInput
                    ref={textInputRef}
                    value={code}
                    onChangeText={(text) => updateState({ code: text })}
                    selectionColor={Colors.primaryColor}
                    style={{ flex: 1, ...Fonts.blackColor14Medium }}
                />
                <MaterialCommunityIcons
                    name="content-copy"
                    size={15}
                    color={Colors.blackColor}
                    onPress={() => textInputRef.current.focus()}
                />
            </View>
        )
    }

    function suggestionForInviteFriends() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ lineHeight: 18.0, textAlign: 'center', ...Fonts.blackColor16SemiBold }}>
                    {`Get discount vouchers by\ninviting your friends`}
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding, textAlign: 'center', ...Fonts.blackColor13Medium }}>
                    {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the`}
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
                    Invite Friends
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
    codeInfoWrapStyle: {
        flexDirection: 'row',
        backgroundColor: Colors.lightGrayColor,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding * 2.5,
        paddingVertical: Sizes.fixPadding - 3.0,
        paddingHorizontal: Sizes.fixPadding,
    },
    shareButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding,
    }
});

export default InviteFriendsScreen;