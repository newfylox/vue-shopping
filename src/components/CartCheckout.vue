<template>
  <div class="checkout-box">
    <div>
      <router-link v-if="hasProduct()" :to="backTo">{{
        backToText
      }}</router-link>
    </div>
    <ul class="checkout-list">
      <li
        v-for="(product, index) in getProductsInCart"
        :key="`${index}-${product.id}`"
        class="checkout-product"
      >
        <img :src="product.image" alt="" class="product-image" />
        <h3 class="product-name">{{ product.name }}</h3>
        <span class="product-price">{{ product.price }}</span>
        <b-button variant="danger" @click="remove(index)"
          ><b-icon icon="trash" aria-label="Help"></b-icon
        ></b-button>
      </li>
    </ul>
    <div v-if="!hasProduct()" class="checkout-message">
      <h3>{{ noItemsText }}</h3>
      <router-link :to="backTo">{{ backToText }}</router-link>
    </div>
    <h3 class="total" v-if="hasProduct()">
      {{ totalText }}: {{ totalPrice() }}
    </h3>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["backTo", "backToText", "noItemsText", "totalText"],
  computed: {
    ...mapGetters({ getProductsInCart: "shop/getProductsInCart" }),
  },

  methods: {
    ...mapActions({ removeProduct: "shop/removeProduct" }),
    hasProduct() {
      return this.getProductsInCart.length > 0;
    },
    totalPrice() {
      return this.getProductsInCart.reduce(
        (current, next) => current + next.price,
        0
      );
    },
    remove(index) {
      this.removeProduct(index);
    },
  },
};
</script>

<style scoped>
.checkout-box {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  margin: 50px auto;
  box-sizing: border-box;
  padding: 1em;
}

.checkout-list {
  padding: 0;
}

.checkout-product {
  display: grid;
  grid-template-columns: 1fr 3fr 2fr 0.5fr;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(73, 74, 78, 0.1);
  border-radius: 5px;
  list-style: none;
  box-sizing: border-box;
  padding: 0.8em;
  margin: 1em 0;
}

.checkout-product * {
  place-self: center;
}
.product-image {
  grid-column: 1/2;
  width: 50%;
}

.product-name {
  box-sizing: border-box;
}

.product-price {
  font-size: 1.2em;
  font-weight: bold;
}

.product-remove {
  width: 25px;
  height: 25px;
  text-align: left;
  border-radius: 50%;
  border: 0;
  color: #fff;
  cursor: pointer;
}

.total {
  font-size: 2em;
  font-weight: bold;
  align-self: flex-end;
}

.checkout-message {
  font-size: 1.5em;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter,
.fade-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}
</style>
