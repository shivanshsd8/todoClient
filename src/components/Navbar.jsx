import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { TodoContext } from '../store/context';
import styles from '../styles/Navbar.module.css'; // Import CSS Module

export default function Navbar() {
    const { loggedIn, logout } = useContext(TodoContext);
    const location = useLocation();
    return (
        <>
            <div>
                <nav className={styles.navbar}>
                    <div className={styles.logoText}>
                        <img src="/logo.png" alt="Logo" className={styles.logo} />
                        <Link to={'/'}>
                            <p className={styles.heroHeading}>TodoApp</p>
                        </Link>
                    </div>
                    <div className={styles.links}>
                        {loggedIn && (
                            <>
                                <Link to={'/home'}> <p className={`${styles.linkP} ${location.pathname === '/home' ? styles.active : ''}`}>Home</p> </Link>
                                <Link to={'/addTodo'}> <p className={`${styles.linkP} ${location.pathname === '/addTodo' ? styles.active : ''}`}>Add Todo</p> </Link>
                                <Link to={'/profile'}> <p className={`${styles.linkP} ${location.pathname === '/profile' ? styles.active : ''}`}>Profile</p> </Link>
                            </>
                        )}
                        {loggedIn ? (
                            <button onClick={logout} className={styles.loggingBtn}>Signout</button>
                        ) : (
                            <Link to={'/signin'}>
                                <button className={styles.loggingBtn}>Signin</button>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
            <hr className={styles.line} />
        </>
    );
}
