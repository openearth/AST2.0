<template>
  <div class="bar-graph">
    <span
      v-if="amount > 0"
      :style="`transform: scaleX(${amount * 0.01})`"
      class="bar-graph__amount"
    />
    <span
      v-if="fragment > 0"
      :style="`transform: scaleX(${ fragment })`"
      class="bar-graph__fragment"
    />
  </div>
</template>


<script>
export default {
  props: {
    amount: {
      type: Number,
      default: 0,
    },
    fragment: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style>
.bar-graph {
  position: relative;
  width: 100%;
  height: 5px;
  margin-bottom: 5px;
  background-color: var(--border-color);
  font-size: 12px;
}

.bar-graph__amount,
.bar-graph__fragment {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: 0% 50%;
  transform: scaleX(0);
  transition: transform 1s;
}

.bar-graph__amount {
  z-index: 1;
  background-color: var(--md-theme-default-primary, #008fc5);

}

.bar-graph__fragment {
  z-index: 2;
  background-color: yellowgreen;
}
</style>
