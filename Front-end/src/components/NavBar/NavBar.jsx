import styles from './NavBar.module.css';
import { BookOpenText } from 'lucide-react';
import { NavLink } from "react-router-dom";

export function NavBar() {
    return (
        <nav className={styles.container}>
            <div className={styles.logo}>
                <BookOpenText className={styles.logoIcon}/>
                <h1>EduFlow</h1>
            </div>
            <div className={styles.nav}>
                <NavLink to="/home" className={({ isActive }) => isActive ? styles.active : undefined}>Home</NavLink>
                <NavLink to="/" className={({ isActive }) => isActive ? styles.active : undefined}>Login</NavLink>
            </div>
        </nav>
    )
}