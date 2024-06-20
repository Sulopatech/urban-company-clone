import React, { useState } from "react";
import { View, FlatList, StyleSheet, Image, Text, TextInput, ImageBackground, TouchableOpacity, } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import CollapsibleToolbar from 'react-native-collapsible-toolbar';

const popularCategoriesList = [
    {
        id: '1',
        categoryImage: require('../../assets/images/icons/nails.png'),
        categoryName: 'Nails',
        bgColor: '#F48FB1',
    },
    {
        id: '2',
        categoryImage: require('../../assets/images/icons/hair.png'),
        categoryName: 'Hair',
        bgColor: '#CE93D8',
    },
    {
        id: '3',
        categoryImage: require('../../assets/images/icons/face.png'),
        categoryName: 'Face',
        bgColor: '#90CAF9',
    },
    {
        id: '4',
        categoryImage: require('../../assets/images/icons/massage.png'),
        categoryName: 'Massage',
        bgColor: '#80CBC4',
    },
];

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

    const [state, setState] = useState({
        search: null,
        bestSalons: bestSalonList,
        showSnackBar: false,
        isFavorite: null,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        search,
        bestSalons,
        showSnackBar,
        isFavorite,
    } = state;

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
    )

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
        )
        return (
            <View style={{ marginVertical: Sizes.fixPadding + 5.0, }}>
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
        )
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
        updateState({ bestSalons: newList })
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
                            style={{ marginLeft: Sizes.fixPadding - 5.0, marginTop: Sizes.fixPadding - 5.0, }}
                            onPress={() => {
                                updateBestSalons({ id: item.id })
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
                            {item.rating.toFixed(1)} ({item.reviews} reviews)
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
        return (
            <View>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor16Bold }}>
                    Best Salon
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
        )
    }

    function popularCategoryInfo() {

        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.push('CategoryDetail', { item })}
                style={{
                    backgroundColor: item.bgColor,
                    ...styles.popularCategoryWrapStyle,
                }}
            >
                <Image
                    source={item.categoryImage}
                    style={{ width: 18.0, height: 18.0, }}
                    resizeMode="contain"
                />
                <Text
                    numberOfLines={1}
                    style={{ marginTop: Sizes.fixPadding - 8.0, ...Fonts.whiteColor12Medium }}
                >
                    {item.categoryName}
                </Text>
            </TouchableOpacity>
        )
        return (
            <View style={{ marginVertical: Sizes.fixPadding + 5.0, }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor16Bold }}>
                    Popular Category
                </Text>
                <FlatList
                    ListHeaderComponent={
                        <View style={{
                            backgroundColor: '#EF9A9A',
                            ...styles.popularCategoryWrapStyle
                        }}>
                            <Image
                                source={require('../../assets/images/icons/all.png')}
                                style={{ width: 18.0, height: 18.0, }}
                                resizeMode="contain"
                            />
                            <Text
                                numberOfLines={1}
                                style={{ marginTop: Sizes.fixPadding - 8.0, ...Fonts.whiteColor12Medium }}
                            >
                                All
                            </Text>
                        </View>
                    }
                    horizontal
                    data={popularCategoriesList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding * 2.0,
                        paddingTop: Sizes.fixPadding,
                    }}
                />
            </View>
        )
    }

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

    function searchField() {
        return (
            <View style={styles.searchFieldWrapStyle}>
                <MaterialIcons
                    name="search"
                    color={Colors.whiteColor}
                    size={15}
                />
                <TextInput
                    value={search}
                    onChangeText={(text) => updateState({ search: text })}
                    placeholder="Search salon services..."
                    placeholderTextColor={Colors.whiteColor}
                    selectionColor={Colors.whiteColor}
                    style={{ marginLeft: Sizes.fixPadding, flex: 1, ...Fonts.whiteColor14Medium }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    searchFieldWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        backgroundColor: 'rgba(214, 105, 134, 0.85)',
        padding: Sizes.fixPadding,
        marginTop: Sizes.fixPadding,
    },
    popularCategoryWrapStyle: {
        width: 63.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 3.0,
        marginRight: Sizes.fixPadding + 10.0,
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
    },
    offerPercentageWrapStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: Sizes.fixPadding,
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
    snackBarStyle: {
        position: 'absolute',
        bottom: -10.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
        elevation: 0.0,
    }
});

export default HomeScreen;