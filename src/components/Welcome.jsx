import { useContext, useEffect } from 'react';
import styles from '../styles/Welcome.module.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);
    
    return (
        <div className={styles.heroSection}>
            <h1 className={styles.heading}>Welcome to Todo App</h1>
            <h3 className={styles.subheading}>Manage your tasks with ease. Stay focused and productive.</h3>
            <Link to={'/signup'}>
                <button className={styles.button}>Get Started</button>
            </Link>
        </div>
    );
}


