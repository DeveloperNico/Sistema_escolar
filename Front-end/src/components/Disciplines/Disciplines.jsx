import styles from './Disciplines.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '../Modal/Modal';

import { Trash2, Pencil, Plus } from 'lucide-react';
import { Apple } from 'lucide-react';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export function Disciplines() {
    const [disciplinas, setDisciplinas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [professores, setProfessores] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [newDiscipline, setNewDiscipline] = useState({
        nome: '',
        curso: '',
        carga_horaria: '',
        descricao: '',
        professor: ''
    });

    useEffect(() => {
        const loadProfessores = async () => {
            try {
                const [resProfs] = await Promise.all([
                    api.get('usuarios/')
                ]);
                setProfessores(resProfs.data);
            } catch (error) {
                console.error("Erro ao carregar professores:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProfessores();
    }, []);

    const handleCreateDiscipline = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('disciplinas/', newDiscipline);
            setDisciplinas(prev = [...prev, res.data]);
            setShowModal(false);
            setNewDiscipline({
                nome: '',
                curso: '',
                carga_horaria: '',
                descricao: '',
                professor_responsavel_id: ''
            });
        } catch (error) {
            console.error("Erro ao criar disciplina:", error);
        }
    };

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
                    <button className={styles.addButton} onClick={() => setShowModal(true)}>
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
            <Modal title="Adicionar nova disciplina" isOpen={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={handleCreateDiscipline} className={styles.form}>
                    <label>
                        Nome:
                        <input className={styles.inputModal} type="text" value={newDiscipline.nome} 
                            onChange={(e) => setNewDiscipline({...newDiscipline, nome: e.target.value})} />
                    </label>
                    <label>
                        Curso:
                        <input className={styles.inputModal} type="text" value={newDiscipline.curso} 
                            onChange={(e) => setNewDiscipline({...newDiscipline, curso: e.target.value})} />
                    </label>
                    <label>
                        Carga horária:
                        <input className={styles.inputModal} type="number" value={newDiscipline.carga_horaria} 
                            onChange={(e) => setNewDiscipline({...newDiscipline, carga_horaria: e.target.value})} />
                    </label>
                    <label>
                        Descrição:
                        <textarea className={styles.inputModal} value={newDiscipline.descricao} 
                            onChange={(e) => setNewDiscipline({...newDiscipline, descricao: e.target.value})} />
                    </label>
                    <label>
                        Professor:
                        <select className={styles.inputChoices} value={newDiscipline.professor} 
                            onChange={(e) => setNewDiscipline({...newDiscipline, professor: e.target.value})}>
                            {professores.map(p => (
                                <option key={p.id} value={p.id}>{p.username}</option>
                            ))}
                        </select>
                    </label>

                    <button className={styles.button} type="submit">Adicionar</button>
                </form>
            </Modal>
        </div>
    );
}
