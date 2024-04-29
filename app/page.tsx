import styles from './page.module.css'
// import SetList from './set/SetList'
import HomePage from './home/page'
import Booking from './booking/page'

export default function Home() {
    return (
        <div className={styles.design}>
            <HomePage />
        </div>
    )
  }