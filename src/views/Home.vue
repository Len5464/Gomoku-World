<script setup></script>
<template>
  <div class="view">
    <header>
      <img
        src="../assets/header.png"
        alt="Header Image"
      />
      <h1 class="title">雙人五子棋</h1>
    </header>
    <main>
      <ul
        role="list"
        class="menu-lists"
      >
        <li>
          <RouterLink
            to="rule"
            class="btn"
            >經典規則
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'rule', query: { gameType: 'pente' } }"
            class="btn"
            >玉攻棋
          </RouterLink>
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped>
  .view {
    height: 100vh;
    height: 100svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-image: url("../assets/bg.svg");
    background-position: center center;
    background-size: 5%;
  }
  .btn {
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-radius: var(--radius-size);
    padding: 0.5em 1em;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    display: block;
    background-color: var(--primary);
    font-weight: bold;
    letter-spacing: 0.25em;
    color: darkslategrey;
    &:hover {
      background-color: var(--secondary);
    }
  }
  header {
    height: 50%;
    min-height: 380px;
    max-width: 920px;
    position: relative;
    display: flex;
    align-items: end;
  }
  main {
    height: 50%;
    display: flex;
    align-items: center;
  }
  .title {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 80%);
    font-size: 24px;
    background-color: black;
    color: #fff;
    padding: 0.25rem 1rem;
    border-radius: 25px;
  }
  .menu-lists {
    padding-left: 0;
    & > * {
      margin-bottom: 1.5rem;
    }
  }
</style>
