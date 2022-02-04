const express = require("express");

const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser());

app.post("/event", async (req, res) => {
  let { type, data } = req.body;
  console.log("Event Recieved: ", type);

  if (type === "Comment Created") {
    console.log("Moderating");
    console.log(data);
    const status = data.content.includes("controversial")
      ? "rejected"
      : "approved";
    data = { ...data, status };
    console.log(data);
    await axios.post("http://localhost:4005/events", {
      type: "Comment Moderated",
      data,
    });
  }

  res.send("Moderated Comment");
});

app.listen(4003, () => {
  console.log(`Moderation Service at 4003`);
});
