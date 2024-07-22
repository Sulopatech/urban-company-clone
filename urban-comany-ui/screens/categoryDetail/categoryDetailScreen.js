import React, { useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Text, Image } from "react-native";
import { useQuery } from '@apollo/client';
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar } from "react-native-paper";
import MyStatusBar from "../../components/myStatusBar";
import {  GET_SINGLE_COLLECTION_LIST } from '../../services/Product'

const { width } = Dimensions.get('screen');

const CategoryDetailScreen = ({ navigation, route }) => {
    const { productSlug } = route.params;

    const { data } = useQuery(GET_SINGLE_COLLECTION_LIST(productSlug));

    const [state, setState] = useState({
        showSnackBar: false,
        addToFavorite: false,
    });

    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const {
        showSnackBar,
        addToFavorite,
    } = state;

    const product = data ? data.collection : null;
    const variantList = product?.productVariants?.items || [];

    const filterUniqueProducts = (data) => {
        const uniqueProducts = [];
        const productIds = new Set();

        data.forEach(item => {
            if (!productIds.has(item.product.id)) {
                uniqueProducts.push(item);
                productIds.add(item.product.id);
            }
        });

        return uniqueProducts;
    };

    const filteredVariantList = filterUniqueProducts(variantList);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                {/* {product && availableSalons(product)} */}
                {variantList && renderVariants(filteredVariantList)}
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
        const imageSource = item.product.featuredAsset ? { uri: item.product.featuredAsset.preview } : require('../../assets/images/dummyimage.png');
        return (
            <View style={styles.variantContainer}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.push('SalonDetail', { variantSlug: item.product.slug })}
                    style={styles.variantItem}
                >
                    <Image
                        source={imageSource}
                        style={styles.variantImage}
                        resizeMode="cover"
                    />
                    <View style={styles.salonDetailWrapper}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Text numberOfLines={1} style={{ ...Fonts.blackColor14Bold, flex: 1 }}>
                            {item.product.name}
                        </Text>
                        {/* <MaterialIcons
                            name={item.isFavorite ? "favorite" : "favorite-border"}
                            color={Colors.blackColor}
                            size={17}
                            // onPress={() => {
                            //     updateSalons({ id: item.id })
                            //     updateState({ showSnackBar: true })
                            // }}
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
            </View>
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
                    {product ? product.name : 'Loading.....'}
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
        borderRadius: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        ...CommonStyles.shadow
    },
    variantItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    variantImage: {
        width: 100,
        height: "100%",
        borderRadius: Sizes.fixPadding,
    },
    variantName: {
        ...Fonts.blackColor14Bold,
        marginLeft: Sizes.fixPadding,
        flex: 1,
    }
});

export default CategoryDetailScreen;