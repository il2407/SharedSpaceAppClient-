import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserScreen({ navigation }) {
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
      // call loadFaults() when groupID is loaded
    };

    fetchGroupID();
    fetchUserName();
  }, []);

  useEffect(() => {
    console.log("This is groupID", groupID);
  }, [groupID]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", margin: 16 }}>
        <TouchableOpacity>
          <Image
            style={styles.image}
            source={{
              uri: "https://bootdey.com/img/Content/avatar/avatar6.png",
            }}
            resizeMode={"cover"}
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
            resizeMode={"cover"}
          />
        </TouchableOpacity>{" "}
      </View>
      <Text style={styles.textStyle}>Menu</Text>
      {/* Render all the buttons below */}
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={[
              styles.box,
              { backgroundColor: groupID !== "undefined" ? "#B4C7E7" : "gray" },
            ]}
            onPress={() => {
              groupID !== "undefined" ? handleNavigate("ManageTasks") : null;
            }}
          >
            <Text numberOfLines={2} style={styles.textBox}>
              Manage Task
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}></View>
          <TouchableOpacity
            style={[
              styles.box,
              { backgroundColor: groupID !== "undefined" ? "#B4C7E7" : "gray" },
            ]}
            onPress={() => {
              groupID !== "undefined" ? handleNavigate("ApplyRequest") : null;
            }}
          >
            <Text style={styles.textBox}>
              Opening a new call for the apartment owner
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={[
              styles.box,
              { backgroundColor: groupID !== "undefined" ? "#B4C7E7" : "gray" },
            ]}
            onPress={() => {
              groupID !== "undefined" ? handleNavigate("SplitPayments") : null;
            }}
          >
            <Text numberOfLines={2} style={styles.textBox}>
              Manage Outcomes
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}></View>
          <TouchableOpacity
            style={[
              styles.box,
              { backgroundColor: groupID !== "undefined" ? "#B4C7E7" : "gray" },
            ]}
            onPress={() => {
              groupID !== "undefined"
                ? handleNavigate("UploadDocumentPage")
                : null;
            }}
          >
            <Text style={styles.textBox}>Upload Documents</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={[styles.box, { backgroundColor: "#B4C7E7" }]}
            onPress={() => {
              handleNavigate("GroupPage");
            }}
          >
            <Text style={styles.textBox}>Join Group</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}></View>
          <TouchableOpacity
            style={[styles.box, { backgroundColor: "#B4C7E7" }]}
            onPress={() => {
              handleNavigate("UserInvitationPage");
            }}
          >
            <Text style={styles.textBox}>Invitations</Text>
          </TouchableOpacity>
        </View>

        <br></br>
        <br></br>
        <br></br>
        {groupID === "undefined" ? (
          <Text style={styles.textBox}>
            First join group and than the functions will be available{" "}
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 150,
    shadowColor: "grey",
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 8,
    height: 150,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
    resizeMode: "cover",
  },
  textStyle: {
    color: "#000",
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
