import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Container } from "../../components/Grid";
import Jumbotron from "../../components/Jumbotron";

class Rentals extends Component {
  state = {
    articles: [],
    target: "",
    noResults: false
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    //  blah blah blah
  };

  render() {
    return (
      <div>
        <Jumbotron>
          <h1>Vandelay Outdoor Gear, Nomsayn?</h1>
          <h2>Rent some stuff</h2>
          <p className="lead">
            <Link className="btn btn-primary btn-lg" to="/" role="button">Home</Link>
            <Link className="btn btn-primary btn-lg" to="/sales" role="button">Sales</Link>
            <Link className="btn btn-primary btn-lg" to="/classes" role="button">Classes</Link>
            <Link className="btn btn-primary btn-lg" to="/signup" role="button">Signup</Link>
            <Link className="btn btn-primary btn-lg" to="/login" role="button">Login</Link>
          </p>
        </Jumbotron>
        <Container>
          <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</h2>
        </Container>
      </div>
    );
  }
}

export default Rentals;
