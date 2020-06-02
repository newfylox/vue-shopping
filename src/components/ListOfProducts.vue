<template>
  <div>
    <b-container fluid class="p-3">
      <b-row>
        <b-col
          cols="3"
          v-for="(product, index) in getAllProducts"
          :key="index"
          class=""
        >
          <b-img fluid thumbnail :src="product.image_url" :alt="product.name" />
          <div class="product-name" @click="openProductModal(product)">
            {{ product.name }}
          </div>
          <div class="product-price">
            <span>${{ product.price }}</span>
            <span>{{ product.units }} X</span>
          </div>
          <div class="shop-button">
            <b-button @click="addProductToCart(product.sku)">
              {{ buttonText }}
              <img
                :src="!buttonLogo ? require('./assets/cart.svg') : buttonLogo"
                alt="Cart Icon"
              />
            </b-button>
          </div>
        </b-col>
        <ProductModal :detailsTitle="detailsTitle" :closeButton="closeButton" />
      </b-row>
    </b-container>
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

    addProductToCart(productSku) {
      this.addProduct(productSku);
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
.row.display-flex {
  display: flex;
  flex-wrap: wrap;
}
.thumbnail {
  height: 100%;
}

.btn img {
  max-width: 20px;
  margin-left: 0.5em;
}

.listOfProducts {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0;
}

.product-item {
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
  margin-top: 10px;
  font-size: 1.2em;
  font-weight: normal;
}

.product-name:hover {
  cursor: pointer;
  text-decoration: underline;
}

.product-price {
  width: 100%;
  height: 40px;
  align-items: center;
  align-self: flex-start;
  display: flex;
  justify-content: space-between;
}

.wrapper {
  align-items: center;
  display: flex;
  /* justify-content: center; */
}
</style>
