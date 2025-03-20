import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function DocsPage() {
  const [files, setFiles] = useState([]);
  const [fileStructure, setFileStructure] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [generatedDocs, setGeneratedDocs] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get(`${API_URL}/docs/files`);
        setFiles(res.data.files);
        setFileStructure(buildFileTree(res.data.files));
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  // 🔍 Helper: Build a nested file tree
  const buildFileTree = (files) => {
    const tree = {};

    files.forEach(({ path, name }) => {
      const parts = path.split("/");
      let current = tree;

      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[name] = path;
    });

    return tree;
  };

  // 📌 Handle selecting files
  const handleFileSelect = (filePath) => {
    setSelectedFiles((prev) =>
      prev.includes(filePath) ? prev.filter((f) => f !== filePath) : [...prev, filePath]
    );
  };

  // 🚀 Send selected files to AI for documentation
  const generateDocs = async () => {
    try {
      const res = await axios.post(`${API_URL}/docs/generate-docs`, {
          selectedFiles, // Now backend will read contents from selected files
      });
      setGeneratedDocs(res.data.documentation);
    } catch (error) {
      console.error("Error generating documentation:", error);
    }
  };

  // 📂 Recursive function to render file tree
  const renderFileTree = (tree, parentPath = "") => {
    return Object.keys(tree).map((key) => {
      const fullPath = `${parentPath}/${key}`.replace(/^\/+/, "");

      if (typeof tree[key] === "object") {
        return (
          <div key={fullPath} className="pl-4 border-l border-gray-600">
            <div className="font-semibold text-blue-400">{key}</div>
            {renderFileTree(tree[key], fullPath)}
          </div>
        );
      } else {
        return (
          <div key={fullPath} className="flex items-center space-x-2 pl-6">
            <Checkbox onClick={() => handleFileSelect(fullPath)} />
            <span className="text-gray-300">{key}</span>
          </div>
        );
      }
    });
  };

  return (
    <div className="p-8 bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-4">📂 Repository File Explorer</h1>
      <Card className="p-4 bg-gray-900 border-gray-800">
        {Object.keys(fileStructure).length === 0 ? (
          <p className="text-gray-400">No files found.</p>
        ) : (
          <div>{renderFileTree(fileStructure)}</div>
        )}
      </Card>

      <Button className="mt-4" onClick={generateDocs} disabled={selectedFiles.length === 0}>
        🚀 Generate Documentation
      </Button>

      {generatedDocs && generatedDocs.documentation && (
  <div className="mt-6 p-4 bg-gray-800 rounded-lg">
    <h2 className="text-lg font-semibold">📜 AI-Generated Documentation</h2>
    <div className="bg-gray-900 p-4 rounded-lg text-gray-300 whitespace-pre-wrap">
      <h3 className="text-blue-400 font-semibold">{generatedDocs.documentation.filename}</h3>
      <p className="text-gray-400">{generatedDocs.documentation.documentation.purpose}</p>
      <ul className="mt-2 space-y-2">
        {generatedDocs.documentation.documentation.functions.map((func, index) => (
          <li key={index} className="border-l-4 border-blue-500 pl-4">
            <h4 className="text-blue-300 font-medium">{func.name}</h4>
            <p className="text-gray-400">{func.description}</p>
            <pre className="bg-gray-700 p-2 rounded text-sm text-gray-200">
              Example: {func.usage_example}
            </pre>
          </li>
        ))}
      </ul>
      <p className="text-yellow-400 mt-2 italic">{generatedDocs.documentation.documentation.notes}</p>
    </div>
  </div>
)}

    </div>
  );
}
