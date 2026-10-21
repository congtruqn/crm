import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Spin, message } from "antd";
import { Cookies } from "react-cookie";
import { Icon } from "@iconify/react";
import classes from "./AIChat.module.scss";

const cookies = new Cookies();

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const extractAiText = (data: any): string => {
    if (!data) return "";
    if (typeof data.reply === "string") return data.reply;
    if (Array.isArray(data.content)) {
      return data.content
        .filter((b: any) => b && b.type === "text")
        .map((b: any) => b.text || "")
        .join("");
    }
    if (typeof data.content === "string") return data.content;
    if (typeof data.message === "string") return data.message;
    return "";
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_AI_BASE_URL as string;
      const model = import.meta.env.VITE_AI_MODEL || "trutran";
      const authToken = cookies.get("accessToken") as string;

      if (!baseUrl || !authToken) {
        throw new Error("AI API credentials not configured");
      }

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + authToken.trim(),
        },
        body: JSON.stringify({
          model: model,
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMsg = `API error: ${response.status}`;

        try {
          if (contentType?.includes("application/json")) {
            const errorData = await response.json();
            errorMsg =
              errorData.error?.message ||
              errorData.message ||
              errorData.errors?.[0]?.msg ||
              errorMsg;
          } else {
            const text = await response.text();
            errorMsg = text.substring(0, 200) || errorMsg;
          }
        } catch {
          // ignore parsing error
        }

        throw new Error(errorMsg);
      }

      const assistantId = (Date.now() + 1).toString();
      const updateAssistant = (content: string) => {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === assistantId);
          if (exists) {
            return prev.map((m) => (m.id === assistantId ? { ...m, content } : m));
          }
          return [...prev, { id: assistantId, role: "assistant", content, timestamp: new Date() }];
        });
      };

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json") || !response.body) {
        const data = await response.json();
        const text = extractAiText(data);
        updateAssistant(text || "No response");
        return;
      }

      // Trường hợp server trả về SSE trực tiếp (phụ cases triển khai)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload);
            if (parsed.type === "error") {
              throw new Error(parsed.error?.message || "AI stream error");
            }
            const delta =
              parsed.type === "content_block_delta" ? parsed.delta?.text : parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              updateAssistant(assistantContent);
            }
          } catch (parseErr) {
            if (parseErr instanceof SyntaxError) continue;
            throw parseErr;
          }
        }
      }

      if (!assistantContent) {
        throw new Error("Empty response from AI");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to get response from AI";
      setError(errorMsg);
      message.error(errorMsg);
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };


  const clearHistory = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <section className={classes.aiChat}>
      <div className={classes.header}>
        <h2 className={classes.title}>
          <Icon icon="solar:robot-bold" width="24" /> AI Assistant
        </h2>
        <Button type="primary" danger onClick={clearHistory} size="small">
          Clear History
        </Button>
      </div>

      <div className={classes.messagesContainer}>
        {messages.length === 0 && !error && (
          <div className={classes.empty}>
            <Icon icon="solar:chat-round-dots-bold" width="48" />
            <p>Start a conversation with AI</p>
            <span>Ask anything about your CRM data</span>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`${classes.message} ${classes[message.role]}`}>
            <div className={classes.messageIcon}>
              <Icon
                icon={message.role === "user" ? "solar:user-bold" : "solar:robot-bold"}
                width="20"
              />
            </div>
            <div className={classes.messageContent}>
              <p>{message.content}</p>
              <span className={classes.timestamp}>
                {message.timestamp.toLocaleTimeString("vi-VN")}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className={`${classes.message} ${classes.assistant}`}>
            <div className={classes.messageIcon}>
              <Icon icon="solar:robot-bold" width="20" />
            </div>
            <div className={classes.messageContent}>
              <Spin size="small" />
            </div>
          </div>
        )}

        {error && (
          <div className={classes.errorMessage}>
            <Icon icon="solar:danger-bold" width="16" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className={classes.inputForm}>
        <Input.TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={(e) => {
            if (e.shiftKey) return;
            e.preventDefault();
            sendMessage(e);
          }}
          placeholder="Type your message... (Shift+Enter for new line)"
          rows={3}
          disabled={loading}
          className={classes.input}
        />
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={!input.trim() || loading}
          className={classes.submitBtn}
        >
          <Icon icon="solar:send-bold" width="16" /> Send
        </Button>
      </form>
    </section>
  );
};

export default AIChat;
