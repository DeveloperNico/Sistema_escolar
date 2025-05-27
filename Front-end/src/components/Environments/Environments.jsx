import styles from './Environments.module.css';
import { useState, useEffect, use } from 'react';
import axios from 'axios';
import api from '../../api/axios';
import { Modal } from '../Modal/Modal';
import { Trash2, Pencil, Plus } from 'lucide-react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Api = axios.create({
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
    const [isEditing, setIsEditing] = useState(false);
    const [editEnvironmentId, setEditEnvironmentId] = useState(null);

    const handleEdit = (environment) => {
        const formatForInput = (isoString) => {
            const date = new Date(isoString);
            const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
        };

        setNewEnvironment({
            dt_inicio: formatForInput(environment.dt_inicio),
            dt_termino: formatForInput(environment.dt_termino),
            periodo: environment.periodo,
            sala_reservada: environment.sala_reservada,
            professor_responsavel_id: environment.professor_responsavel_id,
            disciplina_associada_id: environment.disciplina_associada_id
        });
        setEditEnvironmentId(environment.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setNewEnvironment({
            dt_inicio: '',
            dt_termino: '',
            periodo: 'Manhã',
            sala_reservada: '',
            professor_responsavel_id: '',
            disciplina_associada_id: ''
        });
        setEditEnvironmentId(null);
        setIsEditing(false);
        setShowModal(false);
    };

    const handleCreateEnvironment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (isEditing) {
            api.put(`http://localhost:8000/api/reservasambiente/${editEnvironmentId}/`, newEnvironment, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                api.get('http://localhost:8000/api/reservasambiente/', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setReservas(prev => prev.map(reserva => reserva.id === editEnvironmentId ? response.data : reserva));
                setShowModal(false);
                resetForm();
            })
            .catch(error => {
                console.error("Erro ao editar reserva:", error);
            });
        } else {
            api.post('http://localhost:8000/api/reservasambiente/', newEnvironment, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setReservas(prev => [...prev, response.data]);
                resetForm();
            })
            .catch(error => {
                console.error("Erro ao criar reserva:", error);
            });
        }
    };

    const handleDelete = (id) => {
        MySwal.fire({
            title: 'Tem certeza?',
            text: 'Você não poderá reverter essa ação!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                api.delete(`http://localhost:8000/api/ambientes/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(() => {
                    setReservas(prev => prev.filter(reservas => reservas.id !== id));
                    Swal.fire('Excluído!', 'A reserva foi removida.', 'success');
                })
                .catch(error => {
                    console.error("Erro ao deletar reserva:", error);
                    Swal.fire('Erro', 'Não foi possível excluir a reserva.', 'error');
                });
            }
        });
    };
    
    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    };

    useEffect(() => {
        const loadData = async () => {
            const token = localStorage.getItem('token');

            try {
                const delay = new Promise(resolve => setTimeout(resolve, 800)); // Garante 1s de carregamento

                const [resReservas, resProfessores, resDisciplinas] = await Promise.all([
                    api.get('http://localhost:8000/api/reservasambiente/', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    api.get('http://localhost:8000/api/usuarios/', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    api.get('http://localhost:8000/api/disciplinas/', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    delay
                ]);

                setReservas(resReservas.data);
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

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Carregando ambientes...</p>
            </div>
        );
    }

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
                                {cargo === 'G' && (
                                    <button onClick={() => handleDelete(r.id)} className={`${styles.iconButton} ${styles.iconTrash}`}>
                                        <Trash2 />
                                    </button>
                                )}
                                {cargo === 'G' && (
                                    <button onClick={() => handleEdit(r)} className={`${styles.iconButton} ${styles.iconPencil}`}>
                                        <Pencil />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal title={isEditing ? "Editar reserva" : "Reservar novo ambiente"} isOpen={showModal} onClose={resetForm}>
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
                    <button className={styles.button} type="submit">
                        {isEditing ? "Salvar" : "Reservar"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
