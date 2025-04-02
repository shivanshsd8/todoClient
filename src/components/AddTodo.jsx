import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { TodoContext } from "../store/context";
import styles from '../styles/AddTodo.module.css'; // Import CSS Module

export default function AddTodo() {
    const navigate = useNavigate();
    const titleRef = useRef('');
    const descRef = useRef('');
    const [errors, setErrors] = useState({});
    const { addTodoHandler } = useContext(TodoContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
        }
    }, [navigate]);

    function handleSubmit() {
        const title = titleRef.current.value;
        const description = descRef.current.value;
        
        // Error Checking on Frontend:
        let newErrors = {};
        if (!title) newErrors.title = "Title is required!";
        if (!description) newErrors.description = "Description is required!";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        addTodoHandler(title, description);
    }

    return (
        <>  
            <div className={styles.addTodoCard}>
                <h1 className={styles.addTodoHeading}>Add Todo</h1>

                <label htmlFor="title">Title</label>
                <input 
                    type="text" 
                    placeholder={errors.title || "Enter Title"} 
                    ref={titleRef}  
                    className={errors.title ? styles.inputError : ""} 
                    onChange={() => setErrors(prev => ({ ...prev, title: "" }))}
                    maxLength={50}
                />
                
                <label htmlFor="description">Description</label>
                <textarea 
                    ref={descRef} 
                    placeholder={errors.description || "Enter Description"}  
                    className={errors.description ? styles.inputError : ""} 
                    onChange={() => setErrors(prev => ({ ...prev, description: "" }))}
                    maxLength={150}
                ></textarea>
                
                <button className={styles.addButton} onClick={handleSubmit}>Add todo</button>
            </div>
        </>
    );
}
