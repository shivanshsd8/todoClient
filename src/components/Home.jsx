import { useContext } from "react"
import Todo from "./Todo"
import { TodoContext } from "../store/context"
import { useNavigate } from "react-router-dom";
import styles from '../styles/Home.module.css'

export default function Home() {
    const { todos, setCurrentTab } = useContext(TodoContext);
    const navigate = useNavigate()
    return (
        <div className={styles.homeOuterBox}>
            {todos.length > 0 ?
                todos.map((todo) => (
                    <Todo todo={todo} key={todo._id} />
                ))
                :
                <div className={styles.noTodoBox}>
                    <h1>No Todos</h1>
                    <h3>Proceed To add some Todos</h3>
                    <button className={styles.addBtn} onClick={() => {
                        navigate('/addTodo')
                        setCurrentTab('addTodo')
                    }
                    }>Add Todo</button>

                </div>
            }
        </div>
    )
}