<template>
  <div>
    <div v-if="hasProduct && defaultProfileId">
      <div id="cart-checkout-title">
        <h4>{{ $t("shop.stripe_form.title") }}</h4>
      </div>
      <b-card bg-variant="light">
        <b-form-group
          :label="$t('shop.stripe_form.representative_code')"
          label-for="representative-code"
        >
          <b-form-input
            id="representative-code"
            v-model="representativeCode"
            type="text"
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <div id="payment-form">
            <div id="card-element"></div>
            <div id="card-errors" role="alert"></div>
          </div>
        </b-form-group>
        <div id="dropin-container"></div>
        <b-button
          :disabled="loading"
          id="submit-button"
          variant="success"
          @click="onSubmit()"
          >{{ $t("shop.stripe_form.button_pay") }}</b-button
        >
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["redirectTo"],
  data() {
    return {
      stripe: null,
      loading: false,
      elements: null,
      client_secret: null,
      hasError: false,
      payed: false,
      initiate: false,
      representativeCode: "",
    };
  },
  updated() {
    if (this.hasProduct && this.defaultProfileId && !this.initiate) {
      this.getPublishableKey()
        .then((key) => {
          this.stripe = Stripe(key);
          this.elements = this.stripe.elements();
          this.initiate = true;
        })
        .then(() => {
          const style = {
            base: {
              color: "#32325d",
            },
          };
          const card = this.elements.create("card", { style: style });
          card.mount("#card-element");
          card.on("change", (event) => {
            this.showErrors(event.error);
          });
          this.card = card;
        });
    }
  },
  computed: {
    ...mapGetters({
      hasProduct: "shop/hasProduct",
      defaultProfileId: "profile/defaultProfileId",
    }),
  },
  methods: {
    ...mapActions({
      createPayment: "shop/createPayment",
      clearCart: "shop/clearCart",
      loadCart: "shop/loadCart",
      getPublishableKey: "shop/getPublishableKey",
      setDefaultProfileId: "profile/setDefaultProfileId",
    }),
    showErrors(error) {
      var displayError = document.getElementById("card-errors");
      if (error) {
        displayError.textContent = error.message;
        this.hasError = true;
      } else {
        displayError.textContent = "";
        this.hasError = false;
      }
    },
    onSubmit() {
      this.loading = true;
      this.stripe.createToken(this.card).then((result) => {
        this.showErrors(result.error);
        if (!this.hasError) {
          this.pay(result.token);
        } else {
          this.loading = false;
        }
      });
    },
    pay(token) {
      this.loadCart()
        .then(() => {
          return this.createPayment({
            representativeCode: this.representativeCode,
            token: token,
          });
        })
        .then((client_secret) => {
          return client_secret; // future usage
        })
        .then(() => {
          this.setDefaultProfileId(null);
          this.clearCart();
          this.$router.push(this.redirectTo);
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          let message;
          if (e.response && e.response.status < 500) {
            message = e.response.data.message;
            message += this.$t("shop.stripe_form.card_error");
          } else {
            message = this.$t("shop.stripe_form.internal_error");
          }
          this.$bvToast.toast(message, {
            toaster: "b-toaster-top-right",
            variant: "danger",
            solid: true,
            appendToast: true,
          });
        });
      // .then((client_secret) => {
      //   return this.stripe.confirmCardPayment(client_secret, {
      //     payment_method: {
      //       card: this.card,
      //     },
      //   });
      // })
      // .then((result) => {
      //   if (result.error) {
      //     console.log(result.error.message);
      //     const { payment_intent } = result.error;
      //     if (payment_intent && payment_intent.status == "succeeded") {
      //       console.log("it's already bought!");
      //     }
      //   } else {
      //     if (result.paymentIntent.status === "succeeded") {
      //       this.setDefaultProfileId(null);
      //       this.clearCart();
      //       this.$router.push(this.redirectTo);
      //     }
      //   }
      // });
    },
  },
};
</script>
<style scoped>
.StripeElement {
  box-sizing: border-box;

  height: 40px;

  padding: 10px 12px;

  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;

  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>
