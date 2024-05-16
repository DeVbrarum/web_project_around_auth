import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signup } from '../utils/auth';
import InfoTooltip from './InfoTooltip';


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Por favor, ingresa un email válido';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      signup(email, password)
        .then((data) => {
          if (data.token) {
            setIsOpen(true);
            setMessage('¡Correcto! Ya estás registrado.');
            setIsError(false);
            navigate('/signin');
          }
        })
        .catch((error) => {
          console.error('Registration failed:', error);
          setIsOpen(true);
          setIsError(true);
          setMessage(error.message);
        });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Determines the message in the route
  const linkText = location.pathname === '/signup' ? "¿Ya eres miembro? Inicia sesión aquí" : "¿Aún no eres miembro? Regístrate aquí";
  const linkRoute = location.pathname === '/signup' ? "/signin" : "/signup";

   return (
    <div>
      <h2 className='register__title'>Regístrate</h2>
      <form onSubmit={handleSubmit} className='register'>
        <div>
          <input
            className='register__input'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>
        <div>
          <input
            className='register__input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
        </div>
        <button type="submit" className='register__submit'>Registrar</button>
        <div className='register__link'>
          <Link to={linkRoute}>{linkText}</Link>
        </div>
      </form>
      <InfoTooltip isOpen={isOpen} onClose={handleClose} message={message} isError={isError} />
    </div>
  );
}

export default Register;
