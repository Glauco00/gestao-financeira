import React from 'react';
import { useAuth } from '../context/AuthContext';

const Configuracoes = () => {
    const { user, logout } = useAuth();
    return (
        <div>
            <h1>Configurações</h1>
            <div className="card">
                <p>Usuário: {user?.email}</p>
                <button onClick={logout}>Sair</button>
            </div>
        </div>
    );
};

export default Configuracoes;