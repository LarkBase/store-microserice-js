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

const githubHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
};

// ✅ Fetch the latest commit SHA from `main`
const getMainBranchSHA = async () => {
    try {
        const response = await axios.get(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${BRANCH}`,
            { headers: githubHeaders }
        );
        return response.data.object.sha;
    } catch (error) {
        console.error("❌ Error fetching main branch SHA:", error.response?.data || error.message);
        return null;
    }
};

// ✅ Find the Route File in the Repository
const findRouteFile = async (service, route) => {
    try {
        const serviceFolder = `${service}-ms/src/routes`;
        const routeName = route.replace("/", "").toLowerCase();
        const branch = BRANCH;

        console.log(`🔍 Searching for route: ${route} in ${serviceFolder}`);

        // Get the list of files in the routes directory
        const filesResponse = await axios.get(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${serviceFolder}?ref=${branch}`,
            { headers: githubHeaders }
        );

        const matchedFile = filesResponse.data.find(file =>
            file.name.startsWith(routeName) && file.name.endsWith(".js")
        );

        if (!matchedFile) {
            console.log(`⚠️ No matching route file found for ${route}`);
            return null;
        }

        // Fetch the file content
        const fileData = await axios.get(matchedFile.download_url, { headers: githubHeaders });
        console.log(`✅ Found route file: ${matchedFile.path}`);

        return { filePath: matchedFile.path, code: fileData.data };
    } catch (error) {
        console.error("❌ Error searching for route file:", error.response?.data || error.message);
        return null;
    }
};

// ✅ Get file SHA (Required for updating a file)
const getFileSHA = async (filePath) => {
    try {
        const response = await axios.get(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
            { headers: githubHeaders }
        );
        return response.data.sha;
    } catch (error) {
        console.error("❌ Error fetching file SHA:", error.response?.data || error.message);
        return null;
    }
};

// ✅ Create Branch, Commit AI Fix, Open & Merge PR
const createBranchAndPR = async (service, route, fixedCode, explanation) => {
    try {
        const branchName = `hotfix/${new Date().toISOString().split("T")[0]}`;
        console.log(`🚀 Creating Branch: ${branchName}`);

        await createNewBranch(branchName);

        // ✅ Get the File to Edit
        const fileData = await findRouteFile(service, route);
        if (!fileData) throw new Error(`Route file for ${route} not found`);

        const filePath = fileData.filePath;
        const fileSHA = await getFileSHA(filePath);
        if (!fileSHA) throw new Error("Failed to retrieve file SHA.");

        // ✅ Commit AI Fix
        await axios.put(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
            {
                message: `🚀 AI Fix for ${route}`,
                content: Buffer.from(fixedCode).toString("base64"),
                branch: branchName,
                sha: fileSHA,
            },
            { headers: githubHeaders }
        );

        console.log(`✅ Committed AI Fix to ${branchName}`);

        // ✅ Create PR with AI Explanation
        const prRes = await axios.post(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`,
            {
                title: `🚀 Hotfix - AI Fix for ${route}`,
                head: branchName,
                base: BRANCH,
                body: `### AI Suggested Fix\n**Description:** ${explanation}\n\n**This PR includes AI-suggested fixes for the identified issue.**`,
            },
            { headers: githubHeaders }
        );

        console.log(`✅ Created PR: ${prRes.data.html_url}`);

        // ✅ Auto-Merge PR
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
                merge_method: "squash",
            },
            { headers: githubHeaders }
        );

        console.log(`✅ PR Merged Successfully: ${mergeRes.data.message}`);
    } catch (error) {
        console.error("❌ Error merging PR:", error.response?.data || error.message);
    }
};

// ✅ Create a new branch
const createNewBranch = async (branchName) => {
    try {
        const mainBranchSHA = await getMainBranchSHA();
        if (!mainBranchSHA) throw new Error("Failed to get main branch SHA.");

        if (await checkBranchExists(branchName)) return;

        await axios.post(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs`,
            { ref: `refs/heads/${branchName}`, sha: mainBranchSHA },
            { headers: githubHeaders }
        );

        console.log(`✅ Created new branch: ${branchName}`);
    } catch (error) {
        console.error("❌ Error creating branch:", error.response?.data || error.message);
    }
};



// ✅ Check if branch already exists
const checkBranchExists = async (branchName) => {
    try {
        await axios.get(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${branchName}`,
            { headers: githubHeaders }
        );
        console.log(`🔄 Branch already exists: ${branchName}`);
        return true;
    } catch (error) {
        return false; // Branch does not exist
    }
};

module.exports = { findRouteFile, createBranchAndPR, mergePR };
