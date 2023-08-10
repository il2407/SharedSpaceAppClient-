import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../../api/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URLS } from "../../../constants";

const ApplyRequest = () => {
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState("");
  const [groupID, setGroupID] = useState("");
  const [fileUri, setFileUri] = useState(null);
  const [faults, setFaults] = useState([]);
  const [openCallSuccess, setOpenCallSuccess] = useState(false);

  const navigation = useNavigation();

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === "success") {
      setFileUri(result.uri);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("userEmail")
      .then((email) => {
        setEmail(email);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const loadFaults = async () => {
    const data = JSON.stringify({
      group_id: groupID,
    });
    try {
      const response = await axios.post(
        `${API_URLS.URL}/faults_from_group_id`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setFaults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    const data = JSON.stringify({
      email: email, // replace with the email of the current user
      subject,
      summary,
    });

    try {
      console.log(data);
      const response = await axios.post(`${API_URLS.URL}/open_call`, data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response.data); // handle success response
      setOpenCallSuccess(true);
    } catch (error) {
      console.log(error); // handle error response
    }
  };

  useEffect(() => {
    const fetchGroupID = async () => {
      const storedGroupID = await AsyncStorage.getItem("groupID");
      setGroupID(storedGroupID);
      // call loadFaults() when groupID is loaded
    };

    fetchGroupID();
  }, []);

  useEffect(() => {
    if (openCallSuccess) {
      loadFaults();
      setOpenCallSuccess(false);
    }
  }, [openCallSuccess]);

  useEffect(() => {
    loadFaults();
  }, [groupID]);

  const FaultItem = ({ item, fieldName }) => (
    <View style={styles.taskItem}>
      <View>
        <Text style={styles.taskName}>
          {fieldName}: {item.fault_name}
        </Text>
        <Text style={styles.taskDescription}>
          Description: {item.fault_description}
        </Text>
        <Text style={styles.taskDescription}>Created: {item.created_date}</Text>
        <Text style={styles.taskDescription}>Status: {item.fixed}</Text>
      </View>
    </View>
  );

  return (
    <UserContext.Consumer>
      {(value) => (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Open Call To Appartement Owner
            </Text>
          </View>{" "}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Subject"
              onChangeText={(text) => setSubject(text)}
              value={subject}
            />
            <TextInput
              style={styles.input}
              placeholder="Summary"
              onChangeText={(text) => setSummary(text)}
              value={summary}
              multiline={true}
              numberOfLines={4}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <br></br>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => navigation.navigate("UserPage")}
            >
              <Text style={styles.submitButtonText}>Home</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.faultsContainer}>
            <Text style={styles.faultsHeaderText}>Applications:</Text>
            <FlatList
              data={faults}
              keyExtractor={(item) => item.fault_id.toString()}
              renderItem={({ item }) => (
                <FaultItem item={item} fieldName={"Name"} />
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyTasksContainer}>
                  <Text style={styles.emptyTasksText}>
                    No Applications found
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      )}
    </UserContext.Consumer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#62B1F6",
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  inputContainer: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  fileButton: {
    backgroundColor: "#62B1F6",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  fileButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#62B1F6",
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  faultsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  faultsHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskItem: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  taskName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  taskDescription: {
    marginBottom: 5,
  },
  emptyTasksContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  emptyTasksText: {
    color: "#999",
    fontStyle: "italic",
  },
});

export default ApplyRequest;
