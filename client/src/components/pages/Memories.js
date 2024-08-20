import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { get, post } from "../../utilities";
import "../../utilities.css";
import "./Memories.css";
import flower_1 from "../../public/flower-1.png";
import SinglePost from "../modules/SinglePost";
import plants_1 from "../../public/plants-1.png";
// const array = [1, 2, 5, 6, 10, 7, 12];
// const result = [];
// for (var i = 0; i < array.length; i++) {
//   if (array[i] % 2 === 0) {
//     result.push(array[i])
//   }
// }

// const array2 = [1, 2, 5, 6, 10, 7, 12];

// const isEven = x => x % 2 === 0;

// function getAllEvenValues(input) {
//   const result = []
//   for (var i = 0; i < input.length; i++) {
//     const value = input[i];
//     if (isEven(value)) {
//       result.push(value)
//     }
//   }
//   return result;
// }

// const isEven = x => x % 2 === 0;
// [1,2,3].filter(isEven);

// [1,2,3].filter(x => x % 2 === 0);

// const a = 123;

// doSomething(a);
// doSomething(123);

// function filter(array, predicate) {
//   const result = []
//   for (var i = 0; i < input.length; i++) {
//     const value = input[i];
//     if (predicate(value)) {
//       result.push(value)
//     }
//   }
//   return result;
// }

// filter(testArray, isEven);

// function map(array, mapper) {
//   const result = []
//   for (var i = 0; i < input.length; i++) {
//     const value = input[i];
//     result.push(mapper(value))
//   }
//   return result;
// }

// map([1,2,3], x => x^2) // [1, 4, 9]

// const myFunc = (x) => x ^ 2;

// function myFunc(x) {
//   return x ^ 2;
// }

const Memories = ({ userId, setShowNavBar }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    /*get("/api/stories").then((newStories) => {
      console.log(newStories);
      setStories(newStories);
    });*/
    document.title = "SEED";
    get("/api/posts").then((postObjs) => {
      let postsForUser = postObjs.filter((postObj) => userId === postObj.creator_id).reverse();

      console.log(postsForUser);
      setPosts(postsForUser);
    });
  }, []);
  // this gets called when the user pushes "Submit", so their
  // post gets added to the screen right away

  return (
    <div>
      <div className="gallery-scroll">
        <div className="memo-title">🌱 Planting Memories, seed by seed 🌱</div>
        <div className="stories-in-memories">
          {posts.map((post) => (
            <SinglePost post={post}/>
          ))}
        </div>
      </div>
      <img className="flower-image" src={flower_1} />
      <div className="plants-image-container">
        <img className="plants-image" src={plants_1} />
      </div>
    </div>
  );
};

export default Memories;
