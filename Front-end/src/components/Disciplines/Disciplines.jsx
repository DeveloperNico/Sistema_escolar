import styles from './Disciplines.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '../Modal/Modal';

import { Trash2, Pencil, Plus } from 'lucide-react';

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
        professor_responsavel_id: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editDisciplineId, setEditDisciplineId] = useState(null);

    const handleEdit = (discipline) => {
        setNewDiscipline({
            nome: discipline.nome,
            curso: discipline.curso,
            carga_horaria: discipline.carga_horaria,
            descricao: discipline.descricao,
            professor_responsavel_id: discipline.professor_responsavel_id
        });
        setEditDisciplineId(discipline.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setNewDiscipline({
            nome: '',
            curso: '',
            carga_horaria: '',
            descricao: '',
            professor_responsavel_id: ''
        });
        setEditDisciplineId(null);
        setIsEditing(false);
        setShowModal(false);
    };
    
    const handleCreateDiscipline = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (isEditing) {
            axios.put(`http://localhost:8000/api/disciplinas/${editDisciplineId}/`, newDiscipline, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                axios.get('http://localhost:8000/api/disciplinas/', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setDisciplinas(prev => prev.map(d => d.id === editDisciplineId ? response.data : d));
                setShowModal(false);
                resetForm();
            })
            .catch(error => {
                console.error("Erro ao editar disciplina:", error);
            })
        } else {
            axios.post('http://localhost:8000/api/disciplinas/', newDiscipline, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setDisciplinas(prev => [...prev, response.data]);
                resetForm();
            })
            .catch(error => {
                console.error("Erro ao criar disciplina:", error);
            });
        }
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:8000/api/disciplinas/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setDisciplinas(prev => prev.filter(d => d.id !== id));
        })
        .catch(error => {
            if (error.response?.status === 403) {
                alert("Você não tem permissão para deletar disciplinas.");
            } else {
                console.error("Erro ao deletar disciplina:", error);
            }
        });
    };

    useEffect(() => {
        const loadProfessores = async () => {
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

            try {
                const [resProfs] = await Promise.all([
                    api.get('usuarios/'),
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


    const formatHour = (input) => {
        if (!input) return "";
        const horas = input.toString().replace(/[^\d]/g, "");
        return `${horas}h`;
    };

    if (loading) return <p>Carregando disciplinas...</p>;

    const cargo = localStorage.getItem('cargo');

    return (
        <div className={styles.center}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Disciplinas</h1>
                    {cargo === 'G' && (
                        <button className={styles.addButton} onClick={() => setShowModal(true)}>
                            <Plus />
                            Add. Disciplina
                        </button>
                    )}
                </div>
                <div className={styles.list}>
                    {disciplinas.map(d => (
                        <div className={styles.card} key={d.id}>
                            <h2>{d.nome}</h2>
                            <p><strong>Curso:</strong> {d.curso}</p>
                            <p><strong>Carga horária:</strong> {formatHour(d.carga_horaria)}</p>
                            <p><strong>Descrição:</strong> {d.descricao || "Sem descrição"}</p>
                            <p><strong>Professor:</strong> {d.professor_responsavel?.username || "Professor não encontrado"}</p>

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
            <Modal title={isEditing ? "Editar disciplina" : "Adicionar nova disciplina"} isOpen={showModal} onClose={resetForm}>
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
                        <select className={styles.inputChoices} value={newDiscipline.professor_responsavel_id} 
                            onChange={(e) => setNewDiscipline({...newDiscipline, professor_responsavel_id: e.target.value})}>
                            {professores.map(p => (
                                <option key={p.id} value={p.id}>{p.username}</option>
                            ))}
                        </select>
                    </label>

                    <button className={styles.button} type="submit">
                        {isEditing ? "Salvar" : "Adicionar"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
