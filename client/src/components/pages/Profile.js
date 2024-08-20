import React, { useState, useLayoutEffect, useEffect } from "react";
import "../../utilities.css";
import "./Profile.css";
import { get, post } from "../../utilities";
import FileBase64 from "react-file-base64";
import axios from "axios";

import profilepic from "../../public/profilepic.png";
import fillerplant from "../../public/fillerplant.png";

const Profile = ({ userId, setShowNavBar }) => {
  // for image upload
  const [fileState, setFileState] = useState(undefined);
  const [pic, setPic] = useState(undefined);
  const [url, setUrl] = useState(undefined);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState();
  const [submitted, setSubmitted] =useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [currLocation, setCurrLocation] = useState({});
  // const [image, setImage] = useState();

  // get user's location
  // const getLocation = async() => {
  //   const location = await axios.get('https://ipapi.co/json');
  //   setCurrLocation(location.data);
  //   console.log(currLocation.city);
  // }

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrLocation({ latitude, longitude });
    })
  }

  // to display the NavBar upon loading the page
  useLayoutEffect(() => {
    setShowNavBar(true);
  }, []);

  // set user id
  useEffect(() => {
    if (userId) {
      get("/api/user", { userid: userId }).then((user) => {
        setUser(user);
      });
    }
  }, [userId]);


  useEffect(() => {
    getLocation();
  },[]);

  // For text input
  // called whenever the user types in the new post input box
  const handleTextChange = (event) => {
    setMessage(event.target.value);
  };

  // when there is an pictureid
  // need to change this part

  // ONLY NEED TO UPLOAD THE POST ON THIS PAGE

  // called when the user hits "Submit" for a new post - submits the text and the image
  const handleSubmit = (event) => {
    // console.log("clicked");
    event.preventDefault();

    // can add some code s.t. when there is profilepicid then the image automatically updates
    if (pic === undefined) {
      console.warn("Uploading file with no file set...");
      return;
    } // Now we know that we actually have a file to work with.
  
    const formData = new FormData();
    const file = pic;
    const imageBlob = new Blob([file], { type: "text/plain" }); // Build up a FormData object with a field for our file and a name.
    formData.append("file", imageBlob);
    formData.append("name", "anImage"); // Send that formData object to the uploadFile endpoint. It'll be encoded as multipart/form-data since we're sending a FormData as the body.
    console.log(message);
    formData.append("caption", message);
    fetch("/api/uploadPost", {
      method: "POST",
      body: formData,
    })
      .then((o) => setSubmitted(true))
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error uploading picture:", error);
      });

    setMessage("");
    setPic(undefined);
  };

  // DIVIDING LINE -----------------------------------------------------

  useEffect(() => {
    if (user?.profilepicid) {
      get("/api/file", { imageid: user.profilepicid }).then(({ file }) => {
        setUrl(file);
      });
    }
  }, [user]);

  // uploading image
  const handleUpload = (event) => {
    // console.log("clicked");
    event.preventDefault();

    // can add some code s.t. when there is profilepicid then the image automatically updates
    if (fileState === undefined) {
      console.warn("Uploading file with no file set...");
      return;
    } // Now we know that we actually have a file to work with.

    const formData = new FormData();
    const file = fileState;
    const imageBlob = new Blob([file], { type: "text/plain" }); // Build up a FormData object with a field for our file and a name.
    formData.append("file", imageBlob);
    formData.append("name", "anImage"); // Send that formData object to the uploadFile endpoint. It'll be encoded as multipart/form-data since we're sending a FormData as the body.
    fetch("/api/uploadFile", {
      method: "POST",
      body: formData,
    })
      .then((o) => setUploaded(true))
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error uploading picture:", error);
      });
  };
  

  if (!user) {
    return <div> Loading... </div>;
  }
  return (
    <>
      <div class="split left">
        <div class="centered">
          {url ? <img className="Profile-pic" src={`${atob(url)}`} /> : "No image uploaded!"}
          <h2 class="large-text">{user.name}</h2>
          <button className="Submit-button" onClick={handleUpload}>Upload Profile Picture</button>
          <FileBase64
            type="file"
            multiple={false}
            onDone={({ base64 }) => setFileState(base64)}
          />
          {uploaded && <p className="mid-text">Profile picture uploaded. Refresh to see!</p>}
        </div>
      </div>
      <div class="split right">
        <div class="centered">
          <h1 class="large-text">"Share Your Picture"</h1>
          <p class="description">Upload an image about plants or nature and write down your spontaneous thought!</p>
          {/* {urlImage ? <img className="Uploaded-image" src={`${atob(urlImage)}`} /> : "No image uploaded!"} */}
          <FileBase64
            type="file"
            multiple={false}
            onDone={({ base64 }) => setPic(base64)}
          />
          <input
            type="text"
            placeholder={"A few words to describe your present thought!"}
            message={message}
            onChange={handleTextChange}
            className="Caption-input"
          />
          {/* <p>Location: {currLocation.city}</p> */}
          <p> Latitude: {currLocation.latitude} </p>
          <p> Longitude: {currLocation.longitude} </p>
          <div>
            <button
              type="submit"
              className="Submit-button"
              value="Submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
            {submitted && <p className="mid-text">Posted to Feed!</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
