import axios from "axios";

const ApiManager = axios.create({
  baseURL: "http://localhost:5000",
  responseType: "json",
  withCredentials: false,
});

export default ApiManager;
