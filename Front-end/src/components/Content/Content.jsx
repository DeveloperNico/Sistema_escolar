import styles from './Content.module.css';
import { Menu } from '../Menu/Menu';

export function Content() {
    return (
        <main className={styles.container}>
            <Menu />
        </main>
    )
}