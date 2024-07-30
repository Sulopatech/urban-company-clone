import React, { useState, useRef, useEffect, useCallback } from "react";
import { BackHandler, View, Dimensions, StyleSheet, Text, Image, Platform } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import Carousel, { Pagination } from 'react-native-snap-carousel-v4';
import { useFocusEffect } from "@react-navigation/native";
import MyStatusBar from "../../components/myStatusBar";

const { width, height } = Dimensions.get('window');

const onboardingScreenList = [
    {
        id: '1',
        onboardingImage: require('../../assets/images/Cleaning.jpeg'),
        title: 'Find and Book Services',
        description: `These platforms often offer search filters, customer reviews, price comparisons, and secure payment options to streamline the booking process and ensure a convenient and reliable experience for users.`,
    },
    {
        id: '2',
        onboardingImage: require('../../assets/images/Electician.png'),
        title: 'Style that fit our Lifestyle',
        description: `This concept emphasizes customization and personalization, ensuring that the products and services selected enhance and complement one's way of living.`,
    },
    {
        id: '3',
        onboardingImage: require('../../assets/images/Painting.jpeg'),
        title: 'The Professional Specialists',
        description: `These specialists offer advanced expertise, tailored solutions, and professional services to meet complex or specialized needs.`,
    },
];

const OnboardingScreen = ({ navigation }) => {

    const backAction = () => {
        if (Platform.OS === "ios") {
            navigation.addListener("beforeRemove", (e) => {
                e.preventDefault();
            });
        } else {
            backClickCount == 1 ? BackHandler.exitApp() : _spring();
            return true;
        }
    };

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            navigation.addListener("gestureEnd", backAction);
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", backAction);
                navigation.removeListener("gestureEnd", backAction);
            };
        }, [backAction])
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            flatListRef.current.startAutoplay((instantly = false));
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            flatListRef.current.stopAutoplay();
        });
        return unsubscribe;
    }, [navigation]);

    function _spring() {
        setBackClickCount(1);
        setTimeout(() => {
            setBackClickCount(0)
        }, 1000)
    }

    const [backClickCount, setBackClickCount] = useState(0);
    const [onboardingScreens, setOnboardingScreen] = useState(onboardingScreenList);
    const [activeSlide, setActiveSlide] = useState(0);

    const flatListRef = useRef();

    const renderItem = ({ item }) => {
        return (
            <View style={{ flex: 1, alignItems: 'center', overflow: 'hidden' }}>
                <View style={{ flex: 0.85, }}>
                    <Image
                        source={item.onboardingImage}
                        style={{
                            resizeMode: 'contain',
                            flex: 1.0,
                            width: width + 250,
                            left: width / 10.0,
                            bottom: -height / 2.4,
                        }}
                    />
                </View>
                <View style={styles.titleAndDescriptionWrapStyle}>
                    <Text style={{ textAlign: 'center', ...Fonts.primaryColor15Bold }}>
                        {item.title}
                    </Text>
                    <Text style={{ marginTop: Sizes.fixPadding, textAlign: 'center', ...Fonts.blackColor13Medium }}>
                        {item.description}
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <Carousel
                ref={flatListRef}
                data={onboardingScreens}
                sliderWidth={width}
                itemWidth={width}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                onSnapToItem={(index) => setActiveSlide(index)}
                loop={true}
                autoplayInterval={4000}
                slideStyle={{ width: width }}
            />
            {pagination()}
            {skipNextAndDone()}
            {
                backClickCount == 1
                    ?
                    <View style={[styles.animatedView]}>
                        <Text style={{ ...Fonts.whiteColor11Medium }}>
                            Press Back Once Again to Exit
                        </Text>
                    </View>
                    :
                    null
            }
        </View>
    )

    function skipNextAndDone() {
        return (
            <View style={styles.skipAndDoneWrapStyle}>
                {activeSlide != 2
                    ?
                    <Text
                        onPress={() => { navigation.push('Signin') }}
                        style={{ ...Fonts.blackColor14Bold, }}
                    >
                        Skip
                    </Text>
                    :
                    <Text>
                    </Text>
                }
                {
                    activeSlide == 2
                        ?
                        <Text
                            onPress={() => { navigation.push('Signin') }}
                            style={{ position: 'absolute', right: 0.0, bottom: 0.0, ...Fonts.blackColor14Bold, }}
                        >
                            Done
                        </Text>
                        :
                        <Text
                            onPress={() => {
                                if (activeSlide == 0) {
                                    flatListRef.current.snapToItem(1);
                                }
                                else if (activeSlide == 1) {
                                    flatListRef.current.snapToItem(2);
                                }
                            }}
                            style={{
                                ...Fonts.blackColor14Bold,
                            }}
                        >
                            Next
                        </Text>
                }
            </View>
        )
    }

    function pagination() {
        return (
            <Pagination
                dotsLength={onboardingScreens.length}
                activeDotIndex={activeSlide}
                containerStyle={{
                    position: 'absolute',
                    bottom: height / 2.06,
                    alignSelf: 'center'
                }}
                dotStyle={styles.activeDotStyle}
                inactiveDotStyle={styles.dotStyle}
                inactiveDotScale={0.8}
            />
        );
    }
}

const styles = StyleSheet.create({
    animatedView: {
        backgroundColor: "#333333",
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
    },
    dotStyle: {
        backgroundColor: Colors.grayColor,
        borderRadius: Sizes.fixPadding + 5.0,
        height: 9.0,
        width: 9.0,
        borderRadius: 4.5,
        marginHorizontal: Sizes.fixPadding - 15.0,
    },
    activeDotStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding + 5.0,
        height: 7.0,
        width: 20.0,
        marginHorizontal: Sizes.fixPadding - 15.0,
    },
    titleAndDescriptionWrapStyle: {
        position: 'absolute',
        bottom: height / 1.4,
        left: 0.0,
        right: 0.0,
        flex: 1,
        justifyContent: 'space-between'
    },
    skipAndDoneWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: height / 1.95,
        left: 20.0,
        right: 20.0,
    }
});

export default OnboardingScreen;