<template>
  <div>
    <slot
      :click="showOrHiddenPopupCart"
      :count="getCartProductSkus.length"
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
      getCartProductSkus: "shop/getCartProductSkus",
    }),
  },
};
</script>
