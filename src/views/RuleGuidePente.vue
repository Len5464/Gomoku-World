<template>
  <h2>玉攻棋 (Pente)</h2>
  白色先行，黑白雙方輪流下一子。
  <ul class="flow">
    <li>
      若兩個連著的同色棋子，因為對手剛下的一步而被對手兩枚棋子夾著在一線，那麼對手便吃掉那兩枚被夾的同色棋子。
      <br />
      ⚫⚪⚪⚫ => ⚫ X X ⚫
    </li>
  </ul>
  有兩種情況可勝：
  <ul>
    <li>五枚或以上同色棋子連著成一線。</li>
    <li>吃掉對手十子即獲勝</li>
  </ul>
</template>

<style scoped>
  h2 {
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid black;
  }
</style>
