import { useEffect, useState } from "react";
import axios from "axios";
import SummaryCards from "../components/SummaryCards";
import AlertCharts from "../components/AlertCharts";
import AlertTable from "../components/AlertTable";
import Navbar  from "../components/Navbar";
import { Input } from "@/components/ui/input";


export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`${API_URL}/alerts`);
        setAlerts(res.data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const deleteAlert = async (id) => {
    try {
      await axios.delete(`${API_URL}/alerts/${id}`);
      setAlerts(alerts.filter((alert) => alert.id !== id));
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  const fetchAIResponse = async (alertId) => {
    try {
      const res = await axios.get(`${API_URL}/ai-response/${alertId}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return null;
    }
  };

  const approveFix = async (alertId) => {
    try {
      const response = await axios.post(`${API_URL}/alerts/${alertId}/approve`);
      alert("✅ Approved! PR Created Successfully.");
    } catch (error) {
      console.error("❌ Error approving fix:", error);
      alert("❌ Failed to approve.");
    }
  };

  const fetchAlertDetails = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/alerts/${id}`);
      const alertData = res.data;

      // Fetch AI response and attach it
      const aiResponse = await fetchAIResponse(id);
      if (aiResponse) {
        alertData.correctedCode = aiResponse.response;
        alertData.explanation = aiResponse.explanation;
      }

      return alertData;
    } catch (error) {
      console.error("Error fetching alert details:", error);
      return null;
    }
  };

  // 🔍 Filter alerts based on search
  const filteredAlerts = alerts.filter(
    (alert) =>
      (alert.alertName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (alert.severity?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
        🚀 AI-SRE Alerts Dashboard
      </h1>

      {/* 📊 Summary Cards */}
      <SummaryCards alerts={alerts} />

      {/* 📈 Charts */}
      <AlertCharts alerts={alerts} />

      {/* 🔍 Search Bar */}
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search alerts..."
          className="w-full p-3 rounded-lg bg-gray-900 border-gray-800"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 🚨 Alerts Table */}
      <AlertTable
        alerts={filteredAlerts}
        deleteAlert={deleteAlert}
        fetchAlertDetails={fetchAlertDetails}
        approveFix={approveFix}
      />
    </div>
  );
}