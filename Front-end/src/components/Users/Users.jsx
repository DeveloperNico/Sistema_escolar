import styles from './Users.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function Users() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const cargoLabel = (sigla) => {
        if (sigla === "G") return "Gestor";
        if (sigla === "P") return "Professor";
        return "Desconhecido";
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8000/api/usuarios/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setUsuarios(response.data.usuarios || response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Erro ao buscar usuários:", error);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Carregando usuários...</p>

    return (
        <div className={styles.container}>
            <h1>Usuários</h1>
            <div className={styles.lista}>
                {usuarios.map(usuario => (
                    <div className={styles.card} key={usuario.id}>
                        <h2>{usuario.username}</h2>
                        <p><strong>Cargo:</strong> {cargoLabel(usuario.cargo)}</p>
                        <p><strong>NI:</strong> {usuario.ni}</p>
                        <p><strong>Telefone:</strong> {usuario.telefone}</p>
                        <p><strong>Nascimento:</strong> {usuario.dt_nascimento}</p>
                        <p><strong>Contratação:</strong> {usuario.dt_contratacao}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}