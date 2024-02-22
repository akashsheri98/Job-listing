const express = require("express");
const router = express.Router();
const { model } = require("mongoose");
const Job = require("../models/job");
const jwtVerify = require("../middleware/authMiddleware");

router.post("/create", jwtVerify, async (req, res) => {
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
      refUserId: req.body.userId,
    });

    await jobDetails.save();

    res.json({ message: "New Job created successfully!" });
  } catch (error) {
    console.log(`Error : ${error}`);
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

router.post("/edit/:jobId", jwtVerify, async (req, res) => {
  try {
    const { companyName, title, description, logoUrl } = req.body;
    const jobId = req.params.jobId;

    if (!companyName || !title || !description || !logoUrl || !jobId) {
      return res.status(400).json({ errorMessage: "Bad Request" });
    }

    await Job.updateOne(
      { _id: jobId },
      {
        $set: {
          companyName,
          title,
          description,
          logoUrl,
        },
      }
    );

    res.json({ message: " Job details updtated successfully!" });
  } catch (error) {
    console.log(`Error : ${error}`);
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

router.get("/job-description/:jobId",  async (req, res) => {
  try {
    const jobId = req.params.jobId;

    if (!jobId) {
      return res.status(400).json({ errorMessage: "Bad Request" });
    }

    const jobDetails = await Job.findById(jobId);

    res.json({ data : jobDetails});
  } catch (error) 
  {
    console.log(`Error : ${error}`);
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

router.get("/all",  async (req, res) => {
  try {
    
    const title = req.query.title || "";
    const skills = req.query.skills;
    let filterSkills = skills?.split( "," ); 
    let filter ={};

    if( filterSkills){
      filter = {skills : { $in :[...filterSkills] }}
    }
    const jobList = await Job.find(
      {title : {$regex: title , $options:"i"}, 
       ...filter,
      },
      {companyName :1,});

    res.json({ data : jobList});
  } catch (error) 
  {
    console.log(`Error : ${error}`);
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

router.delete("/job/:jobId",  async (req, res) => {
  try {
    
    const jobId = req.params.jobId;
    const jobList = await Job.findByIdAndDelete(jobId);

    res.json({ data : jobList}) ;
  } catch (error) 
  {
    console.log(`Error : ${error}`);
    res.status(500).send({ message: "Internal Server Error!" });
  }
});
module.exports = router;
