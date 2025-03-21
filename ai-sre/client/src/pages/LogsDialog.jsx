import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const USER_API = import.meta.env.VITE_USER_SERVICE_API_URL || "http://localhost:5001";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function LogsDialog() {
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${USER_API}/api/logs`);
        setLogs(res.data.logs || []);
        setAiResult(null); // reset any previous AI result
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, [open]);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/logs/analyze`, { logs });
      setAiResult(res.data.analysis);
    } catch (error) {
      console.error("Error analyzing logs:", error);
      setAiResult({ error: "Something went wrong while analyzing the logs." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">📄 View User-Service Logs</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-gray-900 text-white p-6">
        <h2 className="text-lg font-semibold mb-4">🪵 User-Service Logs</h2>
        <ScrollArea className="h-[400px] rounded bg-gray-800 p-4 border border-gray-700">
          {logs.length === 0 ? (
            <p className="text-gray-400">No logs found.</p>
          ) : (
            logs.map((log) => (
              <div key={log.filename} className="mb-4">
                <h3 className="text-blue-400 font-medium mb-1">{log.filename}</h3>
                <pre className="bg-gray-900 text-gray-300 p-2 rounded text-sm whitespace-pre-wrap overflow-x-auto">
                  {log.content.join("\n")}
                </pre>
              </div>
            ))
          )}
        </ScrollArea>

        <div className="mt-4 flex justify-between items-center">
          <Button onClick={handleAnalyze} variant="default" disabled={loading || logs.length === 0}>
            {loading ? "Analyzing..." : "🧠 Analyze Logs"}
          </Button>
        </div>

        {/* 🧠 AI Result Section */}
        {aiResult && (
          <div className="mt-6 bg-gray-800 p-4 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">📊 AI Analysis Summary</h3>
            {aiResult.error ? (
              <p className="text-red-400">{aiResult.error}</p>
            ) : (
              <>
                <p className="text-gray-300 mb-2"><strong>Summary:</strong> {aiResult.summary}</p>

                <div className="mb-2">
                  <p className="font-semibold text-red-400">Issues:</p>
                  <ul className="list-disc list-inside text-gray-300">
                    {aiResult.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-green-400">Recommendations:</p>
                  <ul className="list-disc list-inside text-gray-300">
                    {aiResult.recommendations.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
