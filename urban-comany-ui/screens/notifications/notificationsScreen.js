import React, { useState, useRef } from "react";
import {
    Text,
    View,
    StyleSheet,
    Animated,
    Dimensions,
    Image,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Fonts, Sizes,CommonStyles } from "../../constants/styles";
import { SwipeListView } from 'react-native-swipe-list-view';
import { Snackbar } from 'react-native-paper';
import MyStatusBar from "../../components/myStatusBar";

const { width } = Dimensions.get('window');

const notificationList = [
    {
        key: '1',
        salonName: 'Crown Salon',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        salonImage: require('../../assets/images/salon/salon2.png'),
        receiveTime: '42 min ago',
    },
    {
        key: '2',
        salonName: 'RedBox Salon',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        salonImage: require('../../assets/images/salon/salon3.png'),
        receiveTime: '2 days ago',
    },
    {
        key: '3',
        salonName: 'Crown Salon',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        salonImage: require('../../assets/images/salon/salon2.png'),
        receiveTime: '5 days ago',
    },
    {
        key: '4',
        salonName: 'Ultra unisex salon',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        salonImage: require('../../assets/images/salon/salon4.png'),
        receiveTime: '8 days ago',
    },
];

const rowTranslateAnimatedValues = {};

const NotificationsScreen = ({ navigation }) => {

    const [showSnackBar, setShowSnackBar] = useState(false);

    const [snackBarMsg, setSnackBarMsg] = useState('');

    const [listData, setListData] = useState(notificationList);

    Array(listData.length + 1)
        .fill('')
        .forEach((_, i) => {
            rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
        });

    const animationIsRunning = useRef(false);

    const onSwipeValueChange = swipeData => {

        const { key, value } = swipeData;

        if ((value < -width || value > width) && !animationIsRunning.current) {
            animationIsRunning.current = true;
            Animated.timing(rowTranslateAnimatedValues[key], {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start(() => {

                const newData = [...listData];
                const prevIndex = listData.findIndex(item => item.key === key);
                newData.splice(prevIndex, 1);
                const removedItem = listData.find(item => item.key === key);

                setSnackBarMsg(`${removedItem.salonName} dismissed`);

                setListData(newData);

                setShowSnackBar(true);

                animationIsRunning.current = false;
            });
        }
    };

    const renderItem = data => (
        <Animated.View
            style={[
                {
                    height: rowTranslateAnimatedValues[
                        data.item.key
                    ].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 75],
                    }),
                },
            ]}
        >
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginHorizontal: Sizes.fixPadding * 2.0,
                }}>
                    <View style={styles.notificationShadowStyle}>
                        <Image
                            source={data.item.salonImage}
                            style={styles.salonImageStyle}
                        />
                    </View>
                    <View style={{ marginLeft: Sizes.fixPadding + 2.0, flex: 1, }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text
                                numberOfLines={1}
                                style={{ ...Fonts.blackColor14Bold }}
                            >
                                {data.item.salonName}
                            </Text>
                            <Text
                                style={{
                                    ...Fonts.blackColor10Bold,
                                    alignSelf: 'flex-end',
                                    marginBottom: Sizes.fixPadding - 9.0,
                                }}
                            >
                                {data.item.receiveTime}
                            </Text>
                        </View>
                        <Text
                            numberOfLines={2}
                            style={{ lineHeight: 12.0, ...Fonts.grayColor11SemiBold }}
                        >
                            {data.item.description}
                        </Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );

    const renderHiddenItem = () => (
        <View style={styles.rowBack} />
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            {header()}
            <View style={{ backgroundColor: Colors.whiteColor, flex: 1, }}>
                {listData.length == 0 ?
                    noNotification()
                    :
                    <SwipeListView
                        data={listData}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        rightOpenValue={-width}
                        leftOpenValue={width}
                        onSwipeValueChange={onSwipeValueChange}
                        useNativeDriver={false}
                        contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0, }}
                    />
                }
                <Snackbar
                    style={styles.snackBarStyle}
                    visible={showSnackBar}
                    onDismiss={() => setShowSnackBar(false)}
                >
                    {snackBarMsg}
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
                    Notifications
                </Text>
            </View>
        )
    }

    function noNotification() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <MaterialCommunityIcons
                    name="bell-off-outline"
                    size={50}
                    color={Colors.grayColor}
                />
                <Text style={{ ...Fonts.grayColor15Bold, marginTop: Sizes.fixPadding }}>
                    Notification List Is Empty
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
    rowBack: {
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        flex: 1,
        marginBottom: Sizes.fixPadding + 5.0,
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: -10.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333'
    },
    notificationShadowStyle: {
        elevation: 6.0,
        borderRadius: 30.0,
        paddingVertical: Sizes.fixPadding - 9.0,
        ...CommonStyles.shadow
    },
    salonImageStyle: {
        width: 55.0,
        height: 55.0,
        borderColor: Colors.whiteColor,
        borderWidth: 2.0,
        borderRadius: 27.5,
    }
});

export default NotificationsScreen;