const axios = require("axios");

const GITHUB_OWNER = "LarkBase";
const GITHUB_REPO = "store-microserice-js";
const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN; // Store in `.env`
const BRANCH = "master";

// ✅ Function to list all files and directories in a path from GitHub
const listFilesInDir = async (dirPath) => {
    try {
        const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${dirPath}?ref=${BRANCH}`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        return response.data
            .filter(item => item.type === "file") // Ensure only files are returned
            .map(file => file.name);
    } catch (error) {
        console.error(`⚠️ Could not list files in ${dirPath}: ${error.response?.status} - ${error.response?.data?.message}`);
        return [];
    }
};

const normalizeRouteName = (route) => {
    const cleanRoute = route.replace(/^\//, ""); // Remove leading `/`
    return [
        cleanRoute, // reset-password
        cleanRoute.replace(/-/g, ""), // resetpassword
        cleanRoute.replace(/-/g, "_"), // reset_password
        cleanRoute.charAt(0).toUpperCase() + cleanRoute.slice(1), // Reset-password
    ];
};

const findRouteFile = async (job, route) => {
    try {
        const serviceFolder = `${job}-ms/src`; // Example: user-service-ms/src
        const normalizedRoutes = normalizeRouteName(route);
        console.log(`🔍 Searching for route: ${route} in service: ${serviceFolder}`);

        const possibleDirs = ["routes", "controllers", "services"];
        let foundFile = null;

        for (const dir of possibleDirs) {
            const dirPath = `${serviceFolder}/${dir}`;
            const files = await listFilesInDir(dirPath);

            for (const routeVariant of normalizedRoutes) {
                const matchedFile = files.find(file => file.startsWith(routeVariant) && file.endsWith(".js"));
                if (matchedFile) {
                    foundFile = `${dirPath}/${matchedFile}`;
                    break;
                }
            }

            if (foundFile) break;
        }

        if (foundFile) {
            console.log(`✅ Found route file: ${foundFile}`);

            const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${foundFile}?ref=${BRANCH}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3.raw",
                },
            });

            return { filePath: foundFile, code: response.data };
        } else {
            console.log("❌ Route file not found!");
            return null;
        }
    } catch (error) {
        console.error("❌ Error searching for route file:", error.message);
        return null;
    }
};


// ✅ Create a new GitHub branch, commit AI fix & merge PR
const createBranchAndPR = async (service, route, fixedCode, explanation, branchName) => {
    try {
        const mainBranch = BRANCH;
        const filePath = `${service}-ms/src/routes/${route.replace("/", "")}.routes.js`;

        console.log(`📂 Fetching file from GitHub: ${filePath}`);

        // 1️⃣ Get File SHA
        const fileData = await axios.get(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );

        const fileSha = fileData.data.sha;

        // 2️⃣ Create Branch
        const branchRes = await axios.post(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs`,
            {
                ref: `refs/heads/${branchName}`,
                sha: fileData.data.sha
            },
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );

        console.log(`✅ Created Branch: ${branchName}`);

        // 3️⃣ Commit AI Fix
        const commitRes = await axios.put(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
            {
                message: `🚀 AI Fix for ${route}`,
                content: Buffer.from(fixedCode).toString("base64"),
                branch: branchName,
                sha: fileSha
            },
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );

        console.log(`✅ Committed AI Fix to ${branchName}`);

        // 4️⃣ Create PR with AI Explanation
        const prRes = await axios.post(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`,
            {
                title: `🚀 Hotfix - AI Fix for ${route}`,
                head: branchName,
                base: mainBranch,
                body: `### AI Suggested Fix
                **Description:** ${explanation}
                
                **This PR includes AI-suggested fixes for the identified issue.**`
            },
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );

        console.log(`✅ Created PR: ${prRes.data.html_url}`);

        // 5️⃣ Auto-Merge PR
        await mergePR(prRes.data.number);

        return { success: true, prUrl: prRes.data.html_url };
    } catch (error) {
        console.error("❌ Error creating PR:", error.response?.data || error.message);
        return { success: false };
    }
};

// ✅ Merge PR after creation
const mergePR = async (prNumber) => {
    try {
        const mergeRes = await axios.put(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls/${prNumber}/merge`,
            {
                commit_title: "✅ Auto-merged AI Fix",
                commit_message: "Merging AI-suggested fix automatically.",
                merge_method: "squash"
            },
            { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );

        console.log(`✅ PR Merged Successfully: ${mergeRes.data.message}`);
    } catch (error) {
        console.error("❌ Error merging PR:", error.response?.data || error.message);
    }
};

module.exports = { findRouteFile , createBranchAndPR };
