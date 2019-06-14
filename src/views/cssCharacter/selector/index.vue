<template>
  <div>
    <div class="selector">
      <div class="dd"></div>
      <div class="dd"></div>
      <div class="dd"></div>
      <div class="dd"></div>
      <div class="dd"></div>
      <span class="dd"></span>
      <span class="dd"></span>
      <span class="dd"></span>
      <span class="dd"></span>
      <span class="dd"></span>
      <div class="dd"></div>
      <div class="dd"></div>
      <div class="dd"></div>
      <div class="dd"></div>
      <div class="dd"></div>
      <span class="dd"></span>
      <span class="dd"></span>
      <span class="dd"></span>
      <span class="dd"></span>
      <span class="dd"></span>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@mixin hover {
  outline: #6b6575 dotted 4px;
  outline-offset: -12px;
}
.selector {
  display: flex;
  width: 900px;
  justify-content: space-around;
  & > * {
    width: 30px;
    height: 30px;
  }
  &:only-child {
    @include hover;
  }
  & > div {
    background-color: #f4606b;
    // &:nth-child(1):nth-child(2) {
    //   @include hover;
    // }
    // &:only-child {
    //   @include hover;
    // }
    // &:not(:nth-last-child(-n + 4)) {
    //   @include hover;
    // }
    // &:nth-last-child(-n + 6) {
    //   @include hover;
    // }
    // &:only-of-type {
    //   @include hover;
    // }
    // &:nth-of-type(n + 2):nth-of-type(odd) {
    //   @include hover;
    // }
    // &:nth-child(n + 4):nth-child(-n + 6):nth-child(even) {
    //   @include hover;
    // }
    // &:nth-of-type(even) {
    //   @include hover;
    // }
  }
  & > .dd:nth-of-type(even) {
    @include hover;
  }
  & > span {
    border-radius: 50%;
    background-color: #c7b3e5;
  }
  // & > div:nth-child(even) {
  //   outline: #6b6575 dotted 4px;
  //   outline-offset: -12px;
  // }
}
</style>
