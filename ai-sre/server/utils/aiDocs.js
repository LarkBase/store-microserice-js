const { OpenAI } = require("openai");
const { google } = require("googleapis");
const path = require("path");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const credentialsPath = path.join(__dirname, "credentials.json"); 

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

        const parsedContent = JSON.parse(content);

        // Upload to Google Docs
        const docUrl = await uploadToGoogleDocs(parsedContent.documentation);

        return { documentation: parsedContent, docUrl };
    } catch (error) {
        console.error("❌ AI Documentation Error:", error);
        return null;
    }
};


const uploadToGoogleDocs = async (docContent) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "utils/credentials.json", // Ensure the correct path
    scopes: ["https://www.googleapis.com/auth/documents"],
  });

  const docs = google.docs({ version: "v1", auth });

  // Create a new Google Doc
  const document = await docs.documents.create({
    requestBody: {
      title: "AI-Generated Documentation",
    },
  });

  const docId = document.data.documentId;

  // Ensure docContent is valid and formatted correctly
  const textToInsert = typeof docContent === "string" ? docContent : JSON.stringify(docContent, null, 2);

  if (!textToInsert.trim()) {
    throw new Error("Generated documentation is empty.");
  }

  // Insert text into the Google Doc
  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: textToInsert, // Ensure this contains valid text
          },
        },
      ],
    },
  });

  return `https://docs.google.com/document/d/${docId}`;
}

module.exports = { generateDocumentation, uploadToGoogleDocs };
