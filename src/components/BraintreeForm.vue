<template>
  <div>
    <div v-if="!payed" v-show="hasProduct">
      <div id="dropin-container"></div>
      <b-button id="submit-button" variant="success" @click="pay()">{{
        buttonText
      }}</b-button>
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import dropin from "braintree-web-drop-in";

export default {
  props: ["buttonText", "confirmBuyText", "okButtonText", "cancelButtonText"],
  data() {
    return {
      instance: null,
      payed: false,
    };
  },
  created() {
    this.getClientToken().then((clientToken) => {
      this.initDropin(clientToken);
    });
  },
  computed: {
    ...mapGetters({ hasProduct: "shop/hasProduct" }),
  },
  methods: {
    ...mapActions({
      getClientToken: "shop/getClientToken",
      checkout: "shop/checkout",
      clearCart: "shop/clearCart",
      loadCart: "shop/loadCart",
    }),
    initDropin(clientToken) {
      let locale = navigator.language || navigator.userLanguage;
      locale = locale.replace("-", "_");
      dropin.create(
        {
          authorization: clientToken,
          container: "#dropin-container",
          paypal: {
            flow: "vault",
          },
          locale: locale,
        },
        (createErr, instance) => {
          if (createErr) {
            console.error(createErr);
            return;
          }
          this.instance = instance;
        }
      );
    },
    pay() {
      this.instance.requestPaymentMethod(this.callback);
    },
    callback(requestPaymentMethodErr, payload) {
      if (requestPaymentMethodErr) {
        console.error(requestPaymentMethodErr);
        return;
      }
      this.loadCart()
        .then((total) => {
          this.$bvModal
            .msgBoxConfirm(`${this.confirmBuyText} ($${total})`, {
              okTitle: this.okButtonText,
              okVariant: "success",
              cancelTitle: this.cancelButtonText,
              cancelVariant: "danger",
            })
            .then((value) => {
              if (value === true) {
                this.checkout(payload)
                  .then(() => {
                    this.clearCart();
                    this.payed = true;
                  })
                  .catch((e) => {
                    if (
                      e.response &&
                      e.respons.status == 422 &&
                      e.response.data.token
                    ) {
                      this.initDropin(e.response.data.token);
                    } else {
                      console.error(e);
                    }
                  });
              }
            })
            .catch(console.error);
        })
        .catch(console.error);
    },
  },
};
</script>