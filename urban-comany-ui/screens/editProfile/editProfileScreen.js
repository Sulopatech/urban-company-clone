import React, { useState } from "react";
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Text, Image, Modal, Platform } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";

const EditProfileScreen = ({ navigation }) => {

    const [state, setState] = useState({
        userName: 'Samantha John',
        email: 'shahsamantha@gmail.com',
        mobileNumber: '(+91) 1234567890',
        password: '1234567890435',
        showBottomSheet: false,
        profilePic: require('../../assets/images/users/user3.png'),
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        userName,
        email,
        mobileNumber,
        password,
        showBottomSheet,
        profilePic
    } = state;

    const pickImageFromCamera = async () => {
        console.log("inside camera");
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert("You've refused to allow this app to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();
        if (!result.cancelled) {
            updateState({ profilePic: { uri: result.uri }, showBottomSheet: false });
        }
    };

    const pickImageFromGallery = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("You've refused to allow this app to access your gallery!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
            updateState({ profilePic: { uri: result.uri }, showBottomSheet: false });
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                    {profilePicSection()}
                    {userNameInfo()}
                    {emailInfo()}
                    {mobileNumberInfo()}
                    {passwordInfo()}
                    {updateProfileButton()}
                </ScrollView>
            </View>
            {changeProfilePicOptionsSheet()}
        </View>
    )

    function changeProfilePicOptionsSheet() {
        return (
            // <BottomSheet
            //     isVisible={showBottomSheet}
            //     containerStyle={{ backgroundColor: 'rgba(0.5, 0.50, 0, 0.50)' }}
            //     onBackdropPress={() => { updateState({ showBottomSheet: false }) }}
            // >
            <Modal
                animationType="slide"
                transparent={true}
                visible={showBottomSheet}
                onRequestClose={() => {
                    updateState({ showBottomSheet: false })
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        updateState({ showBottomSheet: false });
                    }}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View style={{ justifyContent: "flex-end", flex: 1 }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                            style={{ backgroundColor: Colors.whiteColor }}
                        >
                            <View
                                style={{
                                    backgroundColor: Colors.whiteColor,
                                    paddingVertical: Sizes.fixPadding,
                                }}
                            >
                                <Text style={{ ...Fonts.blackColor16Bold, textAlign: 'center' }}>
                                    Choose Option
                                </Text>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={pickImageFromCamera}
                                    style={{ marginVertical: Sizes.fixPadding, flexDirection: 'row', marginHorizontal: Sizes.fixPadding * 2.0 }}
                                >
                                    <MaterialIcons name="photo-camera" size={20} color={Colors.blackColor} />
                                    <Text style={{ lineHeight: 20.0, ...Fonts.blackColor14SemiBold, marginLeft: Sizes.fixPadding }}>
                                        Take picture
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={pickImageFromGallery}
                                    style={{ flexDirection: 'row', marginHorizontal: Sizes.fixPadding * 2.0 }}
                                >
                                    <MaterialIcons name="photo-library" size={20} color={Colors.blackColor} />
                                    <Text style={{ lineHeight: 20.0, ...Fonts.blackColor14SemiBold, marginLeft: Sizes.fixPadding }}>
                                        Select From Gallery
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    function updateProfileButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.pop()}
                style={styles.updateProfileButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                    Update Profile
                </Text>
            </TouchableOpacity>
        )
    }

    function passwordInfo() {
        return (
            <View style={{
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginVertical: Sizes.fixPadding
            }}>
                <Text style={{ ...Fonts.grayColor13SemiBold }}>
                    Password
                </Text>
                <TextInput
                    placeholder="Enter Password"
                    value={password}
                    onChangeText={(text) => updateState({ password: text })}
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    secureTextEntry={true}
                    style={styles.textFieldStyle}
                />
            </View>
        )
    }

    function mobileNumberInfo() {
        return (
            <View style={{
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginVertical: Sizes.fixPadding
            }}>
                <Text style={{ ...Fonts.grayColor13SemiBold }}>
                    Mobile Number
                </Text>
                <TextInput
                    keyboardType="phone-pad"
                    placeholder="Enter Mobile Number"
                    value={mobileNumber}
                    onChangeText={(text) => updateState({ mobileNumber: text })}
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                />
            </View>
        )
    }

    function emailInfo() {
        return (
            <View style={{
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginVertical: Sizes.fixPadding
            }}>
                <Text style={{ ...Fonts.grayColor13SemiBold }}>
                    Email
                </Text>
                <TextInput
                    keyboardType="email-address"
                    placeholder="Enter Email"
                    value={email}
                    onChangeText={(text) => updateState({ email: text })}
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                />
            </View>
        )
    }

    function userNameInfo() {
        return (
            <View style={{
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginVertical: Sizes.fixPadding
            }}>
                <Text style={{ ...Fonts.grayColor13SemiBold }}>
                    User Name
                </Text>
                <TextInput
                    placeholder="Enter User Name"
                    value={userName}
                    onChangeText={(text) => updateState({ userName: text })}
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                />
            </View>
        )
    }

    function profilePicSection() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => updateState({ showBottomSheet: true })}
                style={{ alignItems: 'center', alignSelf: 'center' }}
            >
                <Image
                    source={profilePic}
                    style={{ width: 90.0, height: 90.0, borderRadius: 45.0 }}
                />
                <View style={styles.addIconWrapStyle}>
                    <MaterialIcons
                        name="add"
                        color={Colors.whiteColor}
                        size={14}
                    />
                </View>
            </TouchableOpacity>
        );
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
                    Edit Profile
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
    addIconWrapStyle: {
        position: 'absolute',
        bottom: 0.0,
        marginLeft: Sizes.fixPadding * 2.0,
        right: 5.0,
        backgroundColor: Colors.primaryColor,
        width: 18.0, height: 18.0,
        borderRadius: 9.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    updateProfileButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding * 3.0,
    },
    textFieldStyle: {
        ...Fonts.blackColor14Medium,
        borderBottomColor: Colors.grayColor,
        borderBottomWidth: 1.5,
        paddingBottom: Platform.OS == 'ios' ? Sizes.fixPadding - 6.0 : 0,
        marginTop: Platform.OS == "ios" ? Sizes.fixPadding - 5.0 : null
    }
});

export default EditProfileScreen;