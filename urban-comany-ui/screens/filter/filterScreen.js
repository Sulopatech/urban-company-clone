import React, { useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import { Slider } from '@miblanchard/react-native-slider';

const servicesList = [
    'Facial makeup', 'Trim & Saving', 'Body care', 'Spa', 'Hair cuting', 'Hairstyle', 'Hair color',
];

const shortByOptionsList = ['Most popular', 'Cost low to high', 'Cost high to low', 'Near by'];

const FilterScreen = ({ navigation }) => {

    const [state, setState] = useState({
        selectedService: servicesList[5],
        currentGenderTypeIndex: 2,
        selectedShort: shortByOptionsList[1],
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        selectedService,
        currentGenderTypeIndex,
        selectedShort,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <FlatList
                    ListHeaderComponent={
                        <>
                            {servicesInfo()}
                            {ratingInfo({ rate: 3.0, })}
                            {genderInfo()}
                            {shortByInfo()}
                            {distanceInfo()}
                            {priceInfo()}
                            {applyAndCancel()}
                        </>
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0, }}
                />
            </View>
        </View>
    )

    function applyAndCancel() {
        return (
            <View style={styles.applyAndCancelWrapStyle}>
                <Text
                    onPress={() => navigation.pop()}
                    style={{ ...Fonts.primaryColor16Bold }}
                >
                    Apply
                </Text>
                <Text
                    onPress={() => navigation.pop()}
                    style={{ ...Fonts.grayColor16Bold }}
                >
                    Cancel
                </Text>
            </View>
        )
    }

    function priceInfo() {
        return (
            <View style={{ marginVertical: Sizes.fixPadding + 5.0, marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Bold, }}>
                    Price
                </Text>
                <PriceSlider />
            </View>
        )
    }

    function distanceInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Bold, }}>
                    Distance
                </Text>
                <DistanceSlider />
            </View>
        )
    }

    function shortByInfo() {
        return (
            <View style={{
                marginTop: Sizes.fixPadding + 5.0,
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginBottom: Sizes.fixPadding - 5.0,
            }}>
                <Text style={{ ...Fonts.blackColor16Bold, marginBottom: Sizes.fixPadding, }}>
                    Short by
                </Text>
                {
                    shortByOptionsList.map((item, index) => (
                        <View key={`${index}`}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => updateState({ selectedShort: item })}
                                style={styles.shortByOptionWrapStyle}
                            >
                                <View
                                    style={{
                                        backgroundColor: selectedShort == item ? 'transparent' : Colors.lightGrayColor,
                                        borderColor: selectedShort == item ? Colors.primaryColor : Colors.lightGrayColor,
                                        ...styles.radioButtonStyle,
                                    }}
                                >
                                    {
                                        selectedShort == item
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
                                <Text style={{
                                    marginLeft: Sizes.fixPadding,
                                    ...selectedShort == item ? { ...Fonts.primaryColor14Bold } : { ...Fonts.grayColor14Bold }
                                }}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))
                }
            </View>
        )
    }

    function genderInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.blackColor16Bold }}>
                    Gender
                </Text>
                <View style={{ marginTop: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center' }}>
                    {genderType({ gender: 'Men', index: 1 })}
                    {genderType({ gender: 'Women', index: 2 })}
                    {genderType({ gender: 'Other', index: 3 })}
                </View>
            </View>
        )
    }

    function genderType({ gender, index }) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => updateState({ currentGenderTypeIndex: index })}
                style={{
                    marginRight: Sizes.fixPadding * 2.5,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <View style={{
                    backgroundColor: currentGenderTypeIndex == index ? 'transparent' : Colors.lightGrayColor,
                    borderColor: currentGenderTypeIndex == index ? Colors.primaryColor : Colors.lightGrayColor,
                    ...styles.radioButtonStyle,
                }}>
                    {
                        currentGenderTypeIndex == index
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
                <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.grayColor14Bold }}>
                    {gender}
                </Text>
            </TouchableOpacity>
        )
    }

    function ratingInfo({ rate }) {
        const rating = Math.floor(rate);
        return (
            <View style={{ marginVertical: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.blackColor16Bold }}>
                    Rating
                </Text>
                <View style={{ marginTop: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center' }}>
                    {
                        rating == 1 || rating == 2 || rating == 3 || rating == 4 || rating == 5
                            ?
                            <AntDesign
                                name="star"
                                color={Colors.yellowColor}
                                size={15}
                                style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                            />
                            :
                            <AntDesign
                                name="star"
                                color={Colors.lightGrayColor}
                                size={15}
                                style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                            />
                    }
                    {
                        rating == 2 || rating == 3 || rating == 4 || rating == 5
                            ?
                            <AntDesign
                                name="star"
                                color={Colors.yellowColor}
                                size={15}
                                style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                            />
                            :
                            <AntDesign
                                name="star"
                                color={Colors.lightGrayColor}
                                size={15}
                                style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                            />
                    }
                    {
                        rating == 3 || rating == 4 || rating == 5
                            ?
                            <AntDesign
                                name="star"
                                color={Colors.yellowColor}
                                size={15}
                                style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                            />
                            :
                            <AntDesign
                                name="star"
                                color={Colors.lightGrayColor}
                                size={15}
                                style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                            />
                    }
                    {
                        rating == 4 || rating == 5
                            ?
                            <AntDesign
                                name="star"
                                color={Colors.yellowColor}
                                size={15}
                                style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                            />
                            :
                            <AntDesign
                                name="star"
                                color={Colors.lightGrayColor}
                                size={15}
                                style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                            />
                    }
                    {
                        rating == 5
                            ?
                            <AntDesign
                                name="star"
                                color={Colors.yellowColor}
                                size={15}
                                style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                            />
                            :
                            <AntDesign
                                name="star"
                                color={Colors.lightGrayColor}
                                size={15}
                                style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                            />
                    }
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.grayColor14Bold }}>
                        {rating} star
                    </Text>
                </View>
            </View>
        )
    }

    function servicesInfo() {

        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => updateState({ selectedService: item })}
                style={{
                    backgroundColor: selectedService == item ? Colors.primaryColor : 'transparent',
                    borderColor: selectedService == item ? Colors.primaryColor : Colors.grayColor,
                    ...styles.serviceWrapStyle,
                }}>
                <Text style={selectedService == item ? { ...Fonts.whiteColor13Bold } : { ...Fonts.grayColor13Bold }}>
                    {item}
                </Text>
            </TouchableOpacity>
        )
        return (
            <View>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor16Bold }}>
                    Services
                </Text>
                <View style={{ marginHorizontal: Sizes.fixPadding + 5.0, marginTop: Sizes.fixPadding + 5.0 }}>
                    <FlatList
                        scrollEnabled={false}
                        data={servicesList}
                        numColumns={7}
                        keyExtractor={(index) => `${index}`}
                        renderItem={renderItem}
                        columnWrapperStyle={{ flexWrap: 'wrap' }}
                    />
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
                    Filter
                </Text>
            </View>
        )
    }
}

const DistanceSlider = () => {
    const [multiSliderValue, setMultiSliderValue] = useState(5);
    const [showNotch, setShowNotch] = useState(false);

    return (
        <View style={{ marginTop: Sizes.fixPadding - 20.0, }}>
            <Text style={{
                ...Fonts.grayColor14Bold,
                alignSelf: 'flex-end',
                marginRight: Sizes.fixPadding * 2.0,
            }}>
                {parseFloat(multiSliderValue).toFixed(1)}km
            </Text>
            <View style={{ justifyContent: 'center' }}>
                <Slider
                    value={multiSliderValue}
                    minimumValue={0}
                    maximumValue={8}
                    onValueChange={(value) => { setMultiSliderValue(value) }}
                    containerStyle={{ height: 20.0, marginHorizontal: 20.0, width: '100%', alignSelf: 'center' }}
                    trackStyle={{ height: 2.5, }}
                    thumbStyle={{ backgroundColor: Colors.primaryColor, width: 16, height: 16 }}
                    minimumTrackTintColor={Colors.primaryColor}
                    maximumTrackTintColor={Colors.lightGrayColor}
                    onSlidingStart={() => setShowNotch(true)}
                    onSlidingComplete={() => setShowNotch(false)}
                    renderAboveThumbComponent={() => (
                        <View style={{ alignItems: 'center', left: -17.0, }}>
                            {
                                showNotch
                                    ?
                                    <View style={{ alignItems: 'center', }}>
                                        <View style={{ ...styles.sliderValueWrapStyle, width: 35.0, height: 35.0, }} >
                                            <Text style={{ ...Fonts.whiteColor12Medium, }}>
                                                {parseFloat(multiSliderValue).toFixed(1)}
                                            </Text>
                                        </View>
                                        <View style={{ ...styles.sliderNotchStyle, }} />
                                    </View>
                                    :
                                    null
                            }
                        </View>
                    )}
                />
                <View style={{ ...styles.sliderThumbStyle, position: 'absolute', }} />
            </View>
        </View>
    )
}

const PriceSlider = () => {
    const [multiSliderValue, setMultiSliderValue] = useState(550);
    const [showNotch, setShowNotch] = useState(false);

    return (
        <View style={{ marginTop: Sizes.fixPadding - 20.0, }}>
            <Text style={{
                ...Fonts.grayColor14Bold,
                alignSelf: 'flex-end',
                marginRight: Sizes.fixPadding * 2.0,
            }}>
                ${parseInt(multiSliderValue)}
            </Text>
            <View style={{ justifyContent: 'center' }}>
                <Slider
                    value={multiSliderValue}
                    minimumValue={0}
                    maximumValue={1000}
                    onValueChange={(value) => { setMultiSliderValue(value) }}
                    containerStyle={{ height: 20.0, marginHorizontal: 20.0, width: '100%', alignSelf: 'center' }}
                    trackStyle={{ height: 2.5, }}
                    thumbStyle={{ backgroundColor: Colors.primaryColor, width: 16, height: 16 }}
                    minimumTrackTintColor={Colors.primaryColor}
                    maximumTrackTintColor={Colors.lightGrayColor}
                    renderAboveThumbComponent={() => (
                        <View style={{ alignItems: 'center', left: -17.0, }}>
                            {
                                showNotch
                                    ?
                                    <View style={{ alignItems: 'center', }}>
                                        <View style={{ ...styles.sliderValueWrapStyle, width: 35.0, height: 35.0, }} >
                                            <Text style={{ ...Fonts.whiteColor12Medium, }}>
                                                {parseInt(multiSliderValue)}
                                            </Text>
                                        </View>
                                        <View style={{ ...styles.sliderNotchStyle, }} />
                                    </View>
                                    :
                                    null
                            }
                        </View>
                    )}
                    onSlidingStart={() => setShowNotch(true)}
                    onSlidingComplete={() => setShowNotch(false)}
                />
                <View style={{ ...styles.sliderThumbStyle, position: 'absolute', }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 5.0
    },
    serviceWrapStyle: {
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 3.0,
        marginHorizontal: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding - 8.0,
    },
    radioButtonStyle: {
        width: 15.0, height: 15.0,
        borderRadius: 7.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.0,
    },
    shortByOptionWrapStyle: {
        marginRight: Sizes.fixPadding * 2.5,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Sizes.fixPadding - 5.0,
        alignSelf: 'flex-start'
    },
    sliderThumbStyle: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        backgroundColor: Colors.primaryColor,
    },
    inactiveSliderStyle: {
        flex: 1,
        height: 2.5,
        borderRadius: 2,
        backgroundColor: Colors.lightGrayColor,
    },
    selectedSliderStyle: {
        height: 3.5,
        backgroundColor: Colors.primaryColor,
        borderRadius: 2,
    },
    distanceSliderLabelWrapStyle: {
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8.0,
        backgroundColor: Colors.primaryColor,
        borderRadius: 20,
    },
    priceSliderLabelWrapStyle: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.primaryColor,
        borderRadius: 20,
    },
    sliderNotchStyle: {
        width: 10,
        height: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: Colors.primaryColor,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderTopWidth: 15,
        marginBottom: -7.0,
        marginTop: -1.0,
    },
    applyAndCancelWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding,
    },
    sliderValueWrapStyle: {
        width: 30.0,
        height: 30.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: Sizes.fixPadding,
        borderTopRightRadius: Sizes.fixPadding,
        backgroundColor: Colors.primaryColor
    }
});

export default FilterScreen;