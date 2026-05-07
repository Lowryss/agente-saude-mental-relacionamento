"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Heart,
  User,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Settings,
  Camera,
} from "lucide-react";
import ChatContextModal, { ChatContext } from "../components/ChatContextModal";

const DEFAULT_CONTEXT: ChatContext = {
  userName: "",
  partnerName: "",
  relationshipType: "",
  situation: "",
  desiredOutcome: "",
  feelings: "",
  photos: [],
};

export default function ChatPage() {
  // State Management
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Olá. Eu sou seu Mentor de Relacionamentos. Estou aqui para ouvir você e ajudar a navegar pelos desafios do seu coração. O que está acontecendo hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [context, setContext] = useState<ChatContext>(DEFAULT_CONTEXT);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);

  // Hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load credits from API
  const loadCredits = async (id: string) => {
    try {
      setIsLoadingCredits(true);
      const response = await fetch(`/api/credits/check?userId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits || 0);
      }
    } catch (error) {
      console.error("Error loading credits:", error);
    } finally {
      setIsLoadingCredits(false);
    }
  };

  // Handle Stripe payment success
  useEffect(() => {
    const paymentSuccess = searchParams.get("payment");
    if (paymentSuccess === "success") {
      // Payment was successful, reload credits
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        loadCredits(storedUserId);
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  // Initialize user, credits and context
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      loadCredits(storedUserId);
    } else {
      setIsLoadingCredits(false);
    }

    // Load saved context
    const savedContext = localStorage.getItem("chatContext");
    if (savedContext) {
      try {
        setContext(JSON.parse(savedContext));
      } catch (e) {
        console.error("Error loading context:", e);
      }
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Handle buying credits
  const handleBuyCredits = () => {
    router.push("/");
  };

  // Handle saving context
  const handleSaveContext = (newContext: ChatContext) => {
    setContext(newContext);
    localStorage.setItem("chatContext", JSON.stringify(newContext));
  };

  // Check if context has any data
  const hasContext = context.userName || context.partnerName || context.situation;

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim()) return;

    // Check if user has userId
    if (!userId) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Para usar o chat, você precisa comprar créditos primeiro. Por favor, volte à página inicial e faça uma compra.",
        },
      ]);
      return;
    }

    // Check if user has credits
    if (credits <= 0) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Você não tem créditos disponíveis. Por favor, compre mais créditos para continuar.",
        },
      ]);
      return;
    }

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      // Deduct credits first
      const deductResponse = await fetch("/api/credits/deduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount: 1,
        }),
      });

      if (deductResponse.status === 402) {
        // Insufficient credits
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Créditos insuficientes. Por favor, compre mais créditos para continuar.",
          },
        ]);
        setIsTyping(false);
        return;
      }

      if (!deductResponse.ok) {
        throw new Error("Falha ao descontar créditos");
      }

      const deductData = await deductResponse.json();
      setCredits(deductData.remainingCredits || 0);

      // Call chat API with context
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: hasContext ? context : undefined,
        }),
      });

      if (!chatResponse.ok) throw new Error("Falha na comunicação");

      const data = await chatResponse.json();
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sinto muito, tive um pequeno problema técnico. Poderia repetir o que aconteceu?",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 md:p-6 space-y-4">
      {/* Header do Chat */}
      <header className="flex items-center justify-between p-4 glass-card rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-playfair font-bold text-lg text-slate-800 leading-tight">
              Mentor de Relacionamentos
            </h1>
            <div className="flex items-center text-xs text-sage-500 font-medium">
              <span className="w-2 h-2 bg-sage-400 rounded-full mr-1.5 animate-pulse"></span>
              Online e pronto para ouvir
            </div>
          </div>
        </div>

        {/* Credits Display or Buy Button */}
        <div className="flex items-center space-x-2">
          {/* Context indicator */}
          {hasContext && (
            <button
              onClick={() => setIsContextModalOpen(true)}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Contexto ativo
              {context.photos.length > 0 && (
                <span className="flex items-center gap-0.5">
                  <Camera className="w-3 h-3" />
                  {context.photos.length}
                </span>
              )}
            </button>
          )}

          {userId ? (
            <div className="flex flex-col items-end">
              <div className="text-sm font-bold text-slate-800">
                {isLoadingCredits ? "..." : credits}
              </div>
              <div className="text-xs text-slate-500">Créditos</div>
            </div>
          ) : (
            <button
              onClick={handleBuyCredits}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors"
            >
              Comprar Créditos
            </button>
          )}

          {/* Settings button */}
          <button
            onClick={() => setIsContextModalOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Configurar contexto"
          >
            <Settings className="w-5 h-5 text-slate-500" />
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-slate-400 ml-2 pl-2 border-l border-slate-200">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-medium">Privado & Seguro</span>
          </div>
        </div>
      </header>

      {/* Alert when credits are 0 */}
      {credits === 0 && userId && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">
                Você está sem créditos
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Compre mais créditos para continuar conversando com seu mentor.
              </p>
            </div>
            <button
              onClick={handleBuyCredits}
              className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap"
            >
              Comprar Agora
            </button>
          </div>
        </motion.div>
      )}

      {/* Área de Mensagens */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar min-h-[400px]"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
            >
              <div className="flex items-start max-w-[85%] space-x-2">
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center mt-1 flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-sage-500" />
                  </div>
                )}
                <div
                  className={
                    msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                  }
                >
                  <p className="text-sm md:text-base leading-relaxed">
                    {msg.content}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center mt-1 flex-shrink-0">
                    <User className="w-4 h-4 text-brand-500" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              <div className="chat-bubble-ai flex items-center space-x-1 py-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input de Mensagem */}
      <footer className="relative pt-2">
        <div className="glass-card rounded-2xl p-2 flex items-center shadow-2xl transition-all focus-within:ring-2 focus-within:ring-brand-200">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Desabafe ou peça um conselho..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-4 text-slate-700 placeholder:text-slate-400 text-sm md:text-base outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`premium-button ml-2 p-3 rounded-xl flex items-center justify-center transition-all ${
              input.trim() && !isTyping
                ? "bg-brand-500 text-white shadow-md"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-3 uppercase tracking-widest font-semibold">
          Sua conversa é confidencial e segura •{" "}
          {isLoadingCredits ? "..." : `${credits} créditos`}
        </p>
      </footer>

      {/* Sugestões Rápidas - Only show when messages.length <= 1 */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", overflowX: "auto", gap: "0.5rem", paddingBottom: "0.5rem" }}
        >
          {[
            "Como iniciar uma conversa difícil?",
            "Sinto que estamos nos distanciando...",
            "Como perdoar uma mágoa?",
            "Dicas de comunicação não-violenta",
          ].map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setInput(suggestion)}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-white/40 border border-white/60 text-xs font-medium text-slate-600 hover:bg-white/60 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      )}

      {/* Context Modal */}
      <ChatContextModal
        isOpen={isContextModalOpen}
        onClose={() => setIsContextModalOpen(false)}
        context={context}
        onSave={handleSaveContext}
      />
    </div>
  );
}
