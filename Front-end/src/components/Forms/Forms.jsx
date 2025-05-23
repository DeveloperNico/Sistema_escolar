import styles from "./Forms.module.css";
import { BookOpenText } from 'lucide-react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Forms() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/api/login/", {
                username,
                password
            });

            const { access, refresh } = response.data;
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);

            localStorage.setItem("token", access);

            const userRes = await axios.get("http://localhost:8000/api/me/", {
                headers: { Authorization: `Bearer ${access}` }
            });

            const { cargo, id } = userRes.data;

            localStorage.setItem("cargo", cargo);
            localStorage.setItem("userId", id);

            console.log("Nome do usuário:", userRes.data.username);
            console.log("Cargo do usuário:", cargo);

            navigate("/home");
        } catch (error) {
            alert("Erro ao fazer login. Verifique suas credenciais.");
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleLogin}>
                <div className={styles.formContent}>
                    <div className={styles.formHeader}>
                        <BookOpenText className={styles.icon}/>
                        <h2 className={styles.title}>Login</h2>
                        <div className={styles.username}>
                            <label>Nome de usuário:</label>
                            <input className={styles.input} type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className={styles.password}>
                            <label>Senha:</label>
                            <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        <div className={styles.buttonContainer}>
                            <button type="submit" className={styles.button}>
                                Entrar
                            </button>
                        </div>
                    </div>

                    <div className={styles.imageContainer}>
                        <img src="/Images/topo-blogo_Prancheta-1.png" alt="Imagem para exemplificar uma gestão escolar" className={styles.image}/>
                    </div>
                </div>
            </form>
        </div>
    );
};