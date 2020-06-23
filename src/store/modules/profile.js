export const profileModule = (endpoints, axios) => {
  const state = {
    profiles: [],
    defaultProfileId: null,
  };

  const actions = {
    getProfiles: ({ commit }) => {
      return endpoints
        .getProfiles()
        .then((profiles) => {
          commit("SET_PROFILES", profiles);
        })
        .catch(console.error);
    },
    getDefaultProfile: ({ getters }) => {
      return axios
        .get(`profiles/${getters.defaultProfileId}`)
        .then((res) => {
          return res.data;
        })
        .catch(console.error);
    },
    updateProfile: ({ commit }, profile) => {
      return endpoints.updateProfile(profile.id, profile).then(() => {
        commit("SET_DEFAULT_PROFILE_ID", profile.id);
      });
    },
    setDefaultProfileId: ({ commit }, profileId) => {
      commit("SET_DEFAULT_PROFILE_ID", profileId);
    },
  };

  const mutations = {
    SET_DEFAULT_PROFILE_ID: (state, profileId) => {
      state.defaultProfileId = profileId;
    },
    SET_PROFILES: (state, profiles) => {
      state.profiles = profiles;
    },
  };

  const getters = {
    profiles: (state) => state.profiles,
    defaultProfileId: (state) => state.defaultProfileId,
  };

  return {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  };
};
