import styles from './Environments.module.css'; // Ou './Reservas.module.css' se preferir separado
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Pencil, Plus } from 'lucide-react';

export function Environments() {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    };    

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8000/api/reservasambiente/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setReservas(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Erro ao buscar reservas:", error);
            setLoading(false);
        });
    }, []);

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:8000/api/reservas/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setReservas(prev => prev.filter(r => r.id !== id));
        })
        .catch(error => {
            console.error("Erro ao deletar reserva:", error);
        });
    };

    const handleEdit = (reserva) => {
        console.log("Editar reserva com ID:", reserva.id);
        // Exemplo: navigate(`/editar-reserva/${reserva.id}`);
    };

    if (loading) return <p>Carregando reservas...</p>;

    return (
        <div className={styles.center}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Reservas de Ambiente</h1>
                    <button className={styles.addButton}>
                        <Plus />
                        Add. Reserva
                    </button>
                </div>
                <div className={styles.list}>
                    {reservas.map(r => (
                        <div className={styles.card} key={r.id}>
                            <h2>{r.sala_reservada}</h2>
                            <p><strong>Período:</strong> {r.periodo}</p>
                            <p><strong>Início:</strong> {formatDateTime(r.dt_inicio)}</p>
                            <p><strong>Término:</strong> {formatDateTime(r.dt_termino)}</p>
                            <p><strong>Disciplina:</strong> {r.disciplina_associada?.nome || 'N/A'}</p>
                            <p><strong>Professor:</strong> {r.professor_responsavel?.username || 'N/A'}</p>

                            <div className={styles.actions}>
                                <button onClick={() => handleDelete(r.id)} className={`${styles.iconButton} ${styles.iconTrash}`}>
                                    <Trash2 />
                                </button>
                                <button onClick={() => handleEdit(r)} className={`${styles.iconButton} ${styles.iconPencil}`}>
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
