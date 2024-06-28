import React, { useState, useRef, useEffect } from "react";
import { useApolloClient, useQuery, useLazyQuery } from "@apollo/client";
import { View, FlatList, StyleSheet, Image, Text, TextInput, ImageBackground, TouchableOpacity, Animated } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import CollapsibleToolbar from 'react-native-collapsible-toolbar';
import { GET_ACTIVE_CUSTOMER } from "../../services/HomeApi";
import { GETCOLLECTIONSLIST  } from "../../services/Product";
import { GETSEARCHLIST } from "../../services/Search";

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
    const client = useApolloClient();
    const [productData, setProductData] = useState([]);
    const [customerData, setCustomerData] = useState(null);
    const [state, setState] = useState({
        search: null,
        bestSalons: bestSalonList,
        showSnackBar: false,
        isFavorite: null,
    });

    const [getSearchResults, { loading: searchLoading, data: searchData }] = useLazyQuery(GETSEARCHLIST);

    useEffect(() => {
        async function fetchCollections() {
            try {
                const { data } = await client.query({ query: GETCOLLECTIONSLIST });
                if (data && data.products && data.products.items) {
                    setProductData(data.products.items);
                }
            } catch (error) {
                console.error("Error fetching collections:", error);
            }
        }

        async function fetchCustomer() {
            try {
                const { data } = await client.query({ query: GET_ACTIVE_CUSTOMER });
                setCustomerData(data.activeCustomer);
            } catch (error) {
                console.error("Error fetching customer:", error);
            }
        }

        fetchCollections();
        fetchCustomer();
    }, [client]);

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

    if (!customerData) return <Text>Loading...</Text>;

    const { firstName, lastName } = customerData;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
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
                            size={16}
                            style={{ marginLeft: Sizes.fixPadding - 5.0 }}
                            onPress={() => {
                                updateBestSalons({ id: item.id });
                                updateState({ showSnackBar: true });
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons
                            name="star"
                            color={Colors.ratingColor}
                            size={16}
                        />
                        <Text style={{ ...Fonts.whiteColor14Medium, marginLeft: Sizes.fixPadding - 8.0 }}>
                            {item.rating.toFixed(1)}
                        </Text>
                        <Text style={{ ...Fonts.whiteColor12Light }}>
                            ({item.reviews} reviews)
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
        return (
            <View>
                <View style={styles.bestSalonHeaderWrapStyle}>
                    <Text style={{ ...Fonts.blackColor16Bold }}>
                        Best salons near you
                    </Text>
                    <Text
                        onPress={() => navigation.push('AllSalonList')}
                        style={{ ...Fonts.primaryColor14Bold }}
                    >
                        View all
                    </Text>
                </View>
                <FlatList
                    data={bestSalons}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2.0 }}
                />
            </View>
        );
    }

    function popularCategoryInfo() {
        const categoryList = searchData ? searchData.categories.items : [];
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.push('SalonDetail', { item })}
                style={{
                    marginRight: Sizes.fixPadding * 2.0,
                    alignItems: 'center',
                }}
            >
                <Image
                    source={{ uri: item.image }}
                    style={styles.popularCategoryImageStyle}
                />
                <Text
                    numberOfLines={2}
                    style={{
                        textAlign: 'center',
                        marginTop: Sizes.fixPadding,
                        ...Fonts.blackColor14Medium,
                    }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
        return (
            <View>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor16Bold }}>
                    Popular categories
                </Text>
                <FlatList
                    data={categoryList}
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

    function userInfo() {
        return (
            <View style={styles.userInfoWrapStyle}>
                <View style={{ flex: 1 }}>
                    <Text style={{ ...Fonts.whiteColor18Medium }}>
                        {`Hey ${firstName} ${lastName}!`}
                    </Text>
                    <Text style={{ ...Fonts.whiteColor16Regular }}>
                        Book your desired salon services
                    </Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.push('EditProfile')}
                >
                    <Image
                        source={require('../../assets/images/users/user1.png')}
                        style={{ width: 60.0, height: 60.0, borderRadius: 30.0 }}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    snackBarStyle: {
        position: 'absolute',
        bottom: 58.0,
        left: 10.0,
        right: 10.0,
        backgroundColor: '#333333',
    },
    searchFieldWrapStyle: {
        backgroundColor: Colors.primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        marginVertical: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding * 2.0,
    },
    userInfoWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Sizes.fixPadding * 2.0
    },
    bestSalonImageStyle: {
        width: 150.0,
        height: 150.0,
        borderTopLeftRadius: Sizes.fixPadding + 5.0,
        borderTopRightRadius: Sizes.fixPadding + 5.0,
    },
    bestSalonHeaderWrapStyle: {
        marginVertical: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bestSalonDetailWrapStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        borderBottomLeftRadius: Sizes.fixPadding + 5.0,
        borderBottomRightRadius: Sizes.fixPadding + 5.0,
    },
    popularCategoryImageStyle: {
        width: 80.0,
        height: 80.0,
        borderRadius: Sizes.fixPadding,
    },
    offerPercentageWrapStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding * 2.0,
        position: 'absolute',
        right: 10.0,
        bottom: 10.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 5.0,
    },
    offerImageStyle: {
        width: 300.0,
        height: 150.0,
        justifyContent: 'space-between',
        paddingVertical: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding,
        marginRight: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
    },
});

export default HomeScreen;
