import React, { useState } from "react";
import MainLayout from "../components/MainLayout";
import { dashboardAPI } from "../api/dashboardAPI";

export default function AIAssistant() {
    const [messages, setMessages] = useState([
        { id: 1, sender: "ai", text: "Hello! I'm your AI logistics assistant. How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        const userMsg = { id: messages.length + 1, sender: "user", text: input };
        setMessages([...messages, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Call backend AI API
            const response = await dashboardAPI.sendChatMessage(input);
            const aiMsg = { id: messages.length + 2, sender: "ai", text: response.reply || "I couldn't process that request." };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
            const errorMsg = { id: messages.length + 2, sender: "ai", text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-6">AI Assistant</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-96">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-sm px-4 py-2 rounded-lg ${
                                    msg.sender === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-900"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-4">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask me anything..."
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
