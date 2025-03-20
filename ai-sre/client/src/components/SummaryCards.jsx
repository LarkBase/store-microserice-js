import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SummaryCards({ alerts }) {
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter((alert) => alert.severity === "critical").length;
  const warningAlerts = alerts.filter((alert) => alert.severity === "warning").length;
  const infoAlerts = alerts.filter((alert) => alert.severity === "info").length;

  return (
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
          <p className="text-4xl font-bold text-yellow-500">{warningAlerts}</p>
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
  );
}