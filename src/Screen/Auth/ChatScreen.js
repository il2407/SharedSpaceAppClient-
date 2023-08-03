import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import Ionicons from "@expo/vector-icons/Ionicons";
export default function ChatScreen({ navigation, route }) {
  //Below name came from past screen where lost is render
  const { name } = route.params;
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    //   by default 1 message in all chats below
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    // Below is a helping link for sending msg functionality
    //https://blog.logrocket.com/build-chat-app-react-native-gifted-chat/
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => navigation.goBack()}
      >
        <View>
          <Ionicons
            style={styles.image}
            name="chevron-back-sharp"
            size={35}
            color="#7B7BC4"
          ></Ionicons>
        </View>
        <Text style={styles.textStyle}>{name}</Text>
      </TouchableOpacity>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#F2F2F2",
    flex: 1,
    borderRadius: 15,
    shadowColor: "grey",
    shadowRadius: 10,
    shadowOpacity: 0.6,
    elevation: 8,
  },
  textStyle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
});
