export type ChatMessage = {
  type: "apiMessage" | "userMessage";
  message: string;
  isStreaming?: boolean;
  sourceDocs?: Document[];
};

export type ApiChatResponseBody = {
  response: {
    text: string;
    sourceDocuments: Document[];
  };
};

export type ApiChatResponse = ApiChatResponseBody | { error: string; status: number };
