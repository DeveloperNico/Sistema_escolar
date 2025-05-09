import styles from './Users.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { Trash2 } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { Plus } from 'lucide-react';

export function Users() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const cargoLabel = (sigla) => {
        if (sigla === "G") return "Gestor";
        if (sigla === "P") return "Professor";
        return "Desconhecido";
    };

    const formatDate = (dataStr) => {
        if (!dataStr) return "";
        const [ano, mes, dia] = dataStr.split("-");
        return `${dia}/${mes}/${ano}`;
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

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:8000/api/usuarios/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setUsuarios(prev => prev.filter(user => user.id !== id));
        })
        .catch(error => {
            console.error("Erro ao deletar usuário:", error);
        });
    };

    const handleEdit = (id) => {
        // Aqui você pode redirecionar para uma tela de edição ou abrir um modal
        console.log("Editar usuário com ID:", id);
        // Exemplo: navigate(`/editar-usuario/${id}`);
    };


    if (loading) return <p>Carregando usuários...</p>

    return (
        <div className={styles.center}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Usuários</h1>
                    <button className={styles.addButton}>
                        <Plus />
                        Add. Usuário
                    </button>
                </div>
                <div className={styles.list}>
                    {usuarios.map(usuario => (
                        <div className={styles.card} key={usuario.id}>
                            <h2>{usuario.username}</h2>
                            <p><strong>Cargo:</strong> {cargoLabel(usuario.cargo)}</p>
                            <p><strong>NI:</strong> {usuario.ni}</p>
                            <p><strong>Telefone:</strong> {usuario.telefone}</p>
                            <p><strong>Nascimento:</strong> {formatDate(usuario.dt_nascimento)}</p>
                            <p><strong>Contratação:</strong> {formatDate(usuario.dt_contratacao)}</p>

                            <div className={styles.actions}>
                                <button onClick={() => handleDelete(usuario.id)} className={`${styles.iconButton} ${styles.iconTrash}`}>
                                    <Trash2 />
                                </button>
                                <button onClick={() => handleEdit(usuario)} className={`${styles.iconButton} ${styles.iconPencil}`}>
                                    <Pencil />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}