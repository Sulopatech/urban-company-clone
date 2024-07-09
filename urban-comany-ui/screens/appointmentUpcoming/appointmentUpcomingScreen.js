import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { Colors, Fonts, Sizes,CommonStyles } from "../../constants/styles";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { ORDER_HISTORY } from "../../services/OrderHistory";
import { useQuery } from "@apollo/client";

const upcomingAppointmentsList = [
    {
        id: '1',
        isExpandable: false,
        salonName: 'Crown salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        appointmentDay: 'Thursday',
        appointmentDate: '14 August,2021',
        appointmentTime: '2:00 pm',
        specialistName: 'Joya Patel',
        speciality: 'Hair Stylist',
        services: [
            {
                service: 'Hair wash herbal',
                amount: 35.0,
            },
            {
                service: 'Hair color',
                amount: 149.0,
            },
            {
                service: 'Simple hair cuting - hair wash',
                amount: 25.0,
            },
        ],
    },
];

const AppointmentUpcoming = ({ navigation }) => {

    
    const { loading, error, data : orderHistoryData } = useQuery(ORDER_HISTORY);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    useEffect(() => {
        if (orderHistoryData?.activeCustomer?.orders?.items) {
            setUpcomingAppointments(orderHistoryData.activeCustomer.orders.items);
            console.log("upcoming data: ", orderHistoryData.activeCustomer.orders.items);
        }
    }, [orderHistoryData]);
    
    console.log("order data: ", orderHistoryData?.activeCustomer?.orders);
    console.log("custom field: ", orderHistoryData?.activeCustomer?.orders?.items);

    const renderItem = ({ item }) => (
        <View>
        {item.state === "PaymentAuthorized" && (
        <View style={styles.appointmentInfoWrapStyle}>
            <Collapse
                touchableOpacityProps={{ activeOpacity: 0.9 }}
                onToggle={(isExpanded) => handleUpcomingBookingsUpdate({ id: item.id, isExpanded })}
            >
                <CollapseHeader>
                {item.lines.map((lines) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ ...Fonts.blackColor14Bold }}>
                        {lines?.productVariant?.product?.name || "Unknown Service"}
                        </Text>
                        <MaterialIcons
                            name={item.isExpandable ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                            size={24}
                            color={Colors.blackColor}
                        />
                    </View>
                ) )}
                    <Text style={{ ...Fonts.grayColor13SemiBold }}>
                        {'A 9/a Sector 16,Gautam Budh Nagar'}
                    </Text>
                    <Text style={{ lineHeight: 16.0, ...Fonts.grayColor13SemiBold }}>
                        {/* {item.appointmentDay} • {item.appointmentDate} • {item.appointmentTime} */}
                        {"Thursday"} • {"14 August 2024"} • {"2:00 pm"}
                    </Text>
                    <View style={{ marginTop: Sizes.fixPadding - 5.0, flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={require('../../assets/images/icons/calling.png')}
                            style={{ width: 12.0, height: 12.0, }}
                            resizeMode="contain"
                            tintColor={Colors.primaryColor}
                        />
                        <Image
                            source={require('../../assets/images/icons/chat.png')}
                            style={{ width: 12.0, height: 12.0, marginHorizontal: Sizes.fixPadding + 2.0 }}
                            resizeMode="contain"
                            tintColor={Colors.primaryColor}
                        />
                        <FontAwesome
                            name="location-arrow"
                            size={12}
                            color={Colors.primaryColor}
                        />
                    </View>
                    <View style={{
                        backgroundColor: Colors.grayColor,
                        height: 1.5,
                        marginTop: Sizes.fixPadding,
                        marginBottom: item.isExpandable ? Sizes.fixPadding - 5.0 : Sizes.fixPadding + 5.0,
                    }} />
                </CollapseHeader>
                <CollapseBody>
                    {/* <Text style={{ ...Fonts.blackColor14Bold }}>
                        Specialists
                    </Text>
                    <Text style={{ ...Fonts.grayColor13SemiBold }}>
                        {item.specialistName} • {item.speciality}
                    </Text> */}
                    <Text style={{ ...Fonts.blackColor14Bold }}>
                        Services
                    </Text>
                    {item.lines.map((lines, index) => (
                        <View key={index}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{ ...Fonts.grayColor13SemiBold }}>
                                    {lines.productVariant.name}
                                </Text>
                                <Text style={{ ...Fonts.grayColor13SemiBold }}>
                                    {`₹`}{lines.productVariant.priceWithTax.toFixed(1)}
                                </Text>
                            </View>
                        </View>
                    ))}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ ...Fonts.primaryColor13Bold }}>
                            Total Amount
                        </Text>
                        <Text style={{ ...Fonts.primaryColor13Bold }}>
                            {`₹`}{item.totalWithTax.toFixed(2)}
                        </Text>
                    </View>
                     <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10,gap: 7 }}>
                    <Text
                        onPress={() => cancelAppointment({ id: item.id })}
                        style={{ ...Fonts.primaryColor13Bold, textAlign: 'center',paddingVertical: 5, paddingHorizontal: 10, marginTop: 10,alignSelf: 'flex-end' }}>
                        
                        Cancel 
                    </Text>
                    
                    
                    <Text
                        
                        
                        onPress={() =>navigation.push('ScheduleAppointment')}
                        style={{
                            ...Fonts.greenColor13Bold,
                            textAlign: 'center',
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            alignSelf: 'flex-end',
                            marginRight: 1,
                        }}>
                        Reschedule
                    </Text>
                    </View>
                    
                </CollapseBody>
            </Collapse>
        </View>
        )}
        </View>
    )

    function cancelAppointment({ id }) {
        const newList = upcomingAppointments.filter((item) => item.id != id);
        setUpcomingAppointments(newList);
    }

    function handleUpcomingBookingsUpdate({ id, isExpanded }) {
        const newList = upcomingAppointments.map((appointment) => {
            if (appointment.id === id) {
                const updatedItem = { ...appointment, isExpandable: isExpanded };
                return updatedItem;
            }
            return appointment;
        });
        setUpcomingAppointments(newList);
    }

    return (
        <View style={{ flex: 1 }}>
            {
                upcomingAppointments.length === 0
                    ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('../../assets/images/icons/appointment.png')}
                            style={{ width: 50.0, height: 50.0 }}
                            resizeMode="contain"
                            tintColor={Colors.grayColor}
                        />
                        <Text style={{ marginTop: Sizes.fixPadding, textAlign: 'center', ...Fonts.grayColor15Bold }}>
                            Upcoming Appointment List Is Empty
                        </Text>
                    </View>
                    :
                    <FlatList
                        data={upcomingAppointments}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0, }}
                    />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    appointmentInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0,
        ...CommonStyles.shadow
    }
})

export default AppointmentUpcoming;