const express = require("express");

const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser());

const eventsArray = [];

app.post("/events", async (req, res) => {
  const events = req.body;
  console.log(events);
  // We store the events inside the event bus as to make the events
  // available to the services that were not operating when the events occur

  eventsArray.push(events);

  // For Posts Service

  // await axios.post("http://localhost:4000/event", events);

  // this will work on localhost so to use it in kubernetes
  // we will put the url of event bus service
  // that is simply the name of service . Note this will
  // work only on pods not on computer
  await axios.post("http://posts-cluster-ip-service:4000/event", events);

  // For Comment Service
  // await axios.post("http://localhost:4001/event", events);
  // this will work on localhost so to use it in kubernetes
  // we will put the url of event bus service
  // that is simply the name of service . Note this will
  // work only on pods not on computer

  await axios.post("http://comments-cluster-ip-service:4001/event", events);

  // For Query Service
  // await axios.post("http://localhost:4002/event", events);
  // this will work on localhost so to use it in kubernetes
  // we will put the url of event bus service
  // that is simply the name of service . Note this will
  // work only on pods not on computer
  await axios.post("http://query-cluster-ip-service:4002/event", events);

  // For Moderation Service
  // await axios.post("http://localhost:4003/event", events);
  // this will work on localhost so to use it in kubernetes
  // we will put the url of event bus service
  // that is simply the name of service . Note this will
  // work only on pods not on computer
  await axios.post("http://moderation-cluster-ip-service:4003/event", events);

  res.send({ status: "ok" });
});

app.get("/events", (req, res) => {
  res.send(eventsArray);
});

app.listen(4005, () => {
  console.log("Event Bus Listining in 4005");
});
