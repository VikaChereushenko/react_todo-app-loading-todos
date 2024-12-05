import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2042;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todoData: Todo) => {
  return client.post<Todo[]>(`/todos`, todoData);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
