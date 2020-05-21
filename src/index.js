import { shopModule } from "./store";
import {
  CartCheckout,
  CartMenuItem,
  CartModal,
  ListOfProducts,
} from "./components/";

export default {
  install(Vue, options) {
    if (!options.store) {
      throw new Error(
        "Please initialise vue-shopping-cart plugin with a Vuex store."
      );
    }
    options.store.registerModule("shop", shopModule);

    Vue.prototype.$setShopProducts = (products) => {
      options.store.dispatch("shop/setProducts", products);
    };

    Vue.component("ShopCheckout", CartCheckout);
    Vue.component("ShopMenuItem", CartMenuItem);
    Vue.component("ShopCartModal", CartModal);
    Vue.component("ShopProducts", ListOfProducts);
  },
};
