import React, { } from "react";
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";

const { width } = Dimensions.get('window');

const usersList = [
    {
        id: '1',
        userImage: require('../../assets/images/users/user1.png'),
        unreadMessagesCount: 2,
        userName: 'Sora Jain',
        lastMessage: 'Lorem Ipsum is simply dummy text',
        messageReceiveTime: '10:45 am'
    },
    {
        id: '2',
        userImage: require('../../assets/images/specialists/specialist2.png'),
        unreadMessagesCount: 3,
        userName: 'Joya Patel',
        lastMessage: 'Lorem Ipsum dolor sit amet.',
        messageReceiveTime: '9:00 am',
    },
    {
        id: '3',
        userImage: require('../../assets/images/users/user4.png'),
        unreadMessagesCount: 2,
        userName: 'Doe John',
        lastMessage: 'Lorem Ipsum is simply dummy text',
        messageReceiveTime: '8:50 am',
    },
    {
        id: '4',
        userImage: require('../../assets/images/users/user5.png'),
        unreadMessagesCount: 1,
        userName: 'Tina Jain',
        lastMessage: 'Lorem Ipsum dolor sit amet.',
        messageReceiveTime: '8:00 am',
    },
    {
        id: '5',
        userImage: require('../../assets/images/users/user6.png'),
        unreadMessagesCount: 4,
        userName: 'Aelisha Patel',
        lastMessage: 'Lorem Ipsum is simply dummy text',
        messageReceiveTime: '7:50 am',
    },
    {
        id: '6',
        userImage: require('../../assets/images/users/user7.png'),
        unreadMessagesCount: 2,
        userName: 'Joya John',
        lastMessage: 'Lorem Ipsum is simply dummy text',
        messageReceiveTime: '6:00 am',
    },
    {
        id: '7',
        userImage: require('../../assets/images/users/user8.png'),
        unreadMessagesCount: 2,
        userName: 'James Mehta',
        lastMessage: 'Lorem Ipsum dolor sit amet.',
        messageReceiveTime: '5:00 am',
    },
];

const ChatsScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                {usersListData()}
            </View>
        </View>
    )

    function usersListData() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.userInfoWrapStyle}
                onPress={() => navigation.push('ChatDetail')}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <Image
                            source={item.userImage}
                            style={{ width: 50.0, height: 50.0, borderRadius: 25.0 }}
                        />
                        <View style={styles.unreadMessagesCountWrapStyle}>
                            <Text style={{
                                lineHeight: 15.0,
                                ...Fonts.whiteColor10Bold,
                            }}>
                                {item.unreadMessagesCount}
                            </Text>
                        </View>
                    </View>
                    <View style={{ maxWidth: width - 180, marginLeft: Sizes.fixPadding, }}>
                        <Text numberOfLines={1} style={{ ...Fonts.blackColor13Bold }}>
                            {item.userName}
                        </Text>
                        <Text numberOfLines={1} style={{ lineHeight: 13.0, ...Fonts.blackColor12Medium }}>
                            {item.lastMessage}
                        </Text>
                    </View>
                </View>
                <Text style={{ ...Fonts.grayColor11SemiBold }}>
                    {item.messageReceiveTime}
                </Text>
            </TouchableOpacity>
        )
        return (
            <FlatList
                data={usersList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
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
                    Chats
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
    unreadMessagesCountWrapStyle: {
        backgroundColor: Colors.primaryColor,
        width: 17.0,
        height: 17.0,
        borderRadius: 8.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.whiteColor,
        borderWidth: 1.0,
        position: 'absolute',
        bottom: -5.0,
        right: 5.0,
    },
    userInfoWrapStyle: {
        marginBottom: Sizes.fixPadding * 2.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default ChatsScreen;