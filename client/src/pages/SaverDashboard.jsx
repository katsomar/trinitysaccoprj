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
  const user = { name: "Kats Omar", accountNumber: "SACCO20250717001" };

  useEffect(() => {
    // Fetch balance, transactions, and groups
    axios
      .get("/api/saver/balance")
      .then((response) => {
        setBalance(
          typeof response.data.balance === "number" ? response.data.balance : 0
        );
        setTransactions(
          Array.isArray(response.data.transactions)
            ? response.data.transactions
            : []
        );
      })
      .catch((error) => {
        console.error("Error fetching balance and transactions:", error);
        setBalance(0);
        setTransactions([]);
      });

    axios
      .get("/api/saver/groups")
      .then((response) =>
        setGroups(
          Array.isArray(response.data.groups) ? response.data.groups : []
        )
      )
      .catch((error) => {
        console.error("Error fetching groups:", error);
        setGroups([]);
      });
  }, []);

  const handleDeposit = () => {
    if (!selectedGroup) {
      alert("Please select a group to deposit into.");
      return;
    }
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }

    axios
      .post("/api/saver/deposit", {
        amount: depositAmount,
        group_id: selectedGroup,
      })
      .then((response) => {
        alert(response.data.message);
        setBalance((prev) => prev + parseFloat(depositAmount));
        setDepositAmount("");
      })
      .catch((error) => console.error("Error depositing money:", error));
  };

  const handleWithdraw = () => {
    if (!selectedGroup) {
      alert("Please select a group to withdraw from.");
      return;
    }
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }

    axios
      .post("/api/saver/withdraw", {
        amount: withdrawAmount,
        group_id: selectedGroup,
      })
      .then((response) => {
        alert(response.data.message);
        setBalance((prev) => prev - parseFloat(withdrawAmount));
        setWithdrawAmount("");
      })
      .catch((error) => console.error("Error withdrawing money:", error));
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <a href="/deposit">Deposit</a>
            </li>
            <li>
              <a href="/withdraw">Withdraw</a>
            </li>
            <li>
              <a href="/group-savings">Group Savings</a>
            </li>
            <li>
              <a href="/notifications">Notifications</a>
            </li>
            <li>
              <a href="/chat">Chat</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <section className="welcome-section">
          <h1>Welcome, {user.name}!</h1>
          <p>Account Number: {user.accountNumber}</p>
        </section>

        <section className="cards-section">
          <div className="card">
            <h2>Account Balance</h2>
            <p>${(balance || 0).toFixed(2)}</p>
          </div>

          <div className="card">
            <h2>Recent Transactions</h2>
            <ChartCard data={transactions} />
          </div>

          <div className="card">
            <h2>Notifications</h2>
            <p>No new notifications.</p>
          </div>
        </section>

        <section className="actions">
          <div>
            <h3>Select Group</h3>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">-- Select a Group --</option>
              {groups.map((group) => (
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
        </section>

        <section className="performance">
          <h3>Savings Performance</h3>
          {Array.isArray(transactions) && transactions.length > 0 ? (
            <ChartCard data={transactions} />
          ) : (
            <p>No transaction data available.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default SaverDashboard;
