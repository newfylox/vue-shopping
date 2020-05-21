<template>
  <div>
    <b-modal
      id="shop-cart-modal"
      hide-footer
      :title="titleText"
      :hide-header="!titleText"
      :visible="getPopupCart"
      @hide="showOrHiddenPopupCart()"
    >
      <span v-if="!hasProduct()"></span>
      <div
        v-for="(product, index) in getProductsInCart"
        :key="index"
        class="row align-items-center"
        style="margin-bottom: 10px;"
      >
        <div class="col-5">
          <img
            :src="product.image"
            alt=""
            class="h-100"
            style="max-height: 130px;"
          />
        </div>
        <div class="col-7" style="max-height: 130px;">
          <h5>{{ product.name }}</h5>
          <!-- <div class="float-left">Amount: 1</div>
          <div class="float-right">{{ product.price }}</div> -->
          <div>{{ priceText }}: {{ product.price }}</div>
        </div>
      </div>
      <div class="row align-items-end" v-if="hasProduct()">
        <div class="col">
          <span class="float-left">{{ totalText }}: {{ totalPrice() }}</span>
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
  created() {
    const self = this
    window.addEventListener("beforeunload", function (event) {
      let productIds = [];
      self.getProductsInCart.forEach((product) => {
        productIds.push(product.id);
      });
      localStorage.cartProductIds = JSON.stringify(productIds);
    });
  },
  methods: {
    ...mapActions({ showOrHiddenPopupCart: "shop/showOrHiddenPopupCart" }),
    hasProduct() {
      return this.getProductsInCart.length > 0;
    },
    totalPrice() {
      return this.getProductsInCart.reduce(
        (current, next) => current + next.price,
        0
      );
    },
  },
  computed: {
    ...mapGetters({
      getPopupCart: "shop/getPopupCart",
      getProductsInCart: "shop/getProductsInCart",
    }),
  },
};
</script>
