import apiCall from "./apiCall";

export default {
  async createUse(data) {
    let response = await apiCall("user/register", data);
    return response;
  },
  async listRole(data) {
    let response = await apiCall("user/role/list", data);
    return response;
  },

  async login(data) {
    let response = await apiCall("login", data);
    return response;
  },
};
