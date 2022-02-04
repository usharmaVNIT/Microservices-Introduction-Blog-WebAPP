const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(bodyParser());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  console.log(req.body);
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: "pending" });
  commentsByPostId[req.params.id] = comments;
  // Emiting an event on the event-bus
  // await axios.post("http://localhost:4005/events", {
  // this will work on localhost so to use it in kubernetes
  // we will put the url of event bus service
  // that is simply the name of service . Note this will
  // work only on pods not on computer
  await axios.post("http://event-bus-cluster-ip-service:4005/events", {
    type: "Comment Created",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });
  res.status(201).send(comments);
});

// This is to recieve event from the event Bus
app.post("/event", async (req, res) => {
  console.log("Event Recieved : ", req.body);

  const { type, data } = req.body;
  if (type === "Comment Moderated") {
    const { postId, id, status } = data;

    const comments = commentsByPostId[postId];
    // .find method gives a reference so it will be directly updated
    const comment = comments.find((comment) => comment.id == id);
    comment.status = status;

    // await axios.post("http://localhost:4005/events", {
    // this will work on localhost so to use it in kubernetes
    // we will put the url of event bus service
    // that is simply the name of service . Note this will
    // work only on pods not on computer
    await axios.post("http://event-bus-cluster-ip-service:4005/events", {
      type: "Comment Updated",
      data: {
        ...comment,
        postId,
      },
    });
  }
  res.status(200).send("Got The Event");
});

app.listen(4001, () => {
  console.log(`Comments Service Listinig on 4001`);
});
