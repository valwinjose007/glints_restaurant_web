import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";

class AddToCollectionModal extends Component {
  state = {
    collection_Name: "",
    collection_id: "",
    _collectionList: [],
  };

  render() {
    console.log("add collection is ocming", this.props);
    const { resaurant_id,restaurant_name, collections } = this.props;
    return (
      <div>
        <Modal show={true}>
          <Modal.Header>
            <b>Add To Collection ({restaurant_name})</b>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className=" form-group">
                <label htmlFor="staticEmail" className="col-form-label">
                  Add to existing collection
                </label>
                <div>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      this.setState({ collection_id: e.target.value })
                    }
                  >
                    <option value="">Choose collection</option>
                    {collections &&
                      collections.map((collection) => {
                        return (
                          <option
                            key={collection.collection_id}
                            value={collection.collection_id}
                          >
                            {collection.collection_name}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
              <br />
              <hr style={{ color: "blue" }} />
              <div className="form-group mt-1">
                <label htmlFor="inputPassword" className="col-form-label">
                  Create new collection
                </label>
                <div>
                  <input
                    type="text"
                    onChange={(e) => {
                      this.setState({ collection_Name: e.target.value });
                    }}
                    className="form-control"
                    id="inputPassword"
                    value={this.state.collection_Name}
                    placeholder="Collection name"
                  />
                </div>
              </div>
              <br />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-warning"
              onClick={this.props.onHidePopup}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() =>
                this.props.saveCollection(
                  resaurant_id,
                  this.state.collection_Name,
                  this.state.collection_id
                )
              }
            >
              Save
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default AddToCollectionModal;
