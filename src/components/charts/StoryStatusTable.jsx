import React, { Component } from "react";
import grey from "@material-ui/core/colors/grey";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import API_URL from "../../ApiAdapter";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%"
    // minHeight: "100vh"
  },
  tableGrid: {
    flexGrow: 1,
    width: "90%",
    marginLeft: "5%"
  },
  column: {
    width: "45%"
  },
  table: {
    minWidth: 700
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
});

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: grey[800],
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9)
];

class StoryStatusTable extends Component {
  state = { tableData: [] };

  componentDidMount() {
    this.fetchDataForTable();
  }

  fetchDataForTable = () => {
    console.log("StoryStatusTable::fetchDataForTable");

    const config = {
      headers: {
        "content-type": "application/json",
        authorization: `${this.props.loginState.token}`
      }
    };

    axios
      .get(`${API_URL}/dashboard/table/story-count-by-status-and-owner`, config)
      .then(res => {
        console.log(res);
        this.setState({ tableData: res.data });
      })
      .catch(err => {
        console.log("Fetching data for Bar chart Failed: " + err.message);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>Owner</CustomTableCell>
            <CustomTableCell numeric>New</CustomTableCell>
            <CustomTableCell numeric>Ready</CustomTableCell>
            <CustomTableCell numeric>In Progress</CustomTableCell>
            <CustomTableCell numeric>Completed</CustomTableCell>
            <CustomTableCell numeric>Accepted</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.tableData.map(row => {
            return (
              <TableRow className={classes.row} key={row.id}>
                <CustomTableCell component="th" scope="row">
                  {row.name}
                </CustomTableCell>
                <CustomTableCell numeric>{row.New}</CustomTableCell>
                <CustomTableCell numeric>{row.Ready}</CustomTableCell>
                <CustomTableCell numeric>{row.InProgress}</CustomTableCell>
                <CustomTableCell numeric>{row.Completed}</CustomTableCell>
                <CustomTableCell numeric>{row.Accepted}</CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(StoryStatusTable);
