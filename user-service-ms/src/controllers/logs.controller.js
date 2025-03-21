const express = require('express')

const router = express.Router();

const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(process.cwd(), 'logs');

const logsController = async (req, res) => {
    try {
        if (!fs.existsSync(LOGS_DIR)) {
            return res.status(404).json({ message: "Logs directory not found" });
        }
    
        // Read all log files in the folder
        const logFiles = fs.readdirSync(LOGS_DIR)
            .filter(file => file.endsWith('.log'));
    
        let logs = [];
    
        // Read contents of each log file
        logFiles.forEach(file => {
            const filePath = path.join(LOGS_DIR, file);
            const logContent = fs.readFileSync(filePath, 'utf-8');
    
            const logLines = logContent
                .split('\n')
                .filter(line => line.trim() !== "")
                .slice(0, 50); // ⬅️ Limit to first 200 lines
    
            logs.push({
                filename: file,
                content: logLines
            });
        });
    
        res.json({ logs });
    
    } catch (error) {
        console.error("Error reading logs:", error);
        res.status(500).json({ message: "Error retrieving logs" });
    }
    
};

// Export using CommonJS
module.exports = { logsController };

