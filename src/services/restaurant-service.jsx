import config from "../config.json";

export default class DashboardService {
  static getAllRestaurantDetails(data, successCallback, failureCallback) {
    let apiURL = "";
    let options = {
      method: "GET",
    };
    if (data) {
      apiURL = `${config.API_BASE_URL}/restaurant/search`;
      options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
      };
    } else apiURL = `${config.API_BASE_URL}/restaurant/list`;

    fetch(apiURL, options)
      .then((response) => response.json())
      .then((data) => {
        successCallback(data);
      })
      .catch((err) => failureCallback(err));
  }
}
