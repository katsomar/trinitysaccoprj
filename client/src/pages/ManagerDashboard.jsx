import React, { useState, useEffect } from "react";
import axios from "axios";

const ManagerDashboard = () => {
<<<<<<< HEAD
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
=======
    const [groups, setGroups] = useState([]);
    const [withdrawRequests, setWithdrawRequests] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupInterestRate, setNewGroupInterestRate] = useState('');
    const [newGroupPeriod, setNewGroupPeriod] = useState('');
    const user = { name: "Kats Omar", accountNumber: "SACCO20250717001" };

    useEffect(() => {
        // Fetch groups
        axios.get('/api/manager/groups')
            .then(response => {
                if (response.data && Array.isArray(response.data.groups)) {
                    setGroups(response.data.groups);
                } else {
                    setGroups([]);
                }
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
                setGroups([]);
            });

        // Fetch withdrawal requests
        axios.get('/api/manager/withdraw-requests')
            .then(response => {
                if (response.data && Array.isArray(response.data.requests)) {
                    setWithdrawRequests(response.data.requests);
                } else {
                    setWithdrawRequests([]);
                }
            })
            .catch(error => {
                console.error('Error fetching withdrawal requests:', error);
                setWithdrawRequests([]);
            });
    }, []);

    const approveWithdrawal = (requestId) => {
        axios.post('/api/manager/approve-withdrawal', { id: requestId })
            .then(response => {
                alert(response.data.message);
                setWithdrawRequests(prev => prev.filter(req => req.id !== requestId));
            })
            .catch(error => console.error('Error approving withdrawal:', error));
    };

    const createGroup = () => {
        if (!newGroupName || !newGroupInterestRate || !newGroupPeriod) {
            alert('Please fill in all group details.');
            return;
        }

        axios.post('/api/manager/create-group', {
            name: newGroupName,
            interest_rate: newGroupInterestRate,
            period_days: newGroupPeriod,
        })
            .then(response => {
                alert('Group created successfully!');
                if (response.data && response.data.group) {
                    setGroups(prev => [...prev, response.data.group]);
                }
                setNewGroupName('');
                setNewGroupInterestRate('');
                setNewGroupPeriod('');
            })
            .catch(error => console.error('Error creating group:', error));
    };

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <nav>
                    <ul>
                        <li><a href="/members">Members</a></li>
                        <li><a href="/transactions">Transactions</a></li>
                        <li><a href="/groups">Groups</a></li>
                        <li><a href="/interest">Interest</a></li>
                        <li><a href="/reports">Reports</a></li>
                        <li><a href="/messages">Messages</a></li>
                        <li><a href="/settings">Settings</a></li>
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
                        <h2>Total Savings</h2>
                        <p>Placeholder content for total savings.</p>
                    </div>
                    <div className="card">
                        <h2>Recent Member Activity</h2>
                        <p>Placeholder content for recent member activity.</p>
                    </div>
                    <div className="card">
                        <h2>Analytics Overview</h2>
                        <p>Placeholder content for analytics overview.</p>
                    </div>
                    <div className="card">
                        <h2>Group Contribution Status</h2>
                        <p>Placeholder content for group contribution status.</p>
                    </div>
                </section>

                {/* Group Management Section */}
                <div className="groups">
                    <h2>Manage Groups</h2>
                    {groups && groups.length > 0 ? (
                        <ul>
                            {groups.map(group => (
                                <li key={group.id}>
                                    {group.name} - Interest Rate: {group.interest_rate}% - Period: {group.period_days} days
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
                            placeholder="Interest Rate (%)"
                            value={newGroupInterestRate}
                            onChange={(e) => setNewGroupInterestRate(e.target.value)}
                        />
                        <input
                            type="number"
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
                    {withdrawRequests && withdrawRequests.length > 0 ? (
                        <ul>
                            {withdrawRequests.map(request => (
                                <li key={request.id}>
                                    {request.user_name} requested ${request.amount}
                                    <button onClick={() => approveWithdrawal(request.id)}>Approve</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No withdrawal requests.</p>
                    )}
                </div>
            </main>
>>>>>>> db6696dd8b2c92d0b3df95512871fe38fd558341
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
