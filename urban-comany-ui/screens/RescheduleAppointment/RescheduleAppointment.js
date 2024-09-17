import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Text, Image, Dimensions } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import CalendarStrip from 'react-native-calendar-strip';
import MyStatusBar from "../../components/myStatusBar";
import moment from "moment";
import { gql, useMutation } from "@apollo/client";
import { Modal } from "react-native-paper";

const slotsList = [
    '09:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 am', '01:30 pm', '02:00 pm', '02:30 pm', '03:00 pm', '03:30 pm', '04:00 pm', '04:30 pm', '05:00 pm',
    '06:00 pm', '06:30 pm', '07:00 pm', '08:00 pm', '08:30 pm'
];

const RESEHEDULE = gql`
mutation resehedule($orderId: ID!, $newStartDate: DateTime!, $newEndDate: DateTime!, $newStartTime: String!, $newEndTime: String!) {
  rescheduleOrder(
    orderId: $orderId,
    newStartDate: $newStartDate,
    newEndDate: $newEndDate,
    newStartTime: $newStartTime,
    newEndTime: $newEndTime
  ) {
    id
    currentStartDate
    currentEndDate
    currentStartTime
    currentEndTime
    order {
        id
        }
        }
        }
        `;
const { width } = Dimensions.get('window');

const RescheduleAppointment = ({ navigation, route }) => {
    const [state, setState] = useState({
        selectedStartTime: '',
        selectedEndTime: '',
        showSuccessfullyDialog: false,
    });

    const {
        showSuccessfullyDialog,
    } = state;
    const [selectedDate, setSelectedDate] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [dateRangeOption, setDateRangeOption] = useState(null); // 'weekly' or 'monthly'

    const [rescheduleOrder, { loading }] = useMutation(RESEHEDULE);

    const today = moment();
    useEffect(() => {
        if (selectedDate && state.selectedSlot) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [selectedDate, state.selectedSlot]);

    const handleDateSelected = (date) => {
        const formattedDate = formatDate(date);
        setSelectedDate(formattedDate);
    };

    const formatDate = (date) => {
        if (!date) return '';
        const isoString = date.toISOString();
        return isoString.split('T')[0];
    };

    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const { orderId, rescheduleFrequency } = route.params;

    console.log("***************reschedule:", rescheduleFrequency, orderId)
    const calculateEndDate = (startDate, option) => {
        const start = moment(startDate, 'YYYY-MM-DD');
        return option === 'weekly' ? start.add(7, 'days').format('YYYY-MM-DD') : start.add(30, 'days').format('YYYY-MM-DD');
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <FlatList
                    ListHeaderComponent={
                        <>
                            {selectDateInfo()}
                            {dateRangeOptions()}
                            {availableSlotInfo()}
                        </>
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0, }}
                />
            </View>
            {continueButton()}
            {successfullyDialog()}
        </View>
    );

    function continueButton() {
        const handleReschedule = () => {
            const endDate = dateRangeOption
                ? calculateEndDate(selectedDate, dateRangeOption)
                : selectedDate; // Use the same date if no dateRangeOption is selected

            const startTime = state.selectedStartTime;
            const endTime = state.selectedEndTime || startTime;
            console.log('Order ID:', orderId);
            console.log('New Start Date:', selectedDate);
            console.log('New End Date:', endDate);
            console.log('New Start Time:', startTime);
            console.log('New End Time:', endTime);

            rescheduleOrder({
                variables: {
                    orderId: orderId,
                    newStartDate: `${selectedDate}T00:00:00Z`,
                    newEndDate: `${endDate}T23:59:59Z`,
                    newStartTime: startTime,
                    newEndTime: endTime,
                },
            })
                .then(response => {
                    // console.log('Rescheduled successfully', response.data);
                    //   refetch(); // refetch data after reschedule
                    updateState({ showSuccessfullyDialog: true });
                    //   navigation.push('AppointmentScreen');
                })
                .catch(err => {
                    console.error('Error rescheduling order', err);
                });
        };


        const isDisabled = !selectedDate || !state.selectedStartTime || rescheduleFrequency > 2;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleReschedule}
                style={[
                    styles.continueButtonStyle,
                    { backgroundColor: isDisabled ? Colors.grayColor : Colors.primaryColor },
                ]}
                disabled={isDisabled}
            >
                <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                    {loading ? "Rescheduling..." : "Reschedule"}
                </Text>
            </TouchableOpacity>
        );
    }

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
                        {`Reschedule successful`}
                    </Text>
                    <Text style={{
                        marginTop: Sizes.fixPadding - 5.0,
                        marginBottom: Sizes.fixPadding + 10.0, ...Fonts.grayColor13SemiBold, textAlign: 'center'
                    }}>
                        {`Your rescheduling is successfully done.\nAlso We send invoice to your mail address.`}
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

    function availableSlotInfo() {
        const currentTime = moment();

        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    if (!state.selectedStartTime || (state.selectedStartTime && state.selectedEndTime)) {
                        updateState({ selectedStartTime: item, selectedEndTime: '' });
                    } else {
                        updateState({ selectedEndTime: item });
                    }
                }}
                style={{
                    backgroundColor: state.selectedStartTime == item || state.selectedEndTime == item ? Colors.primaryColor : Colors.whiteColor,
                    borderColor: state.selectedStartTime == item || state.selectedEndTime == item ? Colors.primaryColor : Colors.grayColor,
                    ...styles.availableSlotWrapStyle,
                    flex: 1,
                }}
            >
                <Text style={state.selectedStartTime == item || state.selectedEndTime == item ? { ...Fonts.whiteColor13Bold } : { ...Fonts.grayColor13Bold }}>
                    {item}
                </Text>
            </TouchableOpacity>
        );

        const filterSlots = (slots) => {
            if (!selectedDate) return slots;

            const selectedDateMoment = moment(selectedDate, 'YYYY-MM-DD');
            if (selectedDateMoment.isSame(currentTime, 'day')) {
                return slots.filter(slot => moment(slot, 'hh:mm a').isAfter(currentTime));
            }
            return slots;
        };

        const filteredSlots = filterSlots(slotsList);

        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginVertical: Sizes.fixPadding + 5.0, ...Fonts.blackColor16Bold }}>
                    Available Slot
                </Text>
                <FlatList
                    listKey="slots"
                    data={filteredSlots}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={renderItem}
                    numColumns={4}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                />
                <Text style={{
                    marginTop: 10,
                    fontWeight: 'bold',
                    color: rescheduleFrequency > 2 ? 'red' : 'green'
                }}>
                    {rescheduleFrequency === 0 || rescheduleFrequency === null ?
                        "You do not make any reschedule yet. 3 times left." :
                        rescheduleFrequency > 2 ?
                            "You already reschedule three times" :
                            `You have already reschedule ${rescheduleFrequency} times. ${3 - rescheduleFrequency} times left.`}
                </Text>
            </View>
        );
    }

    function selectDateInfo() {
        const today = moment().startOf('day');
        const handleDateSelected = (date) => {
            if (date.isBefore(today)) {
                return; // Prevent selection of past dates
            }
            setSelectedDate(formatDate(date));
        };

        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Bold }}>
                    Select Date
                </Text>
                <CalendarStrip
                    scrollable
                    style={{ height: 100.0, marginTop: Sizes.fixPadding * 1.0 }}
                    highlightDateNumberStyle={{
                        color: Colors.whiteColor,
                        ...Fonts.blackColor14Regular
                    }}
                    highlightDateNameStyle={{
                        color: Colors.whiteColor,
                        ...Fonts.blackColor14Regular
                    }}
                    dateNumberStyle={{
                        color: Colors.blackColor,
                        ...Fonts.blackColor14Regular
                    }}
                    dateNameStyle={{
                        color: Colors.blackColor,
                        ...Fonts.blackColor14Regular
                    }}
                    highlightDateContainerStyle={{
                        backgroundColor: Colors.primaryColor,
                    }}
                    iconContainer={{ flex: 0.1 }}
                    selectedDate={selectedDate ? moment(selectedDate) : today}
                    onDateSelected={handleDateSelected}
                    datesWhitelist={[{ start: today, end: moment().add(1, 'year') }]} // Set the date range for future dates
                    customDatesStyles={(date) => {
                        if (date.isBefore(today)) {
                            return {
                                dateNameStyle: { color: 'gray' },
                                dateNumberStyle: { color: 'gray' },
                                highlightDateNameStyle: { color: 'gray' },
                                highlightDateNumberStyle: { color: 'gray' },
                                highlightDateContainerStyle: { backgroundColor: 'lightgray' },
                            };
                        }
                    }}
                />
            </View>
        );
    }


    function dateRangeOptions() {
        const handleDateRangePress = (option) => {
            // Toggle the date range option
            setDateRangeOption(prevOption => prevOption === option ? '' : option);
        };

        return (
            <View style={styles.dateRangeOptionsContainer}>
                <TouchableOpacity
                    style={[
                        styles.dateRangeOption,
                        dateRangeOption === 'weekly' && styles.selectedDateRangeOption
                    ]}
                    onPress={() => handleDateRangePress('weekly')}
                >
                    <Text style={[
                        styles.dateRangeOptionText,
                        dateRangeOption === 'weekly' && styles.selectedDateRangeOptionText
                    ]}>
                        Weekly
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.dateRangeOption,
                        dateRangeOption === 'monthly' && styles.selectedDateRangeOption
                    ]}
                    onPress={() => handleDateRangePress('monthly')}
                >
                    <Text style={[
                        styles.dateRangeOptionText,
                        dateRangeOption === 'monthly' && styles.selectedDateRangeOptionText
                    ]}>
                        Monthly
                    </Text>
                </TouchableOpacity>
            </View>
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
                    Reschedule Appointment
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
    continueButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    availableSlotWrapStyle: {
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 3.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: Sizes.fixPadding - 8.0,
        paddingTop: Sizes.fixPadding - 8.0,
        paddingHorizontal: Sizes.fixPadding - 5.0,
        marginRight: Sizes.fixPadding - 3.0,
        marginBottom: Sizes.fixPadding - 3.0,
        width: 80, // Fixed width
        height: 45,
    },
    totalAmountInfoWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding + 5.0,
    },
    specialistImageStyle: {
        width: 45.0,
        height: 45.0,
        borderWidth: 1.5,
        borderRadius: Sizes.fixPadding - 5.0,
        marginBottom: Sizes.fixPadding - 7.0
    },
    dateRangeOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        // marginVertical: Sizes.fixPadding,
    },
    dateRangeOption: {
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding * 0.5,
        borderRadius: Sizes.fixPadding * 0.5,
        marginHorizontal: Sizes.fixPadding,
        borderWidth: 1,
        borderColor: Colors.primaryColor,
    },
    selectedDateRangeOption: {
        backgroundColor: Colors.primaryColor,
    },
    dateRangeOptionText: {
        ...Fonts.blackColor14Regular,
    },
    selectedDateRangeOptionText: {
        color: Colors.whiteColor,
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
});

export default RescheduleAppointment;
