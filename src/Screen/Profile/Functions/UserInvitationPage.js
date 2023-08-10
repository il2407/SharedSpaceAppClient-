import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URLS } from "../../../constants";

const UserInvitationPage = ({ navigation }) => {
  // Destructure navigation from props
  const [userID, setUserID] = useState(null);
  const [email, setEmail] = useState(null);
  const [groupID, setGroupID] = useState(null);

  useEffect(() => {
    async function fetchUserID() {
      try {
        const storedUserID = await AsyncStorage.getItem("userID");
        if (storedUserID) {
          setUserID(storedUserID);
        }
      } catch (error) {
        console.error("Failed to get userID from AsyncStorage", error);
      }
    }

    fetchUserID();
  }, []);

  useEffect(() => {
    if (userID) {
      async function fetchUserDetails() {
        try {
          const response = await axios.post(
            `${API_URLS.URL}/get_user_details_by_id`,
            {
              user_id: userID,
            }
          );
          console.log(response.data);
          const userDetails = response.data[3];
          setEmail(userDetails.email);

          // After getting the email, check for invitations
          const invitationResponse = await axios.get(
            `${API_URLS.URL}/check_invitations/${userDetails.email}`
          );
          if (invitationResponse.data && invitationResponse.data.length > 0) {
            // Assuming the response is an array of group IDs, and setting the first one
            setGroupID(invitationResponse.data[0]);
          }
        } catch (error) {
          console.error(
            "Failed to fetch user details or check invitations",
            error
          );
        }
      }

      fetchUserDetails();
    }
  }, [userID]);

  const handleAddUserToGroup = async () => {
    try {
      const data = {
        user_id: userID,
        group_id: groupID[0],
        date_intended_contract_termination: "",
        is_landlord: false,
        // TODO: Add other necessary data like date_intended_contract_termination and is_landlord
      };

      const response = await axios.post(
        `${API_URLS.URL}/add_user_to_group`,
        data
      );

      if (response.status === 200 && response.data.status === "success") {
        // TODO: Add your showMessage logic here
        console.log("User added to group successfully");
      } else {
        throw new Error("Failed to add user to group.");
      }
    } catch (error) {
      console.error("Failed to add user to group", error);
      // TODO: Add your showMessage logic for error here
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => navigation.goBack()} />{" "}
      {/* This is the added back button */}
      <Text>Email: {email}</Text>
      {groupID && (
        <>
          <Text>You have been invited to Group: {groupID}</Text>
          <Button title="Join Group" onPress={handleAddUserToGroup} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserInvitationPage;
