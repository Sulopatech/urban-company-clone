import React, { useState, useCallback, useEffect } from "react";
import { View, Dimensions, BackHandler, FlatList, TouchableOpacity, TextInput, ScrollView, ImageBackground, StyleSheet, Image, Text, Platform } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { Snackbar } from 'react-native-paper';
import MyStatusBar from "../../components/myStatusBar";
import CollapsibleToolbar from 'react-native-collapsible-toolbar';
import { GET_PRODUCT_DETAIL } from "../../services/salonDetails";
import { useMutation, useQuery } from "@apollo/client";
import { REMOVE_BOOKING, SERVICE_BOOKING, REMOVE_ALL_BOOKING } from "../../services/Bookings";

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
        currentSelectedIndex: 2,
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

    const [selectedServices, setSelectedServices] = useState([]);
    const [loadingServiceId, setLoadingServiceId] = useState(null);
    const [adding, setAdding] = useState(false);
    const [removing, setRemoving] = useState(false);

    const { variantSlug } = route.params;

    const { loading, error, data } = useQuery(GET_PRODUCT_DETAIL, {
        variables: { slug: variantSlug },
        skip: !variantSlug,
    });

    const [serviceBooking, { loading: serviceBookingLoading, error: serviceBookingError }] = useMutation(SERVICE_BOOKING, {
        onCompleted: async (data) => {
            console.log("BOOKING successfully:", data);
            console.log("order line", data.addItemToOrder.lines);

            const newServices = data.addItemToOrder.lines.map(line => ({
                id: line.productVariant.id,
                name: line.productVariant.name,
                price: line.productVariant.price,
                priceWithTax: line.productVariant.priceWithTax,
                featuredAsset: line.productVariant.featuredAsset,
                orderLineId: line.id, // Store orderLineId
            }));

            setSelectedServices(prevServices => {
                // Filter out any existing services to avoid duplicates
                const updatedServices = prevServices.filter(
                    service => !newServices.some(newService => newService.id === service.id)
                );
                return [...updatedServices, ...newServices];
            });
        },
        onError: (error) => {
            console.error("Error BOOKING:", error);
        },
    });

    const [removeServiceMutation, { loading: removeServiceLoading, error: removeServiceError }] = useMutation(REMOVE_BOOKING);
    const [removeAllBooking, { loading: removeAllLoading, error: removeAllError }] = useMutation(REMOVE_ALL_BOOKING);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                handleBackPress();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [navigation, removeAllBooking])
    );

    const handleBackPress = async () => {
        try {
            await removeAllBooking();
            console.log('All bookings removed successfully');
            navigation.pop();
        } catch (error) {
            console.error('Error removing all bookings:', error);
            navigation.pop();  // Navigate back even if there's an error
        }
    };

    if (loading) return <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor18Bold }}>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    const { product } = data;
    console.log("data", data)
    const servicesListData = product?.variants || [];
    console.log("servicelistdata: ", servicesListData);

    const addService = async (service) => {
        setLoadingServiceId(service.id);
        setAdding(true);
        try {
            await serviceBooking({
                variables: {
                    productVariantId: parseInt(service.id, 10),
                    quantity: 1
                }
            });
            // setSelectedServices(prevServices => prevServices.filter(item => item.id !== service.id));
        } catch (error) {
            console.error("Error Booking: ", error);
        }
        setAdding(false);
        setLoadingServiceId(null);
    };

    const removeService = async (service) => {
        const serviceToRemove = selectedServices.find(item => item.id === service.id);
        if (!serviceToRemove) return;
        setLoadingServiceId(service.id);
        setRemoving(true);

        try {
            await removeServiceMutation({
                variables: {
                    orderLineId: parseInt(serviceToRemove.orderLineId, 10)
                }
            });

            setSelectedServices(prevServices => prevServices.filter(item => item.id !== service.id));
        } catch (error) {
            console.error("Error Removing Service: ", error);
        }
        setRemoving(false);
        setLoadingServiceId(null);
    };

    const isServiceSelected = (service) => {
        return selectedServices.some((item) => item.id === service.id);
    };

    console.log("selected sevices : ", selectedServices);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                <CollapsibleToolbar
                    renderContent={() => (
                        <View style={{ flex: 1 }}>
                            {/* {options()} */}
                            {/* {divider()} */}
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
            {bookAppointmentButton()}
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
                    onPress={() => handleBackPress()}
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
                source={{ uri: product.featuredAsset.preview }}
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
                                    {product.name}
                                </Text>
                                <Text style={{ marginLeft: Sizes.fixPadding - 6.0, ...Fonts.primaryColor10Bold }}>
                                    {/* {product.name} */}
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
                                {product.address ? product.address : "A 9/a Sector 16,Gautam Budh Nagar"}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <AntDesign
                                    name="star"
                                    color={Colors.yellowColor}
                                    size={13}
                                />
                                <Text style={{ ...Fonts.whiteColor12Medium }}>
                                    {product.ratings ? product.ratings : " 4.6 (100 Reviews)"}
                                </Text>
                            </View>
                        </View>
                        {/* <View style={styles.openButtonWrapStyle}>
                            <Text style={{ ...Fonts.whiteColor11Bold }}>
                                Open
                            </Text>
                        </View> */}
                    </View>
                </View>
            </ImageBackground>
        );
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

    function salonServicesInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor16Bold }}>
                    Services
                </Text>
                {
                    servicesListData.map((item) => (
                        <View key={`${item.id}`}>
                            <View style={styles.salonServicesWrapStyle}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: "70%"
                                }}>
                                    <View style={{
                                        ...styles.salonServiceImageWrapStyle,
                                        backgroundColor: item.bgColor,
                                    }}>
                                        <Image
                                            source={{ uri: item.featuredAsset ? item.featuredAsset.preview : "" }}
                                            style={{ width: "100%", height: "100%", borderRadius: Sizes.fixPadding, }}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View style={{ marginLeft: Sizes.fixPadding, }}>
                                        <Text
                                            style={{ marginTop: Sizes.fixPadding - 5.0, lineHeight: 15.0, ...Fonts.blackColor13Bold }}
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                        >
                                            {item.name}
                                        </Text>
                                        <Text style={{ ...Fonts.grayColor12SemiBold }}>
                                            ₹: {item.price} + tax : {item.priceWithTax - item.price} Rs
                                        </Text>
                                        <Text style={{ ...Fonts.grayColor12SemiBold }}>
                                            Total ₹: {item.priceWithTax} Rs
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    {isServiceSelected(item) ? (
                                        <TouchableOpacity onPress={() => removeService(item)} style={styles.addButton}>
                                            <Text style={{ marginHorizontal: Sizes.fixPadding, ...Fonts.primaryColor14Bold }}>
                                                {loadingServiceId === item.id && removing ? 'Removing..' : 'Remove'}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity onPress={() => {
                                            addService(item)
                                            // handleServiceBooking(item)
                                        }}
                                            style={styles.addButton}>
                                            <Text style={{ marginHorizontal: Sizes.fixPadding, ...Fonts.primaryColor14Bold }}>
                                                {loadingServiceId === item.id && adding ? 'Adding..' : 'Add'}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
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
                {/* {divider()}
                {locationInfo()} */}
                {/* {divider()}
                {currentPackageAndOffersInfo()} */}
            </View>
        )
    }

    function bookAppointmentButton() {
        const isDisabled = selectedServices.length === 0;

        return (
            <View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.push('ScheduleAppointment', {
                        selectedServices: selectedServices,
                        product: product
                    })}
                    style={[
                        styles.bookAppointmentButtonStyle,
                        isDisabled && styles.disabledButtonStyle
                    ]}
                    disabled={isDisabled}
                >
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Book Appointment
                    </Text>
                </TouchableOpacity>
            </View>
        );
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
                                source={{ uri: "" }}
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
                        <Text style={{ ...Fonts.grayColor12SemiBold }}>
                            Monday-Friday
                        </Text>
                        <Text style={{ lineHeight: 17.0, ...Fonts.primaryColor14Bold }}>
                            9:00 am - 9:00 pm
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ ...Fonts.grayColor12SemiBold }}>
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
        const cleanDescription = product.description.replace(/^<p>/, '').replace(/<\/p>$/, '');
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Bold }}>
                    About
                </Text>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.grayColor12SemiBold }}>
                    {cleanDescription}
                </Text>

            </View>
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
    disabledButtonStyle: {
        backgroundColor: Colors.grayColor,
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
        width: "100%",
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
        height: 70,
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
    },
    addButton: {
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#1c294d",
        marginRight: 4,
    },
});

export default SalonDetailScreen;