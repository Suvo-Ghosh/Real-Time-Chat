import { useState } from "react";
import Chat from "./components/Chat";

export default function App() {
  const [username, setUsername] = useState("");
  const [entered, setEntered] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      {!entered ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-80 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Enter Your Name</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name..."
            className="w-full border p-2 mt-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setEntered(true)}
            className="mt-4 bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600"
          >
            Join Chat
          </button>
        </div>
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
}
