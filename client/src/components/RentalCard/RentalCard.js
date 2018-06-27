import React, { Component } from "react";
import "./RentalCard.css"

class RentalCard extends Component {

  render() {
    return (
      <div id="rentalCard" className="rentalCard">
        <li key={this.props.key}>
          <h3>{this.props.name}</h3>
          <h4>{this.props.category}</h4>
          <h5>Maker: {this.props.maker}</h5>
          <p>Daily rate: ${this.props.rate}</p>
        </li>
      </div>
    )
  }
}

export default RentalCard;