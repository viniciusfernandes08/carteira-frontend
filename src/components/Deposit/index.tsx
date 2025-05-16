import { useState } from "react";
import api from "../../services/api";
import './styles.css';
import { isAxiosError } from "axios";

interface DepositProps {
  onSuccess: () => void;
}

function Deposit({ onSuccess} : DepositProps) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleDeposit() {
        if (!amount || parseFloat(amount) <= 0) {
          alert('Informe um valor válido para depósito.');
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          alert('Usuário não autenticado.');
          return;
        }

        setLoading(true)

        try {
            await api.post('/transactions/deposit', {
                amount: parseFloat(amount)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('Depósito realizado com sucesso!');
            setAmount('');
            onSuccess();
        } catch (error) {
          if (isAxiosError(error) && error.response?.data?.message) {
            alert(`Erro: ${error.response.data.message}`);
          } else {
            alert('Erro inesperado');
          }
        } finally {
            setLoading(false)
        }
    }

    return (
      <div className="deposit-container">
        <h3>Depositar</h3>
        <input
          type="number"
          placeholder="Valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleDeposit} disabled={loading}>
          {loading ? 'Processando...' : 'Depositar'}
        </button>
      </div>
    );
}

export default Deposit