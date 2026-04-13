const express = require("express");
const {
  sendMessage,
  saveInterview,
  getHistory,
  getSession,
} = require("../controllers/interviewController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/message", authMiddleware, sendMessage);
router.post("/save", authMiddleware, saveInterview);
router.get("/history", authMiddleware, getHistory);
router.get("/session/:id", authMiddleware, getSession);

module.exports = router;
