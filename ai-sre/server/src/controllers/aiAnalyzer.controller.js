const { analyzeLogs } = require("../../utils/aiAnalyzeLogs");

const analyzeLogsController = async (req, res) => {
  const logs = req.body.logs;

  if (!Array.isArray(logs) || logs.length === 0) {
    return res.status(400).json({ message: "Logs are required in an array format." });
  }

  const aiResult = await analyzeLogs(logs);

  if (!aiResult) {
    return res.status(500).json({ message: "Failed to analyze logs using AI." });
  }

  res.json({ analysis: aiResult });
};

module.exports = { analyzeLogsController };
