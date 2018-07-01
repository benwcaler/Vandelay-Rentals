import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Modal";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./AdminTables.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
const CheckboxTable = checkboxHOC(ReactTable);

export class RentalsTable extends Component {
  constructor() {
    super();
    this.state = {
      modal: {
        isOpen: false,
        header: "",
        body: "",
        footer: ""
      },
      rentals: [],
      selection: [],
      selectedRow: {}
    };
  }

  componentDidMount() {
    this.adminGetAllRentals();
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

  adminGetAllRentals = () => {
    API.adminGetAllRentals()
      .then(res => {

        //  loop through the response array and add a new key/value pair with the formatted rate
        res.data.map(r => {
          const rate = "$" + parseFloat(r.dailyRate.$numberDecimal).toFixed(2);
          r.rate = rate;
        });

        this.setState({
          rentals: res.data,
          selection: []
        });
      })
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  //  Select Table HOC functions

  toggleSelection = (key, shift, row) => {
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);

    if (keyIndex >= 0) {
      // it does exist so we will remove it
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];
    } else {
      // it does not exist so add it
      selection = [];
      selection.push(key);
    }

    //  set state with the selected row key, but also set selectedRow with the entire row object, making it available for db updates
    this.setState({ selection, selectedRow: row });
  };

  isSelected = key => {
    return this.state.selection.includes(key);
  };

  updateSelectedRow = () => {
    const { category, condition, dailyRate, dateAcquired, maker, name, rate, sku, timesRented, _id } = this.state.selectedRow;

    let newRate;
    if (rate)
      if (rate.includes("$")) {
        newRate = dailyRate.$numberDecimal;
      } else {
        newRate = rate;
      }

    const updateObject = {
      category: category,
      condition: condition,
      dateAcquired: dateAcquired,
      maker: maker,
      name: name,
      dailyRate: newRate,
      sku: sku,
      timesRented: timesRented
    };

    API.adminUpdateRental(_id, updateObject)
      .then(response => {
        if (response.status === 200) {

          // Modal for feedback
          this.setModal({
            header: "Success!",
            body: <h3>Database successfully updated</h3>
          });

          //  query the db and reload the table
          this.adminGetAllRentals();
        }
      })
      .catch(err => console.log(err));
  };

  logSelection = () => {
    console.log("Selection:", this.state.selection);
    console.log("Row: ", this.state.selectedRow);
  };

  // editable react table

  renderEditable = (cellInfo) => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const rentals = [...this.state.rentals];
          rentals[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ rentals: rentals });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.rentals[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  };


  render() {
    const { toggleSelection, isSelected } = this;

    const checkboxProps = {
      isSelected,
      toggleSelection,
      selectType: "checkbox",
      getTrProps: (s, r) => {
        let selected;
        if (r) {
          selected = this.isSelected(r.original._id);
        }
        return {
          style: {
            backgroundColor: selected ? "#00eef7" : "inherit",
            color: selected ? '#000' : 'inherit',
          }
        };
      }
    };

    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.modal.header}
          body={this.state.modal.body}
          footer={this.state.modal.footer}
        />

        {/* if no rows have been selected, button remains disabled
            clicking the button without anything selected results in an error */}
        <button disabled={this.state.selection.length === 0} onClick={this.updateSelectedRow}>Update Selected Row</button>
        <button onClick={this.props.hideRentals}>Hide Table</button>
        <button onClick={this.logSelection}>Log Selection</button>

        <h2>Rentals</h2>
        <CheckboxTable

        // this is the 'r' that gets passed in to 'getTrProps' in the checkboxprops object 
          ref={r => (this.checkboxTable = r)}
          data={this.state.rentals}
          columns={[
            {
              Header: "Rental Info",
              columns: [
                {
                  Header: "Name",
                  accessor: "name",
                  Cell: this.renderEditable
                },
                {
                  Header: "Category",
                  id: "category",
                  accessor: d => d.category,
                  Cell: this.renderEditable
                },
                {
                  Header: "Manufacturer",
                  accessor: "maker",
                  Cell: this.renderEditable
                },
                {
                  Header: "SKU",
                  accessor: "sku",
                  Cell: this.renderEditable
                },
              ]
            },
            {
              Header: "Rental Details",
              columns: [
                {
                  Header: "Daily Rate",
                  accessor: "rate",
                  Cell: this.renderEditable
                },
                {
                  Header: "Date Acq.",
                  accessor: "dateAcquired",
                  Cell: this.renderEditable
                },
                {
                  Header: "Times Rented",
                  accessor: "timesRented",
                  Cell: this.renderEditable
                },
                {
                  Header: "Condition",
                  accessor: "condition",
                  Cell: this.renderEditable
                }
              ]
            },
            {
              Header: 'Buttons',
              columns: [
                {
                  Header: "Edit Buttons",
                  id: "edit-buttons",
                  accessor: () => {
                    return <button>Stuff</button>;
                  }
                }
              ]
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          {...checkboxProps}
        />
      </Fragment>
    );
  }
}