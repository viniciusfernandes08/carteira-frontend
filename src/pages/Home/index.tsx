import './styles.css';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { isAxiosError } from 'axios';

function Home() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputEmail = useRef<HTMLInputElement>(null);
  const inputPassword = useRef<HTMLInputElement>(null);
  const loginEmail = useRef<HTMLInputElement>(null);
  const loginPassword = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validateCredentials(email: string, password: string): string | null {
    if (!email || !password) return 'Preencha todos os campos';
    if (!isValidEmail(email)) return 'Email inválido';
    if (password.length < 6) return 'A senha deve ter no mínimo 6 caracteres';
    return null;
  }

  async function registerUser() {
    const email = inputEmail.current?.value || '';
    const password = inputPassword.current?.value || '';

    const errorMessage = validateCredentials(email, password);
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    setLoading(true);
    try {
      await api.post('/register', { email, password });
      alert('Cadastro realizado com sucesso!');
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || 'Erro ao cadastrar';
        alert(message);
      } else {
        alert('Erro inesperado');
      }
    } finally {
      setLoading(false);
    }
  }

  async function loginUser() {
    const email = loginEmail.current?.value || '';
    const password = loginPassword.current?.value || '';

    const errorMessage = validateCredentials(email, password);
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/register/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);

      alert('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || 'Erro ao fazer login';
        alert(message);
      } else {
        alert('Erro inesperado');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Bem-vindo à sua carteira financeira</h1>
      <div className={`container ${isRegister ? 'active' : ''}`} id="container">
        <div className="form-container sign-up">
          <form onSubmit={(e) => e.preventDefault()}>
            <h1>Cadastrar</h1>
            <input type="email" placeholder="Email" ref={inputEmail} required />
            <input type="password" placeholder="Senha" ref={inputPassword} />
            <button type="button" onClick={registerUser}>Cadastre-se</button>
            {loading && <p>Cadastrando...</p>}
          </form>
        </div>

        <div className="form-container sign-in">
          <form onSubmit={(e) => e.preventDefault()}>
            <h1>Entrar</h1>
            <input type="email" placeholder="Email" ref={loginEmail} required />
            <input type="password" placeholder="Senha" ref={loginPassword} />
            <button type="button" onClick={loginUser}>Entrar</button>
            {loading && <p>Entrando...</p>}
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Bem-vindo de volta!</h1>
              <p>Insira seus dados pessoais para entrar na sua carteira</p>
              <button className="hidden" onClick={() => setIsRegister(false)}>Entrar</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Olá, amigo!</h1>
              <p>Cadastre-se com seus dados pessoais para usar sua carteira</p>
              <button className="hidden" onClick={() => setIsRegister(true)}>Cadastre-se</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
