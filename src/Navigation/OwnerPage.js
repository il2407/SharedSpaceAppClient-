import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../Screen/Appartements/Appartements";
import ChatList from "../Screen/Chat/ChatList";
import StepIndicatorScreen from "../Screen/Notification/NotificationScreen";
import OwnerScreen from "../Screen/Profile/OwnerScreen";
import GroupDetailsPage from "../Screen/Appartements/MyAppartements";
import OwnerChatList from "../Screen/Chat/OwnerChatList";
// import Theme from "../../src/Constants/Theme";

const Tab = createBottomTabNavigator();
// Below are the screens whcih use in bottom tab those are import in this screen
function OwnerPage({ route }) {
  return (
    <Tab.Navigator
      //First screen will be home all the time
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#7B7BC4",
        headerShown: false,
        tabBarInactiveTintColor: "#7B7BC4",
      }}
    >
      <Tab.Screen
        name="Home"
        component={OwnerScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            //This is the icon use for Home in bottom tab
            <FontAwesome5 name="user-alt" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Messeage"
        component={OwnerChatList}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            //This is the icon use for Message in bottom tab
            <AntDesign name="message1" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={StepIndicatorScreen}
        options={{
          tabBarLabel: "Notification",
          tabBarIcon: ({ color, size }) => (
            //This is the icon use for Notificatio in bottom tab
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={GroupDetailsPage}
        options={{
          tabBarLabel: "My Appartements",
          tabBarIcon: ({ color, size }) => (
            //This is the icon use for Profile in bottom tab
            <FontAwesome5 name="home" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default OwnerPage;
