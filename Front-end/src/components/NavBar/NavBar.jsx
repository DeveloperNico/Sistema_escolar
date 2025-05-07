import styles from './NavBar.module.css';
import { BookOpenText } from 'lucide-react';

export function NavBar() {
    return (
        <nav className={styles.container}>
            <div className={styles.logo}>
                <BookOpenText className={styles.logoIcon}/>
                <h1>EduFlow</h1>
            </div>
            <ul>
                <li>Home</li>
                <li>Login</li>
            </ul>
        </nav>
    )
}