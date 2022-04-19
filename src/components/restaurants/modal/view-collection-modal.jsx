import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import ListGroup from "react-bootstrap/ListGroup";
//modules
import RestaurantListModel from "../../../Model/restaurant-model";
import CollectionService from "../../../services/collection-service";

class ViewCollectionModal extends Component {
  state = {
    collectionDetailList: [],
  };

  componentDidMount() {
    this.getCollectionDetails(this.props.collection_id);
  }

  getCollectionDetails = (collection_id) => {
    const data = {
      collection_id,
    };
    let successCallback = (res) => {
      this.parseCollectionDetailsModel(res["data"]);
    };
    let failureCallback = (err) => {
      console.log("Ger collection details : Error ::", err);
      toast.error(err);
    };
    CollectionService.getCollectionDetails(
      data,
      successCallback,
      failureCallback
    );
  };

  parseCollectionDetailsModel = (collectionDetailList) => {
    let restaurantList = [];
    collectionDetailList.map((restaurant, index) => {
      let _restaurant = new RestaurantListModel();
      _restaurant.restaurant_id = restaurant.restaurant_id;
      _restaurant.restaurant_name = restaurant.restaurant_name;
      _restaurant.opening_hours = restaurant.opening_hours;
      return restaurantList.push(_restaurant);
    });
    this.setState({ collectionDetailList: restaurantList });
  };

  render() {
    const { collectionDetailList } = this.state;
    const { collection_name } = this.props;
    return (
      <div>
        <Modal show={true}>
          <Modal.Header>
            <b>{collection_name}</b>
          </Modal.Header>
          <Modal.Body>
            <ListGroup as="ol" numbered>
              {collectionDetailList &&
                collectionDetailList.map((collectionDetail) => {
                  return (
                    <ListGroup.Item
                      key={collectionDetail.restaurant_id}
                      as="li"
                    >
                      {collectionDetail.restaurant_name}
                    </ListGroup.Item>
                  );
                })}
            </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-warning"
              onClick={this.props.onHidePopup}
            >
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default ViewCollectionModal;
