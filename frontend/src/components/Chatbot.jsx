import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareCode, Send, X, Bot, User } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am the AltheiaPulse AI Agent. How can I assist you with rumor verification or NLP metrics today?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const predefinedPrompts = [
    "How does the model work?",
    "Show me a sample tweet",
    "What are the risk levels?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const userText = textToSend || inputText;
    if (!userText.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    if (!textToSend) setInputText('');

    // Generate response
    setTimeout(() => {
      let botResponse = "";
      const textLower = userText.toLowerCase();

      if (textLower.includes('how does the model') || textLower.includes('nlp') || textLower.includes('work')) {
        botResponse = "AltheiaPulse uses standard TF-IDF (Term Frequency-Inverse Document Frequency) text feature extraction and a Logistic Regression classifier trained on actual CrisisNLP and Twitter emergency corpora. It outputs 'Real' or 'Fake' based on lexical distributions, falling back to 'Suspicious' when the probability falls in the middle (35-65%).";
      } else if (textLower.includes('sample') || textLower.includes('tweet') || textLower.includes('example')) {
        botResponse = "Try analyzing this real emergency statement: 'Severe flooding reported in London near the Thames river, rescue teams deployed.' OR this fake rumor: 'ALERT: Nuclear explosion in Paris! Government hiding it from citizens! Evacuate immediately!'";
      } else if (textLower.includes('risk') || textLower.includes('level')) {
        botResponse = "Risk levels are derived automatically from high-impact disaster tokens: High Risk matches severe hazards like earthquakes, explosions, and wildfires. Medium Risk tags meteorological events like floods or cyclones. Low Risk represents general news.";
      } else {
        botResponse = "I can help explain our ML pipeline, provide example texts for the analyzer, or discuss our dashboard database schema. Try asking about 'the model', 'sample tweets', or 'risk levels'!";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#00F0FF] to-[#AD00FF] text-slate-950 shadow-glow-blue hover:scale-105 transition-all duration-200"
        >
          <MessageSquareCode className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] glass-panel rounded-2xl flex flex-col shadow-glow-purple overflow-hidden border border-white/15 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-slate-900 border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#00F0FF] animate-pulse"></div>
              <span className="font-display font-semibold text-sm text-white">AltheiaPulse AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'bot' && (
                  <div className="h-7 w-7 rounded-full bg-[#AD00FF]/15 border border-[#AD00FF]/30 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-[#AD00FF]" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[75%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-white rounded-tr-none'
                      : 'bg-slate-800/80 border border-white/5 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === 'user' && (
                  <div className="h-7 w-7 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-[#00F0FF]" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Predefined Prompts */}
          <div className="px-4 py-2 border-t border-white/5 bg-slate-900/40 flex flex-wrap gap-1.5">
            {predefinedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 px-2 py-1 rounded-full transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-white/10 bg-slate-950/60 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about the NLP classifier..."
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF]"
            />
            <button
              type="submit"
              className="h-8 w-8 flex items-center justify-center rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#AD00FF] hover:opacity-90 text-slate-950 shadow-glow-blue shrink-0 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
