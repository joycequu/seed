import React, { useState, useEffect } from "react";
import NavBar from "./modules/NavBar.js";
import { Routes, Route } from "react-router-dom";

import jwt_decode from "jwt-decode";

import NotFound from "./pages/NotFound.js";
import Profile from "./pages/Profile.js";
import Feed from "./pages/Feed.js";
import Memories from "./pages/Memories.js";
import Prelogin from "./pages/Prelogin.js";
import MapView from "./pages/MapView.js";

import "../utilities.css";
import "./App.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities.js";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(null);
  const [showNavBar, setShowNavBar] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(null); // null | true | false

  // required method: whatever is returned defines what
  // shows up on screen

  useEffect(() => {
    get("/api/whoami").then((user) => {
      console.log("user", user);
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  // const handleLogin = (res) => {
  //   // 'res' contains the response from Google's authentication servers
  //   console.log(res);

  //   const userToken = res.credential;
  //   post("/api/login", { token: userToken }).then((user) => {
  //     // the server knows we're logged in now
  //     setUserId(user._id);
  //     console.log(user);
  //   });
  // };

  // const handleLogout = () => {
  //   console.log("Logged out successfully!");
  //   post("/api/logout");
  //   setUserId(null);
  // };

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <>
      <NavBar handleLogout={handleLogout} userId={userId} setShowNavBar={setShowNavBar} />
      <div className="App-container">
        <Routes>
          <Route
            path="/"
            element={
              <Prelogin
                handleLogin={handleLogin}
                handleLogout={handleLogout}
                userId={userId}
                setShowNavBar={setShowNavBar}
              />
            }
          />
          <Route
            path="/profile/:userId"
            element={<Profile userId={userId} setShowNavBar={setShowNavBar} />}
          />
          <Route path="/feed/" element={<Feed userId={userId} setShowNavBar={setShowNavBar} />} />
          <Route
            path="/memories/"
            element={<Memories userId={userId} setShowNavBar={setShowNavBar} />}
          />
          <Route path="/map/" element={<MapView userId={userId} setShowNavBar={setShowNavBar} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
