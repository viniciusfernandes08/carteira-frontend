import { useState } from 'react';
import { isAxiosError } from 'axios';
import api from '../../services/api';
import './styles.css';

interface ReverseProps {
   onSuccess: () => void;
}

function Reverse({ onSuccess }: ReverseProps) {
  const [transactionId, setTransactionId] = useState('');

  async function handleReverse(e: React.FormEvent) {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      
      await api.post(`/transactions/${transactionId}/reverse`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Transação revertida com sucesso');
      setTransactionId('');
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
    <div className='reverse-container'>
      <form onSubmit={handleReverse} className="form-container">
        <h3>Reverter Transação</h3>
        <input
          type="number"
          placeholder="ID da transação"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          required
        />
        <button type="submit">REVERTER</button>
      </form>
    </div>
  );
}

export default Reverse;
