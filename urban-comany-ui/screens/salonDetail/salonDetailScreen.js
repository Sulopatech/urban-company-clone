import React, { useState } from "react";
import { View, Dimensions, FlatList, TouchableOpacity, TextInput, ScrollView, ImageBackground, StyleSheet, Image, Text, Platform } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { Snackbar } from 'react-native-paper';
import MyStatusBar from "../../components/myStatusBar";
import CollapsibleToolbar from 'react-native-collapsible-toolbar';
import { GET_PRODUCT_DETAIL } from "../../services/salonDetails";
import { useQuery } from "@apollo/client";

const { width } = Dimensions.get('window');

const packageAndOffersList = [
    {
        id: '1',
        salonImage: require('../../assets/images/offer/offer2.png'),
        packageName: 'Haircut and Hairstyle',
        packageAvailable: 'Nov 26,2021',
        packageAmount: 160.50,
        offer: 25
    },
    {
        id: '2',
        salonImage: require('../../assets/images/offer/offer3.png'),
        packageName: 'Bridal Beauty Makeup',
        packageAvailable: 'Nov 26,2021',
        packageAmount: 850.50,
        offer: 25
    }
];

const aboutList = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
];

// const specialists = [
//     {
//         id: '1',
//         specialistImage: require('../../assets/images/specialists/specialist1.png'),
//         specialistName: 'Sora',
//         speciality: 'Manager',
//     },
//     {
//         id: '2',
//         specialistImage: require('../../assets/images/specialists/specialist2.png'),
//         specialistName: 'Joya',
//         speciality: 'Hair stylist',
//     },
//     {
//         id: '3',
//         specialistImage: require('../../assets/images/salon/salon4.png'),
//         specialistName: 'Doe',
//         speciality: 'St.Barber',
//     },
//     {
//         id: '4',
//         specialistImage: require('../../assets/images/specialists/specialist3.png'),
//         specialistName: 'Helina',
//         speciality: 'M.Artist',
//     },
//     {
//         id: '5',
//         specialistImage: require('../../assets/images/specialists/specialist4.png'),
//         specialistName: 'Robat',
//         speciality: 'Hair Stylist',
//     },
//     {
//         id: '6',
//         specialistImage: require('../../assets/images/specialists/specialist4.png'),
//         specialistName: 'Robat',
//         speciality: 'Hair Stylist',
//     }
// ];

const servicesList = [
    {
        id: '1',
        serviceImage: require('../../assets/images/icons/hairstyle.png'),
        serviceName: 'Hairstyle',
        serviceTypes: 10,
        bgColor: '#EF9A9A',
    },
    {
        id: '2',
        serviceImage: require('../../assets/images/icons/hairdryer.png'),
        serviceName: 'Hairdryer',
        serviceTypes: 5,
        bgColor: '#F48FB1',
    },
    {
        id: '3',
        serviceImage: require('../../assets/images/icons/shaving.png'),
        serviceName: 'Shaving',
        serviceTypes: 6,
        bgColor: '#CE93D8',
    },
    {
        id: '4',
        serviceImage: require('../../assets/images/icons/makeup.png'),
        serviceName: 'Makeup',
        serviceTypes: 10,
        bgColor: '#90CAF9',
    },
    {
        id: '5',
        serviceImage: require('../../assets/images/icons/nails.png'),
        serviceName: 'Nails',
        serviceTypes: 5,
        bgColor: '#80CBC4',
    },
    {
        id: '6',
        serviceImage: require('../../assets/images/icons/coloring.png'),
        serviceName: 'Coloring',
        serviceTypes: 6,
        bgColor: '#EF9A9A',
    },
    {
        id: '7',
        serviceImage: require('../../assets/images/icons/massage.png'),
        serviceName: 'Massage',
        serviceTypes: 6,
        bgColor: '#F48FB1',
    },
];

// const galleryImagesList = [
//     {
//         id: '1',
//         image: require('../../assets/images/gallery/img1.png'),
//         aspectRatio: 1
//     },
//     {
//         id: '2',
//         image: require('../../assets/images/gallery/img2.png'),
//         aspectRatio: 200 / 145,
//     },
//     {
//         id: '3',
//         image: require('../../assets/images/gallery/img3.png'),
//         aspectRatio: 180 / 145,
//     },
//     {
//         id: '4',
//         image: require('../../assets/images/gallery/img4.png'),
//         aspectRatio: 180 / 145,
//     },
//     {
//         id: '5',
//         image: require('../../assets/images/gallery/img5.png'),
//         aspectRatio: 1,
//     },
//     {
//         id: '6',
//         image: require('../../assets/images/gallery/img6.png'),
//         aspectRatio: 120 / 145,
//     },
//     {
//         id: '7',
//         image: require('../../assets/images/gallery/img7.png'),
//         aspectRatio: 210 / 145,
//     },
//     {
//         id: '8',
//         image: require('../../assets/images/gallery/img8.png'),
//         aspectRatio: 160 / 145,
//     },
//     {
//         id: '9',
//         image: require('../../assets/images/gallery/img9.png'),
//         aspectRatio: 130 / 145,
//     }
// ];

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

const SalonDetailScreen = ({ navigation, route }) => {

    const item = route.params.item;

    const [state, setState] = useState({
        currentSelectedIndex: 1,
        readMore: false,
        review: null,
        isFavorite: false,
        showSnackBar: false,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        currentSelectedIndex,
        readMore,
        review,
        isFavorite,
        showSnackBar,
    } = state;
       
    const { loading, error, data } = useQuery(GET_PRODUCT_DETAIL, {
        variables: { slug: "Laptop" }, 
    });
    
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;
    
    const { product } = data;
    console.log("data",data)

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                <CollapsibleToolbar
                    renderContent={() => (
                        <View style={{ flex: 1 }}>
                            {options()}
                            {divider()}
                            {/* {salonSpecialists()} */}
                            {tabBarOptions()}
                            {
                                currentSelectedIndex == 1
                                    ?
                                    salonAboutInfo()
                                    :
                                    currentSelectedIndex == 2
                                        ?
                                        salonServicesInfo()
                                        :
                                        reviewInfo()
                                        // currentSelectedIndex == 3
                                        //     ?
                                        //     galleryInfo()
                                        //     :
                                          
                            }
                        </View>
                    )}
                    renderNavBar={() => header()}
                    renderToolBar={() => salonImage()}
                    collapsedNavBarBackgroundColor={Colors.primaryColor}
                    toolBarHeight={230}
                    automaticallyAdjustKeyboardInsets={true}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            {bookAppintmentButton()}
            <Snackbar
                style={styles.snackBarStyle}
                visible={showSnackBar}
                elevation={0}
                onDismiss={() => updateState({ showSnackBar: false })}
            >
                {isFavorite ? 'Item added to favorite' : 'Item remove from favorite'}
            </Snackbar>
        </View>
    )

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

    function salonImage() {
        return (
            <ImageBackground
                source={item.salonImage}
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
                    <View style={styles.salonInfoWrapStyle}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    numberOfLines={1}
                                    style={{ maxWidth: width - 150.0, ...Fonts.whiteColor16Bold }}
                                >
                                    {item.salonName}
                                </Text>
                                <Text style={{ marginLeft: Sizes.fixPadding - 6.0, ...Fonts.primaryColor10Bold }}>
                                    {product.name}
                                </Text>
                            </View>
                            <Text
                                numberOfLines={1}
                                style={{
                                    width: width - 120.0,
                                    lineHeight: 17.0,
                                    ...Fonts.whiteColor13Medium
                                }}
                            >
                                {item.salonAddress}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {showRating({ rate: item.rating })}
                                <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.whiteColor12Medium }}>
                                    ({item.reviews} Reviews)
                                </Text>
                            </View>
                        </View>
                        <View style={styles.openButtonWrapStyle}>
                            <Text style={{ ...Fonts.whiteColor11Bold }}>
                                Open
                            </Text>
                        </View>
                    </View>
                </View>

            </ImageBackground>
        )
    }

    function reviewInfo() {
        return (
            <View>
                {userReviewInfo()}
                {divider()}
                {allReviewsInfo()}
            </View>
        )
    }

    function allReviewsInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor16Bold }}>
                    All Review(110)
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

    function userReviewInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.blackColor16Bold }}>
                        Write Your review
                    </Text>
                    {showRating({ rate: 4 })}
                </View>
                <View style={{ marginTop: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/images/users/user3.png')}
                        style={{ width: 40.0, height: 40.0, borderRadius: 20.0, }}
                    />
                    <TextInput
                        value={review}
                        onChangeText={(text) => updateState({ review: text })}
                        selectionColor={Colors.primaryColor}
                        placeholder="Write review here"
                        placeholderTextColor={Colors.grayColor}
                        style={styles.reviewTextFieldWrapStyle}
                    />
                </View>
                <View style={styles.postButtonStyle}>
                    <Text style={{ ...Fonts.whiteColor11Bold }}>
                        Post
                    </Text>
                </View>
            </View>
        )
    }

    // function galleryInfo() {
    //     return (
    //         <ScrollView
    //             automaticallyAdjustKeyboardInsets={true}
    //             contentContainerStyle={styles.galleryInfoWrapStyle}
    //             showsVerticalScrollIndicator={false}
    //         >
    //             <View style={{ flexDirection: 'row' }}>
    //                 <View>
    //                     {galleryImagesList
    //                         .filter((_, i) => i % 2 !== 0)
    //                         .map((item,) =>
    //                         (
    //                             <Image
    //                                 key={`${item.id}`}
    //                                 source={item.image}
    //                                 style={{
    //                                     marginRight: Sizes.fixPadding + 5.0,
    //                                     ...styles.galleryImagesStyle,
    //                                     width: (width - 60) / 2.0,
    //                                     height: ((width - 40) / 2.0) * item.aspectRatio
    //                                 }}
    //                                 resizeMode="cover"
    //                             />
    //                         ))}
    //                 </View>
    //                 <View>
    //                     {galleryImagesList
    //                         .filter((_, i) => i % 2 === 0)
    //                         .map((item,) =>
    //                         (
    //                             <Image
    //                                 key={`${item.id}`}
    //                                 source={item.image}
    //                                 style={{
    //                                     ...styles.galleryImagesStyle,
    //                                     width: (width - 40) / 2.0,
    //                                     height: ((width - 40) / 2.0) * item.aspectRatio
    //                                 }}
    //                                 resizeMode="cover"
    //                             />
    //                         ))}
    //                 </View>
    //             </View>
    //         </ScrollView>
    //     )
    // }

    function salonServicesInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor16Bold }}>
                    Services
                </Text>
                {
                    servicesList.map((item) => (
                        <View key={`${item.id}`}>
                            <View style={styles.salonServicesWrapStyle}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <View style={{
                                        ...styles.salonServiceImageWrapStyle,
                                        backgroundColor: item.bgColor,
                                    }}>
                                        <Image
                                            source={item.serviceImage}
                                            style={{ width: 22.0, height: 22.0, }}
                                            resizeMode="contain"
                                            tintColor={Colors.whiteColor}
                                        />
                                    </View>
                                    <View style={{ marginLeft: Sizes.fixPadding, }}>
                                        <Text style={{ marginTop: Sizes.fixPadding - 5.0, lineHeight: 15.0, ...Fonts.blackColor13Bold }}>
                                            {item.serviceName}
                                        </Text>
                                        <Text style={{ ...Fonts.grayColor11SemiBold }}>
                                            {item.serviceTypes}types
                                        </Text>
                                    </View>
                                </View>
                                <Text
                                    onPress={() => navigation.push('ServiceDetail')}
                                    style={{ marginHorizontal: Sizes.fixPadding, ...Fonts.primaryColor14Bold }}
                                >
                                    View
                                </Text>
                            </View>
                        </View>
                    ))
                }
            </View>
        )
    }

    function salonAboutInfo() {
        return (
            <View>
                {aboutInfo()}
                {divider()}
                {openingHoursInfo()}
                {divider()}
                {locationInfo()}
                {divider()}
                {currentPackageAndOffersInfo()}
            </View>
        )
    }

    function bookAppintmentButton() {
        return (
            <View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.push('ScheduleAppointment')}
                    style={styles.bookAppointmentButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Book Appointment
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function currentPackageAndOffersInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor16Bold }}>
                    Current Package & Offers
                </Text>
                {
                    packageAndOffersList.map((item) => (
                        <View key={`${item.id}`}>
                            <ImageBackground
                                source={item.salonImage}
                                style={styles.packageAndOffersImageStyle}
                                borderRadius={Sizes.fixPadding}
                            >
                                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                    <Text
                                        numberOfLines={1}
                                        style={{ marginRight: Sizes.fixPadding, ...Fonts.blackColor18Bold }}
                                    >
                                        {item.packageName}
                                    </Text>
                                    <View style={{ marginTop: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.offerPercentageWrapStyle}>
                                            <Text style={{ ...Fonts.whiteColor14Medium }}>
                                                {item.offer}% off
                                            </Text>
                                        </View>
                                        <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.primaryColor12Bold }}>
                                            {`$`}{item.packageAmount.toFixed(2)}
                                        </Text>
                                    </View>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            lineHeight: 22.0,
                                            ...Fonts.blackColor12Medium
                                        }}
                                    >
                                        Complete package offer till {item.packageAvailable}
                                    </Text>
                                    <Text style={{ ...Fonts.primaryColor14Bold }}>
                                        Book Now
                                    </Text>
                                </View>
                            </ImageBackground>
                        </View>
                    ))
                }
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
                            {item.salonAddress}
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

    function aboutInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Bold }}>
                    About
                </Text>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0 , ...Fonts.grayColor13Bold }}>
                    {product.description}
                </Text>
               
            </View >
        )
    }

    function tabBarOptions() {
        return (
            <View style={styles.tabBarWrapStyle}>
                <Text
                    onPress={() => updateState({ currentSelectedIndex: 1 })}
                    style={currentSelectedIndex == 1 ? { ...Fonts.primaryColor15Bold } : { ...Fonts.grayColor15Bold }}
                >
                    About
                </Text>
                <Text
                    onPress={() => updateState({ currentSelectedIndex: 2 })}
                    style={currentSelectedIndex == 2 ? { ...Fonts.primaryColor15Bold } : { ...Fonts.grayColor15Bold }}
                >
                    Services
                </Text>
                {/* <Text
                    onPress={() => updateState({ currentSelectedIndex: 3 })}
                    style={currentSelectedIndex == 3 ? { ...Fonts.primaryColor15Bold } : { ...Fonts.grayColor15Bold }}
                >
                    Gallery
                </Text> */}
                <Text
                    onPress={() => updateState({ currentSelectedIndex: 4 })}
                    style={currentSelectedIndex == 4 ? { ...Fonts.primaryColor15Bold } : { ...Fonts.grayColor15Bold }}
                >
                    Review
                </Text>
            </View>
        )
    }

    // function salonSpecialists() {

    //     const renderItem = ({ item }) => (
    //         <TouchableOpacity
    //             activeOpacity={0.9}
    //             onPress={() => navigation.push('SpecialistDetail', { item: item, salonInfo: route.params.item })}
    //             style={{
    //                 alignItems: 'center',
    //                 marginRight: Sizes.fixPadding + 5.0,
    //             }}
    //         >
    //             <Image
    //                 source={item.specialistImage}
    //                 style={{ width: 45.0, height: 45.0, borderRadius: Sizes.fixPadding - 5.0, }}
    //             />
    //             <Text style={{ ...Fonts.blackColor12Bold, marginTop: Sizes.fixPadding - 7.0 }}>
    //                 {item.specialistName}
    //             </Text>
    //             <Text style={{ lineHeight: 11.0, ...Fonts.grayColor11SemiBold }}>
    //                 {item.speciality}
    //             </Text>
    //         </TouchableOpacity>
    //     )
    //     return (
    //         <View>
    //             <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor16Bold }}>
    //                 Our Salon Specialists
    //             </Text>
    //             <FlatList
    //                 data={specialists}
    //                 keyExtractor={(item) => `${item.id}`}
    //                 renderItem={renderItem}
    //                 horizontal
    //                 showsHorizontalScrollIndicator={false}
    //                 contentContainerStyle={{
    //                     paddingLeft: Sizes.fixPadding * 2.0,
    //                     paddingTop: Sizes.fixPadding,
    //                 }}
    //             />
    //         </View>
    //     )
    // }

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

    function options() {
        return (
            <View style={styles.tabBarOptionsWrapStyle}>
                {optionsShort({ optionImage: require('../../assets/images/icons/website.png'), option: 'Website' })}
                {optionsShort({ optionImage: require('../../assets/images/icons/call.png'), option: 'Call' })}
                {optionsShort({ optionImage: require('../../assets/images/icons/map_view.png'), option: 'Direction' })}
                {optionsShort({ optionImage: require('../../assets/images/icons/share.png'), option: 'Share' })}
            </View>
        )
    }

    function optionsShort({ optionImage, option }) {
        return (
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={optionImage}
                    style={{ width: 17.0, height: 17.0, }}
                    resizeMode="contain"
                    tintColor={Colors.primaryColor}
                />
                <Text style={{ ...Fonts.primaryColor13Bold }}>
                    {option}
                </Text>
            </View>
        )
    }

    // function salonInfo() {
    //     return (
    //         <View style={styles.salonInfoWrapStyle}>
    //             <View>
    //                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //                     <Text
    //                         numberOfLines={1}
    //                         style={{ maxWidth: width - 150.0, ...Fonts.whiteColor16Bold }}
    //                     >
    //                         {item.salonName}
    //                     </Text>
    //                     <Text style={{ marginLeft: Sizes.fixPadding - 6.0, ...Fonts.primaryColor10Bold }}>
    //                         WOMEN ONLY
    //                     </Text>
    //                 </View>
    //                 <Text
    //                     numberOfLines={1}
    //                     style={{
    //                         width: width - 120.0,
    //                         lineHeight: 17.0,
    //                         ...Fonts.whiteColor13Medium
    //                     }}
    //                 >
    //                     {item.salonAddress}
    //                 </Text>
    //                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //                     {showRating({ rate: item.rating })}
    //                     <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.whiteColor12Medium }}>
    //                         ({item.reviews} Reviews)
    //                     </Text>
    //                 </View>
    //             </View>
    //             <View style={styles.openButtonWrapStyle}>
    //                 <Text style={{ ...Fonts.whiteColor11Bold }}>
    //                     Open
    //                 </Text>
    //             </View>
    //         </View>
    //     )
    // }

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
    salonInfoWrapStyle: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        margin: Sizes.fixPadding * 1.5
    },
    openButtonWrapStyle: {
        borderColor: Colors.whiteColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 2.0,
        alignSelf: 'flex-end',
        paddingHorizontal: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding - 9.0,
    },
    offerPercentageWrapStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: Sizes.fixPadding,
    },
    packageAndOffersImageStyle: {
        width: width - 40,
        height: 135.0,
        borderColor: 'rgba(197, 197, 197, 0.3)',
        borderWidth: 2.0,
        borderRadius: Sizes.fixPadding,
        justifyContent: 'space-between',
        paddingLeft: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding - 5.0,
        paddingBottom: Sizes.fixPadding - 4.0,
        marginRight: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        overflow: 'hidden'
    },
    mapViewWrapStyle: {
        width: 110.0,
        height: 90.0,
        backgroundColor: Colors.grayColor,
        borderRadius: Sizes.fixPadding,
        overflow: 'hidden'
    },
    bookAppointmentButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    tabBarWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderColor: '#fafafa',
        borderWidth: 1.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingTop: Sizes.fixPadding - 5.0,
        paddingBottom: Sizes.fixPadding - 3.0,
        marginTop: Sizes.fixPadding + 10.0,
        marginBottom: Sizes.fixPadding + 5.0,
        ...CommonStyles.shadow
    },
    tabBarOptionsWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 2.0,
    },
    openingHoursWrapStyle: {
        marginTop: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    galleryImagesStyle: {
        marginBottom: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding,
    },
    galleryInfoWrapStyle: {
        marginLeft: Sizes.fixPadding * 2.0,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    postButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 2,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 8.0,
        marginVertical: Sizes.fixPadding - 5.0,
    },
    salonServicesWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.whiteColor,
        elevation: 1.5,
        borderRadius: Sizes.fixPadding,
        borderColor: '#f1f1f1',
        borderWidth: 0.40,
        marginBottom: Sizes.fixPadding * 2.0,
        ...CommonStyles.shadow
    },
    salonServiceImageWrapStyle: {
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        height: 47.0,
        width: 47.0,
    },
    reviewTextFieldWrapStyle: {
        ...Fonts.blackColor14Bold,
        backgroundColor: '#F0F0F0',
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 7.0,
        marginLeft: Sizes.fixPadding + 5.0,
        flex: 1,
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: 55.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
        elevation: 0.0,
    }
});

export default SalonDetailScreen;