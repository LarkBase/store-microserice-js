const app = require("./app");

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ AI-SRE Service running on port ${PORT}`));
