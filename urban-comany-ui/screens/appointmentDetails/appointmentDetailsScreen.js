import React from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import { UPDATE_BOOKING } from "../../services/Bookings";
import { useMutation } from "@apollo/client";

const servicesList = ['Hair wash herbal', 'Hair color', 'Simple hair cuting - hair wash']

const AppointmentDetailsScreen = ({ navigation ,route }) => {

    const{date, selectedSlot, selectedServices, product} = route.params;

    const [serviceBookingUpdate, { loading, error }] = useMutation(UPDATE_BOOKING, {
        onCompleted: async (data) => {
            console.log("BOOKING successfully update:", data);
            navigation.push('PaymentMethod', {
                    date: date,
                    selectedSlot: selectedSlot ,
                    selectedServices: selectedServices,
                    product: product,
                })
        },
        onError: (error) => {
            console.error("Error BOOKING update:", error);
        },
    });

    console.log("product: ", product);
    console.log("selected services: ",selectedServices);

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
                // onPress={() => navigation.push('PaymentMethod', {
                //     date: date,
                //     selectedSlot: selectedSlot ,
                //     selectedServices: selectedServices,
                //     product: product,
                // })}
                onPress={() => handleBooking()}
                style={styles.bookNowButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                    Book Now
                </Text>
            </TouchableOpacity>
        )
    }

    function handleBooking() {
        try {
            serviceBookingUpdate({
                variables: {
                    input: {
                        customFields: {
                            date: date,
                            time: selectedSlot
                        }
                      }
                }
            })
        } catch (error) {
            console.error("Error Booking: ",error);
        }
    }

    function totalAmountInfo() {
        return (
            <View style={styles.totalAmountInfoWrapStyle}>
                <Text style={{ ...Fonts.blackColor16Bold }}>
                    Total Amount
                </Text>
                <Text style={{ ...Fonts.blackColor16Bold }}>
                    {`$`}{selectedServices.reduce((total, item) => total = total + item.priceWithTax, 0).toFixed(2)}
                </Text>
            </View>
        )
    }
//Thursday •
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
                    {date} • {selectedSlot}
                </Text>
            </View>
        )
    }

    function specialistsInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.blackColor15Bold }}>
                    Selected Specialist
                </Text>
                <Text style={{ ...Fonts.grayColor13SemiBold }}>
                    Joya Patel • Hair stylist
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
                    source={{uri: product.featuredAsset.preview}}
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