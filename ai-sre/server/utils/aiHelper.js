const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateDocumentation = async (files) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.4,
            messages: [
                {
                    role: "system",
                    content: `You are an AI documentation generator.
                    Generate detailed documentation for the provided code files.
                    
                    **Documentation Guidelines:**
                    - Describe the purpose of the file.
                    - Explain each function and its parameters.
                    - Provide usage examples if applicable.
                    - Ensure clarity for developers.

                    **Output Format (JSON Only)**
                    {
                        "filename": "<file name>",
                        "documentation": "<generated documentation>"
                    }`,
                },
                {
                    role: "user",
                    content: `Generate documentation for the following files:
                    
                    ${files.map(file => `**Filename:** ${file.filename}\n\n**Code:**\n\n\`\`\`js\n${file.content}\n\`\`\``).join("\n\n")}`,
                },
            ],
        });

        let content = completion.choices[0].message.content.trim();

        if (content.startsWith("```json")) {
            content = content.replace(/^```json/, "").replace(/```$/, "").trim();
        }

        return JSON.parse(content);
    } catch (error) {
        console.error("❌ AI Documentation Error:", error);
        return null;
    }
};

module.exports = { generateDocumentation };