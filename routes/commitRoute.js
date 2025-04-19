const express = require('express');
const multer = require('multer');
const { createCommit, getAllCommits, getCommitById, deleteCommit, acceptCommit, cancelCommit ,
      
      accept_renter,user_homes} = require('../controllers/commitController.js');
const router = express.Router();

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // name the file
  },
});

const upload = multer({ storage: storage });

// POST: Create a new commit (with file upload handling)
router.post("/post", upload.single('screenshot'), createCommit);

// GET: Get all commits
router.get("/getall", getAllCommits);

// GET: Get a commit by ID
router.get("/:id", getCommitById);

// DELETE: Delete a commit by ID
router.delete("/:id", deleteCommit);

// GET: Accept a commit by ID (admin action)
router.get("/accept-commit/:commitId", acceptCommit);

// GET: Cancel a commit by ID (admin action)
router.get("/cancel-commit/:commitId", cancelCommit);


router.post("/accept-request/:commitId",accept_renter);
router.get("/accepted-property/:userId",user_homes);

module.exports = router;
