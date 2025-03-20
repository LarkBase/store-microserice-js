const axios = require("axios");

const GITHUB_OWNER = "LarkBase";
const GITHUB_REPO = "store-microserice-js";
const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN; // Store in `.env`

// ✅ Function to search for the API route inside a microservice
const findRouteFile = async (job, route) => {
    try {
        const serviceFolder = `${job}-ms/src`; // Example: user-service-ms/src
        const branch = "main";

        console.log(`🔍 Searching for route: ${route} in service: ${serviceFolder}`);

        // Define possible file locations
        const possibleFiles = [
            `${serviceFolder}/routes/auth.routes.js`,
            `${serviceFolder}/routes/${route.replace("/", "")}.routes.js`,
            `${serviceFolder}/controllers/auth.controller.js`,
            `${serviceFolder}/controllers/${route.replace("/", "")}.controller.js`,
        ];

        // Search for the file
        for (const filePath of possibleFiles) {
            const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${branch}`;

            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `token ${GITHUB_TOKEN}`,
                        Accept: "application/vnd.github.v3.raw",
                    },
                });

                console.log(`✅ Found route file: ${filePath}`);
                return { filePath, code: response.data };
            } catch (err) {
                console.log(`⚠️ Not found: ${filePath}`);
            }
        }

        return null;
    } catch (error) {
        console.error("❌ Error searching for route file:", error.message);
        return null;
    }
};

module.exports = { findRouteFile };
