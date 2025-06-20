import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (!localUser?._id) return;

    axios.get("http://localhost:5001/api/admin/user-data", {
      params: { userId: localUser._id }
    })
    .then(res => setUserData(res.data))
    .catch(console.error);
  }, []);

  if (!userData) {
    return <div className="text-center mt-20 text-white">Loading user info…</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl mb-2">👤 Account Info</h2>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
      </section>

      <section>
        <h2 className="text-2xl mb-2">📊 Generated Charts</h2>
        {userData.charts.length === 0 ? (
          <p>No charts yet.</p>
        ) : (
          <ul className="space-y-4">
            {userData.charts.map((chart, i) => (
              <li key={i} className="bg-gray-800 p-4 rounded shadow">
                <p><strong>Title:</strong> {chart.title}</p>
                <p><strong>Created:</strong> {new Date(chart.createdAt).toLocaleString()}</p>
                <a 
                  href={chart.xlsxUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 underline"
                >
                  Download Excel
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
