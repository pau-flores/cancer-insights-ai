"use client";

import { Box, Button, Stack, TextField } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function Chat({ inputRef }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I can provide detailed and accurate information about the causes of cancer, including: \n\n* Environmental factors \n* Diet and nutrition \n* Physical activity \n* Tobacco and alcohol use \n* Infectious agents \n* Pharmaceutical drugs \n* Other factors \n\nHow can I assist you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return; // Don't send empty messages
    setIsLoading(true);

    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: message }],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      width="100%"
      height="600px"
      backgroundColor="#202C39"
      border="1px solid rgba(94, 110, 212, .5)"
      borderRadius="8px"
      boxShadow="0 0 10px rgba(255, 255, 255, 0.15)"
      display="flex"
      flexDirection="column"
    >
      <Box
        flexGrow={1}
        overflow="auto"
        p={2}
        display="flex"
        flexDirection="column"
      >
        <Stack direction={"column"} spacing={2}>
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={message.role === "assistant" ? "#457B9D" : "#A8DADC"}
                color={message.role === "assistant" ? "white" : "#050714"}
                borderRadius={2}
                p={2}
                sx={{ whiteSpace: "pre-wrap" }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
      </Box>
      <Stack
        direction={"row"}
        spacing={2}
        p={2}
        borderTop="1px solid rgba(94, 110, 212, .5)"
      >
        <TextField
          inputRef={inputRef}
          label="Message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          variant="outlined"
          sx={{
            backgroundColor: "#202C39",
            border: "solid",
            borderWidth: "1px",
            borderRadius: "4px",
            borderColor: "rgba(94, 110, 212, .5)",
            fontSize: "14px",
            color: "#fff",
          }}
          InputProps={{
            style: {
              color: "#fff",
            },
            classes: {
              notchedOutline: {
                borderColor: "rgba(94, 110, 212, .5)",
              },
            },
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
          inputProps={{
            style: {
              color: "#fff",
            },
          }}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={isLoading}
          sx={{ backgroundColor: "#A8DADC", color: "#050714" }}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </Stack>
    </Box>
  );
}
