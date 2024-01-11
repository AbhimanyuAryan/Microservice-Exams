const dotenv = require("dotenv");
const express = require("express");
const app = express();
const db = require("./database/sqlite");

dotenv.config();

var PORT = process.env.PORT;

app.use(express.json());

// Router
app.use("/exams", require("./routes/exams")(db));
app.use("/questions", require("./routes/questions")(db));

app.listen(PORT, () => {
    console.log("Started server on port " + PORT + ".");
});