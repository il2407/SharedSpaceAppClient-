import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  CheckBox,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_URLS } from "../../../constants";

const ManageTasks = () => {
  const [groupID, setGroupID] = useState("");
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [checkedAnim] = useState(new Animated.Value(0));

  const navigation = useNavigation();

  const loadTasks = async () => {
    const data = JSON.stringify({
      group_id: groupID,
    });
    try {
      const response = await axios.post(
        `${API_URLS.URL}/missions_from_group_id`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async () => {
    const data = JSON.stringify({
      group_id: groupID,
      mission_name: taskName,
      mission_description: taskDescription,
    });
    try {
      await axios.post(`${API_URLS.URL}/add_mission`, data, {
        headers: { "Content-Type": "application/json" },
      });
      setTaskName("");
      setTaskDescription("");
      loadTasks();
      addNotification();
    } catch (error) {
      console.error(error);
    }
  };

  const addNotification = async () => {
    const data = JSON.stringify({
      group_id: groupID,
      user_id: userID,
      notification_name: `${userName} added new task - ${taskName}`,
    });
    try {
      await axios.post(`${API_URLS.URL}/add_notification`, data, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId) => {
    const data = JSON.stringify({
      mission_id: taskId,
    });
    try {
      await axios.post(`${API_URLS.URL}/remove_mission`, data, {
        headers: { "Content-Type": "application/json" },
      });

      // Trigger the animation
      Animated.timing(checkedAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        // Reset the animation value once it is completed
        checkedAnim.setValue(0);
        loadTasks();
      });
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    loadTasks();
  }, [groupID]);

  const TaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Animated.View style={{ opacity: checkedAnim }}>
        <Text style={styles.checkmark}>✔️</Text>
      </Animated.View>
      <CheckBox value={false} onChange={() => deleteTask(item.mission_id)} />
      <View>
        <Text style={styles.taskName}>{item.mission_name}</Text>
        <Text style={styles.taskDescription}>{item.mission_description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={taskName}
          onChangeText={setTaskName}
          placeholder="Task name"
          style={styles.input}
        />
        <TextInput
          value={taskDescription}
          onChangeText={setTaskDescription}
          placeholder="Task description"
          style={[styles.input, styles.inputDescription]}
        />
        <Button title="Add task" onPress={addTask} />
      </View>
      <h3>Tasks List</h3>
      <FlatList
        data={tasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => <TaskItem item={item} />}
      />

      <Button title="Home" onPress={() => navigation.navigate("UserPage")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 25 : 0, // Add padding to avoid the header of the device
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
  },
  inputContainer: {
    width: "90%",
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  inputDescription: {
    height: 100,
    textAlignVertical: "top",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  taskName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  taskDescription: {
    fontSize: 14,
    color: "#555",
  },
  checkmark: {
    fontSize: 20,
    marginRight: 10,
  },
});

export default ManageTasks;
