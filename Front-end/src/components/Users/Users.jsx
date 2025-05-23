import styles from './Users.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '../Modal/Modal';

import { Trash2 } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { Plus } from 'lucide-react';

export function Users() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        cargo: 'P',
        ni: '',
        telefone: '',
        dt_nascimento: '',
        dt_contratacao: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editUserId, setEditUserId] = useState(null);

    const handleEdit = (id) => {
        setNewUser({
            username: id.username,
            password: id.password,
            cargo: id.cargo,
            ni: id.ni,
            telefone: id.telefone,
            dt_nascimento: id.dt_nascimento,
            dt_contratacao: id.dt_contratacao
        });
        setEditUserId(id.id);
        setIsEditing(true);
        setShowModal(true);
    };
    
    const resetForm = () => {
        setNewUser({
            username: '',
            password: '',
            cargo: 'P',
            ni: '',
            telefone: '',
            dt_nascimento: '',
            dt_contratacao: ''
        });
        setEditUserId(null);
        setIsEditing(false);
        setShowModal(false);
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (isEditing) {
            axios.put(`http://localhost:8000/api/usuarios/${editUserId}/`, newUser, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                axios.get('http://localhost:8000/api/usuarios/', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUsuarios(prev => prev.map(user => user.id === editUserId ? response.data : user));
                setShowModal(false);
                resetForm();
            })
            .catch(error => {
                console.error("Erro ao editar usuário:", error);
            });
        } else {
            axios.post('http://localhost:8000/api/usuarios/', newUser, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setUsuarios(prev => [...prev, response.data]);
                resetForm();
            })
            .catch(error => {
                console.error("Erro ao criar usuário:", error);
            });
        }
    };

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

    if (loading) return <p>Carregando usuários...</p>

    return (
        <div className={styles.center}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Usuários</h1>
                    <button className={styles.addButton} onClick={() => setShowModal(true)}>
                        <Plus />
                        Add. Usuário
                    </button>
                </div>
                <div className={styles.list}>
                    {usuarios
                        .filter(usuario => usuario.username?.trim().toLowerCase() !== "admin")
                        .map(usuario => (
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
            <Modal title={isEditing ? "Editar usuário" : "Cadastrar novo usuário"} isOpen={showModal} onClose={resetForm}>
                <form onSubmit={handleCreateUser} className={styles.form}>
                    <label>
                        Nome de usuário:
                        <input className={styles.inputModal} type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
                    </label>
                    <label>
                        Senha:
                        <input className={styles.inputModal} type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
                    </label>
                    <label>
                        Cargo:
                        <select className={styles.inputChoices} value={newUser.cargo} onChange={(e) => setNewUser({ ...newUser, cargo: e.target.value })}>
                            <option value="P">Professor</option>
                            <option value="G">Gestor</option>
                        </select>
                    </label>
                    <label>
                        NI:
                        <input className={styles.inputModal} type="text" value={newUser.ni} onChange={(e) => setNewUser({ ...newUser, ni: e.target.value })} />
                    </label>
                    <label>
                        Telefone:
                        <input className={styles.inputModal} type="text" value={newUser.telefone} onChange={(e) => setNewUser({ ...newUser, telefone: e.target.value })} />
                    </label>
                    <label>
                        Data de nascimento:
                        <input className={styles.inputModal} type="date" value={newUser.dt_nascimento} onChange={(e) => setNewUser({ ...newUser, dt_nascimento: e.target.value })} />
                    </label>
                    <label>
                        Data de contratação:
                        <input className={styles.inputModal} type="date" value={newUser.dt_contratacao} onChange={(e) => setNewUser({ ...newUser, dt_contratacao: e.target.value })} />
                    </label>

                    <button className={styles.button} type="submit">
                        {isEditing ? "Salvar" : "Cadastrar"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}