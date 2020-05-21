const state = {
  products: [],
  cartProducts: [],
  currentProduct: {},
  showProductModal: false,
  showPopupCart: false,
};

const actions = {
  setProducts: ({ commit, dispatch }, products) => {
    commit("SET_PRODUCTS", products);
    if (localStorage.cartProductIds) {
      JSON.parse(localStorage.cartProductIds).forEach((id) => {
        products.forEach((product) => {
          if (id === product.id) {
            dispatch("addProduct", product);
          }
        });
      });
    }
  },
  addProduct: (context, product) => {
    context.commit("ADD_PRODUCT", product);
  },
  removeProduct: (context, index) => {
    context.commit("REMOVE_PRODUCT", index);
  },
  currentProduct: (context, product) => {
    context.commit("CURRENT_PRODUCT", product);
  },
  showOrHiddenProductModal: (context) => {
    context.commit("SHOW_MODAL");
  },
  showOrHiddenPopupCart: (context) => {
    context.commit("SHOW_POPUP_CART");
  },
};

const mutations = {
  SET_PRODUCTS: (state, products) => {
    state.products = products;
  },
  ADD_PRODUCT: (state, product) => {
    state.cartProducts.push(product);
  },
  REMOVE_PRODUCT: (state, index) => {
    state.cartProducts.splice(index, 1);
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
  getProductsInCart: (state) => state.cartProducts,
  getCurrentProduct: (state) => state.currentProduct,
  getShowProductModal: (state) => state.showProductModal,
  getPopupCart: (state) => state.showPopupCart,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
