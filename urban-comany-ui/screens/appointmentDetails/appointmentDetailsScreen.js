import React from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text, FlatList } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import { UPDATE_BOOKING } from "../../services/Bookings";
import { useMutation } from "@apollo/client";

const AppointmentDetailsScreen = ({ navigation, route }) => {

    const { date, endDate, startTime, endTime, selectedSlot, selectedServices, product } = route.params;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
                >
                    {salonInfo()}
                    {servicesInfo()}
                    {/* {specialistsInfo()} */}
                    {dateTimeInfo()}
                    {selectedServicesInfo()}
                    {totalAmountInfo()}
                </ScrollView>
            </View>
            {bookNowButton()}
        </View>
    )

    function bookNowButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleBooking()}
                style={styles.bookNowButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                    {"Book Now"}
                </Text>
            </TouchableOpacity>
        )
    }

    function handleBooking() {
        navigation.push('ShippingDetail', {
            date: date,
            selectedSlot: selectedSlot,
            selectedServices: selectedServices,
            product: product,
        })
    }

    function totalAmountInfo() {
        const servicesArray = Array.isArray(selectedServices) ? selectedServices : [selectedServices];
        return (
            <View style={styles.totalAmountInfoWrapStyle}>
                <Text style={{ ...Fonts.blackColor16Bold }}>
                    Total Amount
                </Text>
                <Text style={{ ...Fonts.blackColor13Bold }}>
                    {`₹ `}{servicesArray.reduce((total, item) => total = total + item.priceWithTax, 0).toFixed(2)}
                </Text>
            </View>
        )
    }

    function selectedServicesInfo() {
        const renderItem = ({ item }) => (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Text style={{ ...Fonts.grayColor14Bold, width: "80%" }}>
                    {item.name}
                </Text>
                <Text style={{ ...Fonts.grayColor13Bold, width: "20%" }}>
                    {`₹ `}{item.priceWithTax.toFixed(2)}
                </Text>
            </View>
        )
        const servicesArray = Array.isArray(selectedServices) ? selectedServices : [selectedServices];
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding, marginTop: Sizes.fixPadding - 2.0, ...Fonts.blackColor16Bold }}>
                    Selected Services
                </Text>
                <FlatList
                    listKey="services"
                    data={servicesArray}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }

    function dateTimeInfo() {
        return (
            <View style={{
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginVertical: Sizes.fixPadding,
            }}>
                <Text style={{ ...Fonts.blackColor15Bold }}>
                    Appointment Date Time
                </Text>
                <Text style={{ ...Fonts.grayColor13SemiBold }}>
                    From {date} to {endDate}
                </Text>
                <Text style={{ ...Fonts.grayColor13SemiBold }}>
                    Slot: {startTime} to {endTime}
                </Text>
            </View>
        )
    }

    function servicesInfo() {
        return (
            <View style={{
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginVertical: Sizes.fixPadding,
            }}>
                <Text style={{ ...Fonts.blackColor15Bold }}>
                    Services
                </Text>
                <Text>
                    {selectedServices.map((item, index) => (
                        <Text key={`${index}`}
                            style={{ ...Fonts.grayColor13SemiBold }}
                        >
                            {item.name} {index == selectedServices.length - 1 ? '' : `• `}
                        </Text>
                    )
                    )}
                </Text>
            </View>
        )
    }

    function salonInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={{ uri: product?.featuredAsset?.preview }}
                    style={{ width: 70.0, height: 70.0, borderRadius: Sizes.fixPadding }}
                />
                <View style={{ marginLeft: Sizes.fixPadding, }}>
                    <Text style={{ lineHeight: 16.0, ...Fonts.blackColor14Bold }}>
                        {product.name}
                    </Text>
                    <Text style={{ ...Fonts.grayColor12SemiBold }}>
                        {product.address ? product.address : "A 9/a Sector 16,Gautam Budh Nagar"}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <AntDesign
                            name="star"
                            color={Colors.yellowColor}
                            size={13}
                        />
                        <Text style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.grayColor12SemiBold }}>
                            {product.ratings ? product.ratings : " 4.6 (100 Reviews)"}
                        </Text>
                    </View>
                </View>
            </View>
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
                    Appointment Details
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
    }
});

export default AppointmentDetailsScreen;