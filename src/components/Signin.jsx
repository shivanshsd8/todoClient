import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TodoContext } from "../store/context";
import styles from "../styles/Signin.module.css"; // Import CSS Module

export default function Signin() {
    const { signInHandler } = useContext(TodoContext);
    const usernameRef = useRef('');
    const passwordRef = useRef('');
    const [errors, setErrors] = useState({});


    const [popUpMessage, setPopUpMessage] = useState('');
    const [showPopUp, setShowPopUp] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    function handleSubmit() {
        const username = usernameRef.current.value.trim();
        const password = passwordRef.current.value.trim();

        let newErrors = {};
        
        if (!username) newErrors.username = "Username is required";
        if (!password) newErrors.password = "Password is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        signInHandler(username, password, setErrors, setShowPopUp, setPopUpMessage);
    }

    return (
        <>
            <div className={styles.signinMain}>
                <div>
                    <h1 className={styles.signinHeading}>Sign in</h1>
                </div>
                <div>
                    <div className={styles.input}>
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            placeholder={errors.username || "Enter Username"} 
                            id="username" 
                            ref={usernameRef} 
                            className={errors.username ? styles.inputError : ""}
                            onChange={() => setErrors(prev => ({ ...prev, username: "" }))}
                        />

                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            placeholder={errors.password || "Enter Password"} 
                            id="password" 
                            ref={passwordRef} 
                            className={errors.password ? styles.inputError : ""}
                            onChange={() => setErrors(prev => ({ ...prev, password: "" }))}
                        /> 

                        <button onClick={handleSubmit}>Submit</button>
                        <p className={styles.newUser}>
                            New user? <Link to={'/signup'}>Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
            {showPopUp && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <p>{popUpMessage}</p>
                        <button onClick={() => setShowPopUp(false)}>OK</button>
                    </div>
                </div>
            )}
        </>
    );
}
