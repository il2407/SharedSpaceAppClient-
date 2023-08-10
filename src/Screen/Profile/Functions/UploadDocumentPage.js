import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  TextInput,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URLS } from "../../../constants";

function UploadPhotoComponent({ navigation }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [groupID, setGroupID] = useState("");
  const [userID, setUserID] = useState("");
  const [photos, setPhotos] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("groupID", groupID);
    formData.append("userID", userID);

    axios
      .post(`${API_URLS.URL}/upload_photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setMessage("File uploaded successfully!");
        fetchPhotos(); // Refetch the photos after a successful upload
      })
      .catch((error) => {
        setMessage("File upload failed. Please try again.");
      });
  };

  const fetchPhotos = () => {
    axios
      .get(`${API_URLS.URL}/get_photos/${groupID}`)
      .then((response) => {
        setPhotos(response.data.photos);
        console.log(response.data.photos);
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
      });
  };

  useEffect(() => {
    const fetchGroupID = async () => {
      const storedGroupID = await AsyncStorage.getItem("groupID");
      console.log("storedGroupID", storedGroupID);
      setGroupID(storedGroupID);
    };
    const fetchUserID = async () => {
      const storedUserID = await AsyncStorage.getItem("userID");
      console.log("storedUserID", storedUserID);
      setUserID(storedUserID);
    };

    fetchUserID();
    fetchGroupID();

    // Fetch photos when groupID is set
  }, []);

  useEffect(() => {
    if (groupID) {
      fetchPhotos();
    }
  }, [groupID]);

  return (
    <View style={{ padding: 20 }}>
      <Button title="Back" onPress={() => navigation.goBack()} />

      <input type="file" onChange={handleFileChange} />
      <Button title="Upload" onPress={handleSubmit} />
      {message && (
        <Text style={{ textAlign: "center", margin: 10 }}>{message}</Text>
      )}
      <FlatList
        data={photos}
        renderItem={({ item }) => {
          const imageUrl = `${API_URLS.URL}/${item.filepath.replace(
            /\\/g,
            "/"
          )}`;
          return (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ textAlign: "center", marginBottom: 10 }}>
                {item.filename}
              </Text>
              <Image
                source={{ uri: imageUrl }}
                style={{ width: 150, height: 150, alignSelf: "center" }}
              />
              <TouchableOpacity
                onPress={() => Linking.openURL(imageUrl)}
                style={{
                  alignSelf: "center",
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: "#ADD8E6",
                  borderRadius: 5,
                }}
              >
                <Text>Download</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

export default UploadPhotoComponent;
