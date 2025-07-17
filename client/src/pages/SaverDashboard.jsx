import React, { useState, useEffect } from "react";
import axios from "axios";
import ChartCard from "../components/ChartCard";

const SaverDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBalanceAndTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/saver/balance");
      setBalance(response.data.balance);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching balance and transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get("/api/saver/groups");
      setGroups(response.data.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchBalanceAndTransactions();
    fetchGroups();
  }, []);

  const handleDeposit = async () => {
    if (!selectedGroup) {
      alert("Please select a group to deposit into.");
      return;
    }
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }

    try {
      const response = await axios.post("/api/saver/deposit", {
        amount,
        group_id: selectedGroup,
      });
      alert(response.data.message);
      setDepositAmount("");
      fetchBalanceAndTransactions(); // Refresh after action
    } catch (error) {
      console.error("Error depositing money:", error);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedGroup) {
      alert("Please select a group to withdraw from.");
      return;
    }
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }

    try {
      const response = await axios.post("/api/saver/withdraw", {
        amount,
        group_id: selectedGroup,
      });
      alert(response.data.message);
      setWithdrawAmount("");
      fetchBalanceAndTransactions(); // Refresh after action
    } catch (error) {
      console.error("Error withdrawing money:", error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Saver Dashboard</h1>

      <div className="balance">
        <h2>
          Current Balance:{" "}
          {Number.isFinite(balance)
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(balance)
            : "0.00"}
        </h2>
      </div>

      <div className="actions">
        <div>
          <h3>Select Group</h3>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">-- Select a Group --</option>
            {Array.isArray(groups) &&
              groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <h3>Deposit Money</h3>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
          />
          <button
            onClick={handleDeposit}
            disabled={!depositAmount || parseFloat(depositAmount) <= 0}
          >
            Deposit
          </button>
        </div>

        <div>
          <h3>Request Withdrawal</h3>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
          />
          <button
            onClick={handleWithdraw}
            disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="performance">
        <h3>Savings Performance</h3>
        {Array.isArray(transactions) && transactions.length > 0 ? (
          <ChartCard data={transactions} />
        ) : (
          <p>No transaction data available.</p>
        )}
        {/* {loading ? (
          <p>Loading transactions...</p>
        ) : (
          <ChartCard data={transactions} />
        )} */}
      </div>
    </div>
  );
};

export default SaverDashboard;
