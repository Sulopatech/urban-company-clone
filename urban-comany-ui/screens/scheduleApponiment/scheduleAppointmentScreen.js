import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import CalendarStrip from 'react-native-calendar-strip';
import MyStatusBar from "../../components/myStatusBar";
import moment from "moment";
import { useMutation, useQuery } from "@apollo/client";
import { ACTIVE_ORDER, ADD_SCHEDULE } from "../../services/Bookings";

const slotsList = [
    '09:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 am', '01:30 pm', '02:00 pm', '02:30 pm', '03:00 pm', '03:30 pm', '04:00 pm', '04:30 pm', '05:00 pm',
    '06:00 pm', '06:30 pm', '07:00 pm', '08:00 pm', '08:30 pm'
];

const ScheduleAppointmentScreen = ({ navigation, route }) => {

    const [state, setState] = useState({
        selectedStartTime: '',
        selectedEndTime: '',
    });

    const [selectedDate, setSelectedDate] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [dateRangeOption, setDateRangeOption] = useState(null); // 'weekly' or 'monthly'

    const { data } = useQuery(ACTIVE_ORDER)
    const [addSchedule, { loading }] = useMutation(ADD_SCHEDULE);

    useEffect(() => {
        // Auto-select current date on initial render
        setSelectedDate(formatDate(moment()));
    }, []);
    
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

    const { selectedServices, product, id } = route.params;

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
        </View>
    );

    function continueButton() {
        const handleContinuePress = async () => {
            const endDate = dateRangeOption
                ? calculateEndDate(selectedDate, dateRangeOption)
                : selectedDate; // Use the same date if no dateRangeOption is selected

            const startTime = state.selectedStartTime;
            const endTime = state.selectedEndTime || startTime; // If end time is not selected, use start time

            const selectedServicesArray = Array.isArray(selectedServices) ? selectedServices : [selectedServices];

            const appointmentDetails = {
                selectedServices: selectedServicesArray,
                date: selectedDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime,
                product: product,
            };

            console.log('Appointment Details:', `${selectedDate}T00:00:00Z`, `${endDate}T23:59:59Z`, startTime, endTime, data?.activeOrder?.id, id?.id);

            try {
                const response = await addSchedule({
                    variables: {
                        orderId: data?.activeOrder?.id,
                        startDate: `${selectedDate}T00:00:00Z`,
                        endDate: `${endDate}T23:59:59Z`,
                        startTime: startTime,
                        endTime: endTime,
                    },
                });

                console.log('Mutation Response:', response.data);

                navigation.push('AppointmentDetail', appointmentDetails);
            } catch (error) {
                console.error('Error scheduling appointment:', error);
            }
        };


        const isDisabled = !selectedDate || !state.selectedStartTime;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleContinuePress}
                style={[
                    styles.continueButtonStyle,
                    { backgroundColor: isDisabled ? Colors.grayColor : Colors.primaryColor },
                ]}
                disabled={isDisabled}
            >
                <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                    {loading ? "Continue..." : "Continue"}
                </Text>
            </TouchableOpacity>
        );
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
                    Schedule Appointment
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
});

export default ScheduleAppointmentScreen;
