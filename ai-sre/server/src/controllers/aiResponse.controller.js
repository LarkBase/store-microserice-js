const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ✅ Get AI Response by Alert ID
const getAIResponse = async (req, res) => {
    try {
        const { alertId } = req.params;

        const aiResponse = await prisma.aIResponse.findUnique({
            where: { alertId },
        });

        if (!aiResponse) {
            return res.status(404).json({ message: "AI Response not found" });
        }

        res.json(aiResponse);
    } catch (error) {
        console.error("❌ Error fetching AI response:", error);
        res.status(500).json({ message: "Error fetching AI response" });
    }
};

// ✅ Delete AI Response by Alert ID
const deleteAIResponse = async (req, res) => {
    try {
        const { alertId } = req.params;

        await prisma.aIResponse.delete({ where: { alertId } });

        res.json({ message: "AI Response deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting AI response:", error);
        res.status(500).json({ message: "Error deleting AI response" });
    }
};

module.exports = { getAIResponse, deleteAIResponse };
