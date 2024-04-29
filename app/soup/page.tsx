import SoupList from './SoupList'
import styles from '../page.module.css'

export default function Home() {
    return (
        <div className={styles.design}>
            <SoupList/>
        </div>
    )
  }