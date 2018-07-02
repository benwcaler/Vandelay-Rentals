import React, { Component, Fragment } from "react";
import { Input, FormBtn, Textarea, Select, Option } from "../Form";
import Modal from "../../components/Modal";
import API from "../../utils/API";

export class AddCategoryForm extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    category: "",
    description: ""
  }

  toggleModal = () => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
    });
  }

  setModal = (modalInput) => {
    this.setState({
      modal: {
        isOpen: !this.state.modal.isOpen,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer
      }
    });
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    const { category, description } = this.state;

    const categoryObject = {
      category: category,
      description: description
    }

    API.adminAddNewCategory(categoryObject)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.modal.header}
          body={this.state.modal.body}
          footer={this.state.modal.footer}
        />
        <form>
          <Input
            value={this.state.category}
            onChange={this.handleInputChange}
            name="category"
            type="text"
            label="Category:"
          />
          <Textarea
            value={this.state.description}
            onChange={this.handleInputChange}
            name="description"
            label="Description:"
          />
          <FormBtn
            disabled={
              !this.state.category ||
              !this.state.description
            }
            onClick={this.handleFormSubmit}
          >
            Submit
          </FormBtn>
        </form>

      </Fragment>
    )
  }
}