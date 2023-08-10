import axios from "axios";
import { API_URLS } from "../constants";

const ApiManager = axios.create({
  baseURL: `${API_URLS.URL}`,
  responseType: "json",
  withCredentials: false,
});

export default ApiManager;
