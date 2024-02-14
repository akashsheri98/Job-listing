const express = require("express");
const router = express.Router();
const { model } = require("mongoose");
const Job = require("../models/job");

router.post("/create", async(req, res) => {
  try {
    const { companyName, title, description, logoUrl } = req.body;
    if (!companyName || !title || !description || !logoUrl) {
      return res.status(400).json({ errorMessage: "Bad Request" });
    }

    const jobDetails = new Job({
        companyName,
        title,
        description,
        logoUrl,
    }); 

    await jobDetails.save();

    res.json({ message: "New Job created successfully!"});
  } catch (error) {
    console.log(`Error : ${error}`);
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

module.exports = router; 