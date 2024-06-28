import React, { useState, useEffect } from "react";
import {
  Dimensions,
  View,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Text,
  Alert,
} from "react-native";
import { useMutation } from "@apollo/client";
import { SIGNUP } from "../../services/Auth";
import {
  Colors,
  Fonts,
  Sizes
} from "../../constants/styles";
import {
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";

const { width } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {
  const [state, setState] = useState({
    userName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    securePassword: true,
    secureConfirmPassword: true,
    showEmailErrorMessage: false,
    showPasswordError: false, // State for password error message
  });

  const [signup, {
    loading,
    error
  }] = useMutation(SIGNUP);

  const updateState = (data) => setState(prevState => ({
    ...prevState,
    ...data
  }));

  const {
    userName,
    email,
    mobileNumber,
    password,
    confirmPassword,
    securePassword,
    secureConfirmPassword,
    showEmailErrorMessage,
    showPasswordError,
  } = state;

  // Function to handle dynamic password validation
  useEffect(() => {
    if (password !== '') {
      const isValid = validatePasswordFormat(password);
      updateState({
        showPasswordError: !isValid
      });
    }
  }, [password]);

  // Function to validate password format
  const validatePasswordFormat = (password) => {
    // Minimum eight characters, at least one uppercase letter, one special character, and one number:
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return pattern.test(password);
  };

  // Function to check if all required fields are filled
  const isFormValid = () => {
    return userName !== '' && email !== '' && mobileNumber !== '' && password !== '' && confirmPassword !== '';
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Basic email validation
    if (!validateEmailFormat(email)) {
      updateState({
        showEmailErrorMessage: true
      });
      return;
    }

    // Phone number validation
    if (!validatePhoneNumber(mobileNumber)) {
      Alert.alert("Error", "Invalid phone number. It should be exactly 10 digits.");
      return;
    }

    // Password validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert("Error", passwordError);
      return;
    }

    try {
      const {
        data
      } = await signup({
        variables: {
          firstName: userName,
          emailAddress: email,
          password: password,
          phoneNumber: mobileNumber,
        },
      });

      if (data) {
        Alert.alert("Sign up is successful");
        navigation.navigate('Signin');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Function to validate phone number format
  const validatePhoneNumber = (phoneNumber) => {
    const pattern = /^\d{10}$/;
    return pattern.test(phoneNumber);
  };

  // Function to validate email format
  const validateEmailFormat = (email) => {
    return email.includes('@') && email.endsWith('.com');
  };

  // Function to validate password format
  const validatePassword = (password) => {
    // Minimum eight characters, at least one uppercase letter, one special character, and one number:
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!pattern.test(password)) {
      return "Password must contain at least 8 characters, including at least one uppercase letter, one special character, and one number.";
    }
    return null;
  };

  const handleMobileNumberChange = (text) => {
    // Allow only numerical input
    const cleanedText = text.replace(/[^0-9]/g, '');
    // Update state with cleaned text
    updateState({
      mobileNumber: cleanedText
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <ImageBackground
        source={require('../../assets/images/bg.png')}
        style={{
          flex: 1,
          left: -width / 20.0,
        }}
      >
        <View style={{ flex: 1, right: -width / 20.0 }}>
          {header()}
          <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
            {userNameTextField()}
            {emailTextField()}
            {mobileNumberTextField()}
            {passwordTextField()}
            {confirmPasswordTextField()}
            {signupButton()}
            {orSigninWithDivider()}
            {socialMediaOptions()}
            {alreadyAccountInfo()}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );

  function alreadyAccountInfo() {
    return (
      <Text style={{
        textAlign: 'center',
        marginVertical: Sizes.fixPadding
      }}>
        <Text style={{ ...Fonts.grayColor15Bold }}>
          Already have account?{' '}
        </Text>
        <Text
          onPress={() => navigation.push('Signin')}
          style={{ ...Fonts.primaryColor15Bold }}
        >
          Sign in now
        </Text>
      </Text>
    );
  }

  function socialMediaOptions() {
    return (
      <View>
        <View style={styles.socialMediaOptionsWrapStyle}>
          {optionsShort({
            bgColor: '#4267B2',
            image: require('../../assets/images/icons/facebook.png'),
          })}
          {optionsShort({
            bgColor: '#1DA1F2',
            image: require('../../assets/images/icons/twitter.png'),
          })}
          {optionsShort({
            bgColor: '#EA4335',
            image: require('../../assets/images/icons/google.png')
          })}
        </View>
      </View>
    );
  }

  function optionsShort({ bgColor, image }) {
    return (
      <View style={{ ...styles.optionsShortWrapStyle, backgroundColor: bgColor, }}>
        <Image
          source={image}
          style={{ width: 20.0, height: 20.0, }}
          resizeMode="contain"
        />
      </View>
    );
  }

  function orSigninWithDivider() {
    return (
      <View style={styles.orSigninWithDividerStyle}>
        <View style={{
          flex: 1,
          backgroundColor: Colors.grayColor,
          height: 1.0,
        }} />
        <Text style={{ marginHorizontal: Sizes.fixPadding, ...Fonts.grayColor14Bold }}>
          Or sign in with
        </Text>
        <View style={{
          flex: 1,
          backgroundColor: Colors.grayColor,
          height: 1.0,
        }} />
      </View>
    );
  }

  function signupButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleSignup}
        style={[styles.signupButtonStyle, { opacity: isFormValid() ? 1 : 0.5 }]}
        disabled={!isFormValid() || loading}
      >
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
    );
  }

  function confirmPasswordTextField() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.iconWrapper}>
              <MaterialIcons name="lock" size={19} color={Colors.grayColor} />
            </View>
            <TextInput
              secureTextEntry={secureConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) => updateState({ confirmPassword: text })}
              placeholder="Confirm Password"
              placeholderTextColor={Colors.grayColor}
              selectionColor={Colors.primaryColor}
              style={{
                marginLeft: Sizes.fixPadding,
                ...Fonts.blackColor15Bold, flex: 1
              }}
            />
          </View>
          <MaterialCommunityIcons
            name={secureConfirmPassword ? "eye-off" : "eye"}
            size={19}
            color={Colors.grayColor}
            onPress={() => updateState({ secureConfirmPassword: !secureConfirmPassword })}
          />
        </View>
        <View style={{
          backgroundColor: Colors.grayColor, height: 1.5,
          marginVertical: Sizes.fixPadding - 5.0,
        }} />
      </View>
    );
  }

  function passwordTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name="lock" size={19} color={Colors.grayColor} />
          </View>
          <TextInput
            secureTextEntry={securePassword}
            value={password}
            onChangeText={(text) => updateState({ password: text })}
            placeholder="Password"
            placeholderTextColor={Colors.grayColor}
            selectionColor={Colors.primaryColor}
            style={{
              marginLeft: Sizes.fixPadding,
              ...Fonts.blackColor15Bold, flex: 1
            }}
          />
          <MaterialCommunityIcons
            name={securePassword ? "eye-off" : "eye"}
            size={19}
            color={Colors.grayColor}
            onPress={() => updateState({ securePassword: !securePassword })}
          />
        </View>
        <View style={{
          backgroundColor: Colors.grayColor, height: 1.5,
          marginVertical: Sizes.fixPadding - 5.0,
        }} />
        {showPasswordError && (
          <View>
            <Text style={{ ...Fonts.grayColor14Bold, color: 'red', marginTop: 10 }}>
              Invalid password format
            </Text>
            <Text style={{ ...Fonts.grayColor14Bold, color: 'red', marginTop: 5 }}>
              Password must contain at least 8 characters, including at least one uppercase letter, one special character, and one number.
            </Text>
          </View>
        )}
      </View>
    );
  }
  

  function mobileNumberTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name="phone-android" size={19} color={Colors.grayColor} />
          </View>
          <TextInput
            value={mobileNumber}
            onChangeText={handleMobileNumberChange}
            placeholder="Mobile Number"
            placeholderTextColor={Colors.grayColor}
            selectionColor={Colors.primaryColor}
            keyboardType="numeric"
            maxLength={10}
            style={{
              marginLeft: Sizes.fixPadding,
              ...Fonts.blackColor15Bold, flex: 1
            }}
          />
        </View>
        <View style={{
          backgroundColor: Colors.grayColor, height: 1.5,
          marginVertical: Sizes.fixPadding - 5.0,
        }} />
      </View>
    );
  }

  function emailTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name="email" size={19} color={Colors.grayColor} />
          </View>
          <TextInput
            value={email}
            onChangeText={(text) => updateState({ email: text, showEmailErrorMessage: !validateEmailFormat(text) })}
            placeholder="Email"
            placeholderTextColor={Colors.grayColor}
            selectionColor={Colors.primaryColor}
            style={{
              marginLeft: Sizes.fixPadding,
              ...Fonts.blackColor15Bold, flex: 1
            }}
          />
        </View>
        <View style={{
          backgroundColor: Colors.grayColor, height: 1.5,
          marginVertical: Sizes.fixPadding - 5.0,
        }} />
        {showEmailErrorMessage && (
          <Text style={{ ...Fonts.grayColor14Bold, color: 'red', marginTop: 10 }}>
           Invalid email format. The email must contain "@" and ".com" at the end.
          </Text>
        )}
      </View>
    );
  }

  function userNameTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconWrapper}>
            <FontAwesome name="user-o" size={19} color={Colors.grayColor} />
          </View>
          <TextInput
            value={userName}
            onChangeText={(text) => updateState({ userName: text })}
            placeholder="User Name"
            placeholderTextColor={Colors.grayColor}
            selectionColor={Colors.primaryColor}
            style={{
              marginLeft: Sizes.fixPadding,
              ...Fonts.blackColor15Bold, flex: 1
            }}
          />
        </View>
        <View style={{
          backgroundColor: Colors.grayColor, height: 1.5,
          marginVertical: Sizes.fixPadding - 5.0,
        }} />
      </View>
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <MaterialIcons name="arrow-back-ios" size={24} color={Colors.blackColor}
          onPress={() => navigation.pop()}
          style={{ position: 'absolute', left: 20.0, }}
        />
        <Text style={{ ...Fonts.blackColor22Bold }}>
          Create Account
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    paddingVertical: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonStyle: {
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    height: 56.0,
    marginVertical: Sizes.fixPadding * 2.0,
  },
  orSigninWithDividerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.fixPadding * 2.0,
  },
  optionsShortWrapStyle: {
    height: 40.0,
    width: 40.0, borderRadius: 20.0, alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  socialMediaOptionsWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.fixPadding * 7.0,
  },
  iconWrapper: {
    height: 25.0,
    width: 25.0,
    borderRadius: 12.5,
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SignupScreen;
