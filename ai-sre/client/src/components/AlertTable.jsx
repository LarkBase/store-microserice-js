import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export default function AlertTable({ alerts, deleteAlert, fetchAlertDetails, approveFix }) {
  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleViewAlert = async (id) => {
    const alertDetails = await fetchAlertDetails(id);
    setSelectedAlert(alertDetails);
  };

  return (
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
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{alert.alertName}</TableCell>
                <TableCell>{new Date(alert.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={alert.severity === "critical" ? "destructive" : "warning"}>
                    {alert.severity}
                  </Badge>
                </TableCell>
                <TableCell>{alert.description}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => handleViewAlert(alert.id)} variant="secondary">
                        🔍 View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full h-full max-w-screen-lg max-h-screen bg-gray-900 border-gray-800 text-white p-6 overflow-y-auto">
                      <DialogTitle className="text-xl font-bold">Alert Details</DialogTitle>
                      {selectedAlert && (
                        <DialogDescription className="text-gray-300">
                          <p><strong>Alert Name:</strong> {selectedAlert.alertName}</p>
                          <p><strong>Timestamp:</strong> {new Date(selectedAlert.startsAt).toLocaleString()}</p>
                          <p><strong>Severity:</strong> {selectedAlert.severity}</p>
                          <p><strong>Description:</strong> {selectedAlert.description}</p>
                          <p><strong>Instance:</strong> {selectedAlert.instance}</p>
                          <p><strong>Job:</strong> {selectedAlert.job}</p>
                          <p><strong>Method:</strong> {selectedAlert.method}</p>
                          <p><strong>Route:</strong> {selectedAlert.route}</p>
                          <p><strong>Status Code:</strong> {selectedAlert.status}</p>
                          <p><strong>Starts At:</strong> {new Date(selectedAlert.startsAt).toLocaleString()}</p>
                          <p><strong>Ends At:</strong> {new Date(selectedAlert.endsAt).toLocaleString()}</p>

                          {selectedAlert.correctedCode ? (
                            <>
                              <h3 className="text-lg font-semibold mt-4 text-green-400">AI Suggested Fix:</h3>
                              <pre className="bg-gray-800 p-4 rounded-md text-green-300 text-sm overflow-auto max-h-96">
                                {selectedAlert.correctedCode}
                              </pre>
                              <p className="mt-2 text-gray-400"><strong>AI Explanation:</strong> {selectedAlert.explanation}</p>
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
                  <Button onClick={() => deleteAlert(alert.id)} variant="destructive" className="ml-2">
                    🗑 Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}