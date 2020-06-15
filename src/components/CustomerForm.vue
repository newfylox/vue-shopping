<template>
  <div v-if="hasProduct && !defaultProfileId">
    <div v-for="(profile, index) in forms" :key="profile.id">
      <b-form>
        <b-row>
          <b-col cols="8">
            <b-card bg-variant="light">
              <p>{{ $t("shop.customer_form.header_privacy") }}</p>
              <b-form-group
                label-cols-lg="3"
                :label="$t('shop.customer_form.informations')"
                label-size="lg"
                label-class="font-weight-bold pt-0"
                class="mb-0"
              >
                <b-form-group
                  label-cols-sm="3"
                  :label="$t('shop.customer_form.name')"
                  label-align-sm="right"
                  :label-for="`name-${index}`"
                >
                  <b-form-input
                    :id="`name-${index}`"
                    type="text"
                    name="name"
                    :state="errors[`name${index}`]"
                    v-model="forms[index].name"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  label-cols-sm="3"
                  :label="$t('shop.customer_form.phone')"
                  label-align-sm="right"
                  :label-for="`phone-${index}`"
                >
                  <b-form-input
                    :id="`phone-${index}`"
                    type="text"
                    name="phone"
                    :state="errors[`phone${index}`]"
                    v-model="forms[index].phone"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  label-cols-sm="3"
                  :label="$t('shop.customer_form.street')"
                  label-align-sm="right"
                  :label-for="`street-${index}`"
                >
                  <b-form-input
                    :id="`street-${index}`"
                    :state="errors[`street${index}`]"
                    v-model="forms[index].street"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  label-cols-sm="3"
                  :label="$t('shop.customer_form.city')"
                  label-align-sm="right"
                  :label-for="`city-${index}`"
                >
                  <b-form-input
                    :id="`city-${index}`"
                    :state="errors[`city${index}`]"
                    v-model="forms[index].city"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  label-cols-sm="3"
                  :label="$t('shop.customer_form.state')"
                  label-align-sm="right"
                  :label-for="`state-${index}`"
                >
                  <b-form-input
                    :id="`state-${index}`"
                    :state="errors[`state${index}`]"
                    v-model="forms[index].state"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  label-cols-sm="3"
                  :label="$t('shop.customer_form.country')"
                  label-align-sm="right"
                  :label-for="`country-${index}`"
                >
                  <b-form-input
                    :id="`country-${index}`"
                    :state="errors[`country${index}`]"
                    v-model="forms[index].country"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  label-cols-sm="3"
                  :label="$t('shop.customer_form.make_default')"
                  label-align-sm="right"
                  :label-for="`default-${index}`"
                >
                  <b-form-radio
                    :id="`default-${index}`"
                    v-model="defaultIndex"
                    name="default"
                    :value="index"
                  />
                </b-form-group>
              </b-form-group>
              <b-button
                class="pull-right"
                :id="`button-${index}`"
                variant="success"
                @click="onSubmit()"
                >{{ $t("shop.customer_form.button_next") }}</b-button
              >
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      defaultIndex: null,
      forms: [],
      errors: {},
    };
  },
  created() {
    this.getProfiles().then(() => {
      this.forms = this.profiles;
      if (this.profiles.length == 1) {
        this.defaultIndex = 0;
      }
    });
  },
  computed: {
    ...mapGetters({
      profiles: "profile/profiles",
      hasProduct: "shop/hasProduct",
      defaultProfileId: "profile/defaultProfileId",
    }),
    isValid(index, key) {
      return this.errors[`${key}${index}`];
    },
  },
  methods: {
    ...mapActions({
      getProfiles: "profile/getProfiles",
      updateProfile: "profile/updateProfile",
    }),
    onSubmit() {
      if (this.defaultIndex != null) {
        this.saveProfile(this.defaultIndex);
      } else {
        this.$bvToast.toast(this.$t("shop.customer_form.warning_default"), {
          toaster: "b-toaster-top-right",
          variant: "warning",
          solid: true,
          appendToast: true,
        });
      }
    },
    saveProfile(index) {
      const profile = this.forms[index];
      this.clearErrors(index, profile);
      return this.updateProfile(profile).catch((e) => {
        if (e.response && e.response.status == 422) {
          this.setErrors(index, e.response.data.errors);
        } else {
          console.error(e);
        }
      });
    },
    clearErrors(index, profile) {
      for (const key in profile) {
        this.$set(this.errors, `${key}${index}`, null);
      }
    },
    setErrors(index, errors) {
      for (const key in errors) {
        this.$set(this.errors, `${key}${index}`, false);
      }
    },
  },
};
</script>
