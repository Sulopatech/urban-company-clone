import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";

const hairWashServicesList = [
    {
        id: '1',
        serviceName: 'Hair wash herbal',
        amount: 35.00,
        duration: '20 min',
        serviceDetail: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    },
    {
        id: '2',
        serviceName: 'Professional hair wash',
        amount: 28.00,
        duration: '35 min',
        serviceDetail: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    },
    {
        id: '3',
        serviceName: 'Hair Spa wash',
        amount: 49.00,
        duration: '35 min',
        serviceDetail: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    }
];

const hairColoringServicesList = [
    {
        id: '1',
        serviceName: 'Hair color',
        amount: 149.00,
        duration: '1 hour 30 min',
        serviceDetail: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    },
];

const hairCuttingServicesList = [
    {
        id: '1',
        serviceName: 'Simple hair cutting - hair wash ghy',
        amount: 25.00,
        duration: '30 min',
        serviceDetail: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    },
];

const ServiceDetailScreen = ({ navigation }) => {

    const [state, setState] = useState({
        selectedHairWashServiceId: hairWashServicesList[0].id,
        selectedHairColorServiceId: hairColoringServicesList[0].id,
        selectedHairCuttingServiceId: hairCuttingServicesList[0].id,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        selectedHairWashServiceId,
        selectedHairColorServiceId,
        selectedHairCuttingServiceId,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
                >
                    {hairWashServices()}
                    {hairColoringServices()}
                    {hairCuttingServices()}
                </ScrollView>
                {continueButton()}
            </View>
        </View>
    )

    function continueButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('ScheduleAppointment')}
                style={styles.continueButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                    Continue
                </Text>
            </TouchableOpacity>
        )
    }

    function hairCuttingServices() {
        return (
            <View style={{ marginTop: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor16Bold }}>
                    Hair Cutting
                </Text>
                {
                    hairCuttingServicesList.map((item) => (
                        <View key={`${item.id}`}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => updateState({ selectedHairCuttingServiceId: item.id })}
                                style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ ...Fonts.blackColor14Bold }}>
                                        {item.serviceName}
                                    </Text>
                                    <Text style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.grayColor13Bold }}>
                                        Duration : {item.duration}
                                    </Text>
                                    <Text style={{ lineHeight: 17.0, ...Fonts.grayColor13Bold }}>
                                        {item.serviceDetail}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{
                                        backgroundColor: selectedHairCuttingServiceId == item.id ? 'transparent' : Colors.lightGrayColor,
                                        borderColor: selectedHairCuttingServiceId == item.id ? Colors.primaryColor : Colors.lightGrayColor,
                                        ...styles.radioButtonStyle,
                                    }}>
                                        {
                                            selectedHairCuttingServiceId == item.id
                                                ?
                                                <View style={{
                                                    backgroundColor: Colors.primaryColor,
                                                    width: 6.0,
                                                    height: 6.0,
                                                    borderRadius: 3.0
                                                }}
                                                />
                                                :
                                                null
                                        }
                                    </View>
                                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.primaryColor14Bold }}>
                                        {`$`}{item.amount.toFixed(2)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            {
                                hairCuttingServicesList.length == 1
                                    ?
                                    null
                                    :
                                    <View style={{
                                        height: 1.0,
                                        backgroundColor: Colors.grayColor,
                                        marginTop: Sizes.fixPadding + 5.0,
                                        marginBottom: Sizes.fixPadding + 2.0,
                                    }} />
                            }
                        </View>
                    ))
                }
            </View>
        )
    }

    function hairColoringServices() {
        return (
            <View style={{ marginTop: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor16Bold }}>
                    Hair Coloring
                </Text>
                {
                    hairColoringServicesList.map((item) => (
                        <View key={`${item.id}`}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => updateState({ selectedHairColorServiceId: item.id })}
                                style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ ...Fonts.blackColor14Bold }}>
                                        {item.serviceName}
                                    </Text>
                                    <Text style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.grayColor13Bold }}>
                                        Duration : {item.duration}
                                    </Text>
                                    <Text style={{ lineHeight: 17.0, ...Fonts.grayColor13Bold }}>
                                        {item.serviceDetail}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{
                                        backgroundColor: selectedHairColorServiceId == item.id ? 'transparent' : Colors.lightGrayColor,
                                        borderColor: selectedHairColorServiceId == item.id ? Colors.primaryColor : Colors.lightGrayColor,
                                        ...styles.radioButtonStyle,
                                    }}>
                                        {
                                            selectedHairColorServiceId == item.id
                                                ?
                                                <View style={{
                                                    backgroundColor: Colors.primaryColor,
                                                    width: 6.0,
                                                    height: 6.0,
                                                    borderRadius: 3.0
                                                }}
                                                />
                                                :
                                                null
                                        }
                                    </View>
                                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.primaryColor14Bold }}>
                                        {`$`}{item.amount.toFixed(2)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{
                                height: 1.0,
                                backgroundColor: Colors.grayColor,
                                marginTop: Sizes.fixPadding + 5.0,
                                marginBottom: Sizes.fixPadding + 2.0,
                            }} />
                        </View>
                    ))
                }
            </View>
        )
    }

    function hairWashServices() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor16Bold }}>
                    Hair Wash
                </Text>
                {
                    hairWashServicesList.map((item) => (
                        <View key={`${item.id}`}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => updateState({ selectedHairWashServiceId: item.id })}
                                style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ ...Fonts.blackColor14Bold }}>
                                        {item.serviceName}
                                    </Text>
                                    <Text style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.grayColor13Bold }}>
                                        Duration : {item.duration}
                                    </Text>
                                    <Text style={{ lineHeight: 17.0, ...Fonts.grayColor13Bold }}>
                                        {item.serviceDetail}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{
                                        backgroundColor: selectedHairWashServiceId == item.id ? 'transparent' : Colors.lightGrayColor,
                                        borderColor: selectedHairWashServiceId == item.id ? Colors.primaryColor : Colors.lightGrayColor,
                                        ...styles.radioButtonStyle,
                                    }}>
                                        {
                                            selectedHairWashServiceId == item.id
                                                ?
                                                <View style={{
                                                    backgroundColor: Colors.primaryColor,
                                                    width: 6.0,
                                                    height: 6.0,
                                                    borderRadius: 3.0
                                                }}
                                                />
                                                :
                                                null
                                        }
                                    </View>
                                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.primaryColor14Bold }}>
                                        {`$`}{item.amount.toFixed(2)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{
                                height: 1.0,
                                backgroundColor: Colors.grayColor,
                                marginTop: Sizes.fixPadding + 5.0,
                                marginBottom: Sizes.fixPadding + 2.0,
                            }} />
                        </View>
                    ))
                }
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
                    Hairstyle
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
    radioButtonStyle: {
        width: 15.0,
        height: 15.0,
        borderRadius: 7.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.0,
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

export default ServiceDetailScreen;