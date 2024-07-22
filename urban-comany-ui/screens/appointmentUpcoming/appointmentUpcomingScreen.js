import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import { ORDER_HISTORY } from "../../services/OrderHistory";
import { useQuery } from "@apollo/client";
import { format, parseISO } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";

const AppointmentUpcoming = ({ navigation }) => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const {
    loading,
    error,
    data: orderHistoryData,
    refetch,
  } = useQuery(ORDER_HISTORY);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (orderHistoryData?.activeCustomer?.orders?.items) {
      setUpcomingAppointments(orderHistoryData.activeCustomer.orders.items);
    }
  }, [orderHistoryData]);

  const renderItem = ({ item }) => {
    const date = item?.customFields?.date;
    const time = item?.customFields?.time;
    const formattedDate = date
      ? format(parseISO(date), "dd MMMM yyyy")
      : "Unknown Date";
    const dayOfWeek = date ? format(parseISO(date), "EEEE") : "Unknown Day";

    return (
      <View>
        {item.state === "PaymentAuthorized" && (
          <View style={styles.appointmentInfoWrapStyle}>
            <Collapse
              touchableOpacityProps={{ activeOpacity: 0.9 }}
              onToggle={(isExpanded) =>
                handleUpcomingBookingsUpdate({ id: item.id, isExpanded })
              }
            >
              <CollapseHeader>
                {(() => {
                  const displayedNames = new Set();
                  return item.lines.map((lines) => {
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
                        {console.log("orderlines: ", lines)}
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
                <Text style={{ ...Fonts.grayColor13SemiBold }}>
                  {item?.shippingAddress?.streetLine1},{item?.shippingAddress?.city},{item?.shippingAddress?.postalCode}
                </Text>
                <Text
                  style={{ lineHeight: 16.0, ...Fonts.grayColor13SemiBold }}
                >
                  {dayOfWeek} • {formattedDate} • {time || "Unknown Time"}
                </Text>
                <View
                  style={{
                    marginTop: Sizes.fixPadding - 5.0,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/icons/calling.png")}
                    style={{ width: 12.0, height: 12.0 }}
                    resizeMode="contain"
                    tintColor={Colors.primaryColor}
                  />
                  <Image
                    source={require("../../assets/images/icons/chat.png")}
                    style={{
                      width: 12.0,
                      height: 12.0,
                      marginHorizontal: Sizes.fixPadding + 2.0,
                    }}
                    resizeMode="contain"
                    tintColor={Colors.primaryColor}
                  />
                  <FontAwesome
                    name="location-arrow"
                    size={12}
                    color={Colors.primaryColor}
                  />
                </View>
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
              </CollapseHeader>
              <CollapseBody>
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
                      <Text style={{ ...Fonts.grayColor13SemiBold }}>
                        {lines.productVariant.name}
                      </Text>
                      <Text style={{ ...Fonts.grayColor13SemiBold }}>
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
                {item.lines.map((lines, index) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 10,
                    gap: 7,
                  }}
                >
                  <Text
                    onPress={() => cancelAppointment({ id: item.id })}
                    style={{
                      ...Fonts.primaryColor13Bold,
                      textAlign: "center",
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      marginTop: 10,
                      alignSelf: "flex-end",
                    }}
                  >
                    Cancel
                  </Text>

                  <Text
                    onPress={() => navigation.push('ScheduleAppointment', {
                        selectedServices: lines.productVariant,
                        product: lines.productVariant.product
                    })}
                    style={{
                      ...Fonts.greenColor13Bold,
                      textAlign: "center",
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      alignSelf: "flex-end",
                      marginRight: 1,
                    }}
                  >
                    Reschedule
                  </Text>
                </View>
                ))}
              </CollapseBody>
            </Collapse>
          </View>
        )}
      </View>
    );
  };

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
      {upcomingAppointments.length === 0 ? (
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
            Upcoming Appointment List Is Empty
          </Text>
        </View>
      ) : (
        <FlatList
          data={upcomingAppointments}
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
    ...CommonStyles.shadow,
  },
});

export default AppointmentUpcoming;
