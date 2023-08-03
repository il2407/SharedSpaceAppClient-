import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, TextInput } from "react-native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatList = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [userID, setUserID] = useState(0);
  const [groupID, setGroupID] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:5000");

    // Fetch existing rooms
    socket.emit("get_rooms");

    socket.on("room_list", (data) => {
      setRooms(data);
    });

    socket.on("error", (data) => {
      alert(data.error);
    });

    return () => socket.close();
  }, []);

  useEffect(() => {
    const fetchGroupID = async () => {
      const storedGroupID = await AsyncStorage.getItem("groupID");
      setGroupID(storedGroupID);
    };
    const fetchUserID = async () => {
      const storedUserID = await AsyncStorage.getItem("userID");
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
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={rooms.filter((room) => room[2] === userID)} // Filter the rooms here based on the data[2]
        renderItem={({ item }) => (
          <Button
            title={item[0]} // data[0] is the name of the room for display.
            onPress={() => navigation.navigate("ChatRoom", { room: item[0] })}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default ChatList;
