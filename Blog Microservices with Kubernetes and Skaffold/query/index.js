const express = require("express");

const cors = require("cors");
const bP = require("body-parser");
const { default: axios } = require("axios");

const app = express();
app.use(bP());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  console.log(type);
  if (type === "Post Created") {
    const { id, title } = data;

    posts[id] = {
      id,
      title,
      comments: [],
    };
  }
  if (type === "Comment Created") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === "Comment Updated") {
    const { id, content, postId, status } = data;
    console.log(data);
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/event", (req, res) => {
  const { type, data } = req.body;
  console.log(type, data);
  handleEvent(type, data);

  res.send("Event Processed");
});

app.listen(4002, async () => {
  console.log("Query Service Listining on 4002");
  // For Processing all the events that has happende when this service was
  // not online we get the list of events that is stored inside the
  // event bus. This storing of events is generqally used in practise

  // const { data } = await axios.get("http://localhost:4005/events");
  // this will work on localhost so to use it in kubernetes
  // we will put the url of event bus service
  // that is simply the name of service . Note this will
  // work only on pods not on computer
  const { data } = await axios.get(
    "http://event-bus-cluster-ip-service:4005/events"
  );
  for (let event of data) {
    console.log("Processing Event Of type", event.type);
    handleEvent(event.type, event.data);
  }
});
