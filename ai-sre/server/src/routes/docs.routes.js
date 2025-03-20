const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { generateDocumentation } = require("../../utils/aiDocs");

const router = express.Router();
const REPO_URL = process.env.GITHUB_REPO_URL;
const REPO_PATH = path.join(__dirname, "../repository");

// 🟢 Function to Clone or Pull the Repository
function updateRepo() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(REPO_PATH)) {
      console.log("🔄 Cloning repository...");
      exec(`git clone ${REPO_URL} ${REPO_PATH}`, (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Git Clone Error:", error);
          return reject(error);
        }
        console.log("✅ Repository Cloned");
        resolve(stdout || stderr);
      });
    } else {
      console.log("🔄 Pulling latest changes...");
      exec(`cd ${REPO_PATH} && git pull`, (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Git Pull Error:", error);
          return reject(error);
        }
        console.log("✅ Repository Updated");
        resolve(stdout || stderr);
      });
    }
  });
}

// 🟢 Function to List All Files (Including Nested)
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push({ name: file, path: filePath.replace(REPO_PATH + "/", "") });
    }
  });
  return fileList;
}

// 📂 API: Get All Files
router.get("/files", async (req, res) => {
  try {
    await updateRepo();
    const files = getAllFiles(REPO_PATH);
    res.json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Failed to retrieve files" });
  }
});

// 📜 Generate documentation with full file contents
router.post("/generate-docs", async (req, res) => {
  try {
      const { selectedFiles } = req.body;
      if (!selectedFiles || selectedFiles.length === 0) {
          return res.status(400).json({ error: "No files selected" });
      }

      // Read file contents
      const fileContents = selectedFiles.map((filePath) => {
          const fullPath = path.join(REPO_PATH, filePath);
          if (!fs.existsSync(fullPath)) {
              throw new Error(`File not found: ${filePath}`);
          }
          return {
              filename: filePath,
              content: fs.readFileSync(fullPath, "utf8"),
          };
      });

      // Send to AI for documentation
      const aiResponse = await generateDocumentation(fileContents);
      res.json({ documentation: aiResponse });
  } catch (error) {
      console.error("Error generating documentation:", error.message);
      res.status(500).json({ error: "Error generating documentation" });
  }
});

module.exports = router;
