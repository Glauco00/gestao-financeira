import React from 'react';
import { useTransactions } from '../hooks/useTransactions';

const TransactionList = () => {
    const { transactions } = useTransactions();

    return (
        <div className="transaction-list">
            <h2>Lista de Transações</h2>
            {transactions.length === 0 ? (
                <p>Nenhuma transação encontrada.</p>
            ) : (
                <ul>
                    {transactions.map(transaction => (
                        <li key={transaction.id}>
                            <span>{transaction.description}</span>
                            <span>{transaction.amount}</span>
                            <span>{transaction.date}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TransactionList;