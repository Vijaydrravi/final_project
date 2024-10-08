import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EmployeeProfile = () => {
    const { id } = useParams();
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/employee/${id}`);
                const data = await response.json();
                setUserProfile(data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, [id]);

    if (!userProfile) {
        return <div className="text-center py-10 text-gray-500">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{userProfile.name}</h1>
            <p className="text-lg text-gray-600 mb-2"><strong>Role:</strong> {userProfile.role}</p>
            <p className="text-lg text-gray-600 mb-6"><strong>Designation:</strong> {userProfile.designation}</p>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">Learning Paths</h2>
                <ul className="space-y-3">
                    {userProfile.performanceSummary.length > 0 ? (
                        userProfile.performanceSummary.map((summary) => (
                            <li
                                key={summary.learningPath.id}
                                className="bg-gray-100 rounded-lg p-4 shadow-md"
                            >
                                <span className="block text-lg font-medium text-gray-700">{summary.learningPath.title}</span>
                                <span className="block text-sm text-gray-600">Average Rating: {summary.average_rating}</span>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">No learning paths available.</li>
                    )}
                </ul>
            </div>

            
        </div>
    );
};

export default EmployeeProfile;
