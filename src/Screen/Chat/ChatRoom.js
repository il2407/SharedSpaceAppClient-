import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { API_URLS } from "../../constants"; // Import `useNavigation`

const ChatRoom = ({ route }) => {
  const { room } = route.params;
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [username, setUsername] = useState("");
  const [userID, setUserID] = useState("");

  // Use the navigation hook
  const navigation = useNavigation();

  useEffect(() => {
    const newSocket = io(`${API_URLS.URL}`);

    // Set up the listeners first
    newSocket.on("chat_history", (data) => {
      console.log("Received chat history:", data);
      setChatHistory(data.map((d) => `${d.username}: ${d.message}`));
    });

    newSocket.on("new_message", (data) => {
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        `${data.user_id}: ${data.message}`,
      ]);
    });

    newSocket.emit("get_chat_history", { room: String(room) });
    newSocket.emit("join", { username: username, room: room });

    setSocket(newSocket);

    return () => {
      newSocket.emit("leave", { username: username, room: room });
      newSocket.close();
    };
  }, [room, username]);

  const sendMessage = () => {
    if (socket && message && room && username) {
      socket.emit("message", {
        message: message,
        room: room,
        user_id: username,
      });
      setMessage("");
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      return () => {}; // Return a cleanup function if needed
    }, [socket, room])
  );

  useEffect(() => {
    const fetchUserID = async () => {
      const storedUserID = await AsyncStorage.getItem("userID");
      console.log("storedUserID", storedUserID);
      setUserID(storedUserID);
    };
    const fetchUserName = async () => {
      const storedUserName = await AsyncStorage.getItem("userName");
      setUsername(storedUserName);
    };

    fetchUserID();
    fetchUserName();
  }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Button title="Back" onPress={() => navigation.goBack()} />{" "}
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{username}</Text>{" "}
      </View>

      <Text style={{ marginBottom: 10 }}>{room}</Text>

      <FlatList
        data={chatHistory}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TextInput
          style={{ flex: 1, borderColor: "gray", borderWidth: 1 }}
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ChatRoom;
