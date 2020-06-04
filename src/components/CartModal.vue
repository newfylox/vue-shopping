<template>
  <div>
    <b-modal
      id="shop-cart-modal"
      hide-footer
      :title="titleText"
      :hide-header="!titleText"
      :visible="getPopupCart"
      @hide="showOrHiddenPopupCart"
    >
      <div
        v-for="(product, index) in getCartModalProducts"
        :key="index"
        class="row align-items-center"
        style="margin-bottom: 10px;"
      >
        <div class="col-5">
          <img
            :src="product.image_url"
            alt=""
            class="h-100"
            style="max-height: 130px;"
          />
        </div>
        <div class="col-7" style="max-height: 130px;">
          <h5>{{ product.name }}</h5>
          <div>{{ priceText }}: ${{ product.price }}</div>
        </div>
      </div>
      <div class="row align-items-end" v-if="hasProduct()">
        <div class="col">
          <span class="float-left"
            >{{ totalText }}: ${{ totalPrice(getCartModalProducts) }}</span
          >
        </div>
        <div class="col">
          <router-link :to="to">
            <b-button
              variant="primary"
              class="float-right"
              btnColor="btn btn-small btn-info"
              @click="$bvModal.hide('shop-cart-modal')"
            >
              {{ buttonText }}
            </b-button>
          </router-link>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["titleText", "priceText", "totalText", "buttonText", "to"],
  data() {
    return {
      products: [],
    };
  },
  created() {
    this.loadCartModalProducts();
  },
  methods: {
    ...mapActions({
      showOrHiddenPopupCart: "shop/showOrHiddenPopupCart",
      loadCartModalProducts: "shop/loadCartModalProducts",
    }),
    hasProduct() {
      return this.getCartProductSkus.length > 0;
    },
    totalPrice(products) {
      return products.reduce((current, next) => current + next.price, 0);
    },
  },
  computed: {
    ...mapGetters({
      getPopupCart: "shop/getPopupCart",
      getCartProductSkus: "shop/getCartProductSkus",
      getCartModalProducts: "shop/getCartModalProducts",
    }),
  },
};
</script>
