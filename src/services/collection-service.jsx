import config from "../config.json";

export default class CollectionService {
  static getAllCollections(successCallback, failureCallback) {
    let apiURL = `${config.API_BASE_URL}/collection/list`;
    let options = {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    };

    fetch(apiURL, options)
      .then((response) => response.json())
      .then((data) => {
        successCallback(data);
      })
      .catch((err) => failureCallback(err));
  }

  static getCollectionDetails(data, successCallback, failureCallback) {
    const apiURL = `${config.API_BASE_URL}/collection/detail`;
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    fetch(apiURL, options)
      .then((response) => response.json())
      .then((data) => {
        successCallback(data);
      })
      .catch((err) => failureCallback(err));
  }

  static saveCollection(data, successCallback, failureCallback) {
    let apiURL = "";
    let options = {
      method: "POST",
    };
    if (data) {
      apiURL = `${config.API_BASE_URL}/collection/add`;
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
