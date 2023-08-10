import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { API_URLS } from "../../../constants";

const CreateGroup = ({ navigation }) => {
  // const [userID, setUserID] = useState(0);
  const [groupID, setGroupID] = useState("");
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [memberNames, setMemberNames] = useState([]);
  const [isLandlord, setIsLandlord] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupMaxMembers, setGroupMaxMembers] = useState(0);
  const [groupDescription, setGroupDescription] = useState("");
  const [dateTermination, setDateTermination] = useState("");

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleCreateNewGroup = async () => {
    console.log("end", dateTermination);

    try {
      const data = {
        userID: userID,
        is_landlord: isLandlord,
        group_name: groupName,
        group_max_members: groupMaxMembers,
        group_description: groupDescription,
        end_of_contract: dateTermination,
      };

      const response = await axios.post(`${API_URLS.URL}/add_group`, data);
      if (response.status === 200) {
        showMessage({
          message: "Success",
          description: "Group created successfully",
          type: "success",
        });
        console.log("Asd", response.data);
        setGroupID(response.data.group_id);
        AsyncStorage.setItem("groupID", response.data.group_id);
      }
    } catch (error) {
      console.log(error);
      showMessage({
        message: "Error",
        description: "Unable to create group",
        type: "danger",
      });
    }
  };
  const handleSendInvitation = async () => {
    try {
      const response = await axios.post(`${API_URLS.URL}/invite_user`, {
        group_id: groupID,
        email: email,
      });

      if (response.status === 200 && response.data.status === "success") {
        showMessage({
          message: "Success",
          description: "Invitation sent successfully",
          type: "success",
        });
      } else {
        throw new Error("Failed to send invitation.");
      }
    } catch (error) {
      console.log(error);
      showMessage({
        message: "Error",
        description: "Unable to send invitation",
        type: "danger",
      });
    }
  };

  const handleGetGroupDetailsById = async () => {
    try {
      console.log("groupID", groupID);
      const data = { group_id: groupID };

      const response = await axios.post(
        `${API_URLS.URL}/members_from_group_id`,
        data
      );
      console.log(response);
      const groupMembers = response.data;

      // Extract the fullname field of each user
      const memberName = groupMembers.map((member) => member.fullName);

      // Conditionally update the state only if the data has changed
      if (JSON.stringify(memberNames) !== JSON.stringify(memberName)) {
        setMemberNames(memberName);
      }
    } catch (error) {
      console.log(error);
      showMessage({
        message: "Error",
        description: "Unable to get group details",
        type: "danger",
      });
    }
  };

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

  useEffect(() => {
    handleGetGroupDetailsById();
  }, [groupID]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>You are a house owner</Text>
        <Text style={styles.subHeaderText}>Create New Group</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.textInput}
          placeholder="Apartment Address ( Street & Number )"
          onChangeText={setGroupName}
          value={groupName}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Apartment Max Members"
          onChangeText={(text) => setGroupMaxMembers(Number(text))}
          value={groupMaxMembers.toString()}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Apartment City"
          onChangeText={setGroupDescription}
          value={groupDescription}
        />
        <TextInput
          style={styles.textInput}
          placeholder="End Of Contract"
          onChangeText={setDateTermination}
          value={dateTermination}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateNewGroup}>
          <Text style={styles.buttonText}>Create New Group</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Invite Email"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Group ID for Invitation"
          onChangeText={setGroupID}
          value={groupID}
        />
        <TouchableOpacity style={styles.button} onPress={handleSendInvitation}>
          <Text style={styles.buttonText}>Send Invitation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.navigate("OwnerPage")}
        >
          <Text style={styles.bottomButtonText}>Home</Text>
        </TouchableOpacity>
        <FlashMessage position="top" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
  },
  subHeaderText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
    marginTop: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
  bottomButton: {
    backgroundColor: "#5c5c5c",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  bottomButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default CreateGroup;
