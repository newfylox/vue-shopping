import { profileModule, shopModule } from "./store";
import {
  BraintreeForm,
  CartCheckout,
  CartMenuItem,
  CartModal,
  CustomerForm,
  ListOfProducts,
  StripeForm,
} from "./components/";

export default {
  install(Vue, options) {
    if (!options.store) {
      throw new Error(
        "Please initialise vue-shopping-cart plugin with a Vuex store named 'store'."
      );
    }

    if (!options.axios) {
      throw new Error(
        "Please initialise vue-shopping-cart plugin with a Axios instance named 'axios'."
      );
    }

    if (!options.website) {
      throw new Error(
        "Please initialise vue-shopping-cart plugin with a Website String named 'website'."
      );
    } else {
      if (!["medical", "top", "buster"].includes(options.website)) {
        throw new Error(
          "vue-shopping-cart plugin: The website option must be one of them => 'medical', 'top' or 'buster'."
        );
      }
    }

    let stripeScript = document.createElement("script");
    stripeScript.setAttribute("src", "https://js.stripe.com/v3/");
    document.head.appendChild(stripeScript);

    options.store.registerModule(
      "shop",
      shopModule(options.endpoints, options.axios)
    );
    options.store.registerModule(
      "profile",
      profileModule(options.endpoints, options.axios)
    );

    options.axios.interceptors.request.use(function (config) {
      config.headers["shop-website"] = options.website;
      return config;
    });

    Vue.prototype.$axios = options.axios;

    Vue.component("ShopBraintreeForm", BraintreeForm);
    Vue.component("ShopCartCheckout", CartCheckout);
    Vue.component("ShopMenuItem", CartMenuItem);
    Vue.component("ShopCartModal", CartModal);
    Vue.component("ShopCustomerForm", CustomerForm);
    Vue.component("ShopProducts", ListOfProducts);
    Vue.component("ShopStripeForm", StripeForm);
  },
};
