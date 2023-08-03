import ApiManager from "./ApiManager";
import { Alert } from "react-native";

export const user_login = async (data) => {
  console.log("in userlogin");
  console.log(data);
  const result = await ApiManager("/register", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    data: data,
  });
  console.log("result ", result);

  return result;
};

export const adduser = async (data) => {
  try {
    console.log("in userlogin");
    console.log(data);
    const result = await ApiManager("/adduser", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      data: data,
    });
    console.log("result ", result);

    return result;
  } catch (error) {
    console.log("error", error);

    return error.response.data;
  }
};
