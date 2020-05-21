<template>
  <div>
    <slot
      :click="showOrHiddenPopupCart"
      :count="getProductsInCart.length"
    ></slot>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  methods: {
    ...mapActions({ showOrHiddenPopupCart: "shop/showOrHiddenPopupCart" }),
  },
  computed: {
    ...mapGetters({
      getProductsInCart: "shop/getProductsInCart",
    }),
  },
};
</script>
