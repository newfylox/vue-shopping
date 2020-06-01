<template>
  <div class="wrapper">
    <ul class="listOfProducts">
      <li
        v-for="(product, index) in getAllProducts"
        :key="index"
        class="product-item"
      >
        <img class="img-fluid" :src="product.image_url" :alt="product.name" />
        <div class="product-name" @click="openProductModal(product)">
          {{ product.name }}
        </div>
        <div class="product-price">
          <span>{{ product.price * product.units }}</span>
          <span>{{ product.units }} x {{ product.price }}</span>
        </div>

        <b-button
          btnColor="btn btn-large btn-sucess"
          @click="addProductToCart(product.id)"
        >
          {{ buttonText }}
          <img
            :src="!buttonLogo ? require('./assets/cart.svg') : buttonLogo"
            alt="Cart Icon"
          />
        </b-button>
      </li>
      <ProductModal :detailsTitle="detailsTitle" :closeButton="closeButton" />
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ProductModal from "./ProductModal";

export default {
  props: ["buttonLogo", "buttonText", "detailsTitle", "closeButton"],
  components: {
    ProductModal,
  },
  methods: {
    ...mapActions({
      addProduct: "shop/addProduct",
      currentProduct: "shop/currentProduct",
      showOrHiddenProductModal: "shop/showOrHiddenProductModal",
    }),

    addProductToCart(product) {
      this.addProduct(product);
    },
    openProductModal(product) {
      this.currentProduct(product);
      this.showOrHiddenProductModal();
    },
  },
  computed: {
    ...mapGetters({ getAllProducts: "shop/getAllProducts" }),
  },
};
</script>

<style scoped>
.btn img {
  max-width: 20px;
  margin-left: 0.5em;
}

.listOfProducts {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0;
}

.product-item {
  width: 300px;
  background-color: #fff;
  list-style: none;
  box-sizing: border-box;
  padding: 1em;
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 7px;
}

.product-name {
  font-size: 1.2em;
  font-weight: normal;
}

.product-name:hover {
  cursor: pointer;
  text-decoration: underline;
}

.product-price {
  width: 100%;
  align-self: flex-start;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5em;
}

.wrapper {
  align-items: center;
  display: flex;
  /* justify-content: center; */
}
</style>
