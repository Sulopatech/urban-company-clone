import { FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { useEffect, useState } from "react";
import MyStatusBar from "../../components/myStatusBar";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { ADD_ADDRESS, ADD_BILLING_ADDRESS, ADD_SHIPPING_METHOD, COUNTRIES, SHIPPING_METHOD } from "../../services/Bookings";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ACTIVE_CUSTOMER } from "../../services/Editprofile";
import { RadioButton } from 'react-native-paper';

const ShippingDetailScreen = ({ navigation, route }) => {

    const {date, selectedSlot, selectedServices, product} = route.params ;

    const [addressingDetail, setAddressingDetail] = useState({
        name: null,
        emailAddress: null,
        phoneNumber: null,
        firstName: null,
        lastName: null,
        showEmailErrorMessage: false,
        showPhoneNumberError: false,
    })

    const [shippingDetail, setShippingDetail] = useState({
        streetLine: null,
        city: null
    })

    const [billingAddressDetail, setBillingAddressDetail] = useState({
        streetLine: null,
        city: null
    });
    const [countryOpen, setCountryOpen] = useState(false);
    const [countryValue, setCountryValue] = useState(null);
    const [countryItems, setCountryItems] = useState([]);

    const [shippingMethodOpen, setShippingMethodOpen] = useState(false);
    const [shippingMethodValue, setShippingMethodValue] = useState(null);
    const [shippingMethodItems, setShippingMethodItems] = useState([]);

    const [countryShippingOpen, setCountryShippingOpen] = useState(false);
    const [countryShippingValue, setCountryShippingValue] = useState('IN');

    const [loading, setLoading] = useState(false);

    const { data: countriesData } = useQuery(COUNTRIES);
    const { data: shippingMethodsData } = useQuery(SHIPPING_METHOD);
    const { data: userData } = useQuery(GET_ACTIVE_CUSTOMER);

    console.log("customer data: ",userData?.activeCustomer);

    const [addAddress] = useMutation(ADD_ADDRESS);
    const [addShippingMethod] = useMutation(ADD_SHIPPING_METHOD);
    const [addingBillingAddress] = useMutation(ADD_BILLING_ADDRESS);

    const contentData = [
        {
            id: 'name',
            component: (
                <View style={{ marginTop: Sizes.fixPadding + 5.0, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            value={addressingDetail?.firstName}
                            onChangeText={e => updateAddressingDetail('firstName', e)}
                            placeholder="Name"
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
            )
        },
        {
            id: 'email',
            component: (
                emailTextField()
            )
        },
        {
            id: 'phone',
            component: (
                mobileNumberTextField()
            )
        },
        {
            id: 'shippingHeader',
            component: (<View style={styles.headerWrapStyle}>
                <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor14Bold }}>
                    Shipping Address
                </Text>
            </View>)
        },
        {
            id: 'shippingMethod',
            component: (
                <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                    {shippingMethodItems.map((method) => (
                        <TouchableOpacity
                            key={method.value}
                            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
                            onPress={() => setShippingMethodValue(method.value)}
                        >
                            <RadioButton
                                value={method.value}
                                status={shippingMethodValue === method.value ? 'checked' : 'unchecked'}
                                onPress={() => setShippingMethodValue(method.value)}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor15Bold }}>
                                {method.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )
        },
        {
            id: 'streetShipping',
            component: (
                <View style={{ marginTop: 0, marginHorizontal: Sizes.fixPadding * 2.0 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            value={shippingDetail.streetLine}
                            onChangeText={e => updateShippingDetail('streetLine', e)}
                            placeholder="Enter your street line"
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
            )
        },
        {
            id: 'cityShipping',
            component: (
                // <custom.InputField
                //   label='City'
                //   value={addressShipping}
                //   innerRef={addresshippingInputRef}
                //   placeholder='Enter your city'
                //   onChangeText={handleAddressShippingChange}
                //   containerStyle={styles.inputContainer}
                // />
                <View style={{ marginTop: Sizes.fixPadding + 5.0, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            value={shippingDetail.city}
                            onChangeText={e => updateShippingDetail('city', e)}
                            placeholder="Enter your city"
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
            )
        },
        {
            id: 'countryShipping',
            component: (
                <View style={{ marginTop: Sizes.fixPadding + 5.0, marginHorizontal: Sizes.fixPadding * 2.0 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <DropDownPicker
                            open={countryShippingOpen}
                            value={countryShippingValue}
                            items={countryItems}
                            setOpen={setCountryShippingOpen}
                            setValue={setCountryShippingValue}
                            setItems={setCountryItems}
                            placeholder="Select your country"
                            placeholderStyle={{color: Colors.grayColor, fontSize: 16}}
                            containerStyle={styles.dropdownContainerStyle}
                            style={styles.dropdownStyle}
                            searchable={true}
                            dropDownContainerStyle={styles.dropdownMenu}
                            listMode="MODAL"
                            autoScroll={true}
                            zIndex={1000}
                            zIndexInverse={3000}
                            onChangeValue={(value) => {
                                setCountryShippingValue(value);
                            }}
                        />
                    </View>
                </View>
            )
        },
    ];

    useEffect(() => {
        if (countriesData?.availableCountries) {
            const items = countriesData.availableCountries.map((country) => ({
                label: country.name,
                value: country.code,
            }));
            setCountryItems(items);
        }
    }, [countriesData]);

    useEffect(() => {
        if (shippingMethodsData?.eligibleShippingMethods) {
            const items = shippingMethodsData.eligibleShippingMethods.map((method) => ({
                label: method.name,
                value: method.id,
            }));
            setShippingMethodItems(items);
        }
    }, [shippingMethodsData]);

    useEffect(() => {
        if (userData?.activeCustomer) {
            const {phoneNumber, emailAddress, firstName, lastName } = userData.activeCustomer;
            setAddressingDetail((prevState) => ({
                ...prevState,
                phoneNumber,
                emailAddress,
                firstName,
                lastName
            }))
        }
    }, [userData])

    const updateAddressingDetail = (target, value) => {
        const copyDetail = { ...addressingDetail };

        copyDetail[target] = value;
        if (target === 'phoneNumber') {
            if (value && !validatePhoneNumber(value)) {
                copyDetail['showPhoneNumberError'] = true;
            } else {
                const cleanedText = value.replace(/[^0-9]/g, '');
                copyDetail[target] = cleanedText;
                copyDetail['showPhoneNumberError'] = false;
            }

        }
        if (target === 'email') {
            if (value && !validateEmailFormat(value)) {
                copyDetail['showEmailErrorMessage'] = true;
            } else {
                copyDetail['showEmailErrorMessage'] = false;
            }
        }

        setAddressingDetail(copyDetail);
    }

    const updateBillingDetail = (target, value) => {
        const copyDetail = { ...billingAddressDetail };
        copyDetail[target] = value;
        setBillingAddressDetail(copyDetail);
    }

    const updateShippingDetail = (target, value) => {
        const copyDetail = { ...shippingDetail };
        copyDetail[target] = value;
        setShippingDetail(copyDetail);
    }

    const validatePhoneNumber = (phoneNumber) => {
        const pattern = /^\d{10}$/;
        return pattern.test(phoneNumber);
    };

    const validateEmailFormat = (email) => {
        return email.includes('@') && email.endsWith('.com');
    };

    const handleProceedToCheckout = async () => {
        setLoading(true);
        try {
            await addingBillingAddress({
                variables: {
                    fullName: addressingDetail.firstName,
                    streetLine1: shippingDetail.streetLine,
                    city: shippingDetail.streetLine,
                    countryCode: countryShippingValue || '',
                }
            });
            await addAddress({
                variables: {
                    fullName: addressingDetail.firstName,
                    streetLine1: shippingDetail.streetLine,
                    city: shippingDetail.city,
                    countryCode: countryShippingValue || '',
                }
            });
            if (shippingMethodValue) {
                await addShippingMethod({ variables: { shippingMethodId: shippingMethodValue } });
            }
            navigation.push('PaymentMethod', {
                date: date,
                selectedSlot: selectedSlot,
                selectedServices: selectedServices,
                product: product,
            })
        } catch (error) {
            console.error("Error during checkout: ", error);
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled = () => {
        return false;
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, marginBottom: 50 }}>
                {header()}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView nestedScrollEnabled={true}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <FlatList
                                data={contentData}
                                renderItem={({ item }) => item?.component}
                                keyExtractor={item => item?.id}
                                // contentContainerStyle={styles.container}
                                keyboardShouldPersistTaps="handled"
                                nestedScrollEnabled={true}
                            />
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
            {continueButton()}
        </View>

    )

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
                    Addressing Detail
                </Text>
            </View>
        )
    }

    function mobileNumberTextField() {
        return (
            <View style={{ marginBottom: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        keyboardType="numeric"
                        value={addressingDetail.phoneNumber}
                        onChangeText={(e) => updateAddressingDetail('phoneNumber', e)}
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
                {addressingDetail.showPhoneNumberError && (
                    <Text style={{ color: 'red', fontSize: 13, marginTop: 5, marginBottom: 10, marginLeft: Sizes.fixPadding }}>
                        Please enter a valid phone number.
                    </Text>
                )}
            </View>
        );
    }

    function emailTextField() {
        return (
            <View style={{ marginBottom: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        keyboardType="email-address"
                        value={addressingDetail?.emailAddress}
                        onChangeText={text => updateAddressingDetail('emailAddress', text)}
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
                {addressingDetail.showEmailErrorMessage && (
                    <Text style={{ color: 'red', fontSize: 13, marginTop: 5, marginBottom: 10, marginLeft: Sizes.fixPadding }}>
                        Please enter a valid email address.The email must contain "@" and ".com" at the end.
                    </Text>
                )}
            </View>
        );
    }

    function continueButton() {

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleProceedToCheckout()}
                style={[
                    styles.continueButtonStyle,
                    { backgroundColor: isButtonDisabled() ? Colors.grayColor : Colors.primaryColor },
                ]}
                disabled={isButtonDisabled()}
            >
                <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                    {loading ? "Proceeding..." : "Proceed to Payment"}
                </Text>
            </TouchableOpacity>
        )
    }
}

export default ShippingDetailScreen;

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 5.0
    },
    bookNowButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    totalAmountInfoWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dropdownContainer: {
        marginVertical: Sizes.fixPadding - 5.0,
    },
    dropdownContainerStyle: {
        height: 50,
    },
    dropdownStyle: {
        backgroundColor: '#fafafa',
        borderColor: Colors.grayColor
    },
    dropdownMenu: {
        zIndex: 1001,
        height: 100,
    },
    continueButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
});