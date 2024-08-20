import React, { useState, useEffect, useLayoutEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./Feed.css";
import { Link } from "react-router-dom";
import leaf_1 from "../../public/leaf-1.png";
import flower_1 from "../../public/flower-1.png";

import Card from "../modules/Card";
import { NewStory } from "../modules/NewPostInput.js";

const Feed = ({ userId, setShowNavBar }) => {
  // const [stories, setStories] = useState([]);

  // useLayoutEffect(() => {
  //   setShowNavBar(true);
  // }, []);

  // useEffect(() => {
  //   /*get("/api/stories").then((newStories) => {
  //     console.log(newStories);
  //     setStories(newStories);
  //   });*/
  //   document.title = "SEED";
  //   get("/api/stories").then((storyObjs) => {
  //     let reversedStoryObjs = storyObjs.reverse();
  //     setStories(reversedStoryObjs);
  //   });
  // }, []);

  // this gets called when the user pushes "Submit", so their
  // post gets added to the screen right away
  const addNewStory = (storyObj) => {
    setStories([storyObj].concat(stories));
  };

  // let storiesList = null;
  // const hasStories = stories.length !== 0;
  // if (hasStories) {
  //   storiesList = stories.map((storyObj) => (
  //     <Card _id={storyObj._id} story={storyObj} userId={userId} key={`Card_${storyObj._id}`} />
  //   ));
  // } else {
  //   storiesList = <div>No stories!</div>;
  // }

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.title = "SEED";
    get("/api/posts").then((postObjs) => {
      let reversedPostObjs = postObjs.reverse();
      setPosts(reversedPostObjs);
    });
  }, []);

  let postsList = null;
  const hasPosts = posts.length !== 0;
  if (hasPosts) {
    postsList = posts.map((postObj) => (
      <Card _id={postObj._id} post={postObj} userId={userId} key={`Postcard_${postObj._id}`} />
    ));
  } else {
    postsList = <div>Loading...</div>;
  }
  
  return (
    <>
      <div className="Feed-to-Map">
        <Link className="link-to-Map" to="/map/">
          Map View
        </Link>
      </div>
      <div className="feed-title">Share your plant through simple words and pictures</div>
      {/* {userId && <NewStory addNewStory={addNewStory} />} */}
        {postsList}
      <div>
        <div className="images">
          <img className="leaf1" src={leaf_1} />
        </div>

        <div className="imagesflower">
          <img className="flower-image" src={flower_1} />
        </div>
      </div>
    </>
  );

  //   return (
  //     <div>
  //       <div className="feed-container u-textCenter">
  //         <h4 className="feed-title">This is Feed!</h4>
  //       </div>
  //       <div className="images">
  //         <img className="leaf1" src={leaf_1} />
  //       </div>
  //       <img className="flower-image" src={flower_1} />
  //       {stories.map((stories, i) => {
  //         return (
  //           <div>
  //             {stories.creator_name}: {stories.content}
  //             <Card userId={userId} />
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // };
};
export default Feed;
