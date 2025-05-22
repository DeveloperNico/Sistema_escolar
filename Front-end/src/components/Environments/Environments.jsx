import styles from './Environments.module.css';
import { useState, useEffect, use } from 'react';
import axios from 'axios';
import { Modal } from '../Modal/Modal';
import { Trash2, Pencil, Plus } from 'lucide-react';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export function Environments() {
    const [reservas, setReservas] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [newEnvironment, setNewEnvironment] = useState({
        dt_inicio: '',
        dt_termino: '',
        periodo: 'Manhã',
        sala_reservada: '',
        professor_responsavel_id: '',
        disciplina_associada_id: ''
    });

    useEffect(() => {
        const loadData = async () => {
            const token = localStorage.getItem('token');

            axios.get('http://localhost:8000/api/reservasambiente/', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setReservas(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao carregar reservas:", error);
                setLoading(false);
            });

            try {
                const [resEnvironment, resProfessores, resDisciplinas] = await Promise.all ([
                    api.get('reservasambiente/'),
                    api.get('usuarios/'),
                    api.get('disciplinas/')
                ]);
                setReservas(resEnvironment.data);
                setProfessores(resProfessores.data);
                setDisciplinas(resDisciplinas.data);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleCreateEnvironment = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('reservasambiente/', newEnvironment);
            setReservas(prev => [...prev, res.data]);
            setShowModal(false);
            setNewEnvironment({
                dt_inicio: '',
                dt_termino: '',
                periodo: 'Manhã',
                sala_reservada: '',
                professor_responsavel_id: '',
                disciplina_associada_id: ''
            });
        } catch (error) {
            console.error("Erro ao reservar ambiente:", error);
        }
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:8000/api/reservasambiente/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setReservas(prev => prev.filter(reservas => reservas.id !== id));
        })
        .catch(error => {
            console.error("Erro ao reserva de ambiente:", error);
        });
    };

    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    };

    if (loading) return <p>Carregando reservas...</p>;

    const cargo = localStorage.getItem('cargo');

    return (
        <div className={styles.center}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Reservas de Ambiente</h1>
                    {cargo === 'G' && (
                        <button className={styles.addButton} onClick={() => setShowModal(true)}>
                            <Plus /> Add. Reserva
                        </button>
                    )}
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
                                <button onClick={() => console.log("Editar", r)} className={`${styles.iconButton} ${styles.iconPencil}`}>
                                    <Pencil />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal title="Reservar novo ambiente" isOpen={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={handleCreateEnvironment} className={styles.form}>
                    <label>
                        Data de início:
                        <input className={styles.inputModal} type="datetime-local" value={newEnvironment.dt_inicio}
                            onChange={(e) => setNewEnvironment({ ...newEnvironment, dt_inicio: e.target.value })} />
                    </label>
                    <label>
                        Data de término:
                        <input className={styles.inputModal} type="datetime-local" value={newEnvironment.dt_termino}
                            onChange={(e) => setNewEnvironment({ ...newEnvironment, dt_termino: e.target.value })} />
                    </label>
                    <label>
                        Período:
                        <select className={styles.inputChoices} value={newEnvironment.periodo}
                            onChange={(e) => setNewEnvironment({ ...newEnvironment, periodo: e.target.value })}>
                            <option value="Manhã">Manhã</option>
                            <option value="Tarde">Tarde</option>
                            <option value="Noite">Noite</option>
                        </select>
                    </label>
                    <label>
                        Sala reservada:
                        <input className={styles.inputModal} type="text" value={newEnvironment.sala_reservada}
                            onChange={(e) => setNewEnvironment({ ...newEnvironment, sala_reservada: e.target.value })} required />
                    </label>
                    <label>
                        Professor responsável:
                        <select className={styles.inputChoices} value={newEnvironment.professor_responsavel_id}
                            onChange={(e) => setNewEnvironment({ ...newEnvironment, professor_responsavel_id: parseInt(e.target.value) })} required>
                            <option value="">Selecione</option>
                            {professores.map(p => (
                                <option key={p.id} value={p.id}>{p.username}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Disciplina associada:
                        <select className={styles.inputChoices} value={newEnvironment.disciplina_associada_id}
                            onChange={(e) => setNewEnvironment({ ...newEnvironment, disciplina_associada_id: parseInt(e.target.value) })} required>
                            <option value="">Selecione</option>
                            {disciplinas.map(d => (
                                <option key={d.id} value={d.id}>{d.nome}</option>
                            ))}
                        </select>
                    </label>
                    <button className={styles.button} type="submit">Reservar</button>
                </form>
            </Modal>
        </div>
    );
}
