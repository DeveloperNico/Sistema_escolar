import styles from "./Forms.module.css";
import { BookOpenText } from 'lucide-react';
import { NavLink } from "react-router-dom";

export function Forms() {
    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <div className={styles.formContent}>
                    <div className={styles.formHeader}>
                        <BookOpenText className={styles.icon}/>
                        <h2 className={styles.title}>Login</h2>
                        <div className={styles.username}>
                            <label>Nome de usuário:</label>
                            <input type="text" />
                        </div>
                        <div className={styles.password}>
                            <label>Senha:</label>
                            <input type="password" />
                        </div>

                        <div className={styles.buttonContainer}>
                            <NavLink to="/home">
                                <button className={styles.button}>Entrar</button>
                            </NavLink>
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