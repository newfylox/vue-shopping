export const shopModule = (endpoints) => {
  const state = {
    products: [],
    cartProducts: [],
    cartModalProducts: [],
    cartProductSkus: localStorage.cartProductSkus
      ? JSON.parse(localStorage.cartProductSkus)
      : [],
    currentProduct: {},
    showProductModal: false,
    showPopupCart: false,
  };

  const loadProducts = ({ dispatch, getters }) => {
    const cartProducts = [];
    getters.getCartProductSkus.forEach((sku, index) => {
      endpoints
        .getProduct(sku)
        .then((product) => {
          cartProducts.push(product);
        })
        .catch((e) => {
          if (e.response.status == 404) {
            dispatch("removeProduct", index);
          } else {
            return Promise.reject(e);
          }
        });
    });
    return cartProducts;
  };

  const actions = {
    getClientToken: () => {
      return endpoints.getClientToken().then((data) => {
        return data.token;
      });
    },
    loadCart: ({ getters }) => {
      return endpoints.loadCart(getters.getCartProductSkus);
    },
    checkout: ({ rootGetters }, payload) => {
      const profileId = rootGetters["profile/defaultProfileId"];
      return endpoints.checkout({ payload: payload, profile_id: profileId });
    },
    loadCartProducts: ({ dispatch, getters, commit }) => {
      const cartProducts = loadProducts({ dispatch, getters });
      commit("SET_CART_PRODUCTS", cartProducts);
    },
    loadCartModalProducts: ({ dispatch, getters, commit }) => {
      const cartProducts = loadProducts({ dispatch, getters });
      commit("SET_CART_MODAL_PRODUCTS", cartProducts);
    },
    setProducts: ({ commit }, products) => {
      commit("SET_PRODUCTS", products);
    },
    addProduct: (context, productSku) => {
      context.commit("ADD_PRODUCT", productSku);
    },
    removeProduct: (context, index) => {
      context.commit("REMOVE_PRODUCT", index);
    },
    clearCart: (context) => {
      context.commit("CLEAR_CART_PRODUCTS");
      context.commit("CLEAR_CART_PRODUCTS_SKUS");
    },
    currentProduct: (context, product) => {
      context.commit("CURRENT_PRODUCT", product);
    },
    showOrHiddenProductModal: (context) => {
      context.commit("SHOW_MODAL");
    },
    showOrHiddenPopupCart: (context) => {
      if (!context.getters.getPopupCart) {
        context.dispatch("loadCartModalProducts");
      }
      context.commit("SHOW_POPUP_CART");
    },
  };

  const mutations = {
    CLEAR_CART_PRODUCTS: (state) => {
      state.cartProducts = [];
    },
    CLEAR_CART_PRODUCTS_SKUS: (state) => {
      state.cartProductSkus = [];
      localStorage.cartProductSkus = JSON.stringify([]);
    },
    SET_CART_PRODUCTS: (state, cartProducts) => {
      state.cartProducts = cartProducts;
    },
    SET_CART_MODAL_PRODUCTS: (state, cartProducts) => {
      state.cartModalProducts = cartProducts;
    },
    SET_PRODUCTS: (state, products) => {
      state.products = products;
    },
    ADD_PRODUCT: (state, productSku) => {
      state.cartProductSkus.push(productSku);
      localStorage.cartProductSkus = JSON.stringify(state.cartProductSkus);
    },
    REMOVE_PRODUCT: (state, index) => {
      state.cartProducts.splice(index, 1);
      const cartProductSkus = state.cartProducts.map(function (p) {
        return p.sku;
      });
      state.cartProductSkus = cartProductSkus;
      localStorage.cartProductSkus = JSON.stringify(cartProductSkus);
    },
    CURRENT_PRODUCT: (state, product) => {
      state.currentProduct = product;
    },
    SHOW_MODAL: (state) => {
      state.showProductModal = !state.showProductModal;
    },
    SHOW_POPUP_CART: (state) => {
      state.showPopupCart = !state.showPopupCart;
    },
  };

  const getters = {
    getAllProducts: (state) => state.products,
    getCartProducts: (state) => state.cartProducts,
    getCartModalProducts: (state) => state.cartModalProducts,
    getCartProductSkus: (state) => state.cartProductSkus,
    getCurrentProduct: (state) => state.currentProduct,
    getShowProductModal: (state) => state.showProductModal,
    getPopupCart: (state) => state.showPopupCart,
    hasProduct: (state) => state.cartProductSkus.length > 0,
  };

  return {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  };
};
