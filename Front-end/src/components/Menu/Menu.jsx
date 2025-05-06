import styles from './Menu.module.css';
import { GraduationCap } from 'lucide-react';
import { User } from 'lucide-react';
import { CalendarDays } from 'lucide-react';
import { FileChartColumnIncreasing } from 'lucide-react';

export function Menu() {
    return (
        <div className={styles.container}>
            <div className={`${styles.card} ${styles.card1}`}>
                <a href="#">Usuários</a>
                <User className={styles.user}/>
            </div>
            <div className={`${styles.card} ${styles.card2}`}>
                <a href="#">Professores</a>
                <GraduationCap className={styles.graduationCap}/>
            </div>
            <div className={`${styles.card} ${styles.card3}`}>
                <a href="#">Disciplinas</a>
                <FileChartColumnIncreasing className={styles.fileChart}/>
            </div>
            <div className={`${styles.card} ${styles.card4}`}>
                <a href="#">Ambientes <br/> reservados</a>
                <CalendarDays className={styles.calendarDays}/>
            </div>
        </div>
    )
}