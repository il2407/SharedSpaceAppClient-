import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URLS } from "../../../constants";

function UploadPhotoComponent({ navigation }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [groupIDs, setGroupIDs] = useState([]); // Notice it's an array
  const [userID, setUserID] = useState("");
  const [photos, setPhotos] = useState([]);
  const [groupDetails, setGroupDetails] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    // ... (This function remains unchanged)
  };
  const fetchPhotosByGroupIDs = async () => {
    // Clear the previous photos
    setPhotos([]);

    for (const groupDetail of groupDetails) {
      const groupId = groupDetail.group_id;
      const groupName = groupDetail.group_name;

      await axios
        .get(`${API_URLS.URL}/get_photos/${groupId}`)
        .then((response) => {
          setPhotos((prevPhotos) => [
            ...prevPhotos,
            {
              groupName: groupName,
              photos: response.data.photos,
            },
          ]);
        })
        .catch((error) => {
          console.error("Error fetching photos:", error);
        });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserID = await AsyncStorage.getItem("userID");
      console.log("storedUserID", storedUserID);
      setUserID(storedUserID);

      if (storedUserID) {
        axios
          .post(`${API_URLS.URL}/get_group_details_by_id`, {
            user_id: storedUserID,
          })
          .then((response) => {
            // Save the entire group details (ID and name)
            setGroupDetails(response.data);
          })
          .catch((error) => {
            console.error("Error fetching group details:", error);
          });
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (groupDetails.length > 0) {
      fetchPhotosByGroupIDs();
    }
  }, [groupDetails]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documents Uploaded By Your Appartements</Text>
      <Button title="Back" onPress={() => navigation.goBack()} />

      {message && <Text style={styles.message}>{message}</Text>}
      <FlatList
        data={photos}
        renderItem={({ item: photoGroup }) => (
          <View>
            <Text style={styles.groupName}>{photoGroup.groupName}</Text>
            <FlatList
              data={photoGroup.photos}
              renderItem={({ item: photo }) => {
                const imageUrl = `${API_URLS.URL}/${photo.filepath.replace(
                  /\\/g,
                  "/"
                )}`;
                return (
                  <View style={styles.photoContainer}>
                    <Text style={styles.photoText}>{photo.filename}</Text>
                    <Image source={{ uri: imageUrl }} style={styles.photo} />
                    <TouchableOpacity
                      onPress={() => Linking.openURL(imageUrl)}
                      style={styles.downloadButton}
                    >
                      <Text>Download</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={(photo) => photo.id.toString()}
            />
          </View>
        )}
        keyExtractor={(group, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F7F7F7",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    margin: 10,
    fontSize: 16,
    color: "red",
  },
  groupName: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  photoContainer: {
    marginBottom: 20,
  },
  photoText: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
  photo: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginVertical: 10,
  },
  downloadButton: {
    alignSelf: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#4B89DC",
    borderRadius: 5,
  },
});

export default UploadPhotoComponent;
