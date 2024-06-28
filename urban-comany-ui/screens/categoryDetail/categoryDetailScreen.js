import React, { useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Text, Image } from "react-native";
import { useQuery } from '@apollo/client';
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar } from "react-native-paper";
import MyStatusBar from "../../components/myStatusBar";
import { GETSINGLECOLLECTIONLIST } from '../../services/Product'

const { width } = Dimensions.get('screen');

const CategoryDetailScreen = ({ navigation, route }) => {
    const { productId } = route.params;

    const { data } = useQuery(GETSINGLECOLLECTIONLIST, {
        variables: { id: productId },
    });

    const [state, setState] = useState({
        showSnackBar: false,
        addToFavorite: false,
    });

    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const {
        showSnackBar,
        addToFavorite,
    } = state;

    const product = data ? data.product : null;
    const variantList = product?.variantList?.items || [];
    

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                {/* {product && availableSalons(product)} */}
                {variantList.length > 0 && renderVariants(variantList)}
            </View>
            <Snackbar
                style={styles.snackBarStyle}
                visible={showSnackBar}
                onDismiss={() => updateState({ showSnackBar: false })}
            >
                {addToFavorite ? 'Item added to favorite' : 'Item removed from favorite'}
            </Snackbar>
        </View>
    );

    function renderVariants(variants) {
        return (
            <FlatList
                data={variants}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                renderItem={renderVariantItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Sizes.fixPadding, paddingTop: Sizes.fixPadding - 5.0 }}
            />
        );
    }

    function renderVariantItem({ item }) {
        const imageSource = item.assets.length > 0 ? { uri: item.assets[0].url } : require('../../assets/images/dummyimage.png');

        return (
            <View style={styles.variantContainer}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {/* Handle onPress if needed */}}
                    style={styles.variantItem}
                >
                    <Image
                        source={imageSource}
                        style={styles.variantImage}
                        resizeMode="cover"
                    />
                    <Text style={styles.variantName}>{item.name}</Text>
                </TouchableOpacity>
            </View>
        );
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

    function availableSalons(product) {
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
                                updateSalons({ id: item.id });
                                updateState({ showSnackBar: true });
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
        );

        return (
            <FlatList
                data={product.salonDetails}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Sizes.fixPadding, paddingTop: Sizes.fixPadding - 5.0 }}
            />
        );
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
                    {product ? product.name : 'Loading...'}
                </Text>
            </View>
        );
    }
};

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
    },
    variantContainer: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        overflow: 'hidden',
        ...CommonStyles.shadow
    },
    variantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Sizes.fixPadding,
    },
    variantImage: {
        width: 80,
        height: 80,
        borderRadius: Sizes.fixPadding,
    },
    variantName: {
        ...Fonts.blackColor14Bold,
        marginLeft: Sizes.fixPadding,
        flex: 1,
    }
});

export default CategoryDetailScreen;