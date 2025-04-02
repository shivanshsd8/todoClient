import { useContext, useState, } from 'react'
import styles from '../styles/Todo.module.css'
import { TodoContext } from '../store/context';

export default function Todo({ todo }) {
    const {deleteTodoHandler,updateTodoHandler,markAsDoneHandler,setTodos} = useContext(TodoContext)
    const [isEditing, setIsEditing] = useState(false);
    const [updatedTodo, setUpdatedTodo] = useState({
        title: todo.title,
        description: todo.description,
        done: todo.done
    })
    function handleUpdate(){
        updateTodoHandler(todo,updatedTodo);
        setIsEditing(false);
    }

    function handleMarkAsDone(){
        const newUpdatedtodo = ({ ...updatedTodo, done: !updatedTodo.done })
        setUpdatedTodo(newUpdatedtodo)
        markAsDoneHandler(todo,newUpdatedtodo)
        setTodos(prevTodos =>
            prevTodos.map(t => t._id === todo._id ? { ...t, ...newUpdatedtodo } : t)
        )   
    }
    function handleDelete(){
        deleteTodoHandler(todo)
    }
    return (
        <>
            {
                isEditing ?
                    (
                        <div className={styles.editBox}>
                            <input className={styles.editTitle} type="text" value={updatedTodo.title} onChange={(e) => setUpdatedTodo({ ...updatedTodo, title: e.target.value })} />
                            <textarea className={styles.editDesc} type="text" value={updatedTodo.description} onChange={(e) => setUpdatedTodo({ ...updatedTodo, description: e.target.value })} />
                            <div className={styles.editBtn}>
                                <button onClick={() => handleUpdate()}>Save</button>
                                <button onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </div>
                    )
                    :
                    (
                        <div className={styles.todoBox}>
                            <div className={styles.title}>{todo.title}</div>
                            <div className={styles.desc}>{todo.description}</div>
                            <div>
                                <div className={styles.buttons}>
                                    <button onClick={() => handleMarkAsDone()}>{updatedTodo.done ? " ✅Completed " : " Mark as Completed!"}</button>
                                    <button onClick={() => handleDelete()} className={styles.deleteBtn}>Delete</button>
                                    <button onClick={() => setIsEditing(true)}>Edit</button>
                                </div>
                            </div>
                        </div>

                    )
            }
        </>
    )
}
