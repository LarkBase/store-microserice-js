const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const analyzeAndFixCode = async (alert, codeSnippet) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.4,
            messages: [
                {
                    role: "system",
                    content: `You are an expert in debugging Node.js applications.
                    Analyze the provided code and optimize it for better performance.
                    
                    **Fix Common Issues:**
                    - Optimize slow database queries (Prisma, Sequelize, etc.)
                    - Improve async/await handling
                    - Reduce memory leaks or unoptimized loops
                    - Fix inefficient API calls

                    **Output Format (JSON Only)**
                    {
                        "fixedCode": "<optimized code>",
                        "explanation": "<brief explanation>"
                    }`,
                },
                {
                    role: "user",
                    content: `**Error Message:** "${alert.description}"

                    **API Route:** "${alert.route}"

                    **Code Snippet:**
                    \`\`\`js
                    ${codeSnippet}
                    \`\`\`

                    Please optimize the code and return the response in JSON format.`,
                },
            ],
        });

        let content = completion.choices[0].message.content.trim();

        if (content.startsWith("```json")) {
            content = content.replace(/^```json/, "").replace(/```$/, "").trim();
        }

        return JSON.parse(content);
    } catch (error) {
        console.error("❌ AI Analysis Error:", error);
        return null;
    }
};

module.exports = { analyzeAndFixCode };
