import styles from './Disciplines.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { Trash2, Pencil, Plus } from 'lucide-react';
import { Apple } from 'lucide-react';

export function Disciplines() {
    const [disciplinas, setDisciplinas] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatHour = (input) => {
        if (!input) return "";
        const horas = input.toString().replace(/[^\d]/g, "");
        return `${horas}h`;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8000/api/disciplinas/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setDisciplinas(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Erro ao buscar disciplinas:", error);
            setLoading(false);
        });
    }, []);

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:8000/api/disciplinas/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setDisciplinas(prev => prev.filter(d => d.id !== id));
        })
        .catch(error => {
            console.error("Erro ao deletar disciplina:", error);
        });
    };

    const handleEdit = (disciplina) => {
        console.log("Editar disciplina com ID:", disciplina.id);
        // Exemplo: navigate(`/editar-disciplina/${disciplina.id}`);
    };

    if (loading) return <p>Carregando disciplinas...</p>;

    return (
        <div className={styles.center}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Disciplinas</h1>
                    <button className={styles.addButton}>
                        <Plus />
                        Add. Disciplina
                    </button>
                </div>
                <div className={styles.list}>
                    {disciplinas.map(d => (
                        <div className={styles.card} key={d.id}>
                            <h2>{d.nome}</h2>
                            <p><strong>Curso:</strong> {d.curso}</p>
                            <p><strong>Carga horária:</strong> {formatHour(d.carga_horaria)}</p>
                            <p><strong>Descrição:</strong> {d.descricao || "Sem descrição"}</p>
                            <p><strong>Professor:</strong> {d.professor?.username || "N/A"}</p>

                            <div className={styles.actions}>
                                <button onClick={() => handleDelete(d.id)} className={`${styles.iconButton} ${styles.iconTrash}`}>
                                    <Trash2 />
                                </button>
                                <button onClick={() => handleEdit(d)} className={`${styles.iconButton} ${styles.iconPencil}`}>
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
