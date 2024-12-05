/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos, addTodo, deleteTodo } from './api/todos';

function findMaxId(todos: Todo[]) {
  const allIds = todos.map(todo => todo.id);

  return Math.max(...allIds) + 1;
}

function filterTodos(todos: Todo[], status?: string | null) {
  const todosCopy = [...todos];

  if (status === 'active') {
    return todosCopy.filter(todo => todo.completed === false);
  }

  if (status === 'completed') {
    return todosCopy.filter(todo => todo.completed === true);
  }

  return todosCopy;
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentList = useRef('all');
  const areAllCompleted = todos.every(todo => todo.completed);
  const isAnyCompleted = todos.some(todo => todo.completed);
  const noTodos = todos.length === 0;
  const activeTodos = todos.map(todo => !todo.completed);
  const maxId = findMaxId(todos);

  useEffect(() => {
    getTodos()
      .then(response => {
        setTodos(response);
        setFilteredTodos(response);
      })
      .catch(error => setErrorMessage(error));
  }, []);

  const handleFiltration = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    const status = e.currentTarget.textContent?.toLowerCase();

    setFilteredTodos(filterTodos(todos, status));

    if (status) {
      currentList.current = status;
    }
  };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   setLoading(true);

  //   const newTodo = { id: maxId, userId: 2042, title: query, completed: false };

  //   addTodo(newTodo);

  //   setTodos(existing => [...existing, newTodo]);

  //   setLoading(false);

  //   setQuery('');
  // };

  // const handleDelete = (id: number) => {
  //   setLoading(true);
  //   deleteTodo(id);

  //   setTodos(existing => existing.filter(todo => todo.id !== id));

  //   setLoading(false);
  // };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!noTodos && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: areAllCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={event => handleSubmit(event)}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={event => setQuery(event.target.value)}
              autoFocus
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => {
            return (
              <div
                data-cy="Todo"
                className={classNames('todo', {
                  completed: todo.completed,
                  'todo__status-label': !todo.completed,
                })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                {/* Remove button appears only on hover */}
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDelete(todo.id)}
                  disabled={loading && true}
                >
                  ×
                </button>

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div
                  data-cy="TodoLoader"
                  className={classNames('modal', 'overlay', {
                    'is-active': loading,
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}
        </section>

        {/* Hide the footer if there are no todos */}

        {!noTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: currentList.current === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={event => handleFiltration(event)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: currentList.current === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={event => handleFiltration(event)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: currentList.current === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={event => handleFiltration(event)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!isAnyCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};

// <div data-cy="Todo" className="todo completed">
//             <label className="todo__status-label">
//               <input
//                 data-cy="TodoStatus"
//                 type="checkbox"
//                 className="todo__status"
//                 checked
//               />
//             </label>

//             <span data-cy="TodoTitle" className="todo__title">
//               Completed Todo
//             </span>

//             {/* Remove button appears only on hover */}
//             <button type="button" className="todo__remove" data-cy="TodoDelete">
//               ×
//             </button>

//             {/* overlay will cover the todo while it is being deleted or updated */}
//             <div data-cy="TodoLoader" className="modal overlay">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div>
//           </div>

//           {/* This todo is an active todo */}
//           <div data-cy="Todo" className="todo">
//             <label className="todo__status-label">
//               <input
//                 data-cy="TodoStatus"
//                 type="checkbox"
//                 className="todo__status"
//               />
//             </label>

//             <span data-cy="TodoTitle" className="todo__title">
//               Not Completed Todo
//             </span>
//             <button type="button" className="todo__remove" data-cy="TodoDelete">
//               ×
//             </button>

//             <div data-cy="TodoLoader" className="modal overlay">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div>
//           </div>

//           {/* This todo is being edited */}
//           <div data-cy="Todo" className="todo">
//             <label className="todo__status-label">
//               <input
//                 data-cy="TodoStatus"
//                 type="checkbox"
//                 className="todo__status"
//               />
//             </label>

//             {/* This form is shown instead of the title and remove button */}
//             <form>
//               <input
//                 data-cy="TodoTitleField"
//                 type="text"
//                 className="todo__title-field"
//                 placeholder="Empty todo will be deleted"
//                 value="Todo is being edited now"
//               />
//             </form>

//             <div data-cy="TodoLoader" className="modal overlay">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div>
//           </div>

//           {/* This todo is in loadind state */}
//           <div data-cy="Todo" className="todo">
//             <label className="todo__status-label">
//               <input
//                 data-cy="TodoStatus"
//                 type="checkbox"
//                 className="todo__status"
//               />
//             </label>

//             <span data-cy="TodoTitle" className="todo__title">
//               Todo is being saved now
//             </span>

//             <button type="button" className="todo__remove" data-cy="TodoDelete">
//               ×
//             </button>

//             {/* 'is-active' class puts this modal on top of the todo */}
//             <div data-cy="TodoLoader" className="modal overlay is-active">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div>
//           </div>
