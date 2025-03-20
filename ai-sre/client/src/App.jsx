import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);
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

      setSelectedAlert(alertData);
    } catch (error) {
      console.error("Error fetching alert details:", error);
    }
  };

  // 🔍 Filter alerts based on search
  const filteredAlerts = alerts.filter(
    (alert) =>
      (alert.alertName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (alert.severity?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  // 📊 Statistics
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === "critical"
  ).length;
  const warningAlerts = alerts.filter(
    (alert) => alert.severity === "warning"
  ).length;
  const infoAlerts = alerts.filter((alert) => alert.severity === "info").length;

  // 📈 Chart Data
  const severityData = [
    { name: "Critical", value: criticalAlerts },
    { name: "Warning", value: warningAlerts },
    { name: "Info", value: infoAlerts },
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#3b82f6"]; // Red, Yellow, Blue

  // Format timestamp for BarChart
  const chartData = alerts.map((alert) => ({
    ...alert,
    timestamp: new Date(alert.createdAt).toLocaleString(),
  }));

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
        🚀 AI-SRE Alerts Dashboard
      </h1>

      {/* 📊 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalAlerts}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-500">{criticalAlerts}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400">Warning Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-yellow-500">
              {warningAlerts}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400">Info Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-500">{infoAlerts}</p>
          </CardContent>
        </Card>
      </div>

      {/* 📈 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400">
              Alert Severity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {severityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400">Alerts Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="severity" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-400">Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert Name</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{alert.alertName}</TableCell>
                  <TableCell>
                    {new Date(alert.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        alert.severity === "critical"
                          ? "destructive"
                          : "warning"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{alert.description}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => fetchAlertDetails(alert.id)}
                          variant="secondary"
                        >
                          🔍 View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full h-full max-w-screen-lg max-h-screen bg-gray-900 border-gray-800 text-white p-6 overflow-y-auto">
  <DialogTitle className="text-xl font-bold">Alert Details</DialogTitle>
  {selectedAlert && (
    <DialogDescription className="text-gray-300">
      <p>
        <strong>Alert Name:</strong> {selectedAlert.alertName}
      </p>
      <p>
        <strong>Timestamp:</strong>{" "}
        {new Date(selectedAlert.startsAt).toLocaleString()}
      </p>
      <p>
        <strong>Severity:</strong> {selectedAlert.severity}
      </p>
      <p>
        <strong>Description:</strong> {selectedAlert.description}
      </p>
      <p>
        <strong>Instance:</strong> {selectedAlert.instance}
      </p>
      <p>
        <strong>Job:</strong> {selectedAlert.job}
      </p>
      <p>
        <strong>Method:</strong> {selectedAlert.method}
      </p>
      <p>
        <strong>Route:</strong> {selectedAlert.route}
      </p>
      <p>
        <strong>Status Code:</strong> {selectedAlert.status}
      </p>
      <p>
        <strong>Starts At:</strong>{" "}
        {new Date(selectedAlert.startsAt).toLocaleString()}
      </p>
      <p>
        <strong>Ends At:</strong>{" "}
        {new Date(selectedAlert.endsAt).toLocaleString()}
      </p>

      {/* AI Suggested Fix */}
      {selectedAlert.correctedCode ? (
        <>
          <h3 className="text-lg font-semibold mt-4 text-green-400">
            AI Suggested Fix:
          </h3>
          <pre className="bg-gray-800 p-4 rounded-md text-green-300 text-sm overflow-auto max-h-96">
            {selectedAlert.correctedCode}
          </pre>
          <p className="mt-2 text-gray-400">
            <strong>AI Explanation:</strong> {selectedAlert.explanation}
          </p>

          {/* ✅ Approve Button */}
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => approveFix(selectedAlert.id)}
          >
            ✅ Approve & Create PR
          </button>
        </>
      ) : (
        <p className="text-yellow-400 mt-4">⏳ AI is analyzing this alert...</p>
      )}
    </DialogDescription>
  )}
</DialogContent>


                    </Dialog>
                    <Button
                      onClick={() => deleteAlert(alert.id)}
                      variant="destructive"
                      className="ml-2"
                    >
                      🗑 Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
