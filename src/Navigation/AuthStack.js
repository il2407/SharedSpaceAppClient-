import React from "react";
import {} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../Screen/Auth/Login";
import SignUp from "../Screen/Auth/SignUp";
import ChatScreen from "../Screen/Auth/ChatScreen";
import ManageTasks from "../Screen/Profile/Functions/ManageTasks";
import ApplyRequest from "../Screen/Profile/Functions/ApplyRequest";
import SplitPayments from "../Screen/Profile/Functions/SplitPayments";
import UploadDocumentPage from "../Screen/Profile/Functions/UploadDocumentPage";
import GroupPage from "../Screen/Profile/Functions/GroupPage";
import OwnerScreen from "../Screen/Profile/OwnerScreen";
import OwnerPage from "./OwnerPage";
import UserPage from "./UserPage";
import CreateGroup from "../Screen/Profile/Functions/CreateGroup";
import ChatList from "../Screen/Chat/ChatList";
import AdminRequestPage from "../Screen/Profile/Functions/AdminRequestPage";
import GroupDetailsPage from "../Screen/Appartements/MyAppartements";
import ChatRoom from "../Screen/Chat/ChatRoom";
import OwnerChatList from "../Screen/Chat/OwnerChatList";
import ManagerDocument from "../Screen/Profile/Functions/ManagerDocument";
import OwnerUploadDocumentPage from "../Screen/Profile/Functions/OwnerUploadDocumentPage";
import UserInvitationPage from "../Screen/Profile/Functions/UserInvitationPage";

const Stack = createNativeStackNavigator();
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="UserPage"
        component={UserPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OwnerPage"
        component={OwnerPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageTasks"
        component={ManageTasks}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ApplyRequest"
        component={ApplyRequest}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminRequestPage"
        component={AdminRequestPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SplitPayments"
        component={SplitPayments}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OwnerUploadDocumentPage"
        component={OwnerUploadDocumentPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UploadDocumentPage"
        component={UploadDocumentPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupPage"
        component={GroupPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroup}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="OwnerScreen"
        component={OwnerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatList"
        component={ChatList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OwnerChatList"
        component={OwnerChatList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManagerDocument"
        component={ManagerDocument}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupDetailsPage"
        component={GroupDetailsPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserInvitationPage"
        component={UserInvitationPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;
