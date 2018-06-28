import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Header from "../../components/Header";
import NavBar from "../../components/NavBar";
import FixedFooter from "../../components/FixedFooter";
import { Input, FormBtn } from "../../components/Form";
import API from "../../utils/API";
import "./Login.css";


class Login extends Component {
  state = {
    username: "",
    password: "",
    redirect: false
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    API.login({
      username: this.state.username,
      password: this.state.password
    })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          // update App.js state
          this.props.updateUser({
            auth: true,
            admin: res.data.admin,
            state: {
              loggedIn: true,
              username: res.data.username,
              firstName: res.data.firstName,
              admin: res.data.admin
            }
          });
          // Once logged in, set this.state.redirect to true so the component will reload and trigger the if/else to redirect elsewhere
          this.setState({ redirect: true });
        }
      }).catch(err => console.log(err));
  };


  render() {
    //  'from' is set as a referrer either:
    //    a) when login is arrived at due to a redirect caused by trying to access a protected route prior to signing in
    //    b) when the login page is arrived at from the signup page - this allows us to prevent sending a user back to signup after logging in
    console.log(this.props.location.state);
    const { from } = this.props.location.state || { from: null };

    if (this.state.redirect) {
      if (from && from !== "/signup") {
        return <Redirect to={from} />
      } else if (from === "/signup") {
        return <Redirect to="/" />
      } else {
        this.props.history.goBack();
      }
    }

    return (
      <React.Fragment>
      <NavBar
          toggleModal={this.props.toggleModal}
          setModal={this.props.setModal}
          updateUser={this.props.updateUser}
          loggedIn={this.props.loggedIn}
          firstName={this.props.firstName}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />
      <div>
        <Header>
          <h1>Vandelay Outdoor Gear, Nomsayn?</h1>
          <h2>Sign in</h2>
          <div className="nav-container">
            <Link className="btn-link" to="/" role="button">Home</Link>
            <Link className="btn-link" to="/rentals" role="button">Rentals</Link>
            <Link className="btn-link" to="/sales" role="button">Sales</Link>
            <Link className="btn-link" to="/courses" role="button">Courses</Link>
            {this.props.loggedIn ? (
              <button className="btn-link" onClick={this.props.logout}>logout</button>
            ) : (
                <React.Fragment>
                  <Link className="btn-link" to={{pathname: "/signup", state: { from: this.props.location.pathname }}} role="button">Signup</Link>
                  <Link className="btn-link" to="/login" role="button">Login</Link>
                </React.Fragment>
              )}
            <Link className="btn-link" to="/test" role="button">Test</Link>
            <Link className="btn-link" to="/testnick" role="button">TestNick</Link>
            <Link className="btn-link" to="/testben" role="button">TestBen</Link>
            <Link className="btn-link" to="/testcorb" role="button">TestCorb</Link>
            {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null }
            {this.props.admin ? <Link className="btn-link" to="/adminkeith" role="button">AdminKeith</Link> : null }
          </div>
        </Header>
        <div>
          <form>
            <Input
              value={this.state.username}
              onChange={this.handleInputChange}
              name="username"
              type="text"
              label="Username"
            />
            <Input
              value={this.state.password}
              onChange={this.handleInputChange}
              name="password"
              type="password"
              label="Password"
            />
            <FormBtn
              disabled={!this.state.username || !this.state.password}
              onClick={this.handleFormSubmit}
            >
              Submit
              </FormBtn>
          </form>
        </div>
        <FixedFooter/>
      </div>
      </React.Fragment>
    );
  }
}

export default Login;
