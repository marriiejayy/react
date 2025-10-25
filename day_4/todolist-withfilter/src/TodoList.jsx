function TodoList({ todos, onToggle, onDelete }) {
    return (
        <div className="list"> 
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        <input className="lists-input"
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => onToggle(todo.id)}
                        />
                        <span style={{
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            marginLeft: '10px'
                        }}>
                            {todo.text}
                        </span>
                        <button className="delete"
                            onClick={() => onDelete(todo.id)}
                            style={{ marginLeft: '10px' }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>

    );
}

export default TodoList;