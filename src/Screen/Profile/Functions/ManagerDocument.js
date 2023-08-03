import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ManagerDocument() {
  const [photos, setPhotos] = useState([]);
  const [groupID, setGroupID] = useState("");

  useEffect(() => {
    // Fetch groupID from AsyncStorage
    const fetchGroupID = async () => {
      const storedGroupID = await AsyncStorage.getItem("groupID");
      setGroupID(storedGroupID);
    };

    fetchGroupID();
  }, []);

  useEffect(() => {
    if (groupID) {
      // Fetch photos once groupID is set
      axios
        .get(`http://localhost:5000/fetch_photos/${groupID}`)
        .then((response) => {
          setPhotos(response.data);
        })
        .catch((error) => {
          console.error("Error fetching photos:", error);
        });
    }
  }, [groupID]);

  return (
    <div>
      <h2>Photo Gallery</h2>
      <ul>
        {photos.map((photo, index) => (
          <li key={index}>
            <img src={photo.filepath} alt={photo.filename} width={100} />{" "}
            {/* Adjust width as needed */}
            <p>{photo.filename}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManagerDocument;
