import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Signup.module.css";
import { TodoContext } from "../store/context";

export default function Signup() {
    const { signupHandler, loading } = useContext(TodoContext);
    const usernameRef = useRef('');
    const passwordRef = useRef('');
    const nameRef = useRef('');
    const [errors, setErrors] = useState({});

    // Pop up messages:
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
        const name = nameRef.current.value.trim();

        let newErrors = {};
        if (!username) newErrors.username = "Username is required!";
        if (!password) newErrors.password = "Password is required!";
        if (!name) newErrors.name = "Name is required!";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        signupHandler(username, password, name, setErrors, setShowPopUp, setPopUpMessage);
    }

    return (
        <>
            <div>
                {loading ? <Loadercomp /> :
                    <div className={styles.signupMain}>
                        <h2 className={styles.signupHeading}>Create your TodoApp Account</h2>
                        <div className={styles.input}>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                placeholder={errors.name || "Enter your name"}
                                ref={nameRef}
                                className={errors.name ? styles.inputError : ""}
                                onChange={() => setErrors(prev => ({ ...prev, name: "" }))}
                            />

                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                placeholder={errors.username || "Enter Username"}
                                ref={usernameRef}
                                className={errors.username ? styles.inputError : ""}
                                onChange={() => setErrors(prev => ({ ...prev, username: "" }))}
                            />

                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                placeholder={errors.password || "Enter Password"}
                                ref={passwordRef}
                                className={errors.password ? styles.inputError : ""}
                                onChange={() => setErrors(prev => ({ ...prev, password: "" }))}
                            />

                            <button onClick={handleSubmit} className={styles.signupSubmitBtn}>Submit</button>
                            <p className={styles.oldUser}>Already have an account? <Link to={'/signin'}>Sign in</Link></p>
                        </div>
                    </div>
                }
            </div>
            
        </>
    );
}

function Loadercomp() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "100px" }}>
            <h2>Signing up, please wait!</h2>
        </div>
    );
}
