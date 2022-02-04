import axios from "axios";
import React, { useState } from "react";

export default ({ postId }) => {
  const [content, setContent] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted");
    // Now we will make a request to the ingress server instead of localhost
    await axios.post(`http://blogs.com/posts/${postId}/comments`, {
      content,
    });

    setContent("");
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Comment</label>
          <input
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
