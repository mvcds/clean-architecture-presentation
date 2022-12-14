import Todo from "./todo";

const isComplete = (todo: Todo) => todo.completed;
const isActive = (todo: Todo) => !todo.completed;

const filters = {
  all(todos: Todo[]) {
    return todos;
  },
  active(todos: Todo[]) {
    return todos.filter(isActive);
  },
  completed(todos: Todo[]) {
    return todos.filter(isComplete);
  },
};

export type Visibility = keyof typeof filters;

export default filters;
