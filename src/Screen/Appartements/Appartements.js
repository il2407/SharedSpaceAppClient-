import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Dimensions,
  View,
  FlatList,
  Text,
  Button,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import io from "socket.io-client";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SLIDER_WIDTH = Dimensions.get("window").width + 2;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);

export default function Appartements({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [userID, setUserID] = useState(0);
  const [groupID, setGroupID] = useState(0);
  const [userName, setUserName] = useState("");

  const createRoom = (groupName, groupDescription, groupID) => {
    console.log(userName, userID, groupID);
    const roomName = `${groupName} - ${groupDescription} : for user ${userName}`;
    const socket = io("http://localhost:5000");
    console.log(groupName, groupDescription, groupID);
    // Emit room creation event with additional parameters
    socket.emit("add_room", {
      room_name: roomName,
      group_id: groupID,
      user1: userID,
      user2: "",
    });

    socket.on("room_added", (data) => {
      alert(`Chat Room for ${roomName} was created successfully!`);
    });

    socket.on("error", (data) => {
      alert(data.error);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      setGroups([]);

      // Fetching data using Axios
      axios
        .post("http://localhost:5000/get_available_groups")
        .then((response) => {
          setGroups(response.data.group_details);
          console.log("response.data", response.data.group_details);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, [])
  );

  useEffect(() => {
    const fetchGroupID = async () => {
      const storedGroupID = await AsyncStorage.getItem("groupID");
      console.log("storedGroupID", storedGroupID);
      setGroupID(storedGroupID);
    };
    const fetchUserID = async () => {
      const storedUserID = await AsyncStorage.getItem("userID");
      console.log("storedUserID", storedUserID);
      setUserID(storedUserID);
    };
    const fetchUserName = async () => {
      const storedUserName = await AsyncStorage.getItem("userName");
      setUserName(storedUserName);
    };

    fetchUserID();
    fetchGroupID();
    fetchUserName();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* ... search input ... */}
      <FlatList
        style={{ marginEnd: 10, marginEnd: 10 }}
        data={groups}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={{ fontWeight: "bold" }}>
              Appartement Address: {item.group_name} - {item.group_description}
            </Text>
            <Text>Appartement Max Roomates: {item.group_max_members}</Text>
            <Text>End of Contract: {item.end_of_contract}</Text>
            <Text>Roomate Name: {item.username}</Text>
            <Button
              title={`Open Chat for ${item.group_name}`}
              onPress={() =>
                createRoom(
                  item.group_name,
                  item.group_description,
                  item.group_id
                )
              }
            />
          </View>
        )}
        keyExtractor={(item, index) =>
          item.group_id ? item.group_id.toString() : index.toString()
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  Notification: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: "#000",
  },
  searchSection: {
    borderColor: "#02C38E",
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: "grey",
    shadowRadius: 10,
    shadowOpacity: 0.6,
    elevation: 8,
  },
  searchIcon: {
    padding: 10,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#ffffff",
    color: "grey",
    width: "50%",
    borderColor: "#02C38E",
    borderRadius: 10,
  },
  categeory: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
  },
});
