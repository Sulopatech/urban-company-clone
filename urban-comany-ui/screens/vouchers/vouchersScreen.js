import React from "react";
import { View, StyleSheet, FlatList, Text, Image } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import DashedLine from 'react-native-dashed-line';
import MyStatusBar from "../../components/myStatusBar";

const vouchersList = [
    {
        id: '1',
        salonImage: require('../../assets/images/salon/salon2.png'),
        salonName: 'Crown Salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        services: ['Hair cut', 'Hair color'],
        amountOff: 10,
        validTill: 'August 31,2021'
    },
    {
        id: '2',
        salonImage: require('../../assets/images/salon/salon3.png'),
        salonName: 'RedBox Salon',
        salonAddress: 'A 9/a Sector 16,Gautam Budh Nagar',
        services: ['Hair cut', 'Hair color', 'Massage'],
        amountOff: 12,
        validTill: 'August 31,2021'
    }
];

const VouchersScreen = ({ navigation }) => {

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                {vouchers()}
            </View>
        </View>
    )

    function vouchers() {
        const renderItem = ({ item }) => (
            <View style={styles.voucherInfoWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={item.salonImage}
                        style={{ width: 60.0, height: 60.0, borderRadius: Sizes.fixPadding - 5.0, }}
                    />
                    <View style={{ flex: 1, marginLeft: Sizes.fixPadding, }}>
                        <Text style={{ ...Fonts.blackColor14Bold }}>
                            {item.salonName}
                        </Text>
                        <Text numberOfLines={1} style={{marginVertical:Sizes.fixPadding-8.0, ...Fonts.grayColor12SemiBold,includeFontPadding:false }}>
                            {item.salonAddress} 
                        </Text>
                        <Text numberOfLines={1} style={{ ...Fonts.blackColor13Bold }}>
                            {item.services.map((service, index) => (
                                <Text key={index}>
                                    {service}{item.services.length - 1 == index ? null : ` - `}
                                </Text>
                            ))}
                        </Text>
                    </View>
                </View>
                <DashedLine
                    dashLength={6}
                    dashThickness={1}
                    dashGap={5}
                    dashColor={Colors.primaryColor}
                    style={{ marginVertical: Sizes.fixPadding, }}
                />
                <Text style={{ marginTop: Sizes.fixPadding - 17.0, }}>
                    <Text style={{ ...Fonts.blackColor26Bold }}>
                        {`$`}{item.amountOff}
                    </Text>
                    <Text style={{ ...Fonts.blackColor14Bold, }}>
                        {`  `}off
                    </Text>
                </Text>
                <Text style={{ lineHeight: 15.0, ...Fonts.grayColor15Bold }}>
                    Valid Till: {item.validTill}
                </Text>
            </View>
        )
        return (
            <FlatList
                data={vouchersList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0, }}
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
                    Vouchers
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
    voucherInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        ...CommonStyles.shadow
    }
});

export default VouchersScreen;