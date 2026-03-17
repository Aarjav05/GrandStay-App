import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../hooks/useTheme';
import HomeScreen from '../screens/home/HomeScreen';
import SearchResultsScreen from '../screens/home/SearchResultsScreen';
import HotelDetailsScreen from '../screens/home/HotelDetailsScreen';
import RoomSelectionScreen from '../screens/home/RoomSelectionScreen';
import BookingScreen from '../screens/home/BookingScreen';
import PaymentScreen from '../screens/home/PaymentScreen';
import BookingSuccessScreen from '../screens/home/BookingSuccessScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.headerBackground,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{ title: 'Search Results' }}
      />
      <Stack.Screen
        name="HotelDetails"
        component={HotelDetailsScreen}
        options={{
          headerShown: false,
          headerTransparent: true,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="RoomSelection"
        component={RoomSelectionScreen}
        options={{ title: 'Select Room' }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ title: 'Review Booking' }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: 'Payment' }}
      />
      <Stack.Screen
        name="BookingSuccess"
        component={BookingSuccessScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
