const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { randomBytes } = require("crypto");
const { default: axios } = require("axios");

const app = express();

app.use(bodyParser());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(2).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };
  // Emit the event to notify the event bus
  // await axios.post("http://localhost:4005/events", {
  // this will work on localhost so to use it in kubernetes
  // we will put the url of event bus service
  // that is simply the name of service . Note this will
  // work only on pods not on computer
  await axios.post("http://event-bus-cluster-ip-service:4005/events", {
    type: "Post Created",
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

// This is to recieve event from the event Bus
app.post("/event", (req, res) => {
  console.log("Event Recieved : ", req.body);
  res.send("Got The Event");
});

app.listen(4000, () => {
  console.log(`Listining posts service on 4000`);
});
