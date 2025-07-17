import React, { useState, useEffect } from "react";
import axios from "axios";

const ManagerDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupInterestRate, setNewGroupInterestRate] = useState("");
  const [newGroupPeriod, setNewGroupPeriod] = useState("");

  useEffect(() => {
    fetchGroups();
    fetchWithdrawRequests();
  }, []);

  const fetchGroups = () => {
    axios
      .get("/api/manager/groups")
      .then((response) => setGroups(response.data.groups || []))
      .catch((error) => console.error("Error fetching groups:", error));
  };

  const fetchWithdrawRequests = () => {
    axios
      .get("/api/manager/withdraw-requests")
      .then((response) => setWithdrawRequests(response.data.requests || []))
      .catch((error) =>
        console.error("Error fetching withdrawal requests:", error)
      );
  };

  const approveWithdrawal = (requestId) => {
    axios
      .post("/api/manager/approve-withdrawal", { id: requestId })
      .then((response) => {
        alert(response.data.message);
        setWithdrawRequests((prev) =>
          prev.filter((req) => req.id !== requestId)
        );
      })
      .catch((error) => console.error("Error approving withdrawal:", error));
  };

  const createGroup = () => {
    if (!newGroupName || newGroupInterestRate <= 0 || newGroupPeriod <= 0) {
      alert("Please fill in all fields with valid values.");
      return;
    }

    axios
      .post("/api/manager/create-group", {
        name: newGroupName,
        interest_rate: parseFloat(newGroupInterestRate),
        period_days: parseInt(newGroupPeriod),
      })
      .then((response) => {
        alert("Group created successfully!");
        setGroups([...groups, response.data.group]);
        setNewGroupName("");
        setNewGroupInterestRate("");
        setNewGroupPeriod("");
      })
      .catch((error) => console.error("Error creating group:", error));
  };

  return (
    <div className="dashboard">
      <h1>Manager Dashboard</h1>

      {/* Group Management Section */}
      <div className="groups">
        <h2>Manage Groups</h2>
        {groups.length > 0 ? (
          <ul>
            {groups.map((group) => (
              <li key={group.id}>
                {group.name} - Interest Rate: {group.interest_rate}% - Period:{" "}
                {group.period_days} days
              </li>
            ))}
          </ul>
        ) : (
          <p>No groups available.</p>
        )}

        <div className="create-group">
          <h3>Create New Group</h3>
          <input
            type="text"
            placeholder="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Interest Rate (%)"
            value={newGroupInterestRate}
            onChange={(e) => setNewGroupInterestRate(e.target.value)}
          />
          <input
            type="number"
            min="1"
            placeholder="Period (days)"
            value={newGroupPeriod}
            onChange={(e) => setNewGroupPeriod(e.target.value)}
          />
          <button onClick={createGroup}>Create Group</button>
        </div>
      </div>

      {/* Withdrawal Requests Section */}
      <div className="withdraw-requests">
        <h2>Withdrawal Requests</h2>
        {withdrawRequests.length > 0 ? (
          <ul>
            {withdrawRequests.map((request) => (
              <li key={request.id}>
                {request.user_name} requested{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(request.amount)}
                <button onClick={() => approveWithdrawal(request.id)}>
                  Approve
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No withdrawal requests at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
