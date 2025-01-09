import { useState } from "react";

export function Authform() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError('');

        if (!email || !password) {
            setError('Please fill out both fields');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            // Handle success
            const data = await response.json();
            console.log('Authentication success', data);
            localStorage.setItem('authToken', data.token);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form
                onSubmit={handleSubmit}
            >
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}