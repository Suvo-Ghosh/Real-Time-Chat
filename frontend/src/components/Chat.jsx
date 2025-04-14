import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Connect to backend
const socket = io("http://localhost:5000");

export default function Chat({ username }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.emit("join", username);

        socket.on("receive-message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("user-list", (userList) => {
            setUsers(userList);
        });

        return () => {
            socket.off("receive-message");
            socket.off("user-list");
        };
    }, [username]);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("send-message", { message, username });
            setMessage("");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Real-Time Chat</h2>

                {/* Chat Box */}
                <div className="border rounded-lg h-64 overflow-y-auto p-3 bg-gray-50 mb-4">
                    {messages.map((msg, index) => (
                        <p key={index} className="mb-2">
                            <span className="font-bold text-blue-500">{msg.username}:</span> {msg.message}
                        </p>
                    ))}
                </div>

                {/* Message Input */}
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Active Users */}
            <div className="mt-6 w-full max-w-md bg-white shadow-lg rounded-lg p-4">
                <h3 className="text-xl font-semibold text-center text-gray-700">Active Users</h3>
                <ul className="mt-2">
                    {users.map((user, index) => (
                        <li key={index} className="text-gray-600 text-center">
                            {user}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
