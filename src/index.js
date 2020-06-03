import { profileModule, shopModule } from "./store";
import {
  BraintreeForm,
  CartCheckout,
  CartMenuItem,
  CartModal,
  CustomerForm,
  ListOfProducts,
} from "./components/";

export default {
  install(Vue, options) {
    if (!options.store) {
      throw new Error(
        "Please initialise vue-shopping-cart plugin with a Vuex store."
      );
    }

    options.store.registerModule("shop", shopModule(options.endpoints));
    options.store.registerModule("profile", profileModule(options.endpoints));

    Vue.prototype.$setShopProducts = (products) => {
      options.store.dispatch("shop/setProducts", products);
    };

    Vue.component("ShopBraintreeForm", BraintreeForm);
    Vue.component("ShopCheckout", CartCheckout);
    Vue.component("ShopMenuItem", CartMenuItem);
    Vue.component("ShopCartModal", CartModal);
    Vue.component("ShopCustomerForm", CustomerForm);
    Vue.component("ShopProducts", ListOfProducts);
  },
};
