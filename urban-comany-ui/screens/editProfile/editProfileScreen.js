import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Text, Image, Modal, Platform, ActivityIndicator, Alert } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_USER, GET_ACTIVE_CUSTOMER } from "../../services/Editprofile";
import { SET_CUSTOMER_PROFILE_PIC } from "../../services/Profile";

const EditProfileScreen = ({ navigation }) => {
    const [error, setError] = useState('');
    const [state, setState] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        showBottomSheet: false,
        profilePic: require('../../assets/images/users/user3.png'),
    })

    const updateState = (newData) => setState((prevState) => ({ ...prevState, ...newData }));

    const { firstName, lastName, phoneNumber, showBottomSheet, profilePic } = state;

    const [setCustomerProfilePic, { loading: picMutationLoading, error: picMutationError }] = useMutation(SET_CUSTOMER_PROFILE_PIC, {
        onCompleted: async (data) => {
            console.log("Profile picture updated successfully:", data);
            // Optionally, update the profile picture URL in your app state or refetch user data
        },
        onError: (error) => {
            console.error("Error updating profile picture:", error);
        },
    });


    // const pickImageFromCamera = async () => {
    //     const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    //     if (!permissionResult.granted) {
    //         alert("You've refused to allow this app to access your camera!");
    //         return;
    //     }

    //     const result = await ImagePicker.launchCameraAsync();
    // };

    // const pickImageFromGallery = async () => {
    //     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //     if (!permissionResult.granted) {
    //         alert("You've refused to allow this app to access your gallery!");
    //         return;
    //     }

    //     const result = await ImagePicker.launchImageLibraryAsync();
    // };

    const pickImageFromCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert("You've refused to allow this app to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();
        if (!result.canceled) {
            try {

                const response = await setCustomerProfilePic({
                    variables: {
                        file: {
                            uri: result.assets[0].uri,
                            type: 'image/jpeg', // Adjust MIME type if necessary
                            name: 'profile.jpg', // Adjust filename if necessary
                        },
                    },
                });

                console.log("Response from image upload:", response);
                // Handle response as needed
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                // Handle error (e.g., show an alert)
            }
        }
    };

    const pickImageFromGallery = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("You've refused to allow this app to access your gallery!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();
        
        if (!result.canceled) {
            setProfilePic({ uri: result.uri });
            uploadProfilePic(result.uri); // Call function to upload the image
        }
    };
    
    const { loading: queryLoading, error: queryError, data, refetch } = useQuery(GET_ACTIVE_CUSTOMER);

    useEffect(() => {
        if (data) {
            const { firstName, lastName, phoneNumber } = data.activeCustomer;
            setState((prevState) => ({
                ...prevState,
                firstName,
                lastName,
                phoneNumber,
            }));
        }
    }, [data]);

    const [updateCustomer, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_USER, {
        onCompleted: async (data) => {
            console.log("Profile updated successfully:", data);
            await refetch(); // Refetch the query to update the UI with the latest data
            navigation.pop();
        },
        onError: (error) => {
            console.error("Error updating profile:", error);
        },
    });

    const handleUpdateProfile = async () => {
        if(error === '') {
        try {
            await updateCustomer({
                variables: {
                    input: {
                        firstName,
                        lastName,
                        phoneNumber,
                    },
                },
            });
        } catch (err) {
            console.error("Error updating profile:", err);
        }
        }else{
            Alert.alert("Somthing went wrong")
        }
    };

    if (queryLoading) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          </View>
        );
      }
    if (queryError) return <Text style={styles.errorText}>Error loading user data</Text>;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                    {profilePicSection()}
                    {renderInputField("First Name", firstName, (text) => updateState({ firstName: text }))}
                    {renderInputField("Last Name", lastName, (text) => updateState({ lastName: text }))}
                    {renderInputField("Phone Number", phoneNumber, (text) => updateState({ phoneNumber: text }), "phone-pad", 10 , true)}
                    {updateProfileButton()}
                </ScrollView>
            </View>
            {changeProfilePicOptionsSheet()}
        </View>
    );

    function changeProfilePicOptionsSheet() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showBottomSheet}
                onRequestClose={() => {
                    updateState({ showBottomSheet: false });
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
                            <View style={{
                                backgroundColor: Colors.whiteColor,
                                paddingVertical: Sizes.fixPadding,
                            }}>
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
        );
    }

    function renderProfilePicOption(icon, text) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => updateState({ showBottomSheet: false })}
                style={{ marginVertical: Sizes.fixPadding, flexDirection: 'row', marginHorizontal: Sizes.fixPadding * 2.0 }}
            >
                <MaterialIcons name={icon} size={20} color={Colors.blackColor} />
                <Text style={{ lineHeight: 20.0, ...Fonts.blackColor14SemiBold, marginLeft: Sizes.fixPadding }}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }

    function updateProfileButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleUpdateProfile}
                style={styles.updateProfileButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                    {mutationLoading ? "Updating..." : "Update Profile"}
                </Text>
                {mutationError && <Text style={styles.errorText}>Error updating profile</Text>}
            </TouchableOpacity>
        );
    }

   

    function renderInputField(label, value, onChangeText, keyboardType = "default", maxLength=100 ,validateInput=false) {
        const handleTextChange = (text) => {
            onChangeText(text); // Call the onChangeText function to update state
    
            if (validateInput) {
                // Perform additional validation (if needed)
                const regex = /^[0-9]*$/;
                if (!regex.test(text) && text !== '') {
                    setError("you can only use numbers ");
                }else{
                    setError('');
                }
            }
        };
        return (
            <View style={styles.inputFieldContainer}>
                <Text style={styles.labelText}>{label}</Text>
                <TextInput
                    placeholder={`Enter ${label}`}
                    value={value}
                    onChangeText={handleTextChange}
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                />
                {label === "Phone Number" && error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
        )
    }

    // function emailInfo() {
    //     return (
    //         <View style={{
    //             marginHorizontal: Sizes.fixPadding * 2.0,
    //             marginVertical: Sizes.fixPadding
    //         }}>
    //             <Text style={{ ...Fonts.grayColor13SemiBold }}>
    //                 Email
    //             </Text>
    //             <TextInput
    //                 keyboardType="email-address"
    //                 placeholder="Enter Email"
    //                 value={email}
    //                 onChangeText={(text) => updateState({ email: text })}
    //                 placeholderTextColor={Colors.grayColor}
    //                 selectionColor={Colors.primaryColor}
    //                 style={styles.textFieldStyle}
    //             />
    //         </View>
    //     )
    // }


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
        );
    }
};

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
    },
    inputFieldContainer: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding,
    },
    labelText: {
        ...Fonts.grayColor13SemiBold,
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginVertical: Sizes.fixPadding,
    },
});

export default EditProfileScreen;
