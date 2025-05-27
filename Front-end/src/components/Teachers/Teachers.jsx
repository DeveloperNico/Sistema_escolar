import styles from './Teachers.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { Trash2 } from 'lucide-react';
import { Pencil } from 'lucide-react';

export function Teachers() {
    const [professores, setProfessores] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dataStr) => {
        if (!dataStr) return "";
        const [ano, mes, dia] = dataStr.split("-");
        return `${dia}/${mes}/${ano}`;
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:8000/api/usuarios/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setProfessores(prev => prev.filter(prof => prof.id !== id)); // Corrigido aqui
        })
        .catch(error => {
            console.error("Erro ao deletar professor:", error);
        });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8000/api/professores/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setTimeout(() => {
                setProfessores(response.data.professores || response.data);
                setLoading(false);
            }, 1000);
        })
        .catch(error => {
            console.error("Erro ao buscar usuários:", error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Carregando usuários...</p>
            </div>
        );
    }

    return (
        <div className={styles.center}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Professores</h1>
                </div>
                <div className={styles.list}>
                    {professores
                        .filter(professor => professor.username?.trim().toLowerCase() !== "admin")
                        .map(professor => (
                        <div className={styles.card} key={professor.id}>
                            <h2>{professor.username}</h2>
                            <p><strong>NI:</strong> {professor.ni}</p>
                            <p><strong>Telefone:</strong> {professor.telefone}</p>
                            <p><strong>Nascimento:</strong> {formatDate(professor.dt_nascimento)}</p>
                            <p><strong>Contratação:</strong> {formatDate(professor.dt_contratacao)}</p>

                            <div className={styles.actions}>
                                <button onClick={() => handleDelete(professor.id)} className={`${styles.iconButton} ${styles.iconTrash}`}>
                                    <Trash2 />
                                </button>
                                <button onClick={() => handleEdit(professor)} className={`${styles.iconButton} ${styles.iconPencil}`}>
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
