import ShoppingcartList from './ShoppingcartList'
import styles from '../page.module.css'

export default function Home() {
    return (
        <div className={styles.design}>
          <ShoppingcartList/>
        </div>
    )
  }