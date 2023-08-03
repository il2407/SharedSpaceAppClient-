import React, { useState } from "react";
import { adduser } from "../../api/user_api";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Button,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../constants";

export default function SignUp({ navigation }) {
  const [full_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_Confirmation] = useState("");
  const [username, setUsername] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [role, setRole] = useState("user");

  const signUpFun = () => {
    adduser(
      JSON.stringify({
        username: username.toLocaleLowerCase(),
        email: email.toLocaleLowerCase(),
        password: password,
        full_name: full_name,
        date_of_birth: date_of_birth,
        role: role,
      })
    );
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons
          style={styles.image}
          name="chevron-back-sharp"
          size={35}
          color="#FF5733"
        />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Create Account</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={full_name}
          onChangeText={(text) => setName(text.trim())}
          placeholder="Full Name"
          style={styles.inputField}
        />
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text.trim())}
          placeholder="E-mail"
          keyboardType="email-address"
          style={styles.inputField}
        />
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text.trim())}
          placeholder="Password"
          secureTextEntry={true}
          style={styles.inputField}
        />
        <TextInput
          value={password_confirmation}
          onChangeText={(text) => setPassword_Confirmation(text.trim())}
          placeholder="Confirm Password"
          secureTextEntry={true}
          style={styles.inputField}
        />
        <TextInput
          value={username}
          onChangeText={(text) => setUsername(text.trim())}
          placeholder="Username"
          style={styles.inputField}
        />
        <TextInput
          value={date_of_birth}
          onChangeText={(text) => setDateOfBirth(text.trim())}
          placeholder="Date Of Birth"
          style={styles.inputField}
        />
      </View>
      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Role:</Text>
        <Switch
          value={role === "owner"}
          onValueChange={(value) => setRole(value ? "owner" : "user")}
        />
        <Text style={styles.roleText}>
          {role === "owner" ? "Owner" : "User"}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign Up"
          color={COLORS.PRIMARY_GREEN}
          onPress={() => signUpFun()}
        />
      </View>
      <View style={styles.signInContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 20,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  headerText: {
    color: COLORS.PRIMARY_GREEN,
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    alignSelf: "flex-start",
    height: 30,
    width: 50,
    marginVertical: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputField: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
    paddingLeft: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 18,
    fontWeight: "500",
    marginRight: 10,
  },
  roleText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    marginBottom: 20,
  },
  signInContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  signInText: {
    color: COLORS.PRIMARY_GREEN,
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
