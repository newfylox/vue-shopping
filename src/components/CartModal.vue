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
      <span v-if="!hasProduct()"></span>
      <div
        v-for="(product, index) in getCartProducts"
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
          <!-- <div class="float-left">Amount: 1</div>
          <div class="float-right">{{ product.price }}</div> -->
          <div>{{ priceText }}: ${{ product.price }}</div>
        </div>
      </div>
      <div class="row align-items-end" v-if="hasProduct()">
        <div class="col">
          <span class="float-left"
            >{{ totalText }}: ${{ totalPrice(getCartProducts) }}</span
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
  methods: {
    ...mapActions({
      showOrHiddenPopupCart: "shop/showOrHiddenPopupCart",
    }),
    hasProduct() {
      return this.getCartProductIds.length > 0;
    },
    totalPrice(products) {
      return products.reduce((current, next) => current + next.price, 0);
    },
  },
  computed: {
    ...mapGetters({
      getPopupCart: "shop/getPopupCart",
      getCartProductIds: "shop/getCartProductIds",
      getCartProducts: "shop/getCartProducts",
    }),
  },
};
</script>
