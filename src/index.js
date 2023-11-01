const express = require("express");
const app = express();
const userRouter = require("./routes/userRoute");
const noteRouter = require("./routes/noteRoute");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const mongoose = require("mongoose");

app.use(express.json());

app.use(cors());

app.use("/users", userRouter);
app.use("/notes", noteRouter);


app.get("/", (req, res) => {
    res.send("Hello from Application");
});

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URL)
    .then(() => {

        app.listen(PORT, () => {
            console.log("Server Started on port 5000");
        });
    })
    .catch((error) => {
        console.log(error);
    })

