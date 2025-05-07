import styles from "./Forms.module.css";
import { BookOpenText } from 'lucide-react';

export function Forms() {
    return (
        <form className={styles.form}>
            <BookOpenText className={styles.icon}/>
            <div className={styles.username}>
                <label>Nome de usuário:</label>
                <input type="text" />
            </div>
            <div className={styles.password}>
                <label>Senha:</label>
                <input type="text" />
            </div>
            <button>Entrar</button>
        </form>
    );
};