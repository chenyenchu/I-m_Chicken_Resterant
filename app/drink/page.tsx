import DrinkList from './DrinkList'
import styles from '../page.module.css'

export default function Home() {
    return (
        <div className={styles.design}>
            <DrinkList/>
        </div>
    )
  }