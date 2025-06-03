import styles from './Users.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '../Modal/Modal';
import api from '../../api/axios';
import { set, z } from 'zod';

import { Trash2 } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { Plus } from 'lucide-react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Funções auxiliares para validação de data
function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString().split("T")[0];
}

function getYear(dateString) {
  return new Date(dateString).getFullYear();
}

const userSchema = z.object({
    username: z.string()
        .min(3, "Nome de usuário deve ter pelo menos 3 caracteres")
        .max(15, "Nome de usuário deve ter no máximo 15 caracteres"),
    password: z.string({required_error: "Senha é obrigatória"})
        .min(1, "Senha é obrigatória")
        .max(15, "Senha deve ter no máximo 15 caracteres"),
    cargo: z.enum(['P', 'G'], { 
        message: "Cargo deve ser 'P' (Professor) ou 'G' (Gestor)" 
    }),
    ni: z.string()
        .min(8, "NI deve ter no máximo 8 caracteres"),
    telefone: z.string()
        .min(13, "Telefone deve ter no máximo 13 caracteres no formato XX XXXXX-XXXX"),

    dt_nascimento: z.string()
        .refine(isValidDate, {
            message: "Data de nascimento deve ser uma data válida no formato YYYY-MM-DD",
        })
        .refine((val) => {
            const year = getYear(val);
            return year >= 1950 && year <= 2025;
        }, {
            message: 'Ano de nascimento deve estar entre 1950 e 2025'
        }),

    dt_contratacao: z.string()
        .refine(isValidDate, {
            message: "Data de contratação deve ser uma data válida no formato YYYY-MM-DD",
        })
        .refine((val) => {
            const year = getYear(val);
            return year >= 1950 && year <= 2025;
        }, {
            message: "Ano de contratação deve estar entre 1950 e 2025"
        }),
}).refine(data => {
    if (!isValidDate(data.dt_nascimento) || !isValidDate(data.dt_contratacao)) return true;

    const nascimento = new Date(data.dt_nascimento);
    const contratacao = new Date(data.dt_contratacao);

    const idade = contratacao.getFullYear() - nascimento.getFullYear();
    const aniversarioPassou = 
        contratacao.getMonth() > nascimento.getMonth() || 
        (contratacao.getMonth() === nascimento.getMonth() && contratacao.getDate() >= nascimento.getDate());

    const idadeReal = aniversarioPassou ? idade : idade - 1;

    return idadeReal >= 16;
}, {
    message: "Usuário deve ter no mínimo 16 anos na data da contratação",
    path: ['dt_contratacao']
});

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
    const [formErrors, setFormErrors] = useState({});

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

        const validation = userSchema.safeParse(newUser);

        if (!validation.success) {
            const fieldErrors = {};
            validation.error.errors.forEach(err => {
                fieldErrors[err.path[0]] = err.message;
            });
            setFormErrors(fieldErrors);
            return;
        }

        setFormErrors({}); // Limpa erros se passou na validação

        if (isEditing) {
            api.put(`http://localhost:8000/api/usuarios/${editUserId}/`, newUser, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setUsuarios(prev => prev.map(user => user.id === editUserId ? response.data : user));
                resetForm();
            })
            .catch(error => {
                console.error("Erro ao editar usuário:", error);
            });
        } else {
            api.post('http://localhost:8000/api/usuarios/', newUser, {
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
                axios.delete(`http://localhost:8000/api/usuarios/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(() => {
                    setUsuarios(prev => prev.filter(user => user.id !== id));
                    Swal.fire('Excluído!', 'O usuário foi removido.', 'success');
                })
                .catch(error => {
                    console.error("Erro ao deletar usuário:", error);
                    Swal.fire('Erro', 'Não foi possível excluir o usuário.', 'error');
                });
            }
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

        api.get('http://localhost:8000/api/usuarios/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setTimeout(() => {
                setUsuarios(response.data.usuarios || response.data);
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
                <form onSubmit={handleCreateUser} className={styles.form} noValidate>
                    <label className={styles.label}>
                        Nome de usuário:
                        <input className={styles.inputModal} type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
                        {formErrors.username && <span className={styles.error}>{formErrors.username}</span>}
                    </label>
                    <label className={styles.label}>
                        Senha:
                        <input className={styles.inputModal} type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                        {formErrors.password && <span className={styles.error}>{formErrors.password}</span>}
                    </label>
                    <label className={styles.label}>
                        Cargo:
                        <select className={styles.inputChoices} value={newUser.cargo} onChange={(e) => setNewUser({ ...newUser, cargo: e.target.value })}>
                            <option value="P">Professor</option>
                            <option value="G">Gestor</option>
                        </select>
                    </label>
                    <label className={styles.label}>
                        NI:
                        <input className={styles.inputModal} type="text" value={newUser.ni} onChange={(e) => setNewUser({ ...newUser, ni: e.target.value })} />
                        {formErrors.ni && <span className={styles.error}>{formErrors.ni}</span>}
                    </label>
                    <label className={styles.label}>
                        Telefone:
                        <input className={styles.inputModal} type="text" value={newUser.telefone} onChange={(e) => setNewUser({ ...newUser, telefone: e.target.value })} />
                        {formErrors.telefone && <span className={styles.error}>{formErrors.telefone}</span>}
                    </label>
                    <label className={styles.label}>
                        Data de nascimento:
                        <input className={styles.inputModal} type="date" value={newUser.dt_nascimento} onChange={(e) => setNewUser({ ...newUser, dt_nascimento: e.target.value })} />
                        {formErrors.dt_nascimento && <span className={styles.error}>{formErrors.dt_nascimento}</span>}
                    </label>
                    <label className={styles.label}>
                        Data de contratação:
                        <input className={styles.inputModal} type="date" value={newUser.dt_contratacao} onChange={(e) => setNewUser({ ...newUser, dt_contratacao: e.target.value })} />
                        {formErrors.dt_contratacao && <span className={styles.error}>{formErrors.dt_contratacao}</span>}
                    </label>

                    <button className={styles.button} type="submit">
                        {isEditing ? "Salvar" : "Cadastrar"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}