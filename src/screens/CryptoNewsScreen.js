import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { normalize } from '../components/theme';
import { NEWS_API_URL } from '../../utilis/env';
import NewsItem from '../components/NewsItem';

const CryptoNewsScreen = () => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchNewsData = async (pageToFetch = 1, isRefresh = false) => {
        if (loading) return;
        setLoading(true);
        if (isRefresh) setRefreshing(true);
        setError(null);

        try {
            const response = await fetch(`${NEWS_API_URL}?page=${pageToFetch}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data?.data?.length > 0) {
                setNewsData((prev) => pageToFetch === 1 ? data.data : [...prev, ...data.data]);
                setHasMore(true);
                setPage(pageToFetch + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            setError(`Failed to load news. Please check your internet connection.`);
            console.log('Error while fetching news data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNewsData();
    }, []);

    const handleRefresh = () => {
        setPage(1);
        setHasMore(true);
        fetchNewsData(1, true);
    };

    const handleEndReached = () => {
        if (!hasMore || loading) return;
        fetchNewsData(page);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTextStyle}>Top Crypto News</Text>
            </View>
            {loading && newsData.length === 0 ? (
                <ActivityIndicator size='large' color='#FFFFFF' />
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTextStyle}>{error}</Text>
                </View>
            ) : (
                <FlatList data={newsData}
                    keyExtractor={(item) => item.title}
                    renderItem={({ item }) => <NewsItem item={item} />}
                    refreshControl={
                        <RefreshControl refreshing={loading} tintColor='#000000' onRefresh={handleRefresh} />
                    }
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loading && !refreshing ? <ActivityIndicator size='large' color='#FFFFFF' /> : null
                    }
                    style={styles.flatListStyle} />
            )}
        </View>
    );
}

export default CryptoNewsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141323',
    },
    headerContainer: {
        paddingTop: normalize(45),
        marginLeft: normalize(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTextStyle: {
        paddingBottom: normalize(5),
        marginLeft: normalize(10),
        fontSize: 25,
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans-Bold',
        color: '#FFFFFF',
    },
    flatListStyle: {
        flex: 1,
        marginTop: normalize(5),
        marginBottom: normalize(15),
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorTextStyle: {
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'Inter-SemiBold',
        color: '#FF6B6B',
        textAlign: 'center',
    },
});