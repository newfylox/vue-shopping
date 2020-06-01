export const shopModule = (endpoints) => {
  const state = {
    products: [],
    cartProducts: [],
    cartProductIds: localStorage.cartProductIds
      ? JSON.parse(localStorage.cartProductIds)
      : [],
    currentProduct: {},
    showProductModal: false,
    showPopupCart: false,
  };

  const actions = {
    getClientToken: () => {
      return endpoints.getClientToken().then((data) => {
        return data.token;
      });
    },
    loadCart: ({ getters }) => {
      return endpoints.loadCart(getters.getCartProductIds);
    },
    checkout: ({}, payload) => {
      return endpoints.checkout(payload);
    },
    loadCartProducts: ({ dispatch, getters, commit }) => {
      const cartProducts = [];
      getters.getCartProductIds.forEach((id, index) => {
        endpoints
          .getProduct(id)
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
        commit("SET_CART_PRODUCTS", cartProducts);
      });
    },
    setProducts: ({ commit }, products) => {
      commit("SET_PRODUCTS", products);
    },
    addProduct: (context, productId) => {
      context.commit("ADD_PRODUCT", productId);
    },
    removeProduct: (context, index) => {
      context.commit("REMOVE_PRODUCT", index);
    },
    clearCart: (context) => {
      context.commit("CLEAR_CART_PRODUCTS");
      context.commit("CLEAR_CART_PRODUCTS_IDS");
    },
    currentProduct: (context, product) => {
      context.commit("CURRENT_PRODUCT", product);
    },
    showOrHiddenProductModal: (context) => {
      context.commit("SHOW_MODAL");
    },
    showOrHiddenPopupCart: (context) => {
      context.commit("SHOW_POPUP_CART");
      if (context.getters.getPopupCart) {
        context.dispatch("loadCartProducts");
      } else {
        context.commit("CLEAR_CART_PRODUCTS");
      }
    },
  };

  const mutations = {
    CLEAR_CART_PRODUCTS: (state) => {
      state.cartProducts = [];
    },
    CLEAR_CART_PRODUCTS_IDS: (state) => {
      state.cartProductIds = [];
      localStorage.cartProductIds = JSON.stringify([]);
    },
    SET_CART_PRODUCTS: (state, cartProducts) => {
      state.cartProducts = cartProducts;
    },
    SET_PRODUCTS: (state, products) => {
      state.products = products;
    },
    ADD_PRODUCT: (state, productId) => {
      state.cartProductIds.push(productId);
      localStorage.cartProductIds = JSON.stringify(state.cartProductIds);
    },
    REMOVE_PRODUCT: (state, index) => {
      state.cartProductIds.splice(index, 1);
      localStorage.cartProductIds = JSON.stringify(state.cartProductIds);
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
    getCartProductIds: (state) => state.cartProductIds,
    getCurrentProduct: (state) => state.currentProduct,
    getShowProductModal: (state) => state.showProductModal,
    getPopupCart: (state) => state.showPopupCart,
    hasProduct: (state) => state.cartProductIds.length > 0,
  };

  return {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  };
};
