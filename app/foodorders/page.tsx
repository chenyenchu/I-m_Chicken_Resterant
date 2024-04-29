import FoodordersList from './FoodordersList'
import styles from '../page.module.css'

export default function Home() {
    return (
        <div className={styles.design}>
          <FoodordersList/>
        </div>
    )
  }