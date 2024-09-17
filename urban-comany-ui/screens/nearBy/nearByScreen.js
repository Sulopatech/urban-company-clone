import React, { useState, useRef,useEffect } from "react";
import { View, Dimensions, Animated, StyleSheet, FlatList, TextInput, TouchableOpacity, Text, Image, Platform } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import { GETSEARCHLIST, SearchProducts } from "../../services/Search";
import { useLazyQuery } from "@apollo/client";

const { width } = Dimensions.get('window');

const salonsList = [
    {
        id: '1',
        salonImage: require('../../assets/images/salon/salon2.png'),
        salonName: 'Crown salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        salonOpenTime: '9:00 am',
        salonCloseTime: '9:00 pm',
        isFavorite: false,
    },
    {
        id: '2',
        salonImage: require('../../assets/images/salon/salon3.png'),
        salonName: 'RedBox salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        salonOpenTime: '9:00 am',
        salonCloseTime: '9:00 pm',
        isFavorite: true,
    },
    {
        id: '3',
        salonImage: require('../../assets/images/salon/salon4.png'),
        salonName: 'Ultra unisex salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        salonOpenTime: '9:00 am',
        salonCloseTime: '9:00 pm',
        isFavorite: true,
    },
    {
        id: '4',
        salonImage: require('../../assets/images/salon/salon5.png'),
        salonName: 'Livestyle salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        salonOpenTime: '9:00 am',
        salonCloseTime: '9:00 pm',
        isFavorite: false,
    },
    {
        id: '5',
        salonImage: require('../../assets/images/salon/salon6.png'),
        salonName: 'Opera city salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        salonOpenTime: '9:00 am',
        salonCloseTime: '9:00 pm',
        isFavorite: false,
    },
    {
        id: '6',
        salonImage: require('../../assets/images/salon/salon7.png'),
        salonName: 'Wonder spot salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        salonOpenTime: '9:00 am',
        salonCloseTime: '9:00 pm',
        isFavorite: false,
    },
];

const markersList = [
    {
        coordinate: {
            latitude: 22.6293867,
            longitude: 88.4354486,
        },
        id: '1',
        salonImage: require('../../assets/images/salon/salon2.png'),
        salonName: 'Crown salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        isFavorite: false,
    },
    {
        coordinate: {
            latitude: 22.6345648,
            longitude: 88.4377279,
        },
        id: '2',
        salonImage: require('../../assets/images/salon/salon3.png'),
        salonName: 'RedBox salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        isFavorite: false,
    },
    {
        coordinate: {
            latitude: 22.6281662,
            longitude: 88.4410113,
        },
        id: '3',
        salonImage: require('../../assets/images/salon/salon4.png'),
        salonName: 'Ultra unisex salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        isFavorite: false,
    },
    {
        coordinate: {
            latitude: 22.6341137,
            longitude: 88.4497463,
        },
        id: '4',
        salonImage: require('../../assets/images/salon/salon5.png'),
        salonName: 'Livestyle Salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        isFavorite: false,
    },
];

const cardWidth = width / 1.5;

const NearByScreen = ({ navigation }) => {
    const [getSearchProducts, { loading: searchLoading, data: searchData }] = useLazyQuery(GETSEARCHLIST);
    useEffect(() => {
    getSearchProducts({ variables: { term: "" } });
    
    }, [])
   


    const animation = useRef(new Animated.Value(0)).current;

    const [state, setState] = useState({
        search: null,
        salons: salonsList,
        showSnackBar: false,
        addToFavorite: false,
        showMapView: false,
        markers: markersList,
    })

    const searchProductData = searchData?.search?.items || [];

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        search,
        salons,
        showSnackBar,
        addToFavorite,
        showMapView,
        markers,
    } = state;


    const filterSearchData = (data) => {
        const uniqueProducts = [];
        const productIds = new Set();

        data.forEach(item => {
            if (!productIds.has(item.productAsset.id)) {
                uniqueProducts.push(item);
                productIds.add(item.productAsset.id);
            }
        });

        return uniqueProducts;
    };

    const filteredSearchProductData = filterSearchData(searchProductData);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <View style={{ flex: 1 }}>
                {header()}
                {
                    showMapView
                        ?
                        <>
                            {mapView()}
                        </>
                        :
                        <>
                            {searchTextField()}
                            {nearbySalons()}
                            {mapViewIcon()}
                        </>
                }
            </View>
            <Snackbar
                style={styles.snackBarStyle}
                visible={showSnackBar}
                onDismiss={() => updateState({ showSnackBar: false })}
            >
                {addToFavorite ? 'Item add to favorite' : 'Item remove from favorite'}
            </Snackbar>
        </View>
    )

    function mapView() {

        const interpolation = markers.map((marker, index) => {
            const inputRange = [
                (index - 1) * cardWidth,
                index * cardWidth,
                ((index + 1) * cardWidth),
            ];

            const scale = animation.interpolate({
                inputRange,
                outputRange: [1, 1.5, 1],
                extrapolate: "clamp"
            })

            return { scale };
        })

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    initialRegion={
                        {
                            latitude: 22.62938671242907,
                            longitude: 88.4354486029795,
                            latitudeDelta: 0.04864195044303443,
                            longitudeDelta: 0.040142817690068,
                        }
                    }
                    style={{ height: '100%' }}
                >
                    <Marker
                        coordinate={{
                            latitude: 22.6292757,
                            longitude: 88.444781,
                        }}
                    >
                        <Image
                            source={require('../../assets/images/icons/current_location_marker.png')}
                            resizeMode="contain"
                            style={{ width: 35.0, height: 35.0 }}
                        >
                        </Image>
                    </Marker>
                    {markers.map((marker, index) => {
                        const scaleStyle = {
                            transform: [
                                {
                                    scale: interpolation[index].scale
                                }
                            ]
                        }
                        return (
                            <Marker
                                key={index}
                                coordinate={marker.coordinate}
                            >
                                <Animated.View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 50.0, height: 50.0
                                    }}
                                >
                                    <Animated.Image
                                        source={require('../../assets/images/icons/marker.png')}
                                        resizeMode="contain"
                                        style={[{ width: 30.0, height: 30.0 }, scaleStyle]}
                                    >
                                    </Animated.Image>
                                </Animated.View>
                            </Marker>
                        )
                    }
                    )}
                </MapView>
                <Animated.ScrollView
                    horizontal={true}
                    scrollEventThrottle={1}
                    showsHorizontalScrollIndicator={false}
                    style={styles.salonsInfoContentStyle}
                    snapToInterval={cardWidth + 20}
                    snapToAlignment="center"
                    decelerationRate={'fast'}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding * 5.0,
                        paddingRight: Sizes.fixPadding * 2.0
                    }}
                    onScroll={
                        Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: {
                                            x: animation,
                                        }
                                    }
                                }
                            ],
                            { useNativeDriver: true }
                        )
                    }
                >
                    {markers.map((marker, index) => (
                        <View key={index}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => navigation.push('SalonDetail', { item: marker })}
                                style={{
                                    alignItems: 'center',
                                    marginRight: Sizes.fixPadding * 2.0,
                                }}
                            >
                                <Image
                                    source={marker.salonImage}
                                    style={styles.bestSalonImageStyle}
                                />
                                <View style={styles.bestSalonDetailWrapStyle}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text
                                                numberOfLines={1}
                                                style={{ ...Fonts.whiteColor14Medium }}
                                            >
                                                {marker.salonName}
                                            </Text>
                                            <Text
                                                numberOfLines={1}
                                                style={{ lineHeight: 15.0, ...Fonts.whiteColor12Light }}
                                            >
                                                {marker.salonAddress}
                                            </Text>
                                        </View>
                                        <MaterialIcons
                                            name={marker.isFavorite ? "favorite" : "favorite-border"}
                                            color={Colors.whiteColor}
                                            size={15}
                                            style={{ marginLeft: Sizes.fixPadding - 5.0, marginTop: Sizes.fixPadding - 5.0, }}
                                            onPress={() => {
                                                updateBestSalons({ id: marker.id })
                                                updateState({ showSnackBar: true })
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
                                        <Text style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.whiteColor12Regular }}>
                                            {marker.rating.toFixed(1)} ({marker.reviews} reviews)
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                    ))}
                </Animated.ScrollView>
            </View>
        )
    }

    function updateBestSalons({ id }) {
        const newList = markers.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, isFavorite: !item.isFavorite };
                updateState({ addToFavorite: updatedItem.isFavorite });
                return updatedItem;
            }
            return item;
        });
        updateState({ markers: newList });
    }

    function mapViewIcon() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    updateState({ showMapView: true })
                }}
                style={styles.mapViewIconWrapStyle}
            >
                <Image source={require('../../assets/images/icons/map_view.png')}
                    style={{ width: 16.0, height: 16.0 }}
                    resizeMode="contain"
                    tintColor={Colors.whiteColor}
                />
            </TouchableOpacity>
        )
    }

    function updateSalons({ id }) {
        const newList = salons.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, isFavorite: !item.isFavorite };
                updateState({ addToFavorite: updatedItem.isFavorite });
                return updatedItem;
            }
            return item;
        });
        updateState({ salons: newList })
    }

    function nearbySalons() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('SalonDetail',{ variantSlug: item.slug })}
                style={styles.salonInfoWrapStyle}
            >
                <Image
                    source={{uri: item.productAsset.preview}}
                    style={{ width: 110.0, height: 95.0, borderRadius: Sizes.fixPadding }}
                />
                <View style={styles.salonDetailWrapper}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Text numberOfLines={1} style={{ ...Fonts.blackColor14Bold, flex: 1 }}>
                            {item.productName}
                        </Text>
                        {/* <MaterialIcons
                            name={item.isFavorite ? "favorite" : "favorite-border"}
                            color={Colors.blackColor}
                            size={17}
                            onPress={() => {
                                updateSalons({ id: item.id })
                                updateState({ showSnackBar: true })
                            }}
                        /> */}
                    </View>
                    <Text numberOfLines={1} style={{ ...Fonts.grayColor12SemiBold }} >
                    {'A 9/a Sector 16,Gautam Budh Nagar'}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <MaterialIcons
                            name="star"
                            color={Colors.yellowColor}
                            size={15}
                        />
                        <Text style={{ marginLeft: Sizes.fixPadding - 7.0, ...Fonts.grayColor12SemiBold }}>
                        {"4.6 (100 reviews)"}
                        </Text>
                    </View>
                    <Text numberOfLines={1} style={{ ...Fonts.grayColor12SemiBold }}>
                    {"9:00 am"} - {"9:00 pm"}
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <FlatList
                data={filteredSearchProductData}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: Sizes.fixPadding,
                    paddingTop: Sizes.fixPadding * 2.0,
                }}
            />
        )
    }

    function searchTextField() {
        return (
            <View style={styles.searchTextFieldWrapStyle}>
                <MaterialIcons
                    name="search"
                    color={Colors.grayColor}
                    size={18}
                />
                <TextInput
                    placeholder="Search salon services..."
                    value={search}
                    onChangeText={(text) => {updateState({ search: text })
                    getSearchProducts({ variables: { term: text } });
                    }}
                    style={{ flex: 1, marginLeft: Sizes.fixPadding, ...Fonts.blackColor13Bold }}
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={{
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginVertical: Sizes.fixPadding + 5.0
            }}>
                <View style={styles.headerWrapStyle}>
                    <Text style={{ ...Fonts.blackColor18Bold }}>
                        Salon Nearby
                    </Text>
                    <MaterialIcons
                        name="filter-alt"
                        color={Colors.blackColor}
                        size={24}
                        onPress={() => navigation.push('Filter')}
                    />
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <Image
                        source={require('../../assets/images/icons/nearby.png')}
                        style={{ width: 16.0, height: 16.0, }}
                        resizeMode="contain"
                    />
                    <Text style={{
                        marginLeft: Sizes.fixPadding,
                        lineHeight: 15.0,
                        ...Fonts.blackColor13Medium
                    }}>
                        {`6/36, Sohrab Bldg, H G Rd, Gamdevi\nMumbai Maharasta`}
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Sizes.fixPadding,
    },
    searchTextFieldWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        marginTop: Sizes.fixPadding - 7.0,
        ...CommonStyles.shadow
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: -10.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
        elevation: 0.0,
    },
    salonInfoWrapStyle: {
        flexDirection: 'row',
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        ...CommonStyles.shadow
    },
    mapViewIconWrapStyle: {
        position: 'absolute',
        bottom: 10.0,
        right: 20.0,
        width: 40.0,
        height: 40.0,
        backgroundColor: Colors.primaryColor,
        borderRadius: 20.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(214, 105, 134, 0.5)',
        shadowColor: Colors.primaryColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 3,
    },
    salonsInfoContentStyle: {
        position: 'absolute',
        bottom: 40.0,
        left: 0.0,
        right: 0.0,
        paddingVertical: 10.0,
    },
    bestSalonImageStyle: {
        borderColor: 'rgba(197, 197, 197, 0.3)',
        borderWidth: 2.0,
        width: width / 1.5,
        height: 130.0,
        borderRadius: Sizes.fixPadding,
    },
    bestSalonDetailWrapStyle: {
        backgroundColor: 'rgba(214, 105, 134, 0.85)',
        borderRadius: Sizes.fixPadding - 5.0,
        width: width / 1.7,
        marginTop: -40.0,
        paddingHorizontal: Sizes.fixPadding - 5.0,
        paddingBottom: Sizes.fixPadding - 5.0,
    },
    salonDetailWrapper: {
        justifyContent: 'space-between',
        height: 85,
        flex: 1,
        marginHorizontal: Sizes.fixPadding,
        marginVertical: Sizes.fixPadding - 5.0,
    }
});

export default NearByScreen;