import filters, { Visibility } from "./filters";
import Todo from "./todo";

class TodoList {
  todos: Todo[];
  visibility: Visibility = "all";

  constructor(todos: Todo[], visibility: Visibility) {
    this.todos = todos;
    this.visibility = visibility;
  }

  get remaining(): number {
    return filters.active(this.todos).length;
  }

  get hasTodos(): boolean {
    return !!this.todos.length;
  }

  get filteredTodos(): Todo[] {
    const filter = filters[this.visibility] ?? filters.all;
    return filter(this.todos);
  }

  add(title: string): boolean {
    const value = title?.trim();

    if (!value) {
      return false;
    }

    this.todos.push({
      id: this.todos.length + 1,
      title: value,
      completed: false,
    });

    return true;
  }

  remove(todo: Todo) {
    var index = this.todos.indexOf(todo);
    this.todos.splice(index, 1);
  }
}

export default TodoList;
