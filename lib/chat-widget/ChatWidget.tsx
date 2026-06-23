import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { PlusCircleIcon } from "@heroicons/react/16/solid";

export interface ChatAgent {
  id: string;
  name: string;
  title: string;
  description: string;
  expertise: string[];
  avatar?: string;
  color?: string;
  backendName?: string;
  status?: string;
}

export interface ChatConfig {
  apiBaseUrl?: string;
  title?: string;
  buttonText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  agents?: ChatAgent[];
  welcomeMessage?: string;
  basePath?: string;
}

interface Message {
  sender: "user" | "bot";
  text: string;
  color?: string;
  avatar?: string;
  time: string;
}

interface PrivateChat {
  messages: Message[];
  sessionId: string;
  isOpen: boolean;
  loading: boolean;
  textProcessing?: string;
}

interface ChatWidgetProps {
  config: ChatConfig;
}

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239CA3AF'%3E%3Cpath fill-rule='evenodd' d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a2.25 2.25 0 00-2.144-1.578H9.432a2.25 2.25 0 00-2.144 1.578 7.487 7.487 0 004.712 1.688 7.487 7.487 0 004.712-1.688z' clip-rule='evenodd' /%3E%3C/svg%3E";

export const ChatWidget: React.FC<ChatWidgetProps> = ({ config }) => {
  const basePath = config.basePath !== undefined ? config.basePath : "/scraper";
  const apiBaseUrl = config.apiBaseUrl || "https://sensei-agents.australiaeast.cloudapp.azure.com/agilent";
  const chatTitle = config.title || "Agilent AI Assistant";
  const buttonText = config.buttonText || "Message Us";
  const logoUrl = config.logoUrl || `${basePath}/logo.png`;

  const resolveAssetUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
    if (typeof window !== "undefined") {
      return `${window.location.origin}${url}`;
    }
    return url;
  };

  const defaultAgents: ChatAgent[] = [
    {
      id: 'SupportSpecialist',
      name: 'Angela',
      title: 'Support Specialist',
      description: 'Angela is our experienced Support Specialist who excels at troubleshooting technical issues and providing maintenance guidance. With extensive knowledge of Agilent instruments and software, she can help resolve operational challenges, optimize system performance, and ensure your equipment runs at peak efficiency.',
      expertise: ['Technical Troubleshooting', 'System Maintenance', 'Performance Optimization', 'Software Support'],
      color: "#22C55E",
      avatar: `${basePath}/assets/chat-agents/angela.png`,
      backendName: "support_specialist"
    },
    {
      id: 'SalesQualifier',
      name: 'Sarah',
      title: 'Sales Specialist',
      description: 'Sarah is our knowledgeable Sales Specialist who understands both your business needs and our product portfolio. She can help you explore pricing options, discuss financing solutions, and guide you through the purchasing process. Sarah ensures you get the right solution at the best value for your organization.',
      expertise: ['Pricing & Quotes', 'Financing Options', 'Order Processing', 'Business Solutions'],
      color: "#3B82F6",
      avatar: `${basePath}/assets/chat-agents/sarah.png`,
      backendName: "sales_qualifier"
    },
    {
      id: 'SpeakToHuman',
      name: 'Adam',
      title: 'Customer Service Representative',
      description: 'Adam is our Customer Service Representative who serves as your direct connection to our human support team. When our AI agents need to escalate your inquiry, Adam will collect your details and arrange for a personalized consultation with one of our expert team members.',
      expertise: ['Escalation Management', 'Human Support Coordination', 'Follow-up Scheduling', 'Customer Care'],
      color: "#00BEAC",
      avatar: `${basePath}/assets/chat-agents/adam.png`,
      backendName: "speak_to_human"
    },
    {
      id: 'CorporateLibrarian',
      name: 'Luke',
      title: 'Agilent AI Assistant',
      description: 'I am Luke, your Agilent AI Assistant. I handle general inquiries about Agilent, coordinate with our specialized team agents, and ensure you get the most relevant and helpful information. I can answer questions about our company, products, and services, and connect you with the right specialist when needed.',
      expertise: ['General Inquiries', 'Team Coordination', 'Company Information', 'Service Navigation'],
      color: "#6B7280",
      avatar: `${basePath}/assets/chat-agents/luke.png`,
      backendName: "corporate_librarian",
      status: "involved"
    }
  ];

  const [teamAgents, setTeamAgents] = useState<ChatAgent[]>(config.agents || defaultAgents);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processMessages, setProcessMessages] = useState<"done" | "processing">("done");
  const [textProcessing, setTextProcessing] = useState("");
  const [sessionId, setSessionId] = useState(`id${Date.now()}`);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionTitle, setSuggestionTitle] = useState('');
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [showTeamTab, setShowTeamTab] = useState(false);
  const [showAgentDetails, setShowAgentDetails] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<ChatAgent | null>(null);
  const [activeTab, setActiveTab] = useState<'group' | 'private'>('group');
  const [privateChats, setPrivateChats] = useState<Record<string, PrivateChat>>({});
  const [openPrivateChats, setOpenPrivateChats] = useState<string[]>([]);
  
  const abortFuncs = useRef<AbortController[]>([]);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const loadingTexts = [
    "Thinking...",
    "Searching...",
    "Looking at your request...",
    "Analyzing...",
    "Processing...",
    "Gathering information...",
    "Checking our knowledge base...",
    "Preparing your response..."
  ];

  const suggestionCommands = ['agent', 'product'];

  const agentsList = teamAgents.map(a => `${a.name} ${a.title}`);

  const productsList = [
    'G1176-60001',
    '240FS AA',
    '7697A Headspace Sampler',
    '5973 Series GC/MSD',
    '5975 Series GC/MSD',
    '5977 Series GC/MSD',
    '7000 Series Triple Quadrupole GC/MS',
    '7010 Series Triple Quadrupole GC/MS',
    'JetClean Self-Cleaning Ion Source'
  ];

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTo({
        top: boxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, textProcessing]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
      }, 2000);
    } else {
      setLoadingTextIndex(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loading, loadingTexts.length]);

  const getAgentInfo = useCallback((agentName: string) => {
    const agent = teamAgents.find(
      a => a.id === agentName || a.name === agentName || a.backendName === agentName
    );
    if (agent) {
      return {
        avatar: agent.avatar || `${basePath}/assets/chat-agents/${agent.id.toLowerCase()}.png`,
        color: agent.color || '#6B7280'
      };
    }
    return {
      avatar: logoUrl,
      color: "#6B7280"
    };
  }, [teamAgents, logoUrl, basePath]);

  // Fetch active agents dynamically from backend API
  useEffect(() => {
    const fetchActiveAgents = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/chat/active-agents`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mappedAgents: ChatAgent[] = data.map((a: any) => ({
            id: a.agent_name,
            name: a.name,
            title: a.job,
            description: a.job,
            expertise: [a.job],
            avatar: a.profile_photo,
            color: a.chat_box_border_color,
            backendName: a.agent_name,
            status: a.default_responder ? "involved" : undefined
          }));
          setTeamAgents(mappedAgents);
        }
      } catch (error) {
        console.error("Error fetching active agents:", error);
      }
    };

    if (apiBaseUrl) {
      fetchActiveAgents();
    }
  }, [apiBaseUrl]);

  // Welcome message loading
  useEffect(() => {
    if (isChatBoxVisible && !hasInitialized && teamAgents.length > 0) {
      const hostAgent = teamAgents.find(a => a.status === "involved") || teamAgents.find(a => a.id === "CorporateLibrarian") || teamAgents[teamAgents.length - 1] || teamAgents[0];
      const welcomeAgent = getAgentInfo(hostAgent.id);
      let welcomeText = config.welcomeMessage;
      
      if (!welcomeText) {
        const agentIntroList = teamAgents
          .filter(a => a.id !== hostAgent.id)
          .map(a => `<li><strong>${a.name}</strong> our ${a.title}</li>`)
          .join('\n');
        
        welcomeText = `<div>
          <p>Hello. My name is ${hostAgent.name} and I am your ${chatTitle}.</p>
          <p>Let me introduce you to our team agents.</p>
          <ul class="list-disc list-inside mt-2 space-y-1">
            ${agentIntroList}
            <li>And <strong>I</strong> will handle your general inquiries.</li>
          </ul>
          <p>Who would you like to speak with today?</p>
        </div>`;
      }

      const welcomeMessage: Message = {
        sender: "bot",
        color: welcomeAgent.color,
        avatar: welcomeAgent.avatar,
        text: welcomeText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([welcomeMessage]);
      setHasInitialized(true);
    }
  }, [isChatBoxVisible, hasInitialized, teamAgents, chatTitle, getAgentInfo, config.welcomeMessage]);

  useEffect(() => {
    setSelectedAgent((prev)=> {
      if(!prev) return null;
      return teamAgents.find(a => a.id === prev.id) || null;
    });
  }, [teamAgents]);

  const getBackendAgentName = (frontendAgentId: string) => {
    const agent = teamAgents.find(a => a.id === frontendAgentId);
    return agent?.backendName || frontendAgentId;
  };

  const updateAgentStatus = useCallback((activeAgentId: string) => {
    setTeamAgents(prev =>
      prev.map(agent => {
        if(agent.id === activeAgentId){
          return {...agent, status: "involved"};
        }
        return {...agent, status: ""};
      })
    );
  }, []);

  const handleSend = async () => {
    if (input.trim() === "") return;
    const abortController = new AbortController();
    abortFuncs.current.unshift(abortController);
    
    const userMessage: Message = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);
    setProcessMessages("processing");

    let resultText = "";
    let urls: string[] = [];
    let accumulatedChunk = "";
    let agentName = "";

    try {
      const response = await fetch(
        `${apiBaseUrl}/chat/group`,
        {
          method: "POST",
          body: JSON.stringify({
            message: input,
            session_id: sessionId
          }),
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
          },
          signal: abortController.signal,
        }
      );

      const contentType = response.headers.get("content-type");
      const isStreaming = contentType && contentType.includes("text/event-stream");

      if (isStreaming) {
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No readable stream reader available");
        
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedChunk += chunk;

          const objects = accumulatedChunk.split("\n");
          accumulatedChunk = objects.pop() || "";

          objects.forEach((obj) => {
            if (obj.trim()) {
              try {
                const result = JSON.parse(obj);

                if (result?.choices?.[0]?.messages?.[0]) {
                  const msg = result.choices[0].messages[0];

                  if (msg.role === "tool") {
                    try {
                      const toolContent = JSON.parse(msg.content);
                      if (toolContent.citations) {
                        toolContent.citations.forEach((citation: any) => {
                          if (citation.url) {
                            urls.push(citation.url);
                          }
                        });
                      }
                    } catch (e) {
                      if (!(e instanceof SyntaxError)) {
                        throw e;
                      }
                    }
                  } else if (msg.role === "assistant") {
                    let content = msg.content;
                    content = content.replace(/\[doc(\d+)\]/g, (match: string, p1: string) => {
                      const index = parseInt(p1, 10) - 1;
                      return urls[index]
                        ? `<a style="color:#1F4F82" href="${urls[index]}" target="_blank">[Ref${p1}]</a>`
                        : match;
                    });
                    resultText += content;
                  }
                  if (obj.length > 0) {
                    setTextProcessing(resultText);
                  }
                }
              } catch (e) {
                console.error("Parsing error: ", e);
                if (!(e instanceof SyntaxError)) {
                  throw e;
                }
              }
            }
          });
        }
      } else {
        const result = await response.json();
        
        if (result.reply) {
          resultText = result.reply;
          agentName = result.responding_agent;
          setTextProcessing(resultText);
        } else if (result.choices?.[0]?.messages) {
          const msg = result.choices[0].messages[0];
          if (msg.role === "assistant") {
            resultText = msg.content;
            setTextProcessing(resultText);
          }
        } else {
          throw new Error("Unexpected response format");
        }
      }
    } catch (e: any) {
      console.error("Request error: ", e);
      
      if (e.name !== 'AbortError') {
        const errorMessage =
          "Sorry, an error occurred. Please try again. If the problem persists, please contact the site administrator.";
        const errorChatMsg: Message = {
          sender: "bot",
          text: errorMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, errorChatMsg]);
      }
    } finally {
      setLoading(false);
      if (resultText !== "") {
        updateAgentStatus(agentName);
        const agentInfo = getAgentInfo(agentName);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: resultText,
            avatar: agentInfo.avatar,
            color: agentInfo.color,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
      setProcessMessages("done");
      setTextProcessing("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    const atIndex = value.lastIndexOf('@');
    if (atIndex === -1) {
      setShowSuggestions(false);
      setSuggestions([]);
    } else {
      const textAfterAt = value.substring(atIndex + 1);
      const parts = textAfterAt.split(' ');
      const command = parts[0].toLowerCase();

      if (parts.length === 1) {
        const filteredCommands = suggestionCommands.filter(c => c.startsWith(command));
        setSuggestions(filteredCommands);
        setShowSuggestions(filteredCommands.length > 0);
        setSuggestionTitle('Select a category');
      } else if (parts.length > 1) {
        const query = parts.slice(1).join(' ').toLowerCase();
        let sourceList: string[] = [];
        if (command === 'agent') {
          sourceList = agentsList;
          setSuggestionTitle('Select an agent');
        } else if (command === 'product') {
          sourceList = productsList;
          setSuggestionTitle('Select a product');
        }

        const filteredItems = sourceList.filter(item => item.toLowerCase().includes(query));
        setSuggestions(filteredItems);
        setShowSuggestions(filteredItems.length > 0);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const atIndex = input.lastIndexOf('@');
    if (atIndex === -1) return;

    const textBeforeAt = input.substring(0, atIndex);
    const command = input.substring(atIndex + 1).split(' ')[0];

    const newValue = suggestionCommands.includes(suggestion)
      ? `${textBeforeAt}@${suggestion} `
      : `${textBeforeAt}@${command} ${suggestion} `;

    setInput(newValue);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleTeamButtonClick = () => {
    setShowTeamTab(!showTeamTab);
    if (showAgentDetails) {
      setShowAgentDetails(false);
      setSelectedAgent(null);
    }
  };

  const handleAgentClick = (agent: ChatAgent) => {
    setSelectedAgent(agent);
    setShowAgentDetails(true);
  };

  const handleCloseAgentDetails = () => {
    setShowAgentDetails(false);
    setSelectedAgent(null);
  };

  const handleStopResponse = () => {
    abortFuncs.current.forEach(abortController => {
      abortController.abort();
    });
    abortFuncs.current = [];
    
    const skippedMessage: Message = {
      sender: "bot",
      text: "Skipped",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages(prev => [...prev, skippedMessage]);
    
    setLoading(false);
    setProcessMessages("done");
    setTextProcessing("");
  };

  const handleNewChat = () => {
    setMessages([]);
    setHasInitialized(false);
    const newSessionId = `id${Date.now()}`;
    setSessionId(newSessionId);
    updateAgentStatus("CorporateLibrarian");
  };

  const toggleChatBox = () => {
    setIsChatBoxVisible(!isChatBoxVisible);
  };

  const handleCloseChatBox = () => {
    setIsChatBoxVisible(false);
    setShowTeamTab(false);
    setShowAgentDetails(false);
  };

  const startPrivateChat = (agentId: string) => {
    const agent = teamAgents.find(a => a.id === agentId);
    if (!agent) return;

    const session = `private_${agentId}_${Date.now()}`;
    const agentInfo = getAgentInfo(agentId);
    const initialMessage: Message = {
      sender: "bot",
      text: `Hello! I'm ${agent.name}, your ${agent.title}. How can I help you today?`,
      avatar: agentInfo.avatar,
      color: agentInfo.color,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setPrivateChats(prev => ({
      ...prev,
      [agentId]: {
        messages: [initialMessage],
        sessionId: session,
        isOpen: true,
        loading: false,
        textProcessing: ""
      }
    }));

    setOpenPrivateChats(prev => [...prev, agentId]);
  };

  const closePrivateChat = (agentId: string) => {
    setPrivateChats(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        isOpen: false
      }
    }));
    setOpenPrivateChats(prev => prev.filter(id => id !== agentId));
  };

  const sendPrivateMessage = async (agentId: string, messageText: string) => {
    const privateChat = privateChats[agentId];
    if (!privateChat) {
      console.error('Private chat not found for agent:', agentId);
      return;
    }

    if (!messageText || !messageText.trim()) {
      return;
    }

    const userMessage: Message = {
      sender: "user",
      text: messageText.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setPrivateChats(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        messages: [...prev[agentId].messages, userMessage],
        loading: true,
        textProcessing: ""
      }
    }));

    try {
      const backendAgentName = getBackendAgentName(agentId);
      
      const response = await fetch(
        `${apiBaseUrl}/chat/private`,
        {
          method: "POST",
          body: JSON.stringify({
            message: messageText.trim(),
            session_id: privateChat.sessionId,
            agent_name: backendAgentName,
            chat_mode: "private"
          }),
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.reply) {
        const agentInfo = getAgentInfo(agentId);
        const botMessage: Message = {
          sender: "bot",
          text: result.reply,
          avatar: agentInfo.avatar,
          color: agentInfo.color,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setPrivateChats(prev => ({
          ...prev,
          [agentId]: {
            ...prev[agentId],
            messages: [...prev[agentId].messages, botMessage],
            loading: false
          }
        }));
      } else {
        throw new Error('No reply received from server');
      }
    } catch (error: any) {
      console.error("Private chat error:", error);
      const agentInfo = getAgentInfo(agentId);
      const errorMessage: Message = {
        sender: "bot",
        text: `Sorry, I'm having trouble connecting. Error: ${error.message}`,
        avatar: agentInfo.avatar,
        color: agentInfo.color,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setPrivateChats(prev => ({
        ...prev,
        [agentId]: {
          ...prev[agentId],
          messages: [...prev[agentId].messages, errorMessage],
          loading: false
        }
      }));
    }
  };

  return (
    <div className="sensei-chat-container">
      <div
        className={`fixed bottom-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isChatBoxVisible ? "right-[500px]" : "right-0"
        }`}
      >
        {!isChatBoxVisible && (
          <div 
            className="designstudio-button" 
            style={{ 
              position: "fixed", 
              zIndex: 999998, 
              bottom: "20px", 
              right: "20px",
              cursor: "pointer"
            }}
            onClick={toggleChatBox}
          >
            <div 
              style={{ 
                display: "flex",
                alignItems: "center",
                backgroundColor: "var(--primary-color, #1F4F82)",
                border: "2px solid white",
                borderRadius: "25px",
                padding: "8px 16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                minWidth: "180px",
                height: "50px"
              }}
            >
              <div 
                style={{ 
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  marginRight: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden"
                }}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" 
                    fill="var(--primary-color, #1F4F82)"
                  />
                </svg>
              </div>
              
              <span 
                style={{ 
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  fontFamily: "Arial, sans-serif",
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                }}
              >
                {buttonText}
              </span>
            </div>
          </div>
        )}
      </div>

      <div
        className={`fixed bottom-0 w-[500px] h-[700px] z-[100] border bg-white transition-all duration-300 ease-in-out shadow-2xl ${
          isChatBoxVisible ? "right-0" : "-right-[500px]"
        }`}
      >
        <div className="bg-[var(--secondary-color)] py-2 flex items-center justify-between px-4">
          <p className="text-white font-bold text-xl">{chatTitle}</p>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleTeamButtonClick} 
              className="text-white hover:text-gray-200 transition-colors duration-200 flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>Our Team</span>
            </button>
            <button onClick={handleCloseChatBox} className="text-white hover:underline text-sm font-medium">
              Close
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-[var(--primary-color)] flex border-b border-gray-300">
          <button
            onClick={() => setActiveTab('group')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'group'
                ? 'bg-white text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                : 'text-white hover:text-gray-200'
            }`}
          >
            Group Chat
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'private'
                ? 'bg-white text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                : 'text-white hover:text-gray-200'
            }`}
          >
            Private Chat
          </button>
        </div>

        {activeTab === 'group' && (
          <div className="bg-[var(--primary-color)] flex items-center py-4 space-x-5 pl-5">
            <img onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }} src={resolveAssetUrl(logoUrl)} alt="logo" className="w-12 h-12 rounded-full object-contain p-[6px] bg-white" />
            <div className="flex-col">
              <p className="text-white font-medium">Chat with us 24/7</p>
            </div>
          </div>
        )}

        {activeTab === 'group' ? (
          <div className="flex flex-col h-[500px] bg-white rounded-t-lg relative">
            <div
              ref={boxRef}
              className="flex-1 overflow-y-auto p-4 pt-6 pb-20"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start mb-4 ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div 
                      className="w-10 h-10 rounded-full mr-2 border-2 overflow-hidden flex-shrink-0 flex items-center justify-center bg-white"
                      style={{ borderColor: message.color }}
                    >
                      <img
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }}
                        src={resolveAssetUrl(message.avatar || logoUrl)}
                        alt="bot-avatar"
                        className="w-10 h-10 object-cover scale-150"
                      />
                    </div>
                  )}
                  <div
                    className={`flex flex-col border p-3 rounded-xl max-w-[80%] ${
                      message.sender === "user"
                        ? "items-end bg-blue-50 border-blue-200"
                        : "items-start"
                    }`}
                    style={message.sender === "bot" ? { 
                      borderColor: message.color,
                      backgroundColor: message.color ? message.color + "1A" : undefined // opacity 10%
                    } : undefined}
                  >
                    <div className="text-sm leading-relaxed text-gray-800 break-words w-full markdown-content">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          a: ({node, ...props}) => <a {...props} className="text-blue-600 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer" />
                        }}
                      >
                        {message.text.replace(/@(\w+)/g, '[@$1]($1)')}
                      </ReactMarkdown>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">{message.time}</div>
                  </div>
                </div>
              ))}

              {loading && processMessages === "processing" && (
                <div
                  className={`flex items-start mb-4 ${
                    messages.length % 2 === 0 ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full mr-2 border-2 overflow-hidden flex-shrink-0 flex items-center justify-center bg-white">
                    <img
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }}
                      src={resolveAssetUrl(logoUrl)}
                      alt="bot-avatar"
                      className="w-10 h-10 object-cover"
                    />
                  </div>
                  <div className="flex flex-col border border-gray-200 p-3 rounded-xl items-start bg-gray-50">
                    <div className="text-sm leading-relaxed text-gray-800 markdown-content">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          a: ({node, ...props}) => <a {...props} className="text-blue-600 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer" />
                        }}
                      >
                        {textProcessing.replace(/@(\w+)/g, '[@$1]($1)')}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {loading && processMessages === "processing" && (
              <div className="flex justify-center items-end absolute bottom-16 left-0 right-0 mb-4 z-10">
                <button
                  disabled
                  type="button"
                  className="py-1.5 px-2.5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 inline-flex items-center shadow-md animate-pulse"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 mr-2 text-gray-200 animate-spin fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                  {loadingTexts[loadingTextIndex]}
                </button>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-300 bg-white shadow-sm flex items-center p-2">
              <div className="hover:opacity-80">
                <PlusCircleIcon
                  width={25}
                  color="black"
                  onClick={handleNewChat}
                  title="Create new chat"
                  className="cursor-pointer flex items-center justify-center ml-2"
                />
              </div>
              <div className="flex-grow relative mx-2">
                {showSuggestions && (
                  <div className="absolute bottom-full mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <ul className="max-h-48 overflow-y-auto rounded-lg m-0 p-0 list-none">
                      <li className="px-4 py-2 text-xs font-semibold text-gray-500 border-b bg-gray-50">{suggestionTitle}</li>
                      {suggestions.map((item, index) => (
                        <li
                          key={index}
                          onMouseDown={() => handleSuggestionClick(item)}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-800"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <input
                  type="text"
                  value={input}
                  onKeyDown={(e) =>
                    processMessages !== "processing" &&
                    e.key === "Enter" &&
                    handleSend()
                  }
                  onChange={handleInputChange}
                  className="w-full p-2 border-none outline-none text-sm text-gray-700 placeholder-gray-400 bg-gray-50 rounded"
                  placeholder="Type a message... Use @agent or @product for suggestions"
                />
              </div>
              <button
                onClick={processMessages === "processing" ? handleStopResponse : handleSend}
                className={`px-4 py-2 font-semibold text-sm transition-colors duration-300 rounded flex items-center space-x-2 ${
                  processMessages === "processing"
                    ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                    : "text-gray-500 hover:text-gray-700 hover:underline"
                }`}
              >
                {processMessages === "processing" ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                    <span>Stop</span>
                  </>
                ) : (
                  <span>Send</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white h-[560px] overflow-y-auto p-4">
            <div className="space-y-3">
              <div className="text-center text-gray-600 mb-4">
                <h3 className="text-lg font-semibold mb-1 text-gray-800">Choose an agent to chat privately</h3>
                <p className="text-sm">Each agent specializes in different areas</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {teamAgents.map((agent, index) => {
                  const agentInfo = getAgentInfo(agent.id);
                  return (
                    <div
                      key={index}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div 
                        className="w-10 h-10 rounded-full mr-3 border-2 overflow-hidden flex-shrink-0 flex items-center justify-center bg-white"
                        style={{ borderColor: agentInfo.color }}
                      >
                        <img
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }}
                          src={resolveAssetUrl(agentInfo.avatar)}
                          alt={`${agent.name}-avatar`}
                          className="w-10 h-10 object-cover scale-150"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm">{agent.name}</h4>
                        <p className="text-xs text-gray-600 mb-1">{agent.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{agent.description}</p>
                      </div>
                      <button
                        onClick={() => startPrivateChat(agent.id)}
                        className="ml-3 px-3 py-1.5 text-white rounded-lg transition-colors duration-200 text-xs font-medium flex-shrink-0 hover:opacity-90"
                        style={{ backgroundColor: "var(--primary-color, #0085d5)" }}
                      >
                        Chat Private
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {openPrivateChats.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Private Chats</h4>
                  <div className="space-y-2">
                    {openPrivateChats.map(agentId => {
                      const agent = teamAgents.find(a => a.id === agentId);
                      const chat = privateChats[agentId];
                      if (!agent || !chat) return null;
                      const agentInfo = getAgentInfo(agentId);
                      
                      return (
                        <div key={agentId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-center">
                            <div 
                              className="w-8 h-8 rounded-full mr-3 border-2 overflow-hidden flex-shrink-0 flex items-center justify-center bg-white"
                              style={{ borderColor: agentInfo.color }}
                            >
                              <img
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }}
                                src={resolveAssetUrl(agentInfo.avatar)}
                                alt={`${agent.name}-avatar`}
                                className="w-8 h-8 object-cover scale-150"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{agent.name}</p>
                              <p className="text-xs text-gray-500">{chat.messages.length} messages</p>
                            </div>
                          </div>
                          <button
                            onClick={() => closePrivateChat(agentId)}
                            className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Private Chat Windows */}
      {openPrivateChats.map((agentId, index) => {
        const agent = teamAgents.find(a => a.id === agentId);
        const chat = privateChats[agentId];
        if (!agent || !chat) return null;
        const agentInfo = getAgentInfo(agentId);

        return (
          <div
            key={agentId}
            data-agent-id={agentId}
            className="fixed bottom-0 w-[400px] h-[500px] z-[101] border bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col"
            style={{
              right: `${520 + (index * 420)}px`
            }}
          >
            <div className="bg-[var(--primary-color)] py-3 px-4 flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-full mr-3 border-2 overflow-hidden flex-shrink-0 flex items-center justify-center bg-white"
                  style={{ borderColor: agentInfo.color }}
                >
                  <img
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }}
                    src={resolveAssetUrl(agentInfo.avatar)}
                    alt={`${agent.name}-avatar`}
                    className="w-8 h-8 object-cover scale-150"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{agent.name}</h3>
                  <p className="text-white text-[10px] opacity-80">{agent.title}</p>
                </div>
              </div>
              <button 
                onClick={() => closePrivateChat(agentId)}
                className="text-white hover:text-gray-200 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-white pb-16">
              {chat.messages.map((message, msgIndex) => (
                <div
                  key={msgIndex}
                  className={`flex items-start mb-4 ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div 
                      className="w-8 h-8 rounded-full mr-2 border-2 overflow-hidden flex-shrink-0 flex items-center justify-center bg-white"
                      style={{ borderColor: message.color }}
                    >
                      <img
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }}
                        src={resolveAssetUrl(message.avatar || logoUrl)}
                        alt="bot-avatar"
                        className="w-8 h-8 object-cover scale-150"
                      />
                    </div>
                  )}
                  <div
                    className={`flex flex-col border p-2 rounded-lg max-w-[80%] ${
                      message.sender === "user"
                        ? "items-end bg-blue-50 border-blue-200"
                        : "items-start"
                    }`}
                    style={message.sender === "bot" ? { 
                      borderColor: message.color,
                      backgroundColor: message.color ? message.color + "1A" : undefined // opacity 10%
                    } : undefined}
                  >
                    <div className="text-sm leading-relaxed text-gray-800 break-words w-full markdown-content">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          a: ({node, ...props}) => <a {...props} className="text-blue-600 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer" />
                        }}
                      >
                        {message.text.replace(/@(\w+)/g, '[@$1]($1)')}
                      </ReactMarkdown>
                    </div>
                    <div className="text-[9px] text-gray-500 mt-1">{message.time}</div>
                  </div>
                </div>
              ))}
              
              {chat.loading && (
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs">Typing...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-300 bg-white flex items-center p-2 private-chat-input">
              <input
                type="text"
                placeholder={`Message ${agent.name}...`}
                className="flex-1 p-2 border-none outline-none text-sm text-gray-700 placeholder-gray-400 bg-gray-50 rounded"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !chat.loading) {
                    const inputElement = e.currentTarget;
                    if (inputElement.value.trim()) {
                      sendPrivateMessage(agentId, inputElement.value);
                      inputElement.value = "";
                    }
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const container = e.currentTarget.closest('.private-chat-input');
                  const inputVal = container?.querySelector('input');
                  if (inputVal && inputVal.value.trim() && !chat.loading) {
                    sendPrivateMessage(agentId, inputVal.value.trim());
                    inputVal.value = "";
                  }
                }}
                disabled={chat.loading}
                className={`p-2 transition-colors duration-200 ${
                  chat.loading 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-blue-500 hover:text-blue-600 cursor-pointer'
                }`}
                title={chat.loading ? 'Please wait...' : 'Send message'}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}

      {/* Team Tab */}
      {showTeamTab && (
        <div className="fixed bottom-0 right-[500px] w-80 h-[560px] bg-white border border-gray-300 shadow-2xl z-[99] transition-all duration-300 ease-in-out">
          <div className="bg-[var(--primary-color)] py-3 px-4 flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg">Our Team</h3>
            <button 
              onClick={handleTeamButtonClick}
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
            <div className="space-y-3">
              {teamAgents.map((agent, index) => (
                <div
                  key={index}
                  onClick={() => handleAgentClick(agent)}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <div className={`w-3 h-3 ${agent.status ? "bg-green-500" : "bg-orange-500"} rounded-full mr-3 flex-shrink-0`}></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">{agent.name}</h4>
                    <p className="text-xs text-gray-500">{agent.title}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Agent Details Tab */}
      {showAgentDetails && selectedAgent && (
        <div className="fixed bottom-0 right-[1170px] w-96 h-[560px] bg-white border border-gray-300 shadow-2xl z-[98] transition-all duration-300 ease-in-out">
          <div className="bg-[var(--primary-color)] py-3 px-4 flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg">Agent Details</h3>
            <button 
              onClick={handleCloseAgentDetails}
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="p-6 overflow-y-auto h-[calc(100%-60px)]">
            <div className="flex items-center mb-6">
              <div className={`w-4 h-4 ${selectedAgent.status ? "bg-green-500" : "bg-orange-500"} rounded-full mr-3`}></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedAgent.name}</h2>
                <p className="text-base text-gray-500 font-medium">{selectedAgent.title}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">About</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{selectedAgent.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Areas of Expertise</h4>
              <div className="space-y-1">
                {selectedAgent.expertise.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
