import React, { useState } from 'react';
import { login } from '../utils/auth'; // Asegúrate de que la ruta es correcta
import { Link, useLocation, useNavigate } from 'react-router-dom';
import InfoTooltip from './InfoTooltip';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Por favor, ingresa un email válido';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const data = await login(email, password);
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          onLogin(data);
          navigate('/');
        }
      } catch (error) {
        setMessage(error.message);
        setIsError(true);
        setIsOpen(true);
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Determines the message in the route
  const linkText = location.pathname === '/signin' ? "¿Aún no eres miembro? Regístrate aquí" : "¿Ya eres miembro? Inicia sesión aquí";
  const linkRoute = location.pathname === '/signin' ? "/signup" : "/signin";

  return (
    <div className='login'>
      <h2 className='login__title'>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="login__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            required
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>
        <div>
          <input
            className="login__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
        </div>
        <button type="submit" className='login__submit'>Iniciar Sesión</button>
        <div className='login__link'>
          <Link to={linkRoute}>{linkText}</Link>
        </div>
      </form>
      <InfoTooltip isOpen={isOpen} onClose={handleClose} message={message} isError={isError} />
    </div>
  );
}

export default Login;
