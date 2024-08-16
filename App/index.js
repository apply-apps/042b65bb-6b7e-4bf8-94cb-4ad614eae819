// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, Image, Button, ScrollView } from 'react-native';
import axios from 'axios';

const API_URL = "http://apihub.p.appply.xyz:3300/chatgpt";

export default function App() {
    const [loading, setLoading] = useState(true);
    const [dishes, setDishes] = useState([]);
    const [selectedDish, setSelectedDish] = useState(null);

    useEffect(() => {
        const getDishes = async () => {
            try {
                const response = await axios.post(API_URL, {
                    messages: [
                        { role: "system", content: "You are a helpful assistant. Please suggest two dishes for the user to choose from." },
                        { role: "user", content: "Please suggest two dishes for my meal." }
                    ],
                    model: "gpt-4o"
                });

                const resultString = response.data.response;
                const dishesFromResponse = resultString.split('\n').filter(line => line.trim() !== '');
                setDishes(dishesFromResponse.map((dish, index) => ({ id: index, name: dish })));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dishes: ", error);
                setLoading(false);
            }
        };

        getDishes();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#00ff00" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>Select a Dish</Text>
                {dishes.map((dish) => (
                    <View key={dish.id} style={styles.dishContainer}>
                        <Image
                            source={{ uri: `https://picsum.photos/200/300?random=${dish.id}` }}
                            style={styles.image}
                        />
                        <Text style={styles.dishName}>{dish.name}</Text>
                        <Button title="Select" onPress={() => setSelectedDish(dish)} />
                    </View>
                ))}
                {selectedDish && (
                    <View style={styles.selectedDishContainer}>
                        <Text style={styles.selectedDishText}>You selected: {selectedDish.name}</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dishContainer: {
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
    },
    image: {
        width: 200,
        height: 300,
        marginBottom: 10,
        borderRadius: 10,
    },
    dishName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    selectedDishContainer: {
        marginTop: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#00ff00',
        borderRadius: 10,
        backgroundColor: '#e0ffe0',
    },
    selectedDishText: {
        fontSize: 18,
        color: '#008000',
    },
});