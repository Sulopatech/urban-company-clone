
import React, { useState } from "react";
import {
    ScrollView,
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    TextInput,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import CreditCard from 'react-native-credit-card-ui';
import CheckerCC from 'card-validator';

const AddNewCardScreen = ({ navigation }) => {

    const [expiry, setExpiry] = useState('');
    const [holder, setHolder] = useState('');
    const [number, setNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [focusCvv, setFocusCvv] = useState(false);
    const [backspaceRemove, setBackspaceRemove] = useState(false);
    const [isValidHolder, setIsValidHolder] = useState('');
    const [cardType, setCardType] = useState('');
    const [expiryInfo, setExpiryInfo] = useState({});

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                    {addNewCardText()}
                    {cardView()}
                    {cardNumberInfo()}
                    {cardHolderInfo()}
                    {expiryAndCvvInfo()}
                    {addButton()}
                </ScrollView>
            </View>
        </View>
    )

    function expiryAndCvvInfo() {
        const handleExpiryDate = (text) => {
            let textTemp = text;
            if (textTemp.length === 2) {
                if (
                    parseInt(textTemp.substring(0, 2)) > 12 ||
                    parseInt(textTemp.substring(0, 2)) === 0
                ) {
                    textTemp = textTemp[0];
                } else if (text.length === 2 && !backspaceRemove) {
                    textTemp += '/';
                    setBackspaceRemove(true);
                } else if (text.length === 2 && backspaceRemove) {
                    textTemp = textTemp[0];
                    setBackspaceRemove(false);
                }
            }
            setExpiry(textTemp);
        };
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Sizes.fixPadding }}>
                <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
                    <Text style={{ ...Fonts.blackColor14Medium, marginBottom: Sizes.fixPadding - 5.0 }}>
                        Expiry
                    </Text>
                    <View style={styles.textFieldWrapper}>
                        <TextInput
                            placeholder="MM/YY"
                            placeholderTextColor={Colors.grayColor}
                            value={expiry}
                            onChangeText={(value) => {
                                handleExpiryDate(value);
                                const expiryValidation = CheckerCC.expirationDate(value);
                                setExpiryInfo(expiryValidation);
                            }}
                            style={{ ...Fonts.blackColor14Medium, color: !expiryInfo.isValid ? 'red' : Colors.blackColor }}
                            maxLength={5}
                            keyboardType="numeric"
                            cursorColor={Colors.primaryColor}
                            selectionColor={Colors.primaryColor}
                        />
                    </View>
                </View>
                <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
                    <Text style={{ ...Fonts.blackColor14Medium, marginBottom: Sizes.fixPadding - 5.0 }}>
                        CVV/CVC
                    </Text>
                    <View style={styles.textFieldWrapper}>
                        <TextInput
                            placeholder="CVV/CVC"
                            placeholderTextColor={Colors.grayColor}
                            value={cvv}
                            onChangeText={(value) => setCvv(value)}
                            style={{ ...Fonts.blackColor14Medium }}
                            maxLength={4}
                            keyboardType="numeric"
                            onFocus={() => { setFocusCvv(true) }}
                            onBlur={() => { setFocusCvv(false) }}
                            cursorColor={Colors.primaryColor}
                            selectionColor={Colors.primaryColor}
                        />
                    </View>
                </View>
            </View>
        )
    }

    function cardHolderInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor14Medium, marginBottom: Sizes.fixPadding - 5.0 }}>
                    Card Holder Name
                </Text>
                <View style={styles.textFieldWrapper}>
                    <TextInput
                        placeholder="Card Holder Name"
                        placeholderTextColor={Colors.grayColor}
                        value={holder}
                        onChangeText={(value) => {
                            setHolder(value)
                            const holderValidation = CheckerCC.cardholderName(value);
                            setIsValidHolder(holderValidation.isValid);
                        }}
                        style={{ ...Fonts.blackColor14Medium, color: isValidHolder ? Colors.blackColor : 'red' }}
                        maxLength={26}
                        cursorColor={Colors.primaryColor}
                        selectionColor={Colors.primaryColor}
                    />
                </View>
            </View>
        )
    }

    function cardNumberInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor14Medium, marginBottom: Sizes.fixPadding - 5.0 }}>
                    Card Number
                </Text>
                <View style={styles.textFieldWrapper}>
                    <TextInput
                        placeholder="Card Number"
                        placeholderTextColor={Colors.grayColor}
                        value={number}
                        onChangeText={(value) => {
                            const numberValidation = CheckerCC.number(value);
                            setCardType(numberValidation.card?.type);
                            setNumber(value);
                        }}
                        style={{ ...Fonts.blackColor14Medium, color: cardType ? Colors.blackColor : 'red' }}
                        keyboardType="numeric"
                        maxLength={16}
                        cursorColor={Colors.primaryColor}
                        selectionColor={Colors.primaryColor}
                    />
                </View>
            </View>
        )
    }

    function addNewCardText() {
        return (
            <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding, ...Fonts.blackColor16Bold }}>
                Add New Card
            </Text>
        )
    }

    function cardView() {
        return (
            <CreditCard
                shiny
                bar={true}
                focused={focusCvv ? 'cvc' : null}
                number={number}
                name={holder}
                expiry={expiry}
                cvc={cvv}
                bgColor={Colors.primaryColor}
                imageFront={require('../../assets/images/cardbg.png')}
                imageBack={require('../../assets/images/cardbg.png')}
                style={{ alignSelf: 'center', marginVertical: Sizes.fixPadding * 2.0 }}
                type={cardType}
            />
        );
    }

    function addButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => { navigation.pop() }}
                style={styles.addButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                    Add
                </Text>
            </TouchableOpacity>
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
                    style={{ alignSelf: 'flex-start' }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingTop: Sizes.fixPadding + 5.0,
        paddingBottom: Sizes.fixPadding,
    },
    addButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        margin: Sizes.fixPadding * 2.0,
    },
    textFieldWrapper: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        borderBottomColor: Colors.lightGrayColor,
        borderBottomWidth: 1,
        paddingVertical: Sizes.fixPadding - 5.0,
    }
})

export default AddNewCardScreen;