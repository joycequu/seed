import React, { useState } from "react";

import "./NewPostInput.css";
import { post } from "../../utilities";

/**
 * New Post is a parent component for all input components
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} postId optional prop, used for comments
 * @param {({postId, value}) => void} onSubmit: (function) triggered when this post is submitted, takes {storyId, value} as parameters
 */
const NewPostInput = ({ defaultText, postId, onSubmit }) => {
  const [value, setValue] = useState("");

  // called whenever the user types in the new post input box
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // called when the user hits "Submit" for a new post
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit && onSubmit(value);
    setValue("");
  };

  return (
    <div className="u-flex">
      <input
        type="text"
        placeholder={defaultText.defaultText}
        value={value}
        onChange={handleChange}
        className="NewPostInput-input"
      />
      <button
        type="submit"
        className="NewPostInput-button u-pointer"
        value="Submit"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

/**
 * New Comment is a New Post component for comments
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} storyId to add comment to
 */

const NewComment = ({ addNewComment, postId }) => {

  const addComment = (value) => {
    const body = { parent: postId, content: value };
    post("/api/comment", body).then((comment) => {
      // display this comment on the screen
      addNewComment(comment);
    });
  };
  
  return <NewPostInput defaultText="New Comment" onSubmit={addComment} />;
};

/**
 * New Story is a New Post component for comments
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 */
// const NewStory = ({ addNewStory }) => {
//   const addStory = (value) => {
//     const body = { content: value };
//     post("/api/story", body).then((story) => {
//       // display this story on the screen
//       addNewStory(story);
//     });
//   };

//   return <NewPostInput defaultText="New Story" onSubmit={addStory} />;
// };

/**
 * New Message is a New Message component for messages
//  *
//  * Proptypes
//  * @param {UserObject} recipient is the intended recipient
//  */
// const NewMessage = ({ recipient }) => {
//   const sendMessage = (value) => {
//     const body = { recipient: recipient, content: value };
//     post("/api/message", body);
//   };

//   return <NewPostInput defaultText="New Message" onSubmit={sendMessage} />;
// };

export { NewComment };
