<template>
  <div v-show="hasProduct">
    <div v-for="(profile, index) in forms" :key="profile.id">
      <b-form>
        <b-row align-h="center">
          <b-col cols="8">
            <b-card bg-variant="light">
              <b-form-group
                label-cols-lg="3"
                label="Your Informations"
                label-size="lg"
                label-class="font-weight-bold pt-0"
                class="mb-0"
              >
                <b-form-group
                  label-cols-sm="3"
                  label="Name:"
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
                  label="Email:"
                  label-align-sm="right"
                  :label-for="`email-${index}`"
                >
                  <b-form-input
                    :id="`email-${index}`"
                    type="email"
                    name="email"
                    :state="errors[`email${index}`]"
                    v-model="forms[index].email"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  label-cols-sm="3"
                  label="Phone:"
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
                  label="Street:"
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
                  label="City:"
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
                  label="State:"
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
                  label="Country:"
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
                  label="Make default:"
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
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </div>
    <slot :saveProfile="saveProfile"></slot>
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
    saveProfile(callBack) {
      if (this.defaultIndex != null) {
        this.onSubmit(this.defaultIndex, callBack);
      } else {
        this.$bvToast.toast(
          "Veuillez choisir un profil d'informations personnelles par défaut!",
          {
            toaster: "b-toaster-top-right",
            variant: "danger",
            solid: true,
            appendToast: true,
          }
        );
      }
    },
    onSubmit(index, callBack) {
      const profile = this.forms[index];
      this.clearErrors(index, profile);
      return this.updateProfile(profile)
        .then(() => callBack())
        .catch((e) => {
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
