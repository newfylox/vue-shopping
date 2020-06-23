export const countryOptions = (vm) => {
  if (!vm.$i18n.te("shop.countries")) {
    vm.$i18n.mergeLocaleMessage("en", require("../locales/countries.en.json"));
    vm.$i18n.mergeLocaleMessage("fr", require("../locales/countries.fr.json"));
  }
  return [
    { value: null, text: vm.$t("shop.countries.empty") },
    { value: "CA", text: vm.$t("shop.countries.ca") },
  ];
};

export const stateOptions = (vm) => {
  if (!vm.$i18n.te("shop.states")) {
    vm.$i18n.mergeLocaleMessage("en", require("../locales/states.en.json"));
    vm.$i18n.mergeLocaleMessage("fr", require("../locales/states.fr.json"));
  }
  return [
    { value: null, text: vm.$t("shop.states.empty") },
    { value: "QC", text: vm.$t("shop.states.qc") },
  ];
};
