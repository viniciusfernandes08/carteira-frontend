import './styles.css';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from '../../services/api';
import Deposit from '../../components/Deposit';
import Transfer from '../../components/Transfer';
import Reverse from '../../components/Reverse';

interface Transaction {
    id: number,
    type: 'depósito' | 'transferência' | 'reversão',
    amount: number,
    date: string
}

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await api.get('/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBalance(response.data.data.balance ?? 0);
      setTransactions(response.data.data.transactions ?? []);
    } catch (error) {
      if (isAxiosError(error)) {
        alert('Erro ao fazer login');
      } else {
        alert('Erro inesperado');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function logout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className="dashboard-container">
      <header>
        <h2>Minha Carteira</h2>
        <section className="balance">
          <h3>Saldo Atual:</h3>
          <p>R$ {typeof balance === 'number'? balance.toFixed(2) : 'Carregando...'}</p>
        </section>
        <button onClick={logout}>Sair</button>
      </header>

      <main>
        <div className='container-transactions'>
          <section className="actions">
            <Deposit onSuccess={fetchData} />
            <Transfer onSuccess={fetchData} />
            <Reverse onSuccess={fetchData} />
          </section>

          <section className="transactions">
            <h3>Histórico de Transações</h3>
            <div className='infos'>
              {transactions.map((t) => (
                <div key={t.id}>
                  <p>{t.type}: R$ {t.amount} </p>
                  <p>{new Date(t.date).toLocaleString()} </p>
                  <p>ID da transação: {t.id} </p>
                </div>  
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
