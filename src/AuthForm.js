import { useState } from "react";
import styles from './AuthForm.module.css'

export function Authform() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);

    const isValidEmail = (email) => {
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        return emailRegex.test(email);
    };

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
                throw new Error('Incorrect email or password');
            }

            // Handle success
            const data = await response.json();
            console.log('Authentication success', data);
            localStorage.setItem('authToken', data.token);
            setIsLoggedIn(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.login_container}>
            {isLoggedIn ? (
                <div className={styles.welcome_message}>
                    <h1>Welcome, {email}!</h1>
                    <p>You have successfully logged in.</p>
                </div>
            ) : (
                <form
                    className={styles.login_form}
                    onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <label for="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError('');
                        }}
                        onBlur={() => setIsEmailValid(isValidEmail(email))} />
                    {!isEmailValid && (
                        <div className={styles.error}>Please enter a valid email.</div>
                    )}
                    <label for="password">Password</label>
                    <div className={styles.icon_container} style={{ display: "flex", position: "relative" }}>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            placeholder="Enter your password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError('');
                            }} />
                        <button className={styles.visibility_button}
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}>
                            <span
                                className={`material-icons ${styles.icon}`}>
                                {showPassword ? "visibility_off" : "visibility"}
                            </span>
                        </button>
                    </div>
                    <a href="/forgot-password">Forgot password?</a>
                    {error && <div className={styles.error}>{error}</div>}
                    <button
                        className={styles.submit_button}
                        type="submit"
                        disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p>Don't have an account?  <a href="/sign-up">Sign up</a>
                    </p>
                </form>
            )}
        </div>
    );
}