import { useState } from 'react';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import TodoFilter from './TodoFilter';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  function handleAddTodo(text) {
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false
    };
    setTodos([...todos, newTodo]);
  }

  function handleToggleTodo(id) {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }

  function handleDeleteTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  function handleClearCompleted() {
    setTodos(todos.filter(todo => !todo.completed));
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className='todo-list'>
      <h1>📝 My Todo List</h1>
      <TodoInput onAdd={handleAddTodo} />
      <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
      <TodoList 
        todos={filteredTodos} 
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
      />
      <div className='output'>
        <p>Total: {totalCount} tasks | Completed: {completedCount}</p>
        <button className='btn-output' onClick={handleClearCompleted}>Clear Completed</button>
      </div>
    </div>
  );
}

export default TodoApp;