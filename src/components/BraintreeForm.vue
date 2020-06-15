<template>
  <div>
    <div v-if="!payed" v-show="hasProduct">
      <b-card bg-variant="light">
        <b-form-group
          :label="representativeCodeText"
          label-for="representative-code"
        >
          <b-form-input
            id="representative-code"
            v-model="representativeCode"
            type="text"
          ></b-form-input>
        </b-form-group>
        <div id="dropin-container"></div>
        <b-button id="submit-button" variant="success" @click="pay()">{{
          buttonText
        }}</b-button>
      </b-card>
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
  props: [
    "buttonText",
    "confirmBuyText",
    "okButtonText",
    "cancelButtonText",
    "saveProfile",
    "representativeCodeText",
  ],
  data() {
    return {
      instance: null,
      payed: false,
      representativeCode: "",
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
      this.saveProfile(() => this.instance.requestPaymentMethod(this.callback));
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
                this.checkout({
                  payload,
                  representativeCode: this.representativeCode,
                })
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
