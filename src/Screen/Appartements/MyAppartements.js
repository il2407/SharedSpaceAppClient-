import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import axios from "axios";
import { ListItem, Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { API_URLS } from "../../constants";
// Import useFocusEffect

const GroupDetailsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(0);
  const [groupID, setGroupID] = useState("");
  const [userName, setUserName] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      setGroups([]);

      // Fetching data using Axios

      axios
        .post(`${API_URLS.URL}/get_group_details_by_id`, {
          user_id: userID,
        })
        .then((response) => {
          setGroups(response.data);
          console.log("response.data", response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>My Apartments</Text>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.group_id.toString()}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{`Group ID: ${item.group_id}`}</ListItem.Title>
              <ListItem.Title>{`Group Name: ${item.group_name}`}</ListItem.Title>
              <ListItem.Title>{`Group Details: ${item.group_details}`}</ListItem.Title>
              <ListItem.Title>{`Group Max Members: ${item.group_max_members}`}</ListItem.Title>
              <ListItem.Title>{`End of Contract: ${item.end_of_contract}`}</ListItem.Title>
              {/* Add other group details here if present */}
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default GroupDetailsPage;
