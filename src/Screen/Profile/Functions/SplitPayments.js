import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URLS } from "../../../constants";

const JsonList = ({ data }) => (
  <View style={styles.table}>
    {Object.entries(data).map(([key, value]) => (
      <View key={key} style={styles.row}>
        <Text style={styles.cell}>{key}</Text>
        <Text style={styles.cell}>{JSON.stringify(value)}</Text>
      </View>
    ))}
  </View>
);

const SplitPayments = () => {
  const navigation = useNavigation();

  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: 0,
  });
  const [debts, setDebts] = useState({});
  const [groupID, setGroupID] = useState("");
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");

  const calculateDebts = () => {
    const debts = {};
    expenses.forEach((expense) => {
      const { user_id, amount } = expense;
      debts[user_id] = debts[user_id] || 0;
      debts[user_id] += amount;
    });
    const totalExpense = Object.values(debts).reduce((a, b) => a + b, 0);
    const averageExpense = totalExpense / Object.keys(debts).length;

    Object.keys(debts).forEach((user_id) => {
      debts[user_id] = debts[user_id] - averageExpense;
    });

    setDebts(debts);
  };

  const addExpense = async () => {
    const data = JSON.stringify({
      group_id: groupID, // replace with the email of the current user
      user_id: userID, // replace with the email of the current user
      outcome_name: newExpense.name,
      amount: newExpense.amount,
    });
    try {
      await axios.post(`${API_URLS.URL}/add_outcome`, data, {
        headers: { "Content-Type": "application/json" },
      });
      fetchExpenses();
      addNotification();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExpenses = async () => {
    const data = JSON.stringify({
      group_id: groupID,
    });
    try {
      const response = await axios.post(
        `${API_URLS.URL}/outcomes_from_group_id`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      replaceUserIDWithName(response.data);
      // setExpenses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const replaceUserIDWithName = async (expenses) => {
    const updatedExpenses = [];

    for (let i = 0; i < expenses.length; i++) {
      const expense = expenses[i];
      const { user_id } = expense;
      const data = JSON.stringify({
        user_id: user_id,
      });
      try {
        const response = await axios.post(
          `${API_URLS.URL}/user_name_from_id`,
          data,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const userName = response.data.user_name;

        updatedExpenses.push({
          ...expense,
          user_id: userName,
        });
      } catch (error) {
        console.error(error);
      }
    }

    setExpenses(updatedExpenses);
  };

  const addNotification = async () => {
    const data = JSON.stringify({
      group_id: groupID,
      user_id: userID,
      notification_name: `${userName} added new expense on ${newExpense.name} in the amount of  ${newExpense.amount}`,
    });
    try {
      await axios.post(`${API_URLS.URL}/add_notification`, data, {
        headers: { "Content-Type": "application/json" },
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
    const fetchExpenses = async () => {
      const data = JSON.stringify({
        group_id: groupID,
      });
      try {
        const response = await axios.post(
          `${API_URLS.URL}/outcomes_from_group_id`,
          data,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        replaceUserIDWithName(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExpenses();
  }, [groupID]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Split Payments</Text>
      <View style={styles.form}>
        {/* Expense Input */}
        <TextInput
          style={styles.input}
          placeholder="Expense name"
          onChangeText={(text) => setNewExpense({ ...newExpense, name: text })}
        />
        {/* Amount Input */}
        <TextInput
          style={styles.input}
          placeholder="Expense amount"
          keyboardType="numeric"
          onChangeText={(text) =>
            setNewExpense({ ...newExpense, amount: Number(text) })
          }
        />

        {/* Expenses Table */}
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Amount</Text>
            <Text style={styles.headerCell}>User</Text>
          </View>
          {expenses.map((expense, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{expense.outcome_name}</Text>
              <Text style={styles.cell}>{expense.amount}</Text>
              <Text style={styles.cell}>{expense.user_id}</Text>
            </View>
          ))}
        </View>

        {/* Add Expense Button */}
        <TouchableOpacity style={styles.button} onPress={addExpense}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Debts List */}
      <View style={styles.tableContainer}>
        <JsonList data={debts} />
      </View>

      <Button title="Calculate Debts" onPress={calculateDebts} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  form: {
    marginBottom: 20,
    width: "100%",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableContainer: {
    marginBottom: 20,
    width: "100%",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
  },
  headerCell: {
    flex: 1,
    padding: 5,
    fontWeight: "600",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    padding: 5,
    textAlign: "center",
  },
});

export default SplitPayments;
