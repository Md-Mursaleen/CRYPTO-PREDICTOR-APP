import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { normalize } from './theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const drawerData = [
    { id: 1, value: 'Leaderboard', other: true, otherText: 'Soon!', },
    { id: 2, value: 'Crypto Resources', other: true, otherText: 'Soon!', },
    { id: 3, value: 'Help & Support', other: true, otherText: 'Very Soon!', },
    { id: 4, value: 'Settings', other: true, otherText: 'Very Soon!', },
    { id: 5, value: 'Suggest a Feature', other: true, otherText: 'Win Points!!', },
];

const drawerIconsData = {
    1: require('../../assets/images/rank.png'),
    2: require('../../assets/images/gps.png'),
    3: require('../../assets/images/help-polygon.png'),
    4: require('../../assets/images/setting.png'),
    5: require('../../assets/images/loading.png'),
};

const MenuDrawer = ({ closeDrawer }) => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const signedUser = await AsyncStorage.getItem('SignedUserData');

                if (signedUser) {
                    const signedUserData = JSON.parse(signedUser);
                    setUserData(signedUserData);
                }
            } catch (error) {
                console.error('Failed to load user data from AsyncStorage:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);


    const handleItemPressable = (item) => {
        if (item.id === 1) {
            navigation.navigate('Leaderboard');
        }
        else if (item.id === 2) {
            navigation.navigate('CryptoResources');
        }
        else if (item.id === 3) {
            navigation.navigate('HelpSupport');
        }
        else if (item.id === 4) {
            navigation.navigate('ProfileSettings');
        }
    };

    const handleSignout = () => {
        GoogleSignin.signOut();
        navigation.navigate('Login');
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {loading ? (
                <ActivityIndicator size='large' color='#FFFFFF' />
            ) : (
                <>
                    <View style={styles.headerContainer}>
                        <Pressable onPress={closeDrawer}>
                            <Image source={require('../../assets/images/close-icon.png')} tintColor={'#FFFFFF'} />
                        </Pressable>
                        <Pressable onPress={handleSignout} style={styles.headerSubContainer}>
                            <Image source={require('../../assets/images/logout.png')} tintColor={'#D0585C'} />
                            <Text style={styles.headerTextStyle}>Logout</Text>
                        </Pressable>
                    </View>
                    <View style={styles.userDetailsContainer}>
                        <Image source={{ uri: userData?.user?.photoURL }} style={styles.userProfileImageStyle} />
                        <View style={styles.userDetailsTextContainer}>
                            <Text style={styles.userNameTextStyle}>{userData?.user?.displayName}</Text>
                            <Text style={styles.userDetailTextStyle}>Crypto Enthusiast</Text>
                        </View>
                    </View>
                    <FlatList data={drawerData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => handleItemPressable(item)} style={styles.itemContainer} accessibilityLabel={`${item.value} button`} accessible={true}>
                                <View style={styles.itemSubContainer}>
                                    <Image source={drawerIconsData[item.id]} tintColor={'#EEEEEE'} />
                                    <Text style={styles.itemValueTextStyle}>{item.value}</Text>
                                </View>
                                {item.other && (
                                    <View style={styles.itemOtherContainer}>
                                        <Text style={styles.itemOtherTextStyle}>{item.otherText}</Text>
                                    </View>
                                )}
                            </Pressable>
                        )} style={{ paddingVertical: 12 }} />
                </>
            )}
        </ScrollView>
    );
}

export default MenuDrawer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: normalize(30),
        backgroundColor: '#141323',
    },
    headerContainer: {
        paddingHorizontal: normalize(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerSubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    headerTextStyle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans-Bold',
        color: '#D0585C',
        lineHeight: 18,
    },
    userDetailsContainer: {
        paddingTop: 35,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userProfileImageStyle: {
        width: 60,
        height: 60,
        borderRadius: 50,
    },
    userDetailsTextContainer: {
        marginLeft: 15,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    userNameTextStyle: {
        fontSize: 28,
        fontWeight: '400',
        fontFamily: 'Lora-MediumItalic',
        color: '#EEEEEE',
        lineHeight: 36,
    },
    userDetailTextStyle: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'PlusJakartaSans-Regular',
        color: '#EEEEEE',
        lineHeight: 18,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EEEEEE',
    },
    itemSubContainer: {
        paddingVertical: 20,
        paddingHorizontal: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemValueTextStyle: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans-SemiBold',
        color: '#EEEEEE',
        lineHeight: 18,
    },
    itemOtherContainer: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        width: 'auto',
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        borderRadius: 6,
    },
    itemOtherTextStyle: {
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'PlusJakartaSans-Medium',
        color: '#EEEEEE',
        lineHeight: 15,
        textAlign: 'center',
    },
});