import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupView = ({ groupId }) => {
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        // Fetch group details
        axios.get(`/api/groups/${groupId}`)
            .then(response => {
                setGroup(response.data.group);
                setMembers(response.data.members);
            })
            .catch(error => console.error('Error fetching group data:', error));
    }, [groupId]);

    return (
        <div className="scrollable-page">
            <div className="group-view">
                {group ? (
                    <>
                        <h1>{group.name}</h1>
                        <p>Interest Rate: {group.interest_rate}%</p>
                        <p>Created By: {group.created_by}</p>
                        <h2>Members</h2>
                        <ul>
                            {members.map(member => (
                                <li key={member.id}>{member.name}</li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p>Loading group details...</p>
                )}
            </div>
        </div>
    );
};

export default GroupView;
