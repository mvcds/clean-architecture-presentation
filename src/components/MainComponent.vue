<template>
  <main>
    <section class="todoapp" v-cloak>
      <header class="header">
        <h1>todos</h1>
        <input
          class="new-todo"
          autofocus
          autocomplete="off"
          placeholder="What needs to be done?"
          v-model="newTodo"
          @keyup.enter="addTodo"
        />
      </header>
      <section class="main" v-show="todos.length">
        <input
          id="toggle-all"
          class="toggle-all"
          type="checkbox"
          v-model="allDone"
        />
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          <li
            class="todo"
            v-for="todo in filteredTodos"
            :key="todo.id"
            :class="{ completed: todo.completed, editing: todo == editedTodo }"
          >
            <div class="view">
              <input class="toggle" type="checkbox" v-model="todo.completed" />
              <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
              <button class="destroy" @click="removeTodo(todo)"></button>
            </div>
            <input
              class="edit"
              type="text"
              v-model="todo.title"
              v-todo-focus="todo == editedTodo"
              @blur="doneEdit(todo)"
              @keyup.enter="doneEdit(todo)"
              @keyup.esc="cancelEdit(todo)"
            />
          </li>
        </ul>
      </section>
      <footer class="footer" v-show="todos.length">
        <span class="todo-count">
          <strong v-text="remaining"></strong>
          {{ pluralize("item", remaining) }} left
        </span>
        <ul class="filters">
          <li>
            <a href="#/all" :class="{ selected: visibility === 'all' }">All</a>
          </li>
          <li>
            <a href="#/active" :class="{ selected: visibility === 'active' }"
              >Active</a
            >
          </li>
          <li>
            <a
              href="#/completed"
              :class="{ selected: visibility === 'completed' }"
              >Completed</a
            >
          </li>
        </ul>
        <button
          class="clear-completed"
          @click="removeCompleted"
          v-show="todos.length > remaining"
        >
          Clear completed
        </button>
      </footer>
    </section>
    <footer class="info">
      <p>Double-click to edit a todo</p>
      <p>Written by <a href="http://evanyou.me">Evan You</a></p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

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

type Visibility = keyof typeof filters;

export default defineComponent({
  name: "MainComponent",
  directives: {
    "todo-focus"(el, binding) {
      if (binding.value) {
        el.focus();
      }
    },
  },
  setup() {
    //Data
    const todos = ref<Todo[]>([]);
    const beforeEditCache = ref("");
    const newTodo = ref("");
    const editedTodo = ref<Todo | null>(null);
    const visibility = ref<Visibility>("all");

    //Computed
    const filteredTodos = computed(() => {
      return filters[visibility.value](todos.value);
    });
    const remaining = computed(() => filters.active(todos.value).length);
    const allDone = computed({
      get: () => remaining.value === 0,
      set: (value) => {
        todos.value.forEach((todo: Todo) => (todo.completed = value));
      },
    });

    //Methods
    const pluralize = (word: string, count: number) => {
      return word + (count === 1 ? "" : "s");
    };

    const addTodo = () => {
      const value = newTodo.value?.trim();

      if (!value) {
        return;
      }

      todos.value.push({
        id: todos.value.length + 1,
        title: value,
        completed: false,
      });

      newTodo.value = "";
    };

    const removeTodo = (todo: Todo) => {
      var index = todos.value.indexOf(todo);
      todos.value.splice(index, 1);
    };

    const editTodo = (todo: Todo) => {
      beforeEditCache.value = todo.title;
      editedTodo.value = todo;
    };

    const doneEdit = (todo: Todo) => {
      if (!editedTodo.value) {
        return;
      }
      editedTodo.value = null;
      todo.title = todo.title.trim();
      if (!todo.title) {
        removeTodo(todo);
      }
    };

    const cancelEdit = (todo: Todo) => {
      editedTodo.value = null;
      todo.title = beforeEditCache.value;
    };

    const removeCompleted = () => {
      todos.value = filters.active(todos.value);
    };

    return {
      //Data
      todos,
      visibility,
      editedTodo,
      newTodo,
      //Computed
      filteredTodos,
      remaining,
      allDone,
      //Methods
      pluralize,
      addTodo,
      removeTodo,
      editTodo,
      doneEdit,
      cancelEdit,
      removeCompleted,
    };
  },
});
</script>
