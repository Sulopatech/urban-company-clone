import React, { useState, useRef, useEffect } from "react";
import { useQuery, useLazyQuery} from "@apollo/client";
import { View, FlatList, StyleSheet, Image, Text, TextInput, ImageBackground, TouchableOpacity, Animated } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import CollapsibleToolbar from 'react-native-collapsible-toolbar';
import { GETCOLLECTIONSLIST  } from "../../services/Product";
import { GETSEARCHLIST } from "../../services/Search";

// const popularCategoriesList = [
//     {
//         id: '1',
//         categoryImage: require('../../assets/images/icons/women_salon1.png'),
//         categoryName: "Women's Salon,Spa & Skin Clinic",
//         bgColor: '#F48FB1',
//     },
//     {
//         id: '2',
//         categoryImage: require('../../assets/images/icons/men_salon1.png'),
//         categoryName: "Men Salon & Massage ",
//         bgColor: '#CE93D8',
//     },
//     {
//         id: '3',
//         categoryImage: require('../../assets/images/icons/ac_repair1.png'),
//         categoryName: "AC & Appliance Repair",
//         bgColor: '#90CAF9',
//     },
//     {
//         id: '4',
//         categoryImage: require('../../assets/images/icons/cleaning_pestControl1.png'),
//         categoryName: "Cleaning & Pest Control",
//         bgColor: '#80CBC4',
//     },
//     {
//         id: '5',
//         categoryImage: require('../../assets/images/icons/weekly_cleaning1.png'),
//         categoryName: "Weekly Bathroom Cleaning",
//         bgColor: '#F48FB1',
//     },
//     {
//         id: '6',
//         categoryImage: require('../../assets/images/icons/electrician1.png'),
//         categoryName: "Electrician Plumber & Carpenter",
//         bgColor: '#CE93D8',
//     },
//     {
//         id: '7',
//         categoryImage: require('../../assets/images/icons/water_purifier1.png'),
//         categoryName: "Native Water Purifier",
//         bgColor: '#90CAF9',
//     },
//     {
//         id: '8',
//         categoryImage: require('../../assets/images/icons/painting.png'),
//         categoryName: "Painting & Water Proofing",
//         bgColor: '#80CBC4',
//     },
// ];

const bestSalonList = [
    {
        id: '1',
        salonImage: require('../../assets/images/salon/salon2.png'),
        salonName: 'Crown salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        isFavorite: false,
    },
    {
        id: '2',
        salonImage: require('../../assets/images/salon/salon3.png'),
        salonName: 'RedBox salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        isFavorite: false,
    },
];

const offersList = [
    {
        id: '1',
        salonName: 'Joseph drake hair salon',
        salonImage: require('../../assets/images/offer/offer1.png'),
        offerTitle: 'Look awesome & save some',
        offer: 25
    },
    {
        id: '2',
        salonName: 'Joseph drake hair salon',
        salonImage: require('../../assets/images/offer/offer1.png'),
        offerTitle: 'Look awesome & save some',
        offer: 25
    },
];

const HomeScreen = ({ navigation }) => {

    const { data } = useQuery(GETCOLLECTIONSLIST);
    const [getSearchResults, { loading: searchLoading, data: searchData }] = useLazyQuery(GETSEARCHLIST);
    const [productData, setProductData] = useState([]);
    useEffect(() => {
        if (data && data.products && data.products.items) {
            setProductData(data.products.items);
        }
    }, [data]);

    const [state, setState] = useState({
        search: null,
        bestSalons: bestSalonList,
        showSnackBar: false,
        isFavorite: null,
    });

    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const {
        search,
        bestSalons,
        showSnackBar,
        isFavorite,
    } = state;

    const scrollY = useRef(new Animated.Value(0)).current;

    const searchField = () => (
        <View style={styles.searchFieldWrapStyle}>
            <MaterialIcons
                name="search"
                color={Colors.whiteColor}
                size={15}
            />
            <TextInput
                value={search}
                onChangeText={(text) => {
                updateState({ search: text });
                getSearchResults({ variables: { term: text } }); // Call the search query with the current text
                }}
                placeholder="Search salon services..."
                placeholderTextColor={Colors.whiteColor}
                selectionColor={Colors.whiteColor}
                style={{ marginLeft: Sizes.fixPadding, flex: 1, ...Fonts.whiteColor14Medium }}
            />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            {/* <Animated.View style={[styles.stickySearchBar, {
                opacity: scrollY.interpolate({
                    inputRange: [200, 250],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                }),
            }]}>
                {searchField()}
            </Animated.View> */}
            <View style={{ flex: 1 }}>
                <CollapsibleToolbar
                    renderContent={() => (
                        <View style={{ flex: 1 }}>
                            {popularCategoryInfo()}
                            {bestSalonInfo()}
                            {offersInfo()}
                        </View>
                    )}
                    renderNavBar={() => <></>}
                    renderToolBar={() => salonImage()}
                    collapsedNavBarBackgroundColor={Colors.primaryColor}
                    toolBarHeight={250}
                    onContentScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                    automaticallyAdjustKeyboardInsets={true}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <Snackbar
                style={styles.snackBarStyle}
                visible={showSnackBar}
                onDismiss={() => updateState({ showSnackBar: false })}
            >
                {isFavorite ? 'Item add to favorite' : 'Item remove from favorite'}
            </Snackbar>
        </View>
    );

    function salonImage() {
        return (
            <ImageBackground
                source={require('../../assets/images/salon/salon1.png')}
                style={{
                    width: '100%',
                    height: 250,
                    justifyContent: 'flex-end'
                }}
                borderBottomLeftRadius={10}
                borderBottomRightRadius={10}
                resizeMode="cover"
            >
                <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                    {userInfo()}
                    <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                        Find and book best services
                    </Text>
                    {searchField()}
                </View>
            </ImageBackground >
        )
    }

    function offersInfo() {
        const renderItem = ({ item }) => (
            <ImageBackground
                source={item.salonImage}
                style={styles.offerImageStyle}
                borderRadius={Sizes.fixPadding}
            >
                <View>
                    <Text
                        numberOfLines={1}
                        style={{ maxWidth: 230.0, ...Fonts.blackColor16Medium }}
                    >
                        {item.salonName}
                    </Text>
                    <Text
                        numberOfLines={2}
                        style={{
                            lineHeight: 22.0,
                            width: 200.0,
                            ...Fonts.blackColor18Bold
                        }}
                    >
                        {item.offerTitle}
                    </Text>
                </View>
                <View style={styles.offerPercentageWrapStyle}>
                    <Text style={{ ...Fonts.whiteColor14Medium }}>
                        {item.offer}% off
                    </Text>
                </View>
            </ImageBackground>
        );
        return (
            <View style={{ marginVertical: Sizes.fixPadding + 5.0 }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor16Bold }}>
                    Offers
                </Text>
                <FlatList
                    data={offersList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding * 2.0,
                        paddingTop: Sizes.fixPadding + 5.0,
                    }}
                />
            </View>
        );
    }

    function updateBestSalons({ id }) {
        const newList = bestSalons.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, isFavorite: !item.isFavorite };
                updateState({ isFavorite: updatedItem.isFavorite });
                return updatedItem;
            }
            return item;
        });
        updateState({ bestSalons: newList });
    }

    function bestSalonInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.push('SalonDetail', { item })}
                style={{
                    alignItems: 'center',
                    marginRight: Sizes.fixPadding * 2.0,
                }}
            >
                <Image
                    source={item.salonImage}
                    style={styles.bestSalonImageStyle}
                />
                <View style={styles.bestSalonDetailWrapStyle}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text
                                numberOfLines={1}
                                style={{ ...Fonts.whiteColor14Medium }}
                            >
                                {item.salonName}
                            </Text>
                            <Text
                                numberOfLines={2}
                                style={{ lineHeight: 15.0, ...Fonts.whiteColor12Light }}
                            >
                                {item.salonAddress}
                            </Text>
                        </View>
                        <MaterialIcons
                            name={item.isFavorite ? "favorite" : "favorite-border"}
                            color={Colors.whiteColor}
                            size={15}
                            style={{ marginLeft: Sizes.fixPadding - 5.0, marginTop: Sizes.fixPadding - 5.0 }}
                            onPress={() => {
                                updateBestSalons({ id: item.id });
                                updateState({ showSnackBar: true });
                            }}
                        />
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <MaterialIcons
                            name="star"
                            color={Colors.yellowColor}
                            size={15}
                        />
                        <Text style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.whiteColor14Medium }}>
                            {item.rating.toFixed(1)}
                        </Text>
                        <Text style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.whiteColor14Medium }}>
                            ({item.reviews} reviews)
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
        return (
            <View style={{ marginVertical: Sizes.fixPadding + 5.0 }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor16Bold }}>
                    Best salon around you
                </Text>
                <FlatList
                    data={bestSalons}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding * 2.0,
                        paddingTop: Sizes.fixPadding + 5.0,
                    }}
                />
            </View>
        );
    }

    function popularCategoryInfo() {
        const limitedProductData = productData.slice(0, 8);
        const renderItem = ({ item }) => (
            <View style={{ alignItems: 'center', marginRight: Sizes.fixPadding, display: "flex", justifyContent: "center" }}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.push('CategoryDetail', { productId: item.id })}
                    style={{
                        backgroundColor: "#f0f0f0",
                        ...styles.popularCategoryWrapStyle,
                    }}
                >
                    <View style={{ width: 60, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={{ uri: item.featuredAsset ? item.featuredAsset.preview : 'https://via.placeholder.com/40' }}
                            style={{ width: 40, height: 40 }}
                            resizeMode="contain"
                        />
                    </View>
                </TouchableOpacity>
                <Text
                    numberOfLines={1}
                    style={{ marginTop: Sizes.fixPadding - 8.0, ...Fonts.blackColor12Medium, textAlign: 'center', flexWrap: 'wrap', width: 100 }}
                >
                    {item.name}
                </Text>
            </View>
        );

        return (
            <View style={{ flex: 1, width: '100%', paddingHorizontal: 5.0 }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 1.3, ...Fonts.blackColor16Bold, marginTop: Sizes.fixPadding - 5 }}>
                    Popular Category
                </Text>
                <View style={{ justifyContent: "center", alignItems: "center", paddingLeft: 11 }}>
                    <FlatList
                        data={limitedProductData}
                        style={{ marginVertical: Sizes.fixPadding + 4.0 }}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={renderItem}
                        horizontal={false}
                        numColumns={3}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            paddingHorizontal: Sizes.fixPadding,
                            gap: 10,
                            display: 'flex',
                            justifyContent: "center",
                            alignSelf: "center",
                            width: "100%"
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        );
    };

    function userInfo() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Image
                            source={require('../../assets/images/icons/whiteNearby.png')}
                            style={{ width: 16.0, height: 16.0, }}
                            resizeMode="contain"
                        />
                        <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.whiteColor18SemiBold }}>
                            Samantha Shah
                        </Text>
                    </View>
                    <Text style={{ ...Fonts.whiteColor14Light }}>
                        {` 6/36, Sohrab Bldg, H G Rd, Gamdevi\nMumbai Maharasta`}
                    </Text>
                </View>
                <MaterialIcons
                    name="filter-alt"
                    size={22}
                    color={Colors.whiteColor}
                    onPress={() => navigation.push('Filter')}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    searchFieldWrapStyle: {
        backgroundColor: 'rgba(214, 105, 134, 0.85)',
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Sizes.fixPadding * 2.0,
        borderWidth: 1,
        borderColor: '#f0adbe',
    },
    stickySearchBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: Colors.primaryColor,
        padding: Sizes.fixPadding * 2.0,
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: -10.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
        elevation: 0.0,
    },
    userInfoWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Sizes.fixPadding + 5.0,
    },
    offerImageStyle: {
        width: '100%',
        height: '100%',
        borderColor: 'rgba(197, 197, 197, 0.3)',
        borderWidth: 2.0,
        borderRadius: Sizes.fixPadding,
        justifyContent: 'space-between',
        paddingLeft: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding - 5.0,
        paddingBottom: Sizes.fixPadding + 5.0,
        resizeMode: 'stretch',
        width: 300.0,
        height: 135.0,
        marginRight: Sizes.fixPadding * 2.0,
        overflow: 'hidden'
    },
    popularCategoryWrapStyle: {
        // width: 90.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 3.0,
        // marginRight: Sizes.fixPadding + 10.0,
        paddingHorizontal: 30,
        paddingVertical: 20
    },
    offerPercentageWrapStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: Sizes.fixPadding,
    },
    bestSalonImageStyle: {
        borderColor: 'rgba(197, 197, 197, 0.3)',
        borderWidth: 2.0,
        width: 210.0,
        height: 130.0,
        borderRadius: Sizes.fixPadding,
    },
    bestSalonDetailWrapStyle: {
        backgroundColor: 'rgba(214, 105, 134, 0.85)',
        borderRadius: Sizes.fixPadding - 5.0,
        width: 185.0,
        marginTop: -40.0,
        paddingHorizontal: Sizes.fixPadding - 5.0,
        paddingBottom: Sizes.fixPadding - 5.0,
    }
});

export default HomeScreen;
