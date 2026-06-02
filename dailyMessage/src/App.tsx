import {useState, useEffect} from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
    const [messages, setMessages] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(API_URL)
            .then(response => setMessages(response.data))
            .catch(error => setError(error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen ">
            <h1 className="text-3xl font-bold mb-4">Daily Message</h1>
            {loading ? <h2 className="text-gray-500">Loading...</h2> : <h2 className="text-xl text-center px-4">{messages}</h2>}
            {error && <h2 className="text-red-500">Error: {error.message}</h2>}
        </div>
    );
};

export default App;
