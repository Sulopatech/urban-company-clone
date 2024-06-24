import 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';
import BottomTabBarScreen from "./components/bottomTabBarScreen";
import FilterScreen from "./screens/filter/filterScreen";
import CategoryDetailScreen from "./screens/categoryDetail/categoryDetailScreen";
import SalonDetailScreen from "./screens/salonDetail/salonDetailScreen";
import ScheduleAppointmentScreen from "./screens/scheduleApponiment/scheduleAppointmentScreen";
import AppointmentDetailsScreen from "./screens/appointmentDetails/appointmentDetailsScreen";
import PaymentmethodScreen from "./screens/paymentMethod/paymentmethodScreen";
import AddNewCardScreen from "./screens/addNewCard/addNewCardScreen";
import SpecialistDetailScreen from "./screens/specialistDetail/specialistDetailScreen";
import ChatDetailScreen from "./screens/chatDetail/chatDetailScreen";
import EditProfileScreen from "./screens/editProfile/editProfileScreen";
import FavoritesScreen from "./screens/favorites/favoritesScreen";
import ChatsScreen from "./screens/chats/chatsScreen";
import NotificationsScreen from "./screens/notifications/notificationsScreen";
import VouchersScreen from "./screens/vouchers/vouchersScreen";
import InviteFriendsScreen from "./screens/inviteFriends/inviteFriendsScreen";
import SettingScreen from "./screens/setting/settingScreen";
import PrivacyPolicyScreen from "./screens/privacyPolicy/privacyPolicyScreen";
import OnboardingScreen from "./screens/onboarding/onboardingScreen";
import SignupScreen from './screens/auth/signupScreen';
import SigninScreen from './screens/auth/signinScreen';
import VerificationScreen from "./screens/auth/verificationScreen";
import SplashScreen from "./screens/splashScreen";
import ServiceDetailScreen from "./screens/serviceDetail/serviceDetailScreen";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import API_URL from './services/Environment';

const Stack = createStackNavigator(); // Define Stack navigator

const httpLink = new HttpLink({
  uri: API_URL,
});
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const App = () => {
  const [fontsLoaded] = useFonts({
    Fahkwang_Light: require("./assets/fonts/Fahkwang-Light.ttf"),
    Fahkwang_Medium: require("./assets/fonts/Fahkwang-Medium.ttf"),
    Fahkwang_Regular: require("./assets/fonts/Fahkwang-Regular.ttf"),
    Fahkwang_SemiBold: require("./assets/fonts/Fahkwang-SemiBold.ttf"),
    Fahkwang_Bold: require("./assets/fonts/Fahkwang-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await ExpoSplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  onLayoutRootView();

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              ...TransitionPresets.SlideFromRightIOS,
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} options={{ ...TransitionPresets.DefaultTransition }} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Signin" component={SigninScreen} options={{ ...TransitionPresets.DefaultTransition }} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
            <Stack.Screen name="BottomTabBar" component={BottomTabBarScreen} options={{ ...TransitionPresets.DefaultTransition }} />
            <Stack.Screen name="Filter" component={FilterScreen} />
            <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
            <Stack.Screen name="SalonDetail" component={SalonDetailScreen} />
            <Stack.Screen name="ScheduleAppointment" component={ScheduleAppointmentScreen} />
            <Stack.Screen name="AppointmentDetail" component={AppointmentDetailsScreen} />
            <Stack.Screen name="PaymentMethod" component={PaymentmethodScreen} />
            <Stack.Screen name="AddNewCard" component={AddNewCardScreen} />
            <Stack.Screen name="SpecialistDetail" component={SpecialistDetailScreen} />
            <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
            <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Chats" component={ChatsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Vouchers" component={VouchersScreen} />
            <Stack.Screen name="InviteFriends" component={InviteFriendsScreen} />
            <Stack.Screen name="Setting" component={SettingScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    );
  }
}

export default App;