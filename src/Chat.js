import React, { useEffect, useState } from 'react';
import { w3cwebsocket } from 'websocket';

const Chat = () => {
    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        if (username && token) {
            const wsClient = new w3cwebsocket('ws://localhost:8080/chat', null, null, { 'Authorization': `Bearer ${token}` });
            setClient(wsClient);

            wsClient.onopen = () => {
                console.log('WebSocket connection established');
            };

            wsClient.onmessage = (event) => {
                const message = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, message]);
            };

            wsClient.onclose = () => {
                console.log('WebSocket connection closed');
            };

            return () => {
                wsClient.close();
            };
        }
    }, [username, token]);

    const handleLogin = () => {
        //Authentication logic here

        const username = 'Filip1';
        const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJGaWxpcDEiLCJpYXQiOjE2ODcxMzEwODMsImV4cCI6MTY4NzIxNzQ4M30.-221bdGGVXMf3F7KqEtICLrAkkb-wMGXDtvdR3H4ehH99DdvwF_bK47rsKmcPhReWJQcfpCCZagb09F7PXo7YA';

        setUsername(username);
        setToken(token);
    };

    const sendMessage = () => {
        if (client && inputValue) {
            const message = {
                username,
                text: inputValue,
            };
            client.send(JSON.stringify(message));
            setInputValue('');
        }
    };

    return (
        <div>
            {username && token ? (
                <>
                    <h1>Chat</h1>
                    <div>
                        {messages.map((message, index) => (
                            <div key={index}>
                                <strong>{message.username}: </strong>
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                </>
            ) : (
                <div>
                    <h1>Login</h1>
                    <button onClick={handleLogin}>Login</button>
                </div>
            )}
        </div>
    );
};

export default Chat;
