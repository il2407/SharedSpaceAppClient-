import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotificationScreen({ navigation }) {
  const [userID, setUserID] = useState("");
  const [groupID, setGroupID] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchGroupID = async () => {
      const storedGroupID = await AsyncStorage.getItem("groupID");
      setGroupID(storedGroupID);
    };
    const fetchUserID = async () => {
      const storedUserID = await AsyncStorage.getItem("userID");
      setUserID(storedUserID);
    };

    fetchUserID();
    fetchGroupID();
  }, []);

  useEffect(() => {
    if (groupID !== "" && userID !== "") fetchNotifications();
  }, [groupID, userID]);

  const fetchNotifications = async () => {
    const data = JSON.stringify({
      group_id: groupID,
    });
    try {
      const response = await axios.post(
        "http://localhost:5000/notifications_from_group_id",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const filteredNotifications = response.data.filter(
        (notification) => String(notification.user_id) !== userID
      );
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error(error);
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/remove_notification",
        { notification_id: notificationId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.status === "success") {
        fetchNotifications();
      } else {
        console.error("Failed to delete notification");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <View style={styles.content}>
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <View style={styles.notificationContainer}>
              <Text style={styles.notificationTitle}>
                {item.notification_name}
              </Text>
              <Button
                title="Delete"
                onPress={() => removeNotification(item.notification_id)}
              />
            </View>
          )}
          keyExtractor={(item) => String(item.notification_id)}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9F6",
  },
  header: {
    height: 60,
    backgroundColor: "#1E90FF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
  },
  notificationContainer: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  notificationTitle: {
    fontSize: 16,
    color: "#000",
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
