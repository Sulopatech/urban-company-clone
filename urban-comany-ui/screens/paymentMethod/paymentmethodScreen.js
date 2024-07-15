import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Text, TouchableOpacity, Image } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Modal } from "react-native-paper";
import MyStatusBar from "../../components/myStatusBar";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_PAYMENT, CHANGE_STATE, ELIGIBLE_PAYMENT, NEXT_ORDER_STATE, PAYMENT_INFO, SERVICE_BOOKING, UPDATE_BOOKING } from "../../services/Bookings";
import DropDownPicker from 'react-native-dropdown-picker';

const paymentMethods = [
    {
        id: '1',
        image: require('../../assets/images/icons/payment.png'),
        paymentType: 'Credit card',
        paymentDetail: '**** **** **** 1234',
    },
    {
        id: '2',
        image: require('../../assets/images/icons/netbanking.png'),
        paymentType: 'Bank account',
        paymentDetail: '**** **** **** 1710',
    },
    {
        id: '3',
        image: require('../../assets/images/icons/paypal.png'),
        paymentType: 'Paypal',
        paymentDetail: 'yourname123@gmail.com',
    },
    {
        id: '4',
        image: require('../../assets/images/icons/cash.png'),
        paymentType: 'Payment in cash',
    }
];

const { width } = Dimensions.get('window');

const PaymentMethodScreen = ({ navigation, route }) => {

    const [state, setState] = useState({
        selectedPaymentMethodId: paymentMethods[0].id,
        selectedPaymentType: null,
        // paymentMethodData: {},
        showSuccessfullyDialog: false,
    })

    const {date, selectedSlot, selectedServices, product} = route.params ;

    const updateState = (data) => setState((state) => ({ ...state, ...data }));
    const [paymentMethodData, setPaymentMethodData] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { data: paymentTypeData } = useQuery(ELIGIBLE_PAYMENT);
    const { data: paymentInfo } = useQuery(PAYMENT_INFO);
    const { data: nextOrderData } = useQuery(NEXT_ORDER_STATE);

    const [changeState] = useMutation(CHANGE_STATE);
    const [addPayment] = useMutation(ADD_PAYMENT);

    // const [serviceBookingUpdate, { loading, error }] = useMutation(UPDATE_BOOKING, {
    //     onCompleted: async (data) => {
    //         console.log("BOOKING successfully:", data);
    //         // navigation.pop();
    //         updateState({ showSuccessfullyDialog: true })
    //     },
    //     onError: (error) => {
    //         console.error("Error BOOKING:", error);
    //     },
    // });

    console.log("error m,sg: ",errorMessage);

    const paymentMethodDatas = paymentTypeData?.eligiblePaymentMethods.map((method) => ({
        label: method.name,
        value: method.code,
      })) || [];


    const {
        selectedPaymentMethodId,
        selectedPaymentType,
        // paymentMethodData,
        showSuccessfullyDialog,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {paymentMethod()}
                    {addNewCardText()}
                    {cards()}
                    {priceDetails()}
                    {continueWithCreditCardButton()}
                </ScrollView>
            </View>
            {successfullyDialog()}
        </View>
    )

    function successfullyDialog() {
        return (
            <Modal
                visible={showSuccessfullyDialog}
                onDismiss={() => { updateState({ showSuccessfullyDialog: false }) }}
            >
                <View style={styles.dialogWrapStyle}>
                    <Image
                        source={require('../../assets/images/icons/done.png')}
                        style={{ marginBottom: Sizes.fixPadding * 2.0, width: 50.0, height: 50.0, }}
                        resizeMode="contain"
                        tintColor={Colors.primaryColor}
                    />
                    <Text style={{ ...Fonts.blackColor14Bold, textAlign: 'center' }}>
                        {`Your appointment booked\nsuccessfully`}
                    </Text>
                    <Text style={{
                        marginTop: Sizes.fixPadding - 5.0,
                        marginBottom: Sizes.fixPadding + 10.0, ...Fonts.grayColor13SemiBold, textAlign: 'center'
                    }}>
                        {`Your appointment booking is successfully done.\nAlso We send invoice to your mail address.`}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => { updateState({ showSuccessfullyDialog: false }) }}
                        style={styles.continueBookingButtonStyle}
                    >
                        <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                            Continue Booking
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                            updateState({ showSuccessfullyDialog: false })
                            navigation.push('BottomTabBar')
                        }}
                        style={styles.gotoAppointmentButtonStyle}
                    >
                        <Text style={{ ...Fonts.primaryColor18SemiBold }}>
                            Go to Appointment
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    function continueWithCreditCardButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                // onPress={() => updateState({ showSuccessfullyDialog: true })}
                onPress={() => handleBooking()}
                style={styles.continueWithCreditCardButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                    {loading ? "Checking Payment..." : "Continue with Credit Card"}
                </Text>
            </TouchableOpacity>
        )
    }

    async function handleBooking() {
        if (!paymentMethodData) {
            console.log("inside emptyy...........");
            setErrorMessage('Please select a payment type');
            return;
        }

        const nextOrder = nextOrderData?.nextOrderStates[0];
        setLoading(true);
        setErrorMessage('');
    
        try {
            await changeState({
                variables: { state: nextOrder }
            });
    
            await addPayment({
                variables: { method: paymentMethodData, metadata: {} }
            });
    
            updateState({ showSuccessfullyDialog: true });
        } catch (e) {
            console.error("Error Payment: ", e);
        } finally {
            setLoading(false); 
        }
    }
    

    function paymentMethod() {

        return (
            <View style={styles.paymentMethodContainer}>
                <Text style={{ ...Fonts.blackColor14Bold, marginBottom: Sizes.fixPadding }}>
                    Select Payment Type
                </Text>
                <DropDownPicker
                    open={open}
                    value={paymentMethodData}
                    items={paymentMethodDatas}
                    setOpen={setOpen}
                    setValue={(value) => {
                        setPaymentMethodData(value);
                        setErrorMessage(''); // Clear error message on selection
                    }}
                    containerStyle={{ height: 40 }}
                    style={styles.dropdown}
                    itemStyle={{
                        justifyContent: 'flex-start'
                    }}
                    dropDownStyle={styles.dropDownContainer}
                    onChangeItem={(item) =>
                        updateState({ selectedPaymentType: item.value })
                    }
                    placeholder="Select Payment Type"
                />
                {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}
            </View>
        );
    }    

    function cards() {
        return (
            <View>
                {
                    paymentMethods.map((item) => (
                        <TouchableOpacity
                            key={`${item.id}`}
                            activeOpacity={0.9}
                            onPress={() => { updateState({ selectedPaymentMethodId: item.id }) }}
                            style={{
                                borderColor: selectedPaymentMethodId == item.id ? Colors.primaryColor : Colors.whiteColor,
                                ...styles.paymentMethodWrapStyle
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={item.image}
                                    style={{ width: 30.0, height: 30.0, }}
                                    resizeMode="contain"
                                    tintColor={selectedPaymentMethodId == item.id ? Colors.primaryColor : Colors.blackColor}
                                />
                                <View style={{ marginLeft: Sizes.fixPadding, }}>
                                    <Text style={selectedPaymentMethodId == item.id ? { ...Fonts.primaryColor14Medium } : { ...Fonts.blackColor14Medium }}>
                                        {item.paymentType}
                                    </Text>
                                    {
                                        item.paymentDetail
                                            ?
                                            <Text style={{ alignSelf: 'center', ...Fonts.grayColor11SemiBold }}>
                                                **** **** **** 1234
                                            </Text>
                                            :
                                            null
                                    }
                                </View>
                            </View>
                            <View style={{
                                width: 16.0, height: 16.0,
                                borderRadius: 8.0,
                                borderColor: selectedPaymentMethodId == item.id ? Colors.primaryColor : Colors.blackColor,
                                borderWidth: 1.2,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {
                                    selectedPaymentMethodId == item.id
                                        ?
                                        <View style={{ width: 7.0, height: 7.0, borderRadius: 3.5, backgroundColor: Colors.primaryColor }} />
                                        :
                                        null
                                }
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </View>
        )
    }

    function priceDetails() {
        return (
            <View style={styles.priceDetailsContainer}>
                <Text style={styles.priceDetailsTitle}>
                    Payment info
                </Text>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Shipping</Text>
                    <Text style={styles.priceValue}>₹{paymentInfo?.activeOrder?.shipping}</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Subtotal</Text>
                    <Text style={styles.priceValue}>₹{paymentInfo?.activeOrder?.subTotal?.toFixed(2)}</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Total</Text>
                    <Text style={styles.priceValue}>₹{paymentInfo?.activeOrder?.total?.toFixed(2)}</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Total with tax</Text>
                    <Text style={styles.priceValue}>₹{paymentInfo?.activeOrder?.subTotalWithTax?.toFixed(2)}</Text>
                </View>
            </View>
        );
    }
    

    function addNewCardText() {
        return (
            <Text
                onPress={() => navigation.push('AddNewCard')}
                style={{
                    marginHorizontal: Sizes.fixPadding * 2.0,
                    marginBottom: Sizes.fixPadding - 5.0,
                    textAlign: 'right',
                    ...Fonts.primaryColor12Bold
                }}
            >
                Add New Card
            </Text>
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
                    Payment Method
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
    paymentMethodWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 7.0,
        borderWidth: 1.2,
        marginBottom: Sizes.fixPadding * 2.0,
        height: 50.0,
        ...CommonStyles.shadow
    },
    continueWithCreditCardButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding * 2.0,
    },
    continueBookingButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        width: '100%',
    },
    gotoAppointmentButtonStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        width: '100%',
        marginTop: Sizes.fixPadding + 5.0,
    },
    dialogWrapStyle: {
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        width: width - 40.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignSelf: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding * 3.0,
    },
    paymentMethodContainer: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 6.0,
        // paddingBottom: Sizes.fixPadding * 2.0,

    },
    dropdown: {
        backgroundColor: '#fafafa',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding,
        // marginTop: Sizes.fixPadding,
    },
    dropDownContainer: {
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: Sizes.fixPadding,
        // marginTop: -1,
    },
    priceDetailsContainer: {
        padding: 20,
        borderRadius: 15,
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        margin: Sizes.fixPadding * 2.0,
        ...CommonStyles.shadow
    },
    priceDetailsTitle: {
        ...Fonts.blackColor14Bold,
        marginBottom: Sizes.fixPadding,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Sizes.fixPadding - 5.0,
    },
    priceLabel: {
        ...Fonts.grayColor13SemiBold,
    },
    priceValue: {
        ...Fonts.blackColor14Medium,
    },
    errorText: {
        marginTop: 5,
        ...Fonts.redColor11SemiBold,
    },
});

export default PaymentMethodScreen;