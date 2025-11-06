import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';

const TransactionForm = () => {
    const { addTransaction } = useTransactions();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('income');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description || !amount) return;

        addTransaction({
            description,
            amount: parseFloat(amount),
            type,
            date: new Date().toISOString(),
        });

        setDescription('');
        setAmount('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="description">Descrição:</label>
                <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="amount">Valor:</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="type">Tipo:</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                </select>
            </div>
            <button type="submit">Adicionar Transação</button>
        </form>
    );
};

export default TransactionForm;