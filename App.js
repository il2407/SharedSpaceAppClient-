import React, { useState, useEffect } from "react";
import { LogBox, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthStack from "./src/Navigation/AuthStack";
import { NavigationContainer } from "@react-navigation/native";

const App = () => {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};
export default App;
