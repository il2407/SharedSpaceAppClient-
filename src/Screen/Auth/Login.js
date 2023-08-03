import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
  TextInput,
} from "react-native";
import PasswordComponent from "../../../src/Component/PasswordComponent";
import { user_login } from "../../api/user_api";
import { UserContext } from "../../api/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CustomTextInput from "../../Component/TextInputComponent";

import { COLORS, API_URLS } from "../../constants";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkValidEmail, setCheckValidEmail] = useState(false);
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [groupID, setGroupID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = () => {
    console.log("in");
    AsyncStorage.setItem("userEmail", email)
      .then(() => {
        console.log("Email saved successfully");
      })
      .catch((error) => {
        console.error(error);
      });
    user_login(
      JSON.stringify({
        email: email.toLocaleLowerCase(),
        password: password,
      })
    )
      .then((result) => {
        if (result.status == 200) {
          console.log("success");
          // send another Axios request to get the user ID
          handleGetUserIdDetails().catch((error) => {
            console.error(error);
          });
        }
      })
      .catch((err) => {
        setErrorMessage("                The Username/Password is incorrect"); // set error message if login fails

        console.error(err);
      });
  };

  const handleGetGroupIdDetails = async () => {
    const data = JSON.stringify({
      user_id: userID, // replace with the email of the current user
    });
    try {
      console.log(data);
      const response = await axios.post(
        "http://localhost:5000/group_id_from_user_id",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(response.data);
      setGroupID(response.data.group);

      // Alert.alert("Group Number", `The group number is ${response.data.group}`);
    } catch (error) {
      console.log(error);
      // Alert.alert("Error", "Unable to get group details");
    }
  };

  const handleGetUserIdDetails = async () => {
    const data = JSON.stringify({
      email: email, // replace with the email of the current user
    });
    try {
      console.log(data);
      const response = await axios.post(
        "http://localhost:5000/id_from_email",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setUserID(response.data.user);
      console.log(userID);
      console.log(response.data.user);
    } catch (error) {
      console.log(error);
      // Alert.alert("Error", "Unable to get group details");
    }
  };

  const handleGetUserNameDetails = async () => {
    const data = JSON.stringify({
      user_id: userID, // replace with the email of the current user
    });
    try {
      console.log(data);
      const response = await axios.post(
        "http://localhost:5000/get_user_details_by_id",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("ASdasdasd", response.data);
      setUserName(response.data[1].username);
      setRole(response.data[10].role);
    } catch (error) {
      console.log(error);
      // Alert.alert("Error", "Unable to get group details");
    }
  };

  useEffect(() => {
    console.log("groupID", groupID);

    if (userID !== "") {
      AsyncStorage.setItem("userID", userID);
      handleGetUserNameDetails();
      handleGetGroupIdDetails();
    }
  }, [userID]);

  useEffect(() => {
    if (groupID !== "") {
      AsyncStorage.setItem("groupID", groupID);
      console.log("username is ", userName);

      AsyncStorage.setItem("userName", userName);
      AsyncStorage.setItem("role", role);

      if (role === "user") {
        navigation.navigate("UserPage");
      } else if (role === "owner") {
        navigation.navigate("OwnerPage");
      }
    }
  }, [groupID]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/icon.png")}
          style={styles.logo}
          resizeMode="cover"
        />
      </View>
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      <View>
        <CustomTextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          label="Email"
          icon="email"
          keyboardType="email-address"
        />
        {checkValidEmail && (
          <Text style={styles.errorText}>Wrong format email</Text>
        )}
        <PasswordComponent
          placeholder="Enter your password"
          icon="key"
          label="Password"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.actionContainer}>
        <Button
          title="Sign In"
          onPress={handleLogin}
          color={COLORS.PRIMARY_GREEN}
        />
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.createAccountText}>Create an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    justifyContent: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 220,
  },
  errorMessage: {
    color: COLORS.ERROR_RED,
    textAlign: "center",
    marginBottom: 15,
  },
  errorText: {
    color: COLORS.ERROR_RED,
    alignSelf: "flex-end",
  },
  inputField: {
    height: 40,
    borderColor: COLORS.GRAY,
    borderWidth: 1,
    paddingLeft: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  actionContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  createAccountText: {
    marginLeft: 5,
    color: COLORS.PRIMARY_GREEN,
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
