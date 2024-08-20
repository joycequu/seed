import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";
import "./NavBar.css";

const GOOGLE_CLIENT_ID = "280530756657-h7idsmk4f3vahmglar41qkf79ch1g9lt.apps.googleusercontent.com";

const NavBar = ({ userId, handleLogout, setShowNavBar }) => {
  const navigate = useNavigate();
  if (!userId) {
    return <></>;
  }
  return (
    <nav className="NavBar-container">
      <div className="NavBar-title NavBar-link u-inlineBlock">
            SEED
      </div>
      <div className="NavBar-container2 u-inlineBlock">
        {userId && (
          <Link className="NavBar-link" to={`/profile/${userId}`}>
            Profile
          </Link>
        )}
        <Link className="NavBar-link" to="/feed/">
          Feed
        </Link>
        <Link className="NavBar-link" to="/memories/">
          Memories
        </Link>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {userId ? (
            <button
              onClick={() => {
                googleLogout();
                handleLogout();
                // <Navigate replace to="/" />;
                // setShowNavBar(false);
                navigate("/");
              }}
            >
              Logout
            </button>
          ) : (
            <Navigate replace to="/" />
          )}
        </GoogleOAuthProvider>
      </div>
    </nav>
  );
};

/*
const CustomButton = (props) => {
  return (
    <button className="Button-common-style" onClick={props.onClick}>
      {props.text}
    </button>
  );
};
*/

export default NavBar;
