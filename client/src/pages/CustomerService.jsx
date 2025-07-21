import React, { useState } from "react";
import "../styles/main.css";
import { FaRobot, FaPaperPlane } from "react-icons/fa";
import axios from "axios";

const issueOptions = [
  "Login Issues",
  "Withdrawal Issues",
  "Deposit Issues",
  "Joining Group Issues",
  "Chat Issues",
  "Other",
];

const aiResponses = {
  "Login Issues":
    "If you're having trouble logging in, please ensure your email and password are correct. If you forgot your password, use the 'Forgot Password' link on the login page.",
  "Withdrawal Issues":
    "For withdrawal issues, make sure your account is verified and you have sufficient balance. If the problem persists, contact support.",
  "Deposit Issues":
    "If your deposit isn't reflecting, check your transaction history and ensure you've followed the correct steps. Deposits may take a few minutes to process.",
  "Joining Group Issues":
    "To join a group, go to the Groups section and request to join. If you face issues, ensure you meet the group requirements.",
  "Chat Issues":
    "If chat isn't working, refresh the page or check your internet connection. For persistent issues, contact support.",
  Other:
    "Please describe your issue in detail and our AI assistant will try to help you.",
};

const CustomerService = () => {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [customQuery, setCustomQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleIssueSelect = (e) => {
    setSelectedIssue(e.target.value);
    setCustomQuery("");
    setResponse("");
  };

  const handleQueryChange = (e) => {
    setCustomQuery(e.target.value);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (selectedIssue && selectedIssue !== "Other") {
      setResponse(aiResponses[selectedIssue]);
      return;
    }

    if (customQuery.trim() === "") {
      setResponse("Please select an issue or describe your problem.");
      return;
    }

    try {
      setResponse("Thinking...");
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful customer support assistant for a finance platform.",
            },
            {
              role: "user",
              content: customQuery,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer YOUR_API_KEY",
          },
        }
      );
      const aiReply = res.data.choices[0].message.content;
      setResponse(aiReply);
    } catch (error) {
      console.error("AI Error:", error);
      setResponse(
        "Sorry, the AI assistant is currently unavailable. Please try again later."
      );
    }
  };

  return (
    <div className="customer-service-page">
      <div className="customer-service-container">
        <h1>
          <FaRobot style={{ marginRight: 10 }} />
          AI Customer Care Assistant
        </h1>
        <p className="cs-desc">
          How can we help you today? Select an issue or describe your problem
          below.
        </p>
        <form className="cs-form" onSubmit={handleSend}>
          <select
            value={selectedIssue}
            onChange={handleIssueSelect}
            className="cs-select"
          >
            <option value="">Select an issue...</option>
            {issueOptions.map((issue) => (
              <option key={issue} value={issue}>
                {issue}
              </option>
            ))}
          </select>
          {(selectedIssue === "Other" || selectedIssue === "") && (
            <textarea
              className="cs-textarea"
              placeholder="Describe your issue here..."
              value={customQuery}
              onChange={handleQueryChange}
              rows={4}
            />
          )}
          <button type="submit" className="cs-btn">
            <FaPaperPlane style={{ marginRight: 6 }} />
            Send
          </button>
        </form>
        {response && (
          <div className="cs-response">
            <FaRobot className="cs-response-icon" />
            <span>{response}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 1. Make sure this file is named CustomerService.jsx and is located in src/pages.

// 2. Make sure you have this export at the end:
export default CustomerService;

// 3. Make sure you have imported this file and set up the route in your main router (e.g., App.jsx or wherever your routes are defined):
// import CustomerService from './pages/CustomerService';
// <Route path="/customer-service" element={<CustomerService />} />

// 4. Make sure you have installed react-icons:
// npm install react-icons

// 5. Make sure your CSS file (main.css) is imported and contains the required