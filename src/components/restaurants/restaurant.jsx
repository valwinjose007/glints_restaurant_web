import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import moment from "moment";
import DatePicker from "react-datepicker";
import Dropdown from "react-bootstrap/Dropdown";
import { toast } from "react-toastify";
//modules
import RestaurantListModel from "../../Model/restaurant-model";
import DashboardService from "../../services/restaurant-service";
import AddToCollectionModal from "./modal/add-to-collection-modal";
import CollectionService from "../../services/collection-service";
import CollectionListModel from "../../Model/collection-model";
import ViewCollectionModal from "./modal/view-collection-modal";
//css
import "../../css/restaurant.css";
import "react-datepicker/dist/react-datepicker.css";

class Restaurant extends Component {
  placeToRender;
  root;
  state = {
    startDate: null,
    searchData: {
      restaurantName: "",
    },
    restaurantList: [],
    collections: [],
  };

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getRestaurantDetails();
    this.placeToRender = document.getElementById("modal_collection");
    this.root = ReactDOM.createRoot(this.placeToRender);
    this.getCollectionDetails();
  }

  handleChange(date) {
    this.setState({
      startDate: date,
    });
  }

  getRestaurantDetails = (_searchData = null) => {
    let successCallback = (res) => {
      this.parseRestaurantDetailsModel(res["data"]);
    };
    let failureCallback = (err) => {
      console.log("get restaurant details : Error ::", err);
      toast.error(err);
    };
    DashboardService.getAllRestaurantDetails(
      _searchData,
      successCallback,
      failureCallback
    );
  };

  parseRestaurantDetailsModel(restaurantList) {
    let _restaurantList = [];
    restaurantList.map((restaurant, index) => {
      let _restaurant = new RestaurantListModel();
      _restaurant.restaurant_id = restaurant.restaurant_id;
      _restaurant.restaurant_name = restaurant.restaurant_name;
      _restaurant.opening_hours = restaurant.opening_hours;
      return _restaurantList.push(_restaurant);
    });
    this.setState({ restaurantList: _restaurantList });
  }

  getCollectionDetails = () => {
    let successCallback = (res) => {
      this.parseCollectionDetailsModel(res["data"]);
    };
    let failureCallback = (err) => {
      console.log("Get collection Details : Error ::", err);
      toast.error(err);
    };
    CollectionService.getAllCollections(successCallback, failureCallback);
  };

  parseCollectionDetailsModel = (collectionList) => {
    let _collectionList = [];
    collectionList.map((collection, index) => {
      let _collection = new CollectionListModel();
      _collection.collection_id = collection.collection_id;
      _collection.collection_name = collection.collection_name;
      return _collectionList.push(_collection);
    });
    this.setState({ collections: _collectionList });
    this.collections = [..._collectionList]; //No need this line. setstate not rendering properly sometime.
  };

  onHandleChange = (e) => {
    let copyOfsearchData = { ...this.state.searchData };
    switch (e.target.id) {
      case "txtRetaurantName": {
        copyOfsearchData.restaurantName = e.target.value;
        break;
      }
      default: {
        break;
      }
    }
    this.setState({ searchData: copyOfsearchData });
  };

  searchRestaurant = (e) => {
    e.preventDefault();
    let { searchData, startDate } = this.state;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    if (startDate) {
      searchData["restaurantOpenByDay"] = days[startDate.getDay()];
      searchData["restaurantOpenByStartTime"] =
        moment(startDate).format("hh:mm A");
      searchData["restaurantOpenByEndTime"] = moment(startDate)
        .add(30, "minutes")
        .format("hh:mm A"); //set 30mins to the open time.
    }
    this.getRestaurantDetails(searchData);
  };

  clearSearchForm = () => {
    let copyOfsearchData = { ...this.state.searchData };
    copyOfsearchData.restaurantName = "";
    copyOfsearchData.restaurantOpenByDay = "";
    copyOfsearchData.restaurantOpenByStartTime = "";
    copyOfsearchData.restaurantOpenByEndTime = "";
    this.setState({ startDate: null, searchData: copyOfsearchData });
    this.getRestaurantDetails();
  };

  addToCollection = (resaurant_id, restaurant_name) => {
    this.root.render(
      <AddToCollectionModal
        resaurant_id={resaurant_id}
        restaurant_name={restaurant_name}
        collections={this.state.collections}
        onHidePopup={this.hideModal}
        saveCollection={this.saveCollection}
      />
    );
  };

  hideModal = () => this.root.render();

  saveCollection = (restaurant_id, collection_name, collection_id = null) => {
    let successCallback = (res) => {
      this.hideModal();
      this.getCollectionDetails();
      toast.success(res.message);
    };
    let failureCallback = (err) => {
      console.log("Save collection : Error ::", err);
      toast.error(err);
    };
    let data = {
      restaurant_id,
      collection_name,
      collection_id,
    };
    CollectionService.saveCollection(data, successCallback, failureCallback);
  };

  viewCollection = (collection) => {
    this.root.render(
      <ViewCollectionModal
        collection_id={collection.collection_id}
        collection_name={collection.collection_name}
        onHidePopup={this.hideModal}
      />
    );
  };

  render() {
    const { searchData, restaurantList } = this.state;
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto mb-4">
              <div className="section-title text-center ">
                <h3 className="top-c-sep">Restaurants</h3>
                <p>Search you favourite restaurant and its open timing.</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="career-search mb-60">
                <form
                  onSubmit={(e) => this.searchRestaurant(e)}
                  className="career-form mb-60"
                >
                  <div className="row">
                    <div className="col-md-3 col-lg-3 my-3">
                      <div className="input-group position-relative">
                        <input
                          id="txtRetaurantName"
                          value={searchData.restaurantName}
                          onChange={(e) => {
                            this.onHandleChange(e);
                          }}
                          type="text"
                          className="form-control"
                          placeholder="Restaurant Name"
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 my-4">
                      <div
                        className="select-container"
                        style={{ marginTop: "-0.5rem" }}
                      >
                        <DatePicker
                          className="form-control"
                          selected={this.state.startDate}
                          onChange={this.handleChange}
                          placeholderText="Open Date and Time"
                          showTimeSelect
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-lg-3 my-2">
                      <button
                        type="submit"
                        // onClick={this.searchRestaurant}
                        className="btn btn-lg btn-block btn-light btn-custom mt-2"
                        id="contact-submit"
                      >
                        Search
                      </button>
                      <a
                        href="!#"
                        onClick={this.clearSearchForm}
                        className="m-3 link-warning"
                      >
                        Clear
                      </a>
                    </div>
                    <Dropdown className="col-md-3 col-lg-2 my-3">
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Collections (
                        {this.collections && this.collections.length})
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {this.collections &&
                          this.collections.map((collection) => {
                            return (
                              <Dropdown.Item
                                key={collection.collection_id}
                                onClick={() => this.viewCollection(collection)}
                                href="!#"
                              >
                                {collection.collection_name}
                              </Dropdown.Item>
                            );
                          })}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </form>

                <div className="filter-result">
                  <p className="mb-30 ff-montserrat">
                    Refine your search to view more.
                  </p>
                  {restaurantList.length > 0 &&
                    restaurantList.map((restaurant, index) => {
                      return (
                        <div
                          key={restaurant.restaurant_id}
                          className="job-box d-md-flex align-items-center justify-content-between mb-30"
                        >
                          <div className="job-left my-4 d-md-flex align-items-center flex-wrap">
                            <div className="img-holder mr-md-4 mb-md-0 mb-4 mx-auto mx-md-0 d-md-none d-lg-flex">
                              {restaurant.restaurant_name
                                .substring(0, 2)
                                .toUpperCase()}
                            </div>
                            <div className="job-content">
                              <h5 className="text-center text-md-left">
                                {restaurant.restaurant_name}
                              </h5>
                              <ul className="d-md-flex flex-wrap text-capitalize ff-open-sans">
                                <li className="mr-md-4">
                                  <i className="zmdi zmdi-money mr-2"></i>{" "}
                                  Opening Hours:
                                </li>
                                <li className="mr-md-8">
                                  <i className="zmdi zmdi-time mr-2"></i>{" "}
                                  {restaurant.opening_hours}
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="job-right my-4 flex-shrink-0">
                            <a
                              href="!#"
                              onClick={() =>
                                this.addToCollection(
                                  restaurant.restaurant_id,
                                  restaurant.restaurant_name
                                )
                              }
                              className="btn d-block w-100 d-sm-inline-block btn-light"
                            >
                              Add to collection
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  {restaurantList.length === 0 && (
                    <p style={{ textAlign: "center" }}>No results found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="modal_collection"></div>
      </React.Fragment>
    );
  }
}

export default Restaurant;
