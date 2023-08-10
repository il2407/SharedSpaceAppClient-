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

const GroupPage = ({ navigation }) => {
  const [userID, setUserID] = useState(0);
  const [groupID, setGroupID] = useState("");
  const [email, setEmail] = useState("");
  const [memberNames, setMemberNames] = useState([]);
  const [isLandlord, setIsLandlord] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupMaxMembers, setGroupMaxMembers] = useState(0);
  const [groupDescription, setGroupDescription] = useState("");
  const [dateTermination, setDateTermination] = useState("");
  const [isFinishStatus, setIsFinishStatus] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleToggleFinishStatus = async () => {
    try {
      // Make an API call to the backend to toggle the is_finish status
      const response = await axios.post(`${API_URLS.URL}/toggle_finish`, {
        user_id: userID,
      });

      if (response.status === 200 && response.data.status === "success") {
        setIsFinishStatus(!isFinishStatus); // Toggle the local state variable
        showMessage({
          message: "Success",
          description: "Contract status updated successfully",
          type: "success",
        });
      } else {
        throw new Error("Failed to update contract status.");
      }
    } catch (error) {
      console.log(error);
      showMessage({
        message: "Error",
        description: "Unable to update contract status",
        type: "danger",
      });
    }
  };

  const handleAddUserToGroup = async (dateIntendedContractTermination) => {
    try {
      const data = {
        user_id: userID, // Assuming the email is being used as the user ID
        group_id: groupID,
        date_intended_contract_termination: dateIntendedContractTermination,
        is_landlord: isLandlord,
      };

      const response = await axios.post(
        `${API_URLS.URL}/add_user_to_group`,
        data
      );

      if (response.status === 200 && response.data.status === "success") {
        showMessage({
          message: "Success",
          description: "User added to group successfully",
          type: "success",
        });
      } else {
        throw new Error("Failed to add user to group.");
      }
    } catch (error) {
      console.log(error);
      showMessage({
        message: "Error",
        description: "Unable to add user to group",
        type: "danger",
      });
    }
  };

  const handleGetGroupIdDetails = () => {
    // setGroupID(response.data.group);
    console.log("groupID", groupID);
    Alert.alert("Group Number", `The group number is ${groupID}`);
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
      <View style={styles.header}></View>

      <View style={styles.header}>
        <Text style={styles.title}>Join Existing Group</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          style={[styles.textInput, isFocused && styles.focused]}
          placeholder="Enter Group Number"
          placeholderTextColor="#999"
          onChangeText={setGroupID}
          value={groupID}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>

      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate("UserPage")}
      >
        <Text style={styles.bottomButtonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleAddUserToGroup(dateTermination)}
      >
        <Text style={styles.buttonText}>
          Fill Group id and Join Existing Group
        </Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Appartement Members</Text>
      </View>
      <TextInput
        style={[styles.textInput, isFocused && styles.focused]}
        placeholder="Enter Email to Invite"
        placeholderTextColor="#999"
        onChangeText={setEmail}
        value={email}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendInvitation}>
        <Text style={styles.buttonText}>Send Invitation</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        {/* Display the member names in a table */}
        <View style={styles.table}>
          <Text style={styles.tableHeader}>Appartement Members</Text>
          {memberNames.map((name, index) => (
            <Text key={index} style={styles.tableRow}>
              {name}
            </Text>
          ))}
          <TouchableOpacity
            style={styles.button}
            onPress={handleToggleFinishStatus}
          >
            <Text style={styles.buttonText}>
              {isFinishStatus
                ? "Mark Contract as Unfinished"
                : "Mark Contract as Finished"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
  groupIDContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupIDLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  groupID: {
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  bottomButton: {
    backgroundColor: "#007bff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    alignItems: "center",
  },
  bottomButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default GroupPage;
