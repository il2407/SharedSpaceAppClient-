import React, { useState, useEffect } from "react";
import { View, Button, FlatList } from "react-native";
import axios from "axios";
import io from "socket.io-client";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OwnerChatList = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [userID, setUserID] = useState(0);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.emit("get_rooms");

    socket.on("room_list", (data) => {
      setRooms(data);
      console.log("Dataasdasd", data);
    });

    socket.on("error", (data) => {
      console.error(data.error);
    });

    return () => socket.close();
  }, []);

  useEffect(() => {}, [userID]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchGroups = async () => {
        try {
          const response = await axios.post(
            "http://localhost:5000/get_group_details_by_id",
            { user_id: userID }
          );
          setGroups(response.data);
          console.log("response.data", response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      if (userID !== 0) fetchGroups();
    }, [userID])
  );

  useEffect(() => {
    const fetchUserID = async () => {
      const storedUserID = await AsyncStorage.getItem("userID");
      console.log("storedUserID", storedUserID);
      setUserID(storedUserID);
    };

    fetchUserID();
  }, []);

  // Create a set of group_ids for efficient lookup
  const groupIDSet = new Set(groups.map((group) => String(group.group_id)));

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={rooms.filter((room) => groupIDSet.has(String(room[1])))}
        renderItem={({ item }) => (
          <Button
            title={item[0]}
            onPress={() => navigation.navigate("ChatRoom", { room: item[0] })}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default OwnerChatList;
