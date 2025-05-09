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
        <>
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

                            <div className={styles.actions}>
                                <button onClick={() => handleDelete(usuario.id)} className={styles.iconTrash}>
                                    <Trash2 />
                                </button>
                                <button onClick={() => handleEdit(usuario.id)} className={styles.iconPencil}>
                                    <Pencil />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}