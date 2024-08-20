import React, { useLayoutEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Navigate } from 'react-router-dom';

import "../../utilities.css";
import "./Prelogin.css";
import seed_logo from "../../public/seed-logo.png";
import seed_to_tree from "../../public/seed-to-tree.png";
import start_button from "../../public/start-planting-button.png";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID -done
const GOOGLE_CLIENT_ID = "280530756657-h7idsmk4f3vahmglar41qkf79ch1g9lt.apps.googleusercontent.com";

const Prelogin = ({ userId, handleLogin, handleLogout, setShowNavBar}) => {
  useLayoutEffect(() => {
    setShowNavBar(false);
  }, [])

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="centerlogo">
        <img className="Profile-avatarContainer" src={seed_logo} />
      </div>
      <div className="pre-login-homepage">
        <div className="login-button">
          <img className="start-button" src={start_button} />
          <div className="google-button">
          {userId ? (
              <Navigate to={`/profile/${userId}`} className="NavBar-link"/>
            ) : (
              <GoogleLogin
                onSuccess={handleLogin}
                onError={(err) => console.log(err)}
              />
            )}
          </div>
        </div>
        <div className="m-box">
          <p className="text-wrapper">Document your journey with nature day by day</p>
        </div>
        <img className="seedtotreeContainer" src={seed_to_tree} />
        <p className="copyright-SEED-web">
          copyright @ SEED · {"{"}web.lab{"}"} 2024
        </p>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Prelogin;
