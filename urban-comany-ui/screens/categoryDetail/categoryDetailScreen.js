import React, { useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Text, Image } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar } from "react-native-paper";
import MyStatusBar from "../../components/myStatusBar";

const { width } = Dimensions.get('screen');

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

const CategoryDetailScreen = ({ navigation, route }) => {

    const item = route.params.item;

    const [state, setState] = useState({
        salons: salonsList,
        showSnackBar: false,
        addToFavorite: false,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        salons,
        showSnackBar,
        addToFavorite,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                {availableSalons()}
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

    function availableSalons() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('SalonDetail', { item })}
                style={styles.salonInfoWrapStyle}
            >
                <Image
                    source={item.salonImage}
                    style={{ width: 110.0, height: 95.0, borderRadius: Sizes.fixPadding }}
                />
                <View style={styles.salonDetailWrapper}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Text numberOfLines={1} style={{ ...Fonts.blackColor14Bold, width: width - 210, }}>
                            {item.salonName}
                        </Text>
                        <MaterialIcons
                            name={item.isFavorite ? "favorite" : "favorite-border"}
                            color={Colors.blackColor}
                            size={17}
                            onPress={() => {
                                updateSalons({ id: item.id })
                                updateState({ showSnackBar: true })
                            }}
                        />
                    </View>
                    <Text numberOfLines={1} style={{ ...Fonts.grayColor12SemiBold }} >
                        {item.salonAddress}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <MaterialIcons
                            name="star"
                            color={Colors.yellowColor}
                            size={15}
                        />
                        <Text style={{ marginLeft: Sizes.fixPadding - 7.0, ...Fonts.grayColor12SemiBold }}>
                            {item.rating.toFixed(1)} ({item.reviews} reviews)
                        </Text>
                    </View>
                    <Text style={{ ...Fonts.grayColor12SemiBold }}>
                        {item.salonOpenTime} - {item.salonCloseTime}
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <FlatList
                data={salons}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Sizes.fixPadding, paddingTop: Sizes.fixPadding - 5.0 }}
            />
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
                    {item.categoryName}
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
    salonDetailWrapper: {
        justifyContent: 'space-between',
        height: 85,
        flex: 1,
        marginHorizontal: Sizes.fixPadding,
        marginVertical: Sizes.fixPadding - 5.0,
    }
});

export default CategoryDetailScreen;