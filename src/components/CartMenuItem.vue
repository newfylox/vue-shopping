<template>
  <div>
    <slot
      :click="showOrHiddenPopupCart"
      :count="getCartProductIds.length"
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
      getCartProductIds: "shop/getCartProductIds",
    }),
  },
};
</script>
