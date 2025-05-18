import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { normalize } from '../components/theme';
import LottieView from 'lottie-react-native';

const ProfileSettingsScreen = () => {
    return (
        <View style={styles.container}>
            <LottieView source={require('../../assets/animations/comingsoon-animation.json')}
                autoPlay={true}
                loop={true}
                style={styles.lottieAnimationStyle} />
            <Text style={styles.comingSoonTextStyle}>Coming Very Soon!</Text>
        </View>
    );
}

export default ProfileSettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottieAnimationStyle: {
        alignSelf: 'center',
        resizeMode: 'contain',
        overflow: 'hidden',
    },
    comingSoonTextStyle: {
        top: '25%',
        fontSize: 24,
        fontWeight: '500',
        fontFamily: 'Inter-SemiBold',
        color: '#FF5F1F',
        textAlign: 'center',
    },
});