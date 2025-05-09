import { useState } from 'react';
import styles from './Menu.module.css';
import { GraduationCap } from 'lucide-react';
import { User } from 'lucide-react';
import { CalendarDays } from 'lucide-react';
import { FileChartColumnIncreasing } from 'lucide-react';

// Componentes que serão rendereizados no menu
import { Users } from '../Users/Users';
import { Teachers } from '../Teachers/Teachers';
import { Disciplines } from '../Disciplines/Disciplines';
import { Environments } from '../Environments/Environments';

export function Menu() {
    const [selectedCard, setSelectedCard] = useState(null);

    const renderContent = () => {
        switch (selectedCard) {
            case 'users': return <Users />;
            case 'teachers': return <Teachers />;
            case 'disciplines': return <Disciplines />;
            case 'environments': return <Environments />;
            default: return null;
        }
    };

    return (
        <div className={styles.menu}>
            <div className={styles.container}>
                <div className={`${styles.card} ${styles.card1}`} onClick={() => setSelectedCard('users')}>
                    <a href="#">Usuários</a>
                    <User className={styles.user}/>
                </div>
                <div className={`${styles.card} ${styles.card2}`} onClick={() => setSelectedCard('teachers')}>
                    <a href="#">Professores</a>
                    <GraduationCap className={styles.graduationCap}/>
                </div>
                <div className={`${styles.card} ${styles.card3}`} onClick={() => setSelectedCard('disciplines')}>
                    <a href="#">Disciplinas</a>
                    <FileChartColumnIncreasing className={styles.fileChart}/>
                </div>
                <div className={`${styles.card} ${styles.card4}`} onClick={() => setSelectedCard('environments')}>
                    <a href="#">Ambientes <br/> reservados</a>
                    <CalendarDays className={styles.calendarDays}/>
                </div>
            </div>

            <div className={styles.apiContent}>
                {renderContent()}
            </div>
        </div>
    )
}