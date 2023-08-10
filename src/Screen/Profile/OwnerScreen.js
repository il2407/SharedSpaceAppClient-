import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OwnerScreen({ navigation }) {
  const [userName, setUserName] = useState("asd");
  const [groupID, setGroupID] = useState("");

  const handleNavigate = (screen) => {
    console.log(screen);
    navigation.navigate(screen);
  };

  useEffect(() => {
    const fetchUserName = async () => {
      const storedUserName = await AsyncStorage.getItem("userName");
      console.log("storedUserName", storedUserName);
      setUserName(storedUserName);
    };

    const fetchGroupID = async () => {
      const storedGroupID = await AsyncStorage.getItem("groupID");
      setGroupID(storedGroupID);
    };

    fetchGroupID();
    fetchUserName();
  }, []);

  useEffect(() => {
    console.log("This is groupID", groupID);
  }, [groupID]);

  // Owner-specific tasks data
  const tasksData = [
    { id: "create_group", title: "Create Group", screen: "CreateGroup" },
    { id: "documents", title: "Documents", screen: "OwnerUploadDocumentPage" },
    {
      id: "admin_requests",
      title: "Admin Requests",
      screen: "AdminRequestPage",
    },
    // Add more owner-specific tasks here if needed
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.box}
      onPress={() => handleNavigate(item.screen)}
    >
      <Text numberOfLines={2} style={styles.textBox}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", margin: 16 }}>
        <TouchableOpacity>
          <Image
            style={styles.image}
            source={{
              uri: "https://bootdey.com/img/Content/avatar/avatar6.png",
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Text style={styles.textStyle}>{userName}</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => window.location.reload()}>
          <Image
            style={styles.image}
            source={{
              uri: "https://thumbs.dreamstime.com/b/logout-isolated-special-cyan-blue-round-button-abstract-illustration-logout-special-cyan-blue-round-button-103957079.jpg",
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>{" "}
      </View>
      <Text style={styles.textStyle}>Menu</Text>

      <FlatList
        data={tasksData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.taskList}
        numColumns={2}
      />
    </View>
  );
}

const { width } = Dimensions.get("window");
const itemWidth = (width - 40) / 2; // Two columns with 20 margin on each side

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  taskList: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: itemWidth,
    shadowColor: "grey",
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 8,
    height: 150,
    backgroundColor: "#ADD8E6",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
    resizeMode: "cover",
  },
  textStyle: {
    color: "#022",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  textBox: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
