require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/job");

//create a server
const app = express();

app.use(express.json());
app.use(cors()); //for testing purposes only, should be removed in production

//connect to db
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Db connected!"))
    .catch((error) => console.log("Failed to connect", error));

//health api

app.get("/health", (req, res) => {
    res.json({
        service: "job listing server",
        status: "Active",
        time: new Date(),
    });
});

app.use("/api/v1/auth" ,authRoutes);
app.use("/api/v1/job", jobRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
