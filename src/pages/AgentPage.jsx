import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Loader2, Bot, User, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const isLoading = message.loading;

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="h-4 w-4 text-gold" />
        </div>
      )}
      <div className={`max-w-[80%] ${isUser ? "flex flex-col items-end" : ""}`}>
        <div className={`rounded-xl px-4 py-2.5 text-sm ${
          isUser
            ? "bg-gold/20 border border-gold/30 text-foreground"
            : "bg-card border border-border text-foreground"
        }`}>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span className="text-xs font-mono">Analyzing...</span>
            </div>
          ) : isUser ? (
            <p className="leading-relaxed">{message.content}</p>
          ) : (
            <ReactMarkdown
              className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              components={{
                p: ({ children }) => <p className="my-1 leading-relaxed text-sm">{children}</p>,
                ul: ({ children }) => <ul className="my-1 ml-4 list-disc text-sm">{children}</ul>,
                ol: ({ children }) => <ol className="my-1 ml-4 list-decimal text-sm">{children}</ol>,
                li: ({ children }) => <li className="my-0.5">{children}</li>,
                strong: ({ children }) => <strong className="text-gold font-bold">{children}</strong>,
                code: ({ children }) => <code className="px-1 py-0.5 rounded bg-secondary text-gold text-xs font-mono">{children}</code>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-lg bg-secondary border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

const SUGGESTED = [
  "Which chapters need the most urgent fixes?",
  "What's the current Omega mean across all chapters?",
  "Show me all CRITICAL quarantine flags",
  "Explain the fry-out vectors for Segura",
  "What are the KIA updates from the v2 audit?",
  "Which chapters are at OMEGA ELITE tier?",
];

export default function AgentPage() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initConversation = async () => {
    setLoading(true);
    const conv = await base44.agents.createConversation({
      agent_name: "manuscript_assistant",
      metadata: { name: "LITCENTRAL Session " + new Date().toLocaleDateString() },
    });
    setConversation(conv);

    const unsub = base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages(data.messages.filter(m => m.role !== "system"));
    });

    setLoading(false);
    inputRef.current?.focus();
    return () => unsub();
  };

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || sending || !conversation) return;
    setInput("");
    setSending(true);

    setMessages(prev => [
      ...prev,
      { role: "user", content: msg, id: "tmp-user" },
      { role: "assistant", content: "", loading: true, id: "tmp-ai" },
    ]);

    await base44.agents.addMessage(conversation, { role: "user", content: msg });
    setSending(false);
  };

  const reset = async () => {
    setMessages([]);
    setConversation(null);
    await initConversation();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center">
            <Bot className="h-5 w-5 text-gold" />
          </div>
          <div className="text-[10px] font-mono text-muted-foreground">LITCENTRAL AI INITIALIZING...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50 backdrop-blur flex-shrink-0">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="h-8 w-8 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center">
          <Bot className="h-4 w-4 text-gold" />
        </div>
        <div>
          <div className="text-sm font-bold text-gold">LITCENTRAL AI</div>
          <div className="text-[9px] font-mono text-muted-foreground">Editorial Assistant · SGT George Ramos</div>
        </div>
        <button
          onClick={reset}
          className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-secondary"
          title="New conversation"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div>
              <div className="h-14 w-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-3">
                <Bot className="h-7 w-7 text-gold" />
              </div>
              <div className="text-base font-bold text-foreground">LITCENTRAL AI</div>
              <div className="text-[10px] font-mono text-muted-foreground mt-1">
                Editorial intelligence for the manuscript
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left px-3 py-2.5 rounded-lg border border-border bg-card hover:border-gold/40 hover:bg-gold/5 transition-all text-[10px] font-mono text-foreground/70 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={msg.id || i} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card/50 backdrop-blur flex-shrink-0">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about chapters, characters, audit scores, quarantine flags..."
            rows={1}
            className="flex-1 resize-none bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 font-mono min-h-[40px] max-h-32"
            style={{ height: "auto" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || sending}
            className="h-10 w-10 flex items-center justify-center rounded-lg bg-gold text-background hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
        <div className="text-[8px] font-mono text-muted-foreground text-center mt-1.5">Enter to send · Shift+Enter for new line</div>
      </div>
    </div>
  );
}