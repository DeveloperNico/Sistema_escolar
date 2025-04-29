import styles from './NavBar.module.css';

export function NavBar() {
    return (
        <nav className={styles.container}>
            <ul>
                <li>Escola</li>
                <li>Missão</li>
                <li>Visão</li>
                <li>Valores</li>
            </ul>
        </nav>
    )
}