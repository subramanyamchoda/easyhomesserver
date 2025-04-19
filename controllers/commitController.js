const nodemailer = require('nodemailer');
const Commit = require('../models/Commit');
const User = require('../models/User');
const Renter = require('../models/Renter');
const Home = require('../models/Home');
  
// Create a Nodemailer transport

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,             // <-- 587 for STARTTLS
  secure: false,         // <-- must be false for port 587
  auth: {
    user: 'pandaconnect7@gmail.com',
    pass: 'pvgitcnukcfuvhog'
  }
});

const sendCommitEmail = async (commit, renter) => {
  const adminEmail = 'Subbuchoda0@gmail.com';

  const renterMailOptions = {
    from: 'pandaconnect7@gmail.com',
    to: renter.email,
    subject: 'New Commit Confirmation',
    text: `Hello ${renter?.firstname || 'User'},\n\nYour commit for home "${commit?.homeId?.title || 'a property'}" has been successfully processed.\n\nBest regards,\nEasy Homes Team`
  };
  const screenshotUrl = commit.screenshot.replace(/\\/g, '/');
  const adminMailOptions = {
    from: 'pandaconnect7@gmail.com',
    to: adminEmail,
    subject: 'New Commit Created',
    html: `
      A new commit has been created for the home "${commit?.homeId?.title || 'a property'}".<br><br>
      Details:<br>
      Renter: ${renter?.firstname || 'Unknown'} ${renter?.lastname || ''}<br>
      Home: ${commit?.homeId?.title || ''}<br>
 
     <img 
    src="http://localhost:5000/${screenshotUrl}" 
    alt="Screenshot" 
    style="max-width: 300px; height: auto; border-radius: 8px;" 
  /><br><br>

  <a href="http://localhost:5000/${screenshotUrl}">View Screenshot</a><br><br>
  <a href="http://localhost:3000/commit/${commit._id}">View Commit</a><br><br>

  To accept or cancel the commit, click the appropriate button:<br><br>
          To accept or cancel the commit, click the appropriate button:<br><br>+
          <button style="background-color: green; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer;" onclick="window.location.href='http://localhost:3000/accept-commit/${commit._id}'">Accept Commit</button><br><br> +
          <button style="background-color: red; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer;" onclick="window.location.href='http://localhost:3000/cancel-commit/${commit._id}'">Cancel Commit</button><br><br> +
          Best regards,<br>Easy Homes Team`
  };

  try {
    await transporter.sendMail(renterMailOptions);
    await transporter.sendMail(adminMailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
// Create Commit

const createCommit = async (req, res) => {
  const { userId, renterId, homeId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Screenshot is required' });
  }

  try {
    // Trim the file path to ensure there are no leading/trailing spaces
    const trimmedFilePath = req.file.path.trim();

    const newCommit = new Commit({
      userId,
      renterId,
      homeId,
      screenshot: trimmedFilePath, // Use the trimmed path
    });

    const savedCommit = await newCommit.save();

    const user = await User.findById(userId);
    const renter = await Renter.findById(renterId);
    const home = await Home.findById(homeId);

    if (user) {
      user.commits.push(savedCommit);
      await user.save();
    }

    if (renter) {
      renter.commits.push(savedCommit);
      await renter.save();
    }

    if (home) {
      home.commits.push(savedCommit);
      await home.save();
    }

    savedCommit.homeId = home;

    await sendCommitEmail(savedCommit, renter);

    res.status(201).json(savedCommit);
  } catch (error) {
    console.error("Error creating commit:", error);
    res.status(500).json({ message: "Error creating commit" });
  }
};


// Accept Commit Route
const acceptCommit = async (req, res) => {
  const { commitId } = req.params;

  try {
    const commit = await Commit.findById(commitId).populate('homeId').populate('renterId');
    if (!commit) {
      return res.status(404).json({ message: 'Commit not found' });
    }

    commit.status = 'accepted';
    await commit.save();

    const renter = commit.renterId;

    const renterMailOptions = {
      from: 'pandaconnect7@gmail.com',
      to: renter.email,
      subject: 'Your Commit has been Accepted',
      text: `Hello ${renter?.firstname || 'User'},\n\nYour commit for the home "${commit?.homeId?.title || 'a property'}" has been successfully accepted
        ${commit.userId._id}
        .\n\nBest regards,\nEasy Homes Team`
    };

    await transporter.sendMail(renterMailOptions);

    res.status(200).json({ message: 'Commit accepted', commit });
  } catch (error) {
    console.error("Error accepting commit:", error);
    res.status(500).json({ message: "Error accepting commit" });
  }
};


// Cancel Commit Route
const cancelCommit = async (req, res) => {
  const { commitId } = req.params;

  try {
    const commit = await Commit.findById(commitId);
    if (!commit) {
      return res.status(404).json({ message: 'Commit not found' });
    }

    // Update commit status to 'canceled'
    commit.status = 'canceled';
    await commit.save();

    // Send cancellation email to renter
    const renter = await Renter.findById(commit.renterId);
    const renterMailOptions = {
      from: 'pandaconnect7@gmail.com',
      to: renter.email,
      subject: 'Your Commit has been Canceled',
      text: `Hello ${renter.firstname},\n\nYour commit for the home "${commit.homeId.title}" has been canceled.\n\nBest regards,\nEasy Homes Team`
    };

    await transporter.sendMail(renterMailOptions);

    // Respond with success
    res.status(200).json({ message: 'Commit canceled', commit });
  } catch (error) {
    console.error("Error canceling commit:", error);
    res.status(500).json({ message: "Error canceling commit" });
  }
};

// Get all commits with populated references (user, renter, home)
const getAllCommits = async (req, res) => {
  try {
    const commits = await Commit.find()
      .populate('userId', 'firstname lastname email')  
      .populate('renterId', 'firstname lastname email mobile')
      .populate('homeId', 'title street town state rentprice images pluscode pincode district name mobile ');   

    res.status(200).json(commits);
  } catch (error) {
    console.error("Error fetching commits:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// In your commitController.js (Backend)

// Get a single commit by ID with populated references
const getCommitById = async (req, res) => {
  const { id } = req.params;

  try {
    const commit = await Commit.findById(id)
      .populate("userId", "firstname lastname email")
      .populate("renterId", "firstname lastname email")
      .populate("homeId", "title street town state");

    if (!commit) {
      return res.status(404).json({ message: "Commit not found" });
    }

    res.status(200).json(commit);
  } catch (error) {
    console.error("Error fetching commit:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a commit by ID
const deleteCommit = async (req, res) => {
  const { id } = req.params;

  try {
    const commit = await Commit.findByIdAndDelete(id);

    if (!commit) {
      return res.status(404).json({ message: "Commit not found" });
    }

    res.status(200).json({ message: "Commit deleted successfully" });
  } catch (error) {
    console.error("Error deleting commit:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// renter commmit or accepts this
const accept_renter = async (req, res) => {
  try {
    const commitId = req.params.commitId;
    console.log("Received commitId:", commitId);

    const commit = await Commit.findById(commitId).populate("userId");
    if (!commit) {
      return res.status(404).json({ message: "Commit request not found." });
    }
    const commit1 = await Commit.findByIdAndUpdate(
      commitId,
      { status: "Accepted", accepted: true },
      { new: true }
    ).populate("userId");

    const home = await Home.findById(commit.homeId); // ✅ Correct model + field
    if (!home) {
      return res.status(404).json({ message: "Home not found." });
    }

    commit.status = "Accepted";
    await commit.save();

    res.status(200).json({
      message: "Request accepted. Home details available.",
      home,
    });
  } catch (error) {
    console.error("Error accepting request:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};


const user_homes = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all accepted commits for the given userId
    const acceptedCommits = await Commit.find({
      userId,
      status: "Accepted",
    }).populate("homeId"); // Populate home details from homeId field

    if (acceptedCommits.length === 0) {
      return res.status(404).json({ message: "No accepted homes found." });
    }

    // Return all homes related to the accepted commits
    const homes = acceptedCommits.map((commit) => commit.homeId);

    res.status(200).json({ homes });
  } catch (error) {
    console.error("Error fetching accepted homes:", error);
    res.status(500).json({ message: "Server error." });
  }
};



module.exports = { 
  createCommit, 
  getAllCommits, 
  getCommitById, 
  deleteCommit, 
  acceptCommit, 
  cancelCommit , user_homes, accept_renter
};
