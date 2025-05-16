import { useState } from 'react';
import api from '../../services/api';
import { isAxiosError } from 'axios';
import './styles.css';

interface TransferProps {
   onSuccess: () => void;
}

function Transfer({ onSuccess }: TransferProps) {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await api.post('/transactions/transfer', {
        to: email,
        amount: parseFloat(amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Transferência realizada com sucesso');
      setEmail('');
      setAmount('');
      onSuccess();
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        alert(`Erro: ${error.response.data.message}`);
      } else {
        alert('Erro inesperado');
      }
    }
  }

  return (
    <div className='transfer-container'>
      <form onSubmit={handleTransfer} className="form-container">
        <h3>Transferir</h3>
        <input
          type="email"
          placeholder="E-mail do destinatário"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Confirmar Transferência</button>
      </form>
    </div>
  );
}

export default Transfer;
