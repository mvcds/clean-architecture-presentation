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
      <section class="main" v-show="hasTodos">
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
      <footer class="footer" v-show="hasTodos">
        <span class="todo-count">
          <strong v-text="remaining"></strong>
          {{ pluralize("item", remaining) }} left
        </span>
        <ul class="filters">
          <li v-for="filter in filterLinks" :key="filter.id">
            <router-link
              :to="filter.link"
              :class="{ selected: filter.isCurrent }"
            >
              {{ filter.name }}
            </router-link>
          </li>
        </ul>
        <button
          class="clear-completed"
          @click="removeCompleted"
          v-show="canClear"
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
import TodoList from "clean-architecture-presentation-presenters/todo-list";
import Todo from "clean-architecture-presentation-presenters/todo";
import filters, {
  Visibility,
} from "clean-architecture-presentation-presenters/filters";
import storage from "@/infrastructure/storage";
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from "vue-router";

const createFilterLink = (visibility: Visibility) => (filter: string) => {
  return {
    id: filter,
    name: `${filter[0].toUpperCase()}${filter.substring(1)}`,
    link: filter === "all" ? "/" : filter,
    isCurrent: visibility === filter,
  };
};

const getVisibility = (route: RouteLocationNormalizedLoaded) => {
  const {
    params: { visibility },
  } = route;

  return visibility === "" ? "all" : (visibility as Visibility);
};

export default defineComponent({
  name: "MainComponent",
  directives: {
    "todo-focus"(el, binding) {
      if (binding.value) {
        el.focus();
      }
    },
  },
  beforeMount() {
    const router = useRouter();
    const {
      params: { visibility },
    } = useRoute();

    const [, ...keys] = Object.keys(filters);

    const isValid = ["", ...keys].includes(visibility as string);

    if (!isValid) {
      router.replace("/");
    }
  },
  setup() {
    const storedTodos = storage.read("todos", []) as Todo[];
    const visibility = getVisibility(useRoute());
    const list = reactive(new TodoList(storedTodos, visibility));

    //Data
    const beforeEditCache = ref("");
    const newTodo = ref("");
    const editedTodo = ref<Todo | null>(null);

    //Computed
    const todos = computed(() => list.todos);
    const filteredTodos = computed(() => list.filteredTodos);
    const remaining = computed(() => list.remaining);
    const allDone = computed({
      get: () => remaining.value === 0,
      set: (value) => {
        todos.value.forEach((todo: Todo) => (todo.completed = value));
      },
    });
    const hasTodos = computed(() => list.hasTodos);
    const canClear = computed(() => list.todos.length > remaining.value);
    const filterLinks = computed(() =>
      Object.keys(filters).map(createFilterLink(list.visibility))
    );

    //Methods
    const pluralize = (word: string, count: number) => {
      return word + (count === 1 ? "" : "s");
    };

    const addTodo = () => {
      if (list.add(newTodo.value)) {
        newTodo.value = "";
      }
    };

    const removeTodo = (todo: Todo) => {
      list.remove(todo);
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
      list.todos = filters.active(todos.value);
    };

    //Watchers
    watch(todos, storage.write.bind(null, "todos"), { deep: true });
    watch(
      useRoute(),
      (value) => {
        list.visibility = getVisibility(value);
      },
      { deep: true }
    );

    return {
      //Data
      editedTodo,
      newTodo,
      //Computed
      filteredTodos,
      remaining,
      allDone,
      hasTodos,
      canClear,
      filterLinks,
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
