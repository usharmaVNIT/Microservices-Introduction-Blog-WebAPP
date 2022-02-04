import React, { useEffect, useState } from "react";

export default ({ comments }) => {
  const rendered = comments.map((comment) => {
    let content = comment.content;
    if (comment.status === "pending") {
      content = "This comment is awaiting Moderation";
    }
    if (comment.status === "rejected") {
      content = "This comment is rejected";
    }
    return <li key={comment.id}>{content}</li>;
  });
  return <ul>{rendered}</ul>;
};
