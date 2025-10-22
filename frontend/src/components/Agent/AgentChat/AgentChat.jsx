// AgentChat.jsx
import React, { useState, useEffect, useRef } from "react";
import "./AgentChat.css";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import apiClient from "@/services/api/apiClient";
import { ENDPOINTS } from "@/services/api/endpoints";

const AgentChat = ({ caseId, analysisData }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef(null);
  const initializedRef = useRef(false); // ✅ Prevents duplicate intros

  // ✅ Auto-scroll when new messages appear
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // ✅ Run intro sequence only once
  useEffect(() => {
    if (analysisData && !initializedRef.current) {
      initializedRef.current = true; // Prevent re-runs
      setMessages([]); // Optional: clear existing messages
      sendSequentialIntro();
    }
  }, [analysisData]);

  // 🧠 Sequential intro messages (like a real chat)
  const sendSequentialIntro = async () => {
    const {
      caseSummary,
      combinedKeyPoints = [],
      contradictions = [],
      timelineCriticalDates = [],
      recommendedActions = [],
      credibilityScore,
      entitiesInvolved = [],
    } = analysisData;

    // 👋 1. Greeting
    await addMessageWithDelay({
      sender: "agent",
      text: `👋 **Hey! I'm your AI Legal Agent.**\n\nI've already analyzed your case documents — here's a quick overview:`,
    }, 300);

    // 📊 2. Quick Case Stats
    const stats = [
      `📄 **Documents Analyzed:** ${combinedKeyPoints.length > 0 ? "3 documents" : "Multiple documents"}`,
      `🎯 **Key Findings:** ${combinedKeyPoints.length} points`,
      contradictions.length > 0 ? `⚠️ **Contradictions:** ${contradictions.length}` : null,
      credibilityScore ? `✅ **Case Strength:** ${credibilityScore}% credibility` : null,
      entitiesInvolved.length > 0 ? `👥 **Entities Involved:** ${entitiesInvolved.length}` : null,
    ].filter(Boolean).join("\n");

    await addMessageWithDelay({
      sender: "agent",
      text: `📊 **CASE SNAPSHOT:**\n\n${stats}`,
    }, 600);

    // 🧾 3. Case Summary
    if (caseSummary?.trim()) {
      await addMessageWithDelay({
        sender: "agent",
        text: `🧾 **CASE SUMMARY:**\n${caseSummary.trim()}`,
      }, 900);
    }

    // 🚨 4. Urgent Hearing
    const nextHearing = timelineCriticalDates.find(
      (d) => d.date && d.date.trim() && !["N/A", "—"].includes(d.date)
    );
    if (nextHearing) {
      const daysUntil = calculateDaysUntil(nextHearing.date);
      const isUrgent = daysUntil && daysUntil <= 14;
      if (isUrgent) {
        await addMessageWithDelay({
          sender: "agent",
          text: `🚨 **URGENT ALERT!**\nYour next court hearing is on **${nextHearing.date}** — only **${daysUntil} days left!** ⏰`,
          isUrgent: true,
        }, 1200);
      } else if (daysUntil) {
        await addMessageWithDelay({
          sender: "agent",
          text: `📅 **Next Hearing:** ${nextHearing.date} (${daysUntil} days away)`,
        }, 1200);
      }
    }

    // 🎯 5. Key Findings
    if (combinedKeyPoints.length > 0) {
      const top3 = combinedKeyPoints.slice(0, 3).map((p, i) => `${i + 1}. ${p}`).join("\n");
      await addMessageWithDelay({
        sender: "agent",
        text: `🎯 **TOP FINDINGS:**\n\n${top3}${combinedKeyPoints.length > 3 ? `\n\n_+${combinedKeyPoints.length - 3} more findings..._` : ""}`,
      }, 1500);
    }

    // ⚠️ 6. Contradictions
    if (contradictions.length > 0) {
      const summary = contradictions
        .slice(0, 2)
        .map((c, i) =>
          typeof c === "string"
            ? `• ${c}`
            : `${c.severity === "HIGH" ? "🔴" : "🟡"} ${c.conflictDescription}`
        )
        .join("\n\n");

      await addMessageWithDelay({
        sender: "agent",
        text: `⚠️ **CRITICAL ISSUES DETECTED:**\n\n${summary}${contradictions.length > 2 ? `\n\n_${contradictions.length - 2} more issues..._` : ""}`,
      }, 1800);
    }

    // 💡 7. Recommendations
    if (recommendedActions.length > 0) {
      const recs = recommendedActions.slice(0, 3).map((r, i) => `${i + 1}. ${r}`).join("\n");
      await addMessageWithDelay({
        sender: "agent",
        text: `💡 **RECOMMENDATIONS:**\n\n${recs}\n\nI can help execute these immediately!`,
      }, 2100);
    }

    // 🎬 8. Final CTA
    await addMessageWithDelay({
      sender: "agent",
      text: `🤔 **How would you like to proceed?**\n\nChoose one of the actions below:`,
      actions: generateSmartActions(analysisData),
    }, 2400);
  };

  // 🧮 Helper: Calculate days until a given date
  const calculateDaysUntil = (dateStr) => {
    try {
      const target = new Date(dateStr);
      const today = new Date();
      const diff = target - today;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? days : null;
    } catch {
      return null;
    }
  };

  // 🕐 Add message with typing simulation delay
  const addMessageWithDelay = (message, delay = 500) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: Date.now() + Math.random(), ...message }]);
          setIsTyping(false);
          resolve();
        }, 400); // simulate typing time
      }, delay);
    });
  };

  // ⚙️ Smart action buttons based on case data
  const generateSmartActions = (data) => {
    const actions = [];
    const hasContradictions = data.contradictions?.length > 0;
    const hasDeadline = data.timelineCriticalDates?.some(d => d.date && d.date.trim());

    if (hasDeadline) {
      actions.push({
        label: "📝 Draft Hearing Brief NOW",
        action: "draft_brief",
        variant: "primary",
      });
    }
    if (hasContradictions) {
      actions.push({
        label: "❓ Explain These Contradictions",
        action: "explain_contradictions",
        variant: "warning",
      });
    }
    actions.push({
      label: "📋 Generate Cross-Exam Questions",
      action: "generate_questions",
    });
    if (!hasDeadline && !hasContradictions) {
      actions.push({
        label: "🎯 What Should I Focus On?",
        action: "get_priorities",
      });
    }
    actions.push({
      label: "💬 I Have Specific Questions",
      action: "open_chat",
      variant: "secondary",
    });

    return actions;
  };

  // 💬 Handle AI action button click
  const handleActionClick = async (actionType) => {
    const actionMessages = {
      draft_brief: "Please draft a comprehensive hearing brief with all key evidence.",
      explain_contradictions: "Explain each contradiction and how to counter it.",
      generate_questions: "Generate strong cross-exam questions based on case weaknesses.",
      get_priorities: "Tell me my top priorities to strengthen this case.",
      open_chat: "I'd like to discuss specific details.",
    };
    const message = actionMessages[actionType] || actionType;
    handleSend(message);
  };

  // 📤 Send message to AI backend
  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await apiClient.post(ENDPOINTS.AGENT.ASK, { caseId, message: text });
      const aiText = res.data.answer || "⚠️ I couldn’t retrieve a proper response.";

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "agent", text: aiText },
        ]);
        setIsTyping(false);
      }, 600);
    } catch (err) {
      console.error("🔥 Agent chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "agent",
          text: "⚠️ Error connecting to AI. Please try again later.",
        },
      ]);
      setIsTyping(false);
    }
  };

  if (!caseId) {
    return (
      <div className="agent-chat">
        <div className="chat-window no-case">
          <div>
            <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🤖</p>
            <p>⚠️ No case selected.</p>
            <p className="hint">Please open this chat from the Analysis Page.</p>
          </div>
        </div>
      </div>
    );
  }

  // 💬 Render full chat
  return (
    <div className="agent-chat">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            sender={msg.sender}
            text={msg.text}
            actions={msg.actions}
            isUrgent={msg.isUrgent}
            onActionClick={handleActionClick}
          />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
};

export default AgentChat;
