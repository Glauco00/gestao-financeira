import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import { useTransactionsContext } from '../context/TransactionsContext';

const Transacoes = () => {
    const { transactions, addTransaction, removeTransaction } = useTransactionsContext();
    const [isEditing, setIsEditing] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);

    const handleEdit = (transaction) => {
        setCurrentTransaction(transaction);
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        removeTransaction(id);
    };

    const handleFormSubmit = (transaction) => {
        if (isEditing) {
            // Update existing transaction logic here
        } else {
            addTransaction(transaction);
        }
        setIsEditing(false);
        setCurrentTransaction(null);
    };

    useEffect(() => {
        // Fetch transactions if needed
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Transações</h1>
                <Link to="/transacoes/adicionar">Adicionar</Link>
            </div>

            <TransactionForm 
                onSubmit={handleFormSubmit} 
                currentTransaction={currentTransaction} 
                isEditing={isEditing} 
            />
            <div className="card" style={{ marginTop: 12 }}>
                {transactions.length === 0 ? (
                    <p>Nenhuma transação encontrada.</p>
                ) : (
                    <TransactionList 
                        transactions={transactions} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                    />
                )}
            </div>
        </div>
    );
};

export default Transacoes;