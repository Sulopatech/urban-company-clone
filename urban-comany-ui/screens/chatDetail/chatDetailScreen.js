import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MyStatusBar from '../../components/myStatusBar';

const userMessages = [
    {
        id: '1',
        message: 'Lorem Ipsum is eit',
        time: '1:15 pm',
        isSender: true,
    },
    {
        id: '2',
        message: 'Lorem Ipsum is eit',
        time: '1:17 pm',
        isSender: false,
    },
    {
        id: '3',
        message: 'Lorem Ipsum is simply dummy\ntext of the printing and type of\nindustry.',
        time: '1:20 pm',
        isSender: true,
    },
    {
        id: '4',
        attachmentType: 'gallery',
        image: require('../../assets/images/hairstyle/hairstyle1.png'),
        isSender: true,
    },
    {
        id: '5',
        message: 'Lorem',
        time: '1:25 pm',
        isSender: false,
    },
    {
        id: '6',
        message: 'Lorem Ipsum is eit',
        time: '1:25 pm',
        isSender: false,
    },
    {
        id: '7',
        message: 'Lorem Ipsum is simply dummy\ntext of the printing and type of\nindustry.',
        time: '1:25 pm',
        isSender: false,
    },
];

const ChatScreen = ({ navigation }) => {

    const [messagesList, setMessagesList] = useState(userMessages);

    function messages() {

        const renderItem = ({ item }) => {
            return (
                <View style={{
                    alignItems: item.isSender == true ? 'flex-end' : 'flex-start',
                    marginHorizontal: Sizes.fixPadding * 2.0,
                    marginVertical: Sizes.fixPadding - 5.0,
                }}>
                    {
                        item.message == null
                            ?
                            item.attachmentType == 'gallery' ?
                                <View
                                    style={{
                                        backgroundColor: item.isSender ? Colors.primaryColor : '#D2D2D2',
                                        ...styles.sendOrReceiveImageWrapStyle
                                    }}
                                >
                                    <Image
                                        source={item.image}
                                        style={{
                                            width: 190.0,
                                            height: 140.0,
                                            borderRadius: Sizes.fixPadding,
                                        }}
                                    />
                                </View>
                                : null
                            :
                            < View style={{
                                ...styles.messageWrapStyle,
                                backgroundColor: item.isSender == true ? Colors.primaryColor : '#D2D2D2',
                            }}>
                                <Text style={item.isSender ? { ...Fonts.whiteColor12Medium } : { ...Fonts.blackColor12Medium }}>
                                    {item.message}
                                </Text>
                                <Text style={{
                                    lineHeight: 11.0,
                                    ...item.isSender ? { ...Fonts.whiteColor11Medium } : { ...Fonts.blackColor11Medium },
                                    alignSelf: 'flex-end'
                                }}>
                                    {item.time}
                                </Text>
                            </View>
                    }
                </View >
            )
        }

        return (
            <FlatList
                inverted
                data={messagesList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingVertical: Sizes.fixPadding * 2.0,
                    flexDirection: 'column-reverse',
                }}
            />
        )
    }

    function addMessage({ message }) {

        const oldMessages = messagesList;
        let date = Date();
        let hour = (new Date(date)).getHours();
        let minute = (new Date(date)).getMinutes();
        let AmPm = hour >= 12 ? 'pm' : 'am';
        let finalhour = hour > 12 ? (hour - 12) : hour;

        const newMessage = {
            id: messagesList.length + 1,
            message: message,
            time: `${finalhour}:${minute} ${AmPm}`,
            isSender: true,
            isSeen: false,
        }

        oldMessages.push(newMessage);
        setMessagesList(oldMessages);
    }

    function typeMessage() {
        const [message, setMessage] = useState('');
        return (
            <View style={styles.textFieldWrapStyle}>
                <TextInput
                    selectionColor={Colors.whiteColor}
                    value={message}
                    onChangeText={setMessage}
                    placeholder='Write your message'
                    style={{ flex: 1, ...Fonts.whiteColor12Medium }}
                    placeholderTextColor={Colors.whiteColor}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name="attach-file"
                        size={16}
                        color={Colors.whiteColor}
                        style={{ marginRight: Sizes.fixPadding, }}
                    />
                    <MaterialCommunityIcons
                        name="send"
                        size={15}
                        color={Colors.whiteColor}
                        onPress={() => {
                            if (message != '') {
                                addMessage({ message: message })
                                setMessage('');
                            }
                        }}
                    />
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            {header()}
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : null}
                style={{ flex: 1, }}
            >
                {messages()}
                {typeMessage()}
            </KeyboardAvoidingView>
        </View>
    )

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
                    Sora Jain
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
    messageWrapStyle: {
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding - 5.0,
    },
    textFieldWrapStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding * 3.0,
        height: 43.0,
        justifyContent: 'center',
        paddingLeft: Sizes.fixPadding,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding + 5.0,
    },
    sendOrReceiveImageWrapStyle: {
        width: 200.0,
        height: 150.0,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default ChatScreen;