import React, { useState } from 'react';
import { authService } from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await authService.register({ email, password, fullName, phone });
            alert('Регистрация успешна!');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка регистрации');
        }
    };

    return (
        <div>
            <h1>Регистрация (CW-16)</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" required /><br />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required /><br />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" required /><br />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required /><br />
                <button type="submit">Зарегистрироваться</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Register;