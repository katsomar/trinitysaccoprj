import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChartCard from '../components/ChartCard';

const SaverDashboard = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');

    useEffect(() => {
        // Fetch balance, transactions, and groups
        axios.get('/api/saver/balance')
            .then(response => {
                setBalance(response.data.balance);
                setTransactions(response.data.transactions);
            })
            .catch(error => console.error('Error fetching balance and transactions:', error));

        axios.get('/api/saver/groups')
            .then(response => setGroups(response.data.groups))
            .catch(error => console.error('Error fetching groups:', error));
    }, []);

    const handleDeposit = () => {
        if (!selectedGroup) {
            alert('Please select a group to deposit into.');
            return;
        }

        axios.post('/api/saver/deposit', { amount: depositAmount, group_id: selectedGroup })
            .then(response => {
                alert(response.data.message);
                setBalance(balance + parseFloat(depositAmount));
                setDepositAmount('');
            })
            .catch(error => console.error('Error depositing money:', error));
    };

    const handleWithdraw = () => {
        if (!selectedGroup) {
            alert('Please select a group to withdraw from.');
            return;
        }

        axios.post('/api/saver/withdraw', { amount: withdrawAmount, group_id: selectedGroup })
            .then(response => {
                alert(response.data.message);
                setBalance(balance - parseFloat(withdrawAmount));
                setWithdrawAmount('');
            })
            .catch(error => console.error('Error withdrawing money:', error));
    };

    return (
        <div className="dashboard">
            <h1>Saver Dashboard</h1>
            <div className="balance">
                <h2>Current Balance: ${balance.toFixed(2)}</h2>
            </div>
            <div className="actions">
                <div>
                    <h3>Select Group</h3>
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                    >
                        <option value="">-- Select a Group --</option>
                        {groups.map(group => (
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
                    />
                    <button onClick={handleDeposit}>Deposit</button>
                </div>
                <div>
                    <h3>Request Withdrawal</h3>
                    <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                    <button onClick={handleWithdraw}>Withdraw</button>
                </div>
            </div>
            <div className="performance">
                <h3>Savings Performance</h3>
                <ChartCard data={transactions} />
            </div>
        </div>
    );
};

export default SaverDashboard;
