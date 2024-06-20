import React, { useState } from "react";
import { View, Dimensions, FlatList, TouchableOpacity, ImageBackground, Platform, StyleSheet, Image, Text } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { Snackbar } from 'react-native-paper';
import MyStatusBar from "../../components/myStatusBar";
import CollapsibleToolbar from 'react-native-collapsible-toolbar';

const { width } = Dimensions.get('window');

const aboutSpecialist = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
];

const hairstylesList = [
    require('../../assets/images/hairstyle/hairstyle1.png'),
    require('../../assets/images/hairstyle/hairstyle2.png'),
    require('../../assets/images/hairstyle/hairstyle3.png'),
    require('../../assets/images/hairstyle/hairstyle4.png'),
    require('../../assets/images/hairstyle/hairstyle4.png')
];

const reviewsList = [
    {
        id: '1',
        userImage: require('../../assets/images/users/user1.png'),
        userName: 'Mitali John',
        rating: 4.0,
        reviewTime: '2 min ago',
        review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        id: '2',
        userImage: require('../../assets/images/users/user2.png'),
        userName: 'Raj Mehta',
        rating: 3.0,
        reviewTime: '2 days ago',
        review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
];

const SpecialistDetailScreen = ({ navigation, route }) => {

    const item = route.params.item;

    const salonInfo = route.params.salonInfo;

    const [state, setState] = useState({
        isFavorite: false,
        readMore: false,
        showSnackBar: false,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        isFavorite,
        readMore,
        showSnackBar,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <CollapsibleToolbar
                renderContent={() => (
                    <View style={{ flex: 1 }}>

                        {specialistInfo()}
                        {aboutInfo()}
                        {divider()}
                        {openingHoursInfo()}
                        {divider()}
                        {locationInfo()}
                        {divider()}
                        {photosOfHairStyle()}
                        {divider()}
                        {reviewsInfo()}
                    </View>
                )}
                renderNavBar={() => header()}
                renderToolBar={() => salonImage()}
                collapsedNavBarBackgroundColor={Colors.primaryColor}
                toolBarHeight={230}
                automaticallyAdjustKeyboardInsets={true}
                showsVerticalScrollIndicator={false}
            />
            <Snackbar
                style={styles.snackBarStyle}
                visible={showSnackBar}
                onDismiss={() => updateState({ showSnackBar: false })}
            >
                {isFavorite ? 'Item added to favorite' : 'Item remove from favorite'}
            </Snackbar>
        </View>
    )

    function salonImage() {
        return (
            <ImageBackground
                source={salonInfo.salonImage}
                style={{
                    width: '100%',
                    height: 230,
                }}
                resizeMode="cover"
            >
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'flex-end'
                }}>
                </View>
            </ImageBackground>
        )
    }

    function header() {
        return (
            <View style={{
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginTop: Platform.OS == 'ios' ? 0 : Sizes.fixPadding + 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <MaterialIcons
                    name="arrow-back-ios"
                    color={Colors.whiteColor}
                    size={24}
                    onPress={() => navigation.pop()}
                />
                <MaterialIcons
                    name={isFavorite ? "favorite" : "favorite-border"}
                    color={Colors.whiteColor}
                    size={24}
                    onPress={() => updateState({ isFavorite: !isFavorite, showSnackBar: true, })}
                />
            </View>
        )
    }

    function reviewsInfo() {
        return (
            <View style={{
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginBottom: Sizes.fixPadding - 5.0,
            }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor16Bold }}>
                    Reviews
                </Text>
                {
                    reviewsList.map((item) => (
                        <View key={`${item.id}`}>
                            <View style={{ marginBottom: Sizes.fixPadding }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={item.userImage}
                                        style={{ width: 40.0, height: 40.0, borderRadius: 20.0, }}
                                    />
                                    <View style={{ marginLeft: Sizes.fixPadding, }}>
                                        <Text style={{ ...Fonts.blackColor14Bold }}>
                                            {item.userName}
                                        </Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            {showRating({ rate: item.rating })}
                                            <Text style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.grayColor12SemiBold }}>
                                                {item.reviewTime}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={{ ...Fonts.grayColor13SemiBold }}>
                                    {item.review}
                                </Text>
                            </View>
                        </View>
                    ))
                }
            </View>
        )
    }

    function photosOfHairStyle() {

        const renderItem = ({ item }) => (
            <View style={styles.hairStyleImageWrapStyle}>
                <Image
                    source={item}
                    style={{
                        width: 75.0,
                        height: 75.0,
                        borderRadius: Sizes.fixPadding,
                    }}
                />
            </View>
        )

        return (
            <View style={{ marginBottom: Sizes.fixPadding }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor16Bold }}>
                    Photos of {item.specialistName}'s hair style
                </Text>
                <FlatList
                    data={hairstylesList}
                    keyExtractor={(index, item) => `${index}${item}`}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding * 2.0,
                        paddingTop: Sizes.fixPadding,
                    }}
                />
            </View>
        )
    }

    function locationInfo() {
        return (
            <View style={{
                marginVertical: Sizes.fixPadding - 5.0,
                marginHorizontal: Sizes.fixPadding * 2.0,
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <View>
                        <Text style={{
                            marginBottom: Sizes.fixPadding,
                            lineHeight: 18.0, ...Fonts.blackColor16Bold
                        }}>
                            Location
                        </Text>
                        <Text style={{ maxWidth: width - 160.0, ...Fonts.grayColor12SemiBold }}>
                            {salonInfo.salonAddress}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome
                                name="location-arrow"
                                size={15}
                                color={Colors.primaryColor}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.primaryColor12Bold }}>
                                Get directions - 5.2km
                            </Text>
                        </View>
                    </View>
                    <View style={styles.mapViewWrapStyle}>
                        <MapView
                            style={{
                                width: 110.0,
                                height: 90.0,
                            }}
                            initialRegion={{
                                latitude: 37.78825,
                                longitude: -122.4324,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                        />
                    </View>
                </View>
            </View>
        )
    }

    function openingHoursInfo() {
        return (
            <View style={{
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginBottom: Sizes.fixPadding - 5.0,
            }}>
                <Text style={{ ...Fonts.blackColor16Bold }}>
                    Opening Hours
                </Text>
                <View style={styles.openingHoursWrapStyle}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ ...Fonts.grayColor13Bold }}>
                            Monday-Friday
                        </Text>
                        <Text style={{ lineHeight: 17.0, ...Fonts.primaryColor14Bold }}>
                            9:00 am - 9:00 pm
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ ...Fonts.grayColor13Bold }}>
                            Monday-Friday
                        </Text>
                        <Text style={{ lineHeight: 17.0, ...Fonts.primaryColor14Bold }}>
                            9:00 am - 9:00 pm
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    function divider() {
        return (
            <View style={{
                backgroundColor: Colors.grayColor,
                height: 2.0,
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginVertical: Sizes.fixPadding,
            }} />
        )
    }

    function aboutInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Bold }}>
                    About {item.specialistName}
                </Text>
                <View>
                    {
                        aboutSpecialist.map((item, index) => (
                            <View key={`${index}`} >
                                {readMore ?
                                    <View style={{}}>
                                        <Text style={{ ...Fonts.grayColor13Bold }}>
                                            {`        `}{item}
                                        </Text>
                                        {index == aboutSpecialist.length - 1 ?
                                            <Text
                                                onPress={() => updateState({ readMore: false })}
                                                style={{ alignSelf: 'flex-end', ...Fonts.primaryColor14Bold }}
                                            >
                                                Show Less
                                            </Text>
                                            : null
                                        }
                                    </View>
                                    :
                                    index < 2
                                        ?
                                        <View style={{}}>
                                            <Text style={{ ...Fonts.grayColor13Bold }}>
                                                {`        `}{item}
                                            </Text>
                                            {index == 1 ?
                                                <Text
                                                    onPress={() => updateState({ readMore: true })}
                                                    style={{ alignSelf: 'flex-end', ...Fonts.primaryColor14Bold }}
                                                >
                                                    ReadMore
                                                </Text>
                                                : null}
                                        </View>
                                        :
                                        null
                                }
                            </View>
                        ))
                    }
                </View>
            </View >
        )
    }

    function specialistInfo() {
        return (
            <View style={{
                alignItems: 'center',
                marginTop: -40
            }}>
                <View style={{}}>
                    <Image
                        source={item.specialistImage}
                        style={styles.specialistImageStyle}
                    />
                </View>
                <Text style={{ ...Fonts.blackColor16Bold, marginTop: Sizes.fixPadding * 1.5 }}>
                    {item.specialistName}
                </Text>
                <Text style={{ ...Fonts.grayColor14Bold }}>
                    {item.speciality} at {salonInfo.salonName}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {showRating({ rate: salonInfo.rating })}
                    <Text style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.grayColor13Bold }}>
                        ({salonInfo.reviews} reviews)
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: Sizes.fixPadding - 5.0,
                }}>
                    {callChatBookOptions({ image: require('../../assets/images/icons/calling.png'), title: 'Call' })}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('ChatDetail')}
                    >
                        {callChatBookOptions({ image: require('../../assets/images/icons/chat.png'), title: 'Chat' })}
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('ScheduleAppointment')}
                    >
                        {callChatBookOptions({ image: require('../../assets/images/icons/appointment.png'), title: 'Book' })}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function callChatBookOptions({ image, title }) {
        return (
            <View style={{ alignItems: 'center' }}>
                <View style={styles.callChatBookOptionsWrapStyle}>
                    <Image
                        source={image}
                        style={{ width: 15.0, height: 15.0, }}
                        resizeMode="contain"
                        tintColor={Colors.primaryColor}
                    />
                </View>
                <Text style={{ ...Fonts.grayColor13SemiBold }}>
                    {title}
                </Text>
            </View>
        )
    }

    function showRating({ rate }) {
        const rating = Math.ceil(rate);
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {
                    rating == 1 || rating == 2 || rating == 3 || rating == 4 || rating == 5
                        ?
                        <AntDesign
                            name="star"
                            color={Colors.yellowColor}
                            size={14}
                            style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                        />
                        :
                        <AntDesign
                            name="star"
                            color={Colors.lightGrayColor}
                            size={14}
                            style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                        />
                }
                {
                    rating == 2 || rating == 3 || rating == 4 || rating == 5
                        ?
                        <AntDesign
                            name="star"
                            color={Colors.yellowColor}
                            size={14}
                            style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                        />
                        :
                        <AntDesign
                            name="star"
                            color={Colors.lightGrayColor}
                            size={14}
                            style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                        />
                }
                {
                    rating == 3 || rating == 4 || rating == 5
                        ?
                        <AntDesign
                            name="star"
                            color={Colors.yellowColor}
                            size={14}
                            style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                        />
                        :
                        <AntDesign
                            name="star"
                            color={Colors.lightGrayColor}
                            size={14}
                            style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                        />
                }
                {
                    rating == 4 || rating == 5
                        ?
                        <AntDesign
                            name="star"
                            color={Colors.yellowColor}
                            size={14}
                            style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                        />
                        :
                        <AntDesign
                            name="star"
                            color={Colors.lightGrayColor}
                            size={14}
                            style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                        />
                }
                {
                    rating == 5
                        ?
                        <AntDesign
                            name="star"
                            color={Colors.yellowColor}
                            size={14}
                            style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                        />
                        :
                        <AntDesign
                            name="star"
                            color={Colors.lightGrayColor}
                            size={14}
                            style={{ marginHorizontal: Sizes.fixPadding - 8.0, }}
                        />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    callChatBookOptionsWrapStyle: {
        width: 32.0,
        height: 32.0,
        borderRadius: 16.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.primaryColor,
        marginHorizontal: Sizes.fixPadding,
        borderWidth: 1.0,
    },
    specialistImageStyle: {
        width: 85.0,
        height: 85.0,
        borderRadius: 42.5,
        borderColor: Colors.primaryColor,
        borderWidth: 2.0,
    },
    openingHoursWrapStyle: {
        marginTop: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    mapViewWrapStyle: {
        width: 110.0,
        height: 90.0,
        backgroundColor: Colors.grayColor,
        borderRadius: Sizes.fixPadding,
        overflow: 'hidden'
    },
    hairStyleImageWrapStyle: {
        width: 75.0,
        height: 75.0,
        borderRadius: Sizes.fixPadding,
        marginRight: Sizes.fixPadding * 2.0,
        borderColor: 'rgba(197, 197, 197, 0.3)',
        borderWidth: 1.5,
        elevation: 5.0,
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: -10.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
        elevation: 0.0,
    }
});

export default SpecialistDetailScreen;