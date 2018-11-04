import React, { Component } from "react";
import { ResponsiveBarCanvas, BarCanvas, ResponsiveBar, Bar } from "@nivo/bar";
import axios from "axios";
import API_URL from "../../ApiAdapter";

class StoryStatusBar extends Component {
  state = {
    barData: [],
    barKeys: []
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetchDataForChart();
  }

  fetchDataForChart = () => {
    console.log("StoryStatusBar::fetchDataForChart");

    const config = {
      headers: {
        "content-type": "application/json",
        authorization: `${this.props.loginState.token}`
      }
    };

    axios
      .get(`${API_URL}/dashboard/bar/story-count-by-status-and-owner`, config)
      .then(res => {
        console.log(res);
        this.setState({ barData: res.data.data, barKeys: res.data.keys });
      })
      .catch(err => {
        console.log("Fetching data for Bar chart Failed: " + err.message);
      });
  };

  render() {
    return (
      <ResponsiveBarCanvas
        // height={400}
        // width={600}
        data={this.state.barData}
        keys={this.state.barKeys}
        indexBy="status"
        margin={{
          top: 50,
          right: 60,
          bottom: 50,
          left: 60
        }}
        padding={0.3}
        colors="nivo"
        colorBy="id"
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        // fill={[
        //   {
        //     match: {
        //       id: "eljog"
        //     },
        //     id: "dots"
        //   },
        //   {
        //     match: {
        //       id: "merin"
        //     },
        //     id: "lines"
        //   }
        // ]}
        borderColor="inherit:darker(1.6)"
        // axisBottom={{
        //   orient: "bottom",
        //   tickSize: 5,
        //   tickPadding: 5,
        //   tickRotation: 0,
        //   legend: "Status",
        //   legendPosition: "end",
        //   legendOffset: 36
        // }}
        // axisLeft={{
        //   orient: "left",
        //   tickSize: 5,
        //   tickPadding: 5,
        //   tickRotation: 0,
        //   legend: "Story",
        //   legendPosition: "end",
        //   legendOffset: -40
        // }}
        // labelSkipWidth={12}
        // labelSkipHeight={12}
        // labelTextColor="inherit:darker(1.6)"
        // // animate={true}
        // // motionStiffness={100}
        // // motionDamping={15}
        // legends={[
        //   {
        //     dataFrom: "keys",
        //     anchor: "bottom-right",
        //     direction: "column",
        //     justify: false,
        //     translateX: 120,
        //     translateY: 0,
        //     itemsSpacing: 2,
        //     itemWidth: 100,
        //     itemHeight: 20,
        //     itemDirection: "left-to-right",
        //     itemOpacity: 0.85,
        //     symbolSize: 20,
        //     effects: [
        //       {
        //         on: "hover",
        //         style: {
        //           itemOpacity: 1
        //         }
        //       }
        //     ]
        //   }
        // ]}
      />
    );
  }
}

export default StoryStatusBar;
