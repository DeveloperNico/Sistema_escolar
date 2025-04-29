import styles from './Menu.module.css';

export function Menu() {
    return (
        <div className={styles.container}>
            <table>
                <tr>
                    <td>
                        Prefessores
                    </td>
                    <td>
                        Gestores
                    </td>
                    <td>
                        Disciplina
                    </td>
                    <td>
                        Ambiente
                    </td>
                </tr>
            </table>
        </div>
    )
}