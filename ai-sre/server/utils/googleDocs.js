import { google } from "googleapis";

export async function uploadToGoogleDocs(docContent) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/documents"],
  });

  const docs = google.docs({ version: "v1", auth });

  const document = await docs.documents.create({
    requestBody: {
      title: "AI-Generated Documentation",
    },
  });

  await docs.documents.batchUpdate({
    documentId: document.data.documentId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: docContent,
          },
        },
      ],
    },
  });

  return `https://docs.google.com/document/d/${document.data.documentId}`;
}
