<template>
  <div>
    <b-modal
      id="shop-product-modal"
      hide-footer
      :visible="getShowProductModal"
      @hide="showOrHiddenProductModal()"
    >
      <div class="product-box row">
        <div class="product-image col">
          <img
            class="img-fluid"
            :src="currentProduct.image_url"
            :alt="currentProduct.name"
          />
        </div>
        <div class="product-info col">
          <h2 class="product-title">{{ currentProduct.name }}</h2>
          <p class="product-price">
            ${{ currentProduct.price * currentProduct.units }}
          </p>
        </div>
      </div>
      <div class="product-details">
        <div>
          <h3>{{ detailsTitle }}</h3>
          {{ currentProduct.description }}
        </div>
        <div class="text-right">
          <b-button
            variant="primary"
            btnColor="btn btn-small btn-info"
            @click="$bvModal.hide('shop-product-modal')"
          >
            {{ closeButton }}
          </b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["detailsTitle", "closeButton"],
  computed: {
    ...mapGetters({
      currentProduct: "shop/getCurrentProduct",
      getShowProductModal: "shop/getShowProductModal",
    }),
  },

  methods: {
    ...mapActions({
      addProduct: "shop/addProduct",
      showOrHiddenProductModal: "shop/showOrHiddenProductModal",
    }),
    addProductToCart(product) {
      this.addProduct(product);
    },
  },
};
</script>

<style scoped>
.product-details {
  margin: 10px 0 0 0;
}

.product-details button {
  width: 200px;
  margin: 10px 0 0 0;
}
</style>
