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
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    securePassword: true,
    secureConfirmPassword: true,
    showEmailErrorMessage: false,
    showPasswordError: false,
  });

  const [signup, { loading, error }] = useMutation(SIGNUP);

  const updateState = (data) => setState(prevState => ({
    ...prevState,
    ...data
  }));

  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    password,
    confirmPassword,
    securePassword,
    secureConfirmPassword,
    showEmailErrorMessage,
    showPasswordError,
  } = state;

  useEffect(() => {
    if (password !== '') {
      const isValid = validatePasswordFormat(password);
      updateState({
        showPasswordError: !isValid
      });
    }
  }, [password]);

  const validatePasswordFormat = (password) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return pattern.test(password);
  };

  const isFormValid = () => {
    return firstName !== '' && lastName !== '' && email !== '' && mobileNumber !== '' && password !== '' && confirmPassword !== '';
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!validateEmailFormat(email)) {
      updateState({
        showEmailErrorMessage: true
      });
      return;
    }

    if (!validatePhoneNumber(mobileNumber)) {
      Alert.alert("Error", "Invalid phone number. It should be exactly 10 digits.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert("Error", passwordError);
      return;
    }

    try {
      const { data } = await signup({
        variables: {
          firstName: firstName,
          lastName: lastName,
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

  const validatePhoneNumber = (phoneNumber) => {
    const pattern = /^\d{10}$/;
    return pattern.test(phoneNumber);
  };

  const validateEmailFormat = (email) => {
    return email.includes('@') && email.endsWith('.com');
  };

  const validatePassword = (password) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!pattern.test(password)) {
      return "Password must contain at least 8 characters, including at least one uppercase letter, one special character, and one number.";
    }
    return null;
  };

  const handleMobileNumberChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    updateState({
      mobileNumber: cleanedText
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      {/* <ImageBackground
        source={require('../../assets/images/bg.png')}
        style={{
          flex: 1,
          left: -width / 20.0,
        }}
      > */}
        <View style={{ flex: 1 }}>
          {header()}
          <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
            {firstNameTextField()}
            {lastNameTextField()}
            {emailTextField()}
            {mobileNumberTextField()}
            {passwordTextField()}
            {confirmPasswordTextField()}
            {signupButton()}
            {/* {orSigninWithDivider()} */}
            {/* {socialMediaOptions()} */}
            {alreadyAccountInfo()}
          </ScrollView>
        </View>
      {/* </ImageBackground> */}
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
      <View style={{ marginBottom: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
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
          </View>
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
        {showPasswordError && <Text style={{ color: 'red' }}>{validatePassword(password)}</Text>}
      </View>
    );
  }

  function mobileNumberTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconWrapper}>
            <FontAwesome name="phone" size={17} color={Colors.grayColor} />
          </View>
          <TextInput
            keyboardType="numeric"
            value={mobileNumber}
            onChangeText={handleMobileNumberChange}
            placeholder="Mobile Number"
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

  function emailTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name="email" size={19} color={Colors.grayColor} />
          </View>
          <TextInput
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => updateState({ email: text, showEmailErrorMessage: false })}
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
          <Text style={{ color: 'red', fontSize: 13, marginTop: 5, marginBottom: 10, marginLeft: Sizes.fixPadding }}>
            Please enter a valid email address.The email must contain "@" and ".com" at the end.
          </Text>
        )}
      </View>
    );
  }

  function lastNameTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name="person" size={19} color={Colors.grayColor} />
          </View>
          <TextInput
            value={lastName}
            onChangeText={(text) => updateState({ lastName: text })}
            placeholder="Last Name"
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

  function firstNameTextField() {
    return (
      <View style={{ marginBottom: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name="person" size={19} color={Colors.grayColor} />
          </View>
          <TextInput
            value={firstName}
            onChangeText={(text) => updateState({ firstName: text })}
            placeholder="First Name"
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
        <MaterialIcons name="arrow-back-ios" size={22} color={Colors.blackColor}
          onPress={() => navigation.pop()}
          style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}
        />
        <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor18Bold }}>
          Signup
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    marginVertical: Sizes.fixPadding,
    flexDirection: 'row',
    alignItems: 'center'
  },
  signupButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding * 3.0,
    marginBottom: Sizes.fixPadding * 2.0
  },
  socialMediaOptionsWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizes.fixPadding * 3.0,
    marginBottom: Sizes.fixPadding * 2.0
  },
  optionsShortWrapStyle: {
    width: 42.0,
    height: 42.0,
    borderRadius: 21.0,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Sizes.fixPadding
  },
  orSigninWithDividerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizes.fixPadding * 2.0,
  },
  iconWrapper: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.grayColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default SignupScreen;
