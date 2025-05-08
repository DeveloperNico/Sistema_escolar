import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const auth = localStorage.getItem("access");  // Ou outra lógica de verificação de autenticação

    // Se o usuário não estiver autenticado, redireciona para o login
    if (!auth) {
        return <Navigate to="/" />;
    }

    // Se o usuário estiver autenticado, renderiza os componentes filhos (Outlet)
    return <Outlet />;
};

export default PrivateRoute;
