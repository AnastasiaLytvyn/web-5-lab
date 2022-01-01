<script>
  import { onMount } from "svelte";
  import http from "./request-helper";
  import OperationDocsStore from "./operationDocsStore";
  import { todos, isAuthenticated, user, token } from "./store";
  import auth from "./authService";
  let auth0Client;

  onMount(async () => {
    auth0Client = await auth.createClient();

    isAuthenticated.set(await auth0Client.isAuthenticated());
    user.set(await auth0Client.getUser());
    if (isAuthenticated) {
      const accessToken = await auth0Client.getIdTokenClaims();
      if (accessToken) token.set(accessToken.__raw);
    }
  });
  token.subscribe(async (value) => {
    if (value) {
      const result = await http.startFetchMyQuery(OperationDocsStore.getAll());
      console.log(result);
      todos.set(result.todo);
    }
  });
  const addTodo = async () => {
    const name = prompt("name") || "";
    const { insert_todo_one } = await http.startExecuteMyMutation(
      OperationDocsStore.addOne(name),
    );
    todos.update((n) => [...n, insert_todo_one]);
  };

  const deleteTodo = async (id) => {
    await http.startExecuteMyMutation(OperationDocsStore.deleteById(id));
    todos.update((n) => n.filter((item) => item.id !== id));
  };

  function login() {
    auth.loginWithPopup(auth0Client);
  }

  function logout() {
    auth.logout(auth0Client);
  }
</script>

<main>
  {#if $isAuthenticated}
    {#if $todos.loading}
      <h1>Loading...</h1>
    {:else if $todos.error}
      <h1>{$todos.error}</h1>
    {:else}
      <button on:click={logout}>Logout</button>

      <button on:click={addTodo}>Add new todo</button>

      {#each $todos as todo}
        <div>
          <p>todo name: {todo.title}</p>
          <p>user id: {todo.user_id}</p>
          <!-- delete todo by id -->
          <button on:click={() => deleteTodo(todo.id)}>Delete todo</button>
          <hr />
        </div>
      {/each}
    {/if}
  {:else}
    <button on:click={login}>Login</button>
  {/if}
</main>

<style>
  main {
    margin: 0;
    padding: 0;
  }
</style>
