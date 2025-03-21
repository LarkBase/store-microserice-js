const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeLogs = async (logs = []) => {
  try {
    const promptLogs = logs
      .map(log => `**${log.filename}**\n\`\`\`\n${log.content.join("\n")}\n\`\`\``)
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `You are an AI SRE assistant.
Your task is to analyze log files from a Node.js microservice and provide a clear summary and any detected issues.

**Guidelines:**
- Identify common errors or patterns.
- Summarize key events and behavior.
- Highlight potential issues (e.g., timeouts, 500s, rate limiting).
- Don't make up info—base everything on the logs.

**Output Format (JSON Only)**:
{
  "summary": "<general summary of log activity>",
  "issues": ["<description of issue 1>", "<description of issue 2>", ...],
  "recommendations": ["<actionable tip 1>", "<actionable tip 2>", ...]
}
`,
        },
        {
          role: "user",
          content: `Please analyze the following logs:\n\n${promptLogs}`,
        },
      ],
    });

    let content = completion.choices[0].message.content.trim();

    // Clean up JSON block if wrapped in ```json
    if (content.startsWith("```json")) {
      content = content.replace(/^```json/, "").replace(/```$/, "").trim();
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("❌ AI Log Analysis Error:", error);
    return null;
  }
};

module.exports = { analyzeLogs };
