import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { get, post } from "../../utilities";

/**
 * Story is a component that renders creator and content of a story
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {string} creator_id
 * @param {string} creator_name
 * @param {string} name
 * @param {Buffer} file
 * @param {string} caption of the post
 * @param {Date} time post is created
 */

const SinglePost = ({ post }) => {
  const [url, setUrl] = useState(undefined);
  const created_date = new Date(post.created_at);

  useEffect(() => {
    get("/api/post", { imageid: post._id }).then(({ file }) => {
      setUrl(file);
    });
  }, []);

  return (
    <div className="Card-post">
      <p className="Card-postUser">{post.creator_name}</p>
      {url ? <img className="Card-image" src={`${atob(url)}`} /> : "No image uploaded!"}
      <p className="Card-postContent">{post.caption}</p>
      {post.created_at && <p className="Date">{created_date.toLocaleString()}</p>}
    </div>
  );
};

export default SinglePost;
