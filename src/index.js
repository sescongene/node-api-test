const express = require("express");

const { body, validationResult } = require("express-validator");

const app = express();

app.use(express.json());

app.post(
  `/message`,
  body("conversation_id").isAlphanumeric(),
  body("message").isString(),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const context = {
      greetings: ["hello", "hi"],
      goodbyes: ["goodbye", "bye"],
    };

    const message = req.body.message.replace(/[^a-zA-Z ]/g, " ").split(" ");

    let greetings = "";

    message.some((word) => {
      if (greetings === "" && context.greetings.includes(word.toLowerCase())) {
        greetings = "Welcome to StationFive.";
        return;
      } else if (
        greetings === "" &&
        context.goodbyes.includes(word.toLowerCase())
      ) {
        greetings = "Thank you, see you around.";
        return;
      }
    });

    const response = {
      conversation_id: req.body.conversation_id,
      response: greetings === "" ? "Sorry, I don't understand." : greetings,
    };

    res.json(response);
  }
);

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`)
);
