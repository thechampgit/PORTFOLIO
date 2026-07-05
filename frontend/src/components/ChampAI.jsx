import React, { useState, useEffect, useRef } from 'react';
import { queryChampAI } from '../utilities/champAiService';
import { speakText, stopSpeaking, pauseSpeaking, resumeSpeaking } from '../utilities/ttsService';
import useSpeechToText from '../utilities/useSpeechToText';

const SUGGESTED_QUESTIONS = [
  "Tell me about your projects",
  "What are your technical skills?",
  "What internships have you completed?",
  "How can I contact you?",
  "What certifications do you have?"
];

export default function ChampAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playbackState, setPlaybackState] = useState('stopped');
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState(null);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const {
    isListening,
    isSupported,
    error: speechError,
    startListening,
    stopListening
  } = useSpeechToText(setInputText);

  // Initialize with greeting
  useEffect(() => {
    const savedMessages = localStorage.getItem('champ_chat_history');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      resetChat();
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('champ_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);


  const resetChat = () => {
    const initialGreeting = {
      id: 'greeting',
      sender: 'ai',
      text: "Hi! I'm Champa Jha. Welcome to my portfolio! I'm here to chat about my background, projects, and experience. Feel free to ask me anything!",
      timestamp: getFormattedTime()
    };
    setMessages([initialGreeting]);
    localStorage.removeItem('champ_chat_history');
    stopSpeaking();
    setPlaybackState('stopped');
    setCurrentlySpeakingId(null);
  };

  const getFormattedTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    // Prevent overlapping audio by stopping active playback immediately
    stopSpeaking();
    setPlaybackState('stopped');
    setCurrentlySpeakingId(null);

    if (!textToSend) {
      setInputText('');
    }

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: getFormattedTime()
    };
    setMessages(prev => [...prev, userMsg]);

    // Setup abort controller for "Stop Generating"
    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      const response = await queryChampAI(text, messages, abortControllerRef.current.signal);
      
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: getFormattedTime()
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // Handle Auto-Scroll Page Action
      if (response.action) {
        handleScrollAction(response.action);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        const errorMsg = {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: "Sorry, I encountered an error. Please try again.",
          timestamp: getFormattedTime()
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleScrollAction = (action) => {
    setTimeout(() => {
      // Handle project-specific scroll or section scroll
      let targetId = action;
      if (action.startsWith('project-')) {
        targetId = 'projects';
      }
      
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // If a specific project was queried, flash a visual hint or open the modal after a delay
        if (action.startsWith('project-')) {
          const projectId = parseInt(action.split('-')[1]);
          const projectCards = document.querySelectorAll('.project-card');
          projectCards.forEach(card => {
            if (card.innerHTML.toLowerCase().includes(targetId)) {
              card.style.transform = 'scale(1.05)';
              setTimeout(() => card.style.transform = '', 1500);
            }
          });
        }
      }
    }, 600);
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      const abortedMsg = {
        id: `aborted-${Date.now()}`,
        sender: 'ai',
        text: "Generation stopped.",
        timestamp: getFormattedTime()
      };
      setMessages(prev => [...prev, abortedMsg]);
    }
  };

  const toggleListen = () => {
    if (!isSupported) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      setPlaybackState('stopped');
      setCurrentlySpeakingId(null);
      startListening();
    }
  };

  const handleSpeakMessage = async (msgId, text) => {
    if (currentlySpeakingId === msgId) {
      if (playbackState === 'playing') {
        pauseSpeaking();
        setPlaybackState('paused');
      } else if (playbackState === 'paused') {
        resumeSpeaking();
        setPlaybackState('playing');
      }
    } else {
      setCurrentlySpeakingId(msgId);
      setPlaybackState('loading');
      
      await speakText(
        text,
        (state) => {
          setPlaybackState(state);
        },
        () => {
          setPlaybackState('stopped');
          setCurrentlySpeakingId(null);
        },
        (err) => {
          setPlaybackState('stopped');
          setCurrentlySpeakingId(null);
          console.warn("TTS voice synthesis failed or was cancelled:", err.message);
        }
      );
    }
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setPlaybackState('stopped');
    setCurrentlySpeakingId(null);
  };

  // Simple custom parser to render markdown links, list items, and bold text
  const parseMarkdown = (text) => {
    let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1 <i class="fa-solid fa-up-right-from-square" style="font-size:0.7rem"></i></a>');
    html = html.split('\n').map(line => {
      if (line.trim().startsWith('- ')) {
        return `<li class="chat-list-item">${line.trim().substring(2)}</li>`;
      }
      return line;
    }).join('\n');
    html = html.replace(/`([^`]+)`/g, '<code class="chat-code">$1</code>');
    html = html.replace(/\n/g, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button 
          className="champ-chat-trigger" 
          onClick={() => setIsOpen(true)}
          aria-label="Open ChampAI Chat Assistant"
        >
          <div className="trigger-pulse"></div>
          <i className="fa-solid fa-robot"></i>
          <span className="trigger-tooltip">Chat with ChampAI</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className={`champ-chat-window ${isMinimized ? 'minimized' : ''} reveal-chat`}>
          {/* Header */}
          <div className="champ-chat-header">
            <div className="header-info">
              <div className="avatar-status">
                <i className="fa-solid fa-robot header-avatar"></i>
                <span className="status-dot"></span>
              </div>
              <div>
                <h3>ChampAI</h3>
                <span className="sub-status">Digital Twin</span>
              </div>
            </div>
            <div className="header-actions">
              <button 
                onClick={() => setIsMinimized(!isMinimized)} 
                title={isMinimized ? "Maximize" : "Minimize"}
                aria-label="Minimize Chat"
              >
                <i className={`fa-solid ${isMinimized ? 'fa-window-maximize' : 'fa-minus'}`}></i>
              </button>
              <button 
                onClick={resetChat} 
                title="Clear Chat History"
                aria-label="Clear Chat History"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
              <button 
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }} 
                title="Close Chat"
                aria-label="Close Chat"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          {/* Chat Content Body */}
          {!isMinimized && (
            <>
              <div className="champ-chat-body">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-message-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}>
                    {msg.sender === 'ai' && (
                      <i className="fa-solid fa-robot msg-avatar"></i>
                    )}
                    <div className="message-bubble-wrapper">
                      <div className="message-bubble">
                        {msg.sender === 'ai' ? parseMarkdown(msg.text) : msg.text}
                      </div>
                      <div className="message-meta">
                        <span className="message-time">{msg.timestamp}</span>
                        {msg.sender === 'ai' && (
                          <div className="audio-controls-group">
                            {currentlySpeakingId === msg.id && playbackState === 'playing' && (
                              <div className="speaking-indicator" title="AI is speaking">
                                <span className="speaking-bar"></span>
                                <span className="speaking-bar"></span>
                                <span className="speaking-bar"></span>
                                <span className="speaking-bar"></span>
                              </div>
                            )}
                            
                            <button 
                              className={`speak-btn ${currentlySpeakingId === msg.id ? 'active' : ''}`}
                              onClick={() => handleSpeakMessage(msg.id, msg.text)}
                              title={
                                currentlySpeakingId !== msg.id 
                                  ? "Read Aloud" 
                                  : playbackState === 'playing' 
                                    ? "Pause Speech" 
                                    : "Resume Speech"
                              }
                              disabled={currentlySpeakingId === msg.id && playbackState === 'loading'}
                              aria-label={
                                currentlySpeakingId !== msg.id 
                                  ? "Read message aloud" 
                                  : playbackState === 'playing' 
                                    ? "Pause playback" 
                                    : "Resume playback"
                              }
                            >
                              {currentlySpeakingId !== msg.id ? (
                                <i className="fa-solid fa-volume-high"></i>
                              ) : playbackState === 'playing' ? (
                                <i className="fa-solid fa-pause"></i>
                              ) : playbackState === 'loading' ? (
                                <i className="fa-solid fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fa-solid fa-play"></i>
                              )}
                            </button>

                            {currentlySpeakingId === msg.id && (
                              <button 
                                className="speak-btn stop-btn"
                                onClick={handleStopSpeaking}
                                title="Stop Speech"
                                aria-label="Stop playback"
                              >
                                <i className="fa-solid fa-stop"></i>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* AI Typing Loading Indicator */}
                {isLoading && (
                  <div className="chat-message-row ai-row">
                    <i className="fa-solid fa-robot msg-avatar"></i>
                    <div className="message-bubble-wrapper">
                      <div className="message-bubble loading-bubble">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions List */}
              {messages.length === 1 && !isLoading && (
                <div className="suggested-questions-box">
                  <span className="suggested-title">Suggested Questions:</span>
                  <div className="suggestions-scroll">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button 
                        key={idx} 
                        className="suggestion-chip" 
                        onClick={() => handleSend(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stop Generating Button */}
              {isLoading && (
                <div className="stop-generating-container">
                  <button className="stop-generating-btn" onClick={handleStopGenerating}>
                    <i className="fa-solid fa-circle-stop"></i> Stop Generating
                  </button>
                </div>
              )}

              {/* Speech Error Banner */}
              {speechError && (
                <div className="speech-error-banner">
                  <i className="fa-solid fa-triangle-exclamation"></i> {speechError}
                </div>
              )}

              {/* Input Area */}
              <div className="champ-chat-input-area">
                <div className="chat-input-wrapper">
                  <input 
                    type="text" 
                    className="chat-text-input" 
                    placeholder={isListening ? "Listening..." : "Ask ChampAI..."}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isLoading) handleSend();
                    }}
                    disabled={isListening}
                    aria-label="Chat input message"
                  />
                  <button 
                    className={`mic-btn ${isListening ? 'recording-active' : ''}`} 
                    onClick={toggleListen}
                    title={isListening ? "Listening... Click to stop" : "Start Voice Input"}
                    aria-label="Toggle Voice Input"
                    type="button"
                  >
                    <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
                  </button>
                </div>
                
                <button 
                  className="send-btn" 
                  onClick={() => handleSend()}
                  disabled={!inputText.trim() || isLoading || isListening}
                  aria-label="Send Message"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
