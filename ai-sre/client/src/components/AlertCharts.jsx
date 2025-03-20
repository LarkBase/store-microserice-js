import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AlertCharts({ alerts }) {
  const criticalAlerts = alerts.filter((alert) => alert.severity === "critical").length;
  const warningAlerts = alerts.filter((alert) => alert.severity === "warning").length;
  const infoAlerts = alerts.filter((alert) => alert.severity === "info").length;

  const severityData = [
    { name: "Critical", value: criticalAlerts },
    { name: "Warning", value: warningAlerts },
    { name: "Info", value: infoAlerts },
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#3b82f6"];

  const chartData = alerts.map((alert) => ({
    ...alert,
    timestamp: new Date(alert.createdAt).toLocaleString(),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-400">Alert Severity Distribution</CardTitle>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
  );
}