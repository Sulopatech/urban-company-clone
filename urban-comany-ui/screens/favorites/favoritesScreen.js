import React, { useState } from "react";
import { Animated, View, Image, StyleSheet, TouchableHighlight, TouchableOpacity, Dimensions, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Snackbar } from 'react-native-paper';
import MyStatusBar from "../../components/myStatusBar";

const { width } = Dimensions.get('window');

const favoriteSalonsList = [
    {
        key: '1',
        salonImage: require('../../assets/images/salon/salon3.png'),
        salonName: 'RedBox salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        salonOpenTime: '9:00 am',
        salonCloseTime: '9:00 pm',
    },
    {
        key: '2',
        salonImage: require('../../assets/images/salon/salon4.png'),
        salonName: 'Ultra unisex salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        salonOpenTime: '9:00 am',
        salonCloseTime: '9:00 pm',
    },
    {
        key: '3',
        salonImage: require('../../assets/images/salon/salon9.png'),
        salonName: 'Beauty plus spa',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        salonOpenTime: '9:00 am',
        salonCloseTime: '9:00 pm',
    },
    {
        key: '4',
        salonImage: require('../../assets/images/salon/salon8.png'),
        salonName: 'Delies unisex salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        rating: 4.6,
        reviews: 100,
        salonOpenTime: '9:00 am',
        salonCloseTime: '9:00 pm',
    },
];

const rowSwipeAnimatedValues = {};

Array(favoriteSalonsList.length + 1)
    .fill('')
    .forEach((_, i) => {
        rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    });

const FavoritesScreen = ({ navigation }) => {

    const [showSnackBar, setShowSnackBar] = useState(false);

    const [listData, setListData] = useState(favoriteSalonsList);

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const renderHiddenItem = (data, rowMap) => (
        <View style={{ alignItems: 'center', flex: 1 }}>
            <TouchableOpacity
                style={styles.backDeleteContinerStyle}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <Animated.View
                    style={[
                        {
                            transform: [
                                {
                                    scale: rowSwipeAnimatedValues[
                                        data.item.key
                                    ].interpolate({
                                        inputRange: [45, 90],
                                        outputRange: [0, 1],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <MaterialIcons
                        name="delete"
                        size={24}
                        color={Colors.whiteColor}
                        style={{ alignSelf: 'center' }}
                    />
                    <Text style={{ ...Fonts.whiteColor12Medium }}>
                        Delete
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setShowSnackBar(true);
        setListData(newData);
    };

    const onSwipeValueChange = swipeData => {
        const { key, value } = swipeData;
        rowSwipeAnimatedValues[key].setValue(Math.abs(value));
    };

    const renderItem = data => (
        <TouchableHighlight
            style={{ backgroundColor: Colors.whiteColor }}
            activeOpacity={0.9}
        >
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.push('SalonDetail', { item })}
                    style={styles.salonInfoWrapStyle}
                >
                    <Image
                        source={data.item.salonImage}
                        style={{ width: 110.0, height: 95.0, borderRadius: Sizes.fixPadding }}
                    />
                    <View style={{ ...styles.salonDetailWrapper }}>
                        <Text numberOfLines={1} style={{ ...Fonts.blackColor14Bold, width: width - 210, }}>
                            {data.item.salonName}
                        </Text>
                        <Text numberOfLines={1} style={{ ...Fonts.grayColor12SemiBold }} >
                            {data.item.salonAddress}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <MaterialIcons
                                name="star"
                                color={Colors.yellowColor}
                                size={15}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding - 7.0, ...Fonts.grayColor12SemiBold }}>
                                {data.item.rating.toFixed(1)} ({data.item.reviews} reviews)
                            </Text>
                        </View>
                        <Text style={{ ...Fonts.grayColor12SemiBold }}>
                            {data.item.salonOpenTime} - {data.item.salonCloseTime}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableHighlight>
    );

    function noItemsSaveInfo() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialIcons
                    name="favorite-border"
                    color={Colors.grayColor}
                    size={50}
                />
                <Text style={{
                    marginTop: Sizes.fixPadding,
                    ...Fonts.grayColor15Bold
                }}>
                    Favorite List Is Empty
                </Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                {header()}
                {listData.length == 0 ?
                    <>
                        {noItemsSaveInfo()}
                    </>
                    :
                    <SwipeListView
                        data={listData}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        rightOpenValue={-100}
                        onSwipeValueChange={onSwipeValueChange}
                        useNativeDriver={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingTop: Sizes.fixPadding - 5.0,
                            paddingBottom: Sizes.fixPadding * 2.0,
                        }}
                    />
                }
                <Snackbar
                    style={styles.snackBarStyle}
                    visible={showSnackBar}
                    onDismiss={() => setShowSnackBar(false)}
                >
                    Item Remove From Favorite List.
                </Snackbar>
            </View>
        </View>
    );

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
                    Favorites
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
    backDeleteContinerStyle: {
        alignItems: 'center',
        bottom: 20,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 100,
        backgroundColor: Colors.primaryColor,
        right: 0,
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

export default FavoritesScreen;