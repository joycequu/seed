import React from "react";
import { Link } from "react-router-dom";

/**
 * Component to render a single comment
 *
 * Proptypes
 * @param {string} _id of comment
 * @param {string} creator_name
 * @param {string} creator_id
 * @param {string} content of the comment
 */
const SingleComment = ({ _id, creator_name, creator_id, content }) => {
  return (
    <div className="Card-commentBody">
      <p className="Card-commentUser">{creator_name + " | "}
        <span className="Card-commentContent">{content}</span>
      </p>
    </div>
  );
};

export default SingleComment;
