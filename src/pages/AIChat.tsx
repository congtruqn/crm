import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Spin, message } from "antd";
import { Cookies } from "react-cookie";
import { Icon } from "@iconify/react";
import classes from "./AIChat.module.scss";

const cookies = new Cookies();

// Giữ đồng bộ với DEFAULT_SYSTEM trong website-cms/routes/messages.js,
// bổ sung quy tắc seourl: chữ thường, không dấu, các từ cách nhau bằng "-".
const SYSTEM_PROMPT =
  "Bạn là trợ lý ảo của hệ thống quản trị website. Trả lời ngắn gọn, lịch sự, bằng ngôn ngữ của người dùng. " +
  "Khi người dùng muốn tạo bài viết: gọi tool list_news_categories để lấy danh mục và mời người dùng chọn một danh mục; " +
  "nếu người dùng không chọn thì bỏ trống parent_id (hệ thống tự dùng danh mục đầu tiên) rồi gọi create_news_content kèm image_keyword (từ khóa tiếng Anh ngắn mô tả nội dung để hệ thống tự tìm ảnh minh họa). Nếu thiếu name hoặc title thì hỏi lại người dùng trước. " +
  "Khi người dùng muốn tạo sản phẩm: gọi tool list_product_categories để lấy danh mục sản phẩm và mời người dùng chọn một danh mục; " +
  "nếu không chọn thì bỏ trống parent_id rồi gọi create_product kèm image_keyword (từ khóa tiếng Anh ngắn mô tả sản phẩm để tự tìm ảnh), price/sale_price (chuỗi số, không có dấu phân cách) nếu người dùng cung cấp. Nếu thiếu name hoặc title thì hỏi lại trước. " +
  'Khi gọi create_news_content hoặc create_product, luôn truyền seourl: chữ thường, không dấu, các từ cách nhau bằng dấu gạch ngang (ví dụ "tin-tuc-cong-nghe"), tuyệt đối không dùng khoảng trắng hay ký tự có dấu.' +
  "\n\n" +
  "--- HƯỚNG DẪN TẠO NỘI DUNG HTML (field `content`) ---\n" +
  "Nội dung trả về cho `content` phải là HTML thuần, bọc trong `<div>`, dùng **inline style** (không dùng class/CSS ngoài). Font chính: 'Source Sans 3', sans-serif; heading dùng 'Merriweather'. Màu chủ đạo thương hiệu: xanh lá #5a9620 / #80c241 (có thể đổi theo yêu cầu). Text màu #2d2d2d / #444 / #555.\n" +
  "Có 2 dạng khung:\n" +
  "• Dạng A — Đầy đủ Header gradient, Mục lục, CTA, Footer (dùng cho bài so sánh, bài PR, landing).\n" +
  '• Dạng B — **Chỉ phần nội dung thuần** (mặc định): bắt đầu bằng 2 đoạn <p> (mở đầu), tiếp theo <hr>, các <h2> có số thứ tự + id="slug-section", <h3>, bảng so sánh, khối callout, FAQ dạng box, kết luận 3 đoạn. KHÔNG có header/TOC/CTA — nội dung đi thẳng vào vấn đề, phù hợp khi chèn vào template CMS đã có khung.\n' +
  'Mặc định dùng **Dạng B** trừ khi người dùng yêu cầu rõ "có banner/CTA/mục lục".\n\n' +
  "### 2 KIỂU BÀI VIẾT\n" +
  "1. **SO SÁNH (A vs B)** — cấu trúc: Tổng quan thị trường → Bảng so sánh trực tiếp (6–9 tiêu chí) → Lý do 1 (sức khỏe/trải nghiệm) → Lý do 2 (môi trường/khí hậu) → Lý do 3 (chi phí dài hạn + bảng vòng đời 10 năm) → Lý do 4 (thị trường/cung cầu) → Khi nào chọn A/B (theo tình huống cụ thể) → FAQ (5–6 câu) → Kết luận (3 đoạn: xu hướng → B thu hẹp phân khúc → khuyên đầu tư đúng chất lượng).\n" +
  '2. **GIẢI THÍCH CHUYÊN SÂU / ĐỊNH NGHĨA ("X là gì?")** — cấu trúc (theo mẫu "Nệm Foam Là Gì?"):\n' +
  "   1. Định nghĩa + lịch sử, h3 phân biệt khái niệm dễ nhầm lẫn\n" +
  "   2. Phân loại 3–4 loại con (mỗi loại 1 h3: đặc điểm, ưu/nhược, cách gọi dân gian) + bảng so sánh nhanh các loại\n" +
  '   3. Cấu tạo/cấu trúc: khối "card" border-left:3px solid màu nhấn cho mỗi lớp + hộp lưu ý kỹ thuật (nền nhạt màu nhấn)\n' +
  "   4. Ưu & nhược điểm: 2 h3 con, mỗi bên 4–5 đoạn <strong>tên:</strong> giải thích\n" +
  "   5. So sánh với các lựa chọn khác trên thị trường: bảng nhiều cột (4+ sản phẩm)\n" +
  "   6. Hướng dẫn chọn: tư thế/mục đích, cân nặng/đặc điểm, môi trường, ngân sách (mỗi mức 1 đoạn <strong>mức giá:</strong> gợi ý)\n" +
  "   7. Bảo quản/sử dụng: 5 đoạn <strong>nguyên tắc:</strong> giải thích ngắn\n" +
  "   8. FAQ (4–5 câu thực dụng: tốt cho X không, an toàn/dị ứng, bao nhiêu đủ, X hay Y)\n" +
  '   9. Kết luận (3 đoạn: khái niệm là "họ" đa dạng → câu hỏi đúng là gì → khoản đầu tư sức khỏe/dài hạn).\n' +
  "Dạng 2 **không cần bảng chi phí vòng đời**.\n\n" +
  "### TONE & FORMAT\n" +
  "- Lịch sự, chuyên gia, dễ hiểu; câu <20 từ, paragraph 3–5 câu; <strong> mở đầu ý chính, <em> nhấn nhẹ.\n" +
  "- h2: có số thứ tự, border-bottom màu nhấn, id slug tiếng Việt không dấu; h3: mệnh đề ngắn + từ khóa, border-left màu nhấn.\n" +
  "- Bảng so sánh: inline style đầy đủ, header nền màu nhấn chữ trắng, zebra stripe.\n" +
  "- FAQ: box header nền nhạt + nội dung nền trắng.\n" +
  "- Callout box: nền nhạt màu nhấn + border-left:4px solid màu nhấn đậm.\n\n" +
  "### NỘI DUNG SẢN PHẨM (create_product)\n" +
  "Áp dụng Dạng 2 nhưng tập trung 1 sản phẩm: Tóm tắt (50–100 chữ) → Bảng thông số kỹ thuật (8–12 hàng) → Lợi ích (4–5 h3) → Đối tượng lý tưởng (4–5) → So sánh tô đậm điểm mạnh → Bảo quản → FAQ sản phẩm → (tùy chọn) CTA.";

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

  const extractAiText = (data: Record<string, unknown>): string => {
    if (!data) return "";
    if (typeof data.reply === "string") return data.reply;
    if (Array.isArray(data.content)) {
      return data.content
        .filter((b): b is { type: string; text?: string } =>
          !!b && typeof b === "object" && b.type === "text"
        )
        .map((b) => b.text || "")
        .join("");
    }
    if (typeof data.content === "string") return data.content;
    if (typeof data.message === "string") return data.message;
    return "";
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

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
          "Accept": "text/event-stream",
        },
        body: JSON.stringify({
          model: model,
          system: SYSTEM_PROMPT,
          max_tokens: 8000,
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          stream: true,
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

      // Handle SSE stream (event: <type>\ndata: <json>\n\n blocks) or JSON response
      if (contentType.includes("text/event-stream") && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let roundText = "";
        // Thông báo tool_call/tool_result được giữ riêng vì mỗi "round" mới sẽ
        // ghi đè roundText (là nội dung text đầy đủ của lượt đó), không phải phần nối thêm.
        const notices: string[] = [];
        let toolCalled = false;

        const render = () => {
          const parts = [roundText, ...notices].filter(Boolean);
          updateAssistant(parts.join("\n\n"));
        };

        const handleEvent = (eventName: string, payload: string) => {
          if (!payload || payload === "[DONE]") return;
          let parsed: Record<string, unknown>;
          try {
            parsed = JSON.parse(payload);
          } catch (parseErr) {
            if (!(parseErr instanceof SyntaxError)) throw parseErr;
            return;
          }

          if (eventName === "error") {
            const msg = (parsed.msg as string) || (parsed.error as Record<string, unknown>)?.message as string || "AI stream error";
            throw new Error(msg);
          } else if (eventName === "round") {
            const text = parsed.text as string;
            if (text) {
              roundText = text;
              render();
            }
          } else if (eventName === "tool_call") {
            toolCalled = true;
            notices.push(`🔧 Đang gọi tool: ${parsed.name as string}...`);
            render();
          } else if (eventName === "tool_result") {
            const resultContent = (parsed.content as string) || "";
            const toolName = parsed.name as string;
            const createLabels: Record<string, string> = {
              create_news_content: "bài viết",
              create_product: "sản phẩm",
            };
            const label = createLabels[toolName];
            if (label) {
              if (!parsed.is_error) {
                message.success(`Đã tạo ${label} thành công!`);
                notices.push(`✅ ${resultContent}`);
              } else {
                message.error(`Tạo ${label} thất bại: ${resultContent}`);
                notices.push(`❌ ${resultContent}`);
              }
              render();
            }
          } else if (eventName === "done") {
            const finalText = extractAiText(parsed);
            if (finalText) {
              roundText = finalText;
              render();
            }
          }
        };

        const processBuffer = () => {
          const blocks = buffer.split("\n\n");
          buffer = blocks.pop() || "";
          for (const block of blocks) {
            let eventName = "";
            const dataLines: string[] = [];
            for (const rawLine of block.split("\n")) {
              const line = rawLine.trim();
              if (!line) continue;
              if (line.startsWith("event:")) eventName = line.slice(6).trim();
              else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
            }
            if (dataLines.length) handleEvent(eventName, dataLines.join("\n"));
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          processBuffer();
        }

        // Flush phần còn lại nếu stream không kết thúc bằng dòng trống
        if (buffer.trim()) {
          buffer += "\n\n";
          processBuffer();
        }

        if (!roundText && !toolCalled) {
          throw new Error("Empty response from AI");
        }
      } else {
        // Fallback: JSON response
        const data = await response.json();
        const text = extractAiText(data);
        updateAssistant(text || "No response");
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
          <div className={`${classes.message} ${classes.assistant} ${classes.typing}`}>
            <div className={classes.messageIcon}>
              <Icon icon="solar:robot-bold" width="20" />
            </div>
            <div className={classes.messageContent}>
              <div className={classes.typingContent}>
                <Spin size="small" className={classes.spin} />
                <span>AI đang trả lời…</span>
              </div>
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
            if (loading) return;
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
