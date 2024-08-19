import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { useQuery } from "@apollo/client";
import { ORDER_HISTORY } from "../../services/OrderHistory";
import { useFocusEffect } from "@react-navigation/native";
import { format, parseISO, isBefore, startOfDay } from "date-fns";

const AppointmentPast = () => {
    const { data: orderHistoryData, refetch } = useQuery(ORDER_HISTORY);

    const [pastAppointments, setPastAppointments] = useState([]);
    const today = startOfDay(new Date());

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    useEffect(() => {
        if (orderHistoryData?.activeCustomer?.orders?.items) {
            setPastAppointments(orderHistoryData?.activeCustomer?.orders?.items);
        }
    }, [orderHistoryData]);

    // Filter past appointments that are before today
    const filteredPastAppointments = pastAppointments.filter((item) => {
        const startDate = item?.customFields?.Schedule?.currentStartDate
            ? parseISO(item?.customFields?.Schedule?.currentStartDate)
            : null;
        return startDate && isBefore(startDate, today);
    });

    const renderItem = ({ item }) => {
        const startTime = item?.customFields?.Schedule?.currentStartTime;
        const startDate = item?.customFields?.Schedule?.currentStartDate
            ? parseISO(item?.customFields?.Schedule?.currentStartDate)
            : null;

        if (!startDate || !isBefore(startDate, today)) {
            return null;
        }

        const formattedStartDate = startDate
            ? format(startDate, "dd MMMM yyyy")
            : "Unknown Date";
        const endDate = item?.customFields?.Schedule?.currentEndDate
            ? format(parseISO(item?.customFields?.Schedule?.currentEndDate), "dd MMMM yyyy")
            : "Unknown Date";
        const endTime = item?.customFields?.Schedule?.currentEndTime;

        return (
            <View style={styles.appointmentInfoWrapStyle}>
                <Collapse
                    touchableOpacityProps={{ activeOpacity: 0.9 }}
                    onToggle={(isExpanded) => handlePastBookingsUpdate({ id: item.id, isExpanded })}
                >
                    <CollapseHeader>
                        {(() => {
                            const displayedNames = new Set();
                            return item?.lines?.map((lines) => {
                                const productName =
                                    lines?.productVariant?.product?.name || "Unknown Service";
                                if (displayedNames.has(productName)) {
                                    return null; // Skip rendering this item if the name is already displayed
                                }
                                displayedNames.add(productName);
                                return (
                                    <View
                                        key={lines.id} // Make sure to add a unique key for each item
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text style={{ ...Fonts.blackColor14Bold }}>
                                            {productName}
                                        </Text>
                                        <MaterialIcons
                                            name={
                                                item.isExpandable
                                                    ? "keyboard-arrow-up"
                                                    : "keyboard-arrow-down"
                                            }
                                            size={24}
                                            color={Colors.blackColor}
                                        />
                                    </View>
                                );
                            });
                        })()}
                        <Text style={{ ...Fonts.grayColor12SemiBold }}>
                            {item?.shippingAddress?.streetLine1},{item?.shippingAddress?.city},{item?.shippingAddress?.postalCode}
                        </Text>
                        <Text
                            style={{ lineHeight: 16.0, ...Fonts.grayColor12SemiBold }}
                        >
                            {formattedStartDate} to {endDate} • {startTime || "Unknown Time"} to {endTime}
                        </Text>
                    </CollapseHeader>
                    <CollapseBody>
                        <View
                            style={{
                                backgroundColor: Colors.grayColor,
                                height: 1.5,
                                marginTop: Sizes.fixPadding,
                                marginBottom: item.isExpandable
                                    ? Sizes.fixPadding - 5.0
                                    : Sizes.fixPadding + 5.0,
                            }}
                        />
                        <Text style={{ ...Fonts.blackColor14Bold }}>Services</Text>
                        {item.lines.map((lines, index) => (
                            <View key={index}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text style={{ ...Fonts.grayColor12SemiBold }}>
                                        {lines.productVariant.name}
                                    </Text>
                                    <Text style={{ ...Fonts.grayColor12SemiBold }}>
                                        {`₹`}
                                        {lines.productVariant.priceWithTax.toFixed(1)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={{ ...Fonts.primaryColor13Bold }}>
                                Total Amount
                            </Text>
                            <Text style={{ ...Fonts.primaryColor13Bold }}>
                                {`₹`}
                                {item.totalWithTax.toFixed(2)}
                            </Text>
                        </View>
                    </CollapseBody>
                </Collapse>
            </View>
        );
    };

    function handlePastBookingsUpdate({ id, isExpanded }) {
        const newList = pastAppointments.map((appointment) => {
            if (appointment.id === id) {
                const updatedItem = { ...appointment, isExpandable: isExpanded };
                return updatedItem;
            }
            return appointment;
        });
        setPastAppointments(newList);
    }

    return (
        <View style={{ flex: 1 }}>
            {filteredPastAppointments.length === 0 ? (
                <View
                    style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                >
                    <Image
                        source={require("../../assets/images/icons/appointment.png")}
                        style={{ width: 50.0, height: 50.0 }}
                        resizeMode="contain"
                        tintColor={Colors.grayColor}
                    />
                    <Text
                        style={{
                            marginTop: Sizes.fixPadding,
                            textAlign: "center",
                            ...Fonts.grayColor15Bold,
                        }}
                    >
                        Past Appointment List Is Empty
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredPastAppointments}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0 }}
                />
            )}
        </View>
    );
};

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
});

export default AppointmentPast;
