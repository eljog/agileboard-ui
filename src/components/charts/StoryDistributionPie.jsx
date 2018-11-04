import React, { Component } from "react";
import { ResponsivePieCanvas } from "@nivo/pie";
import axios from "axios";
import API_URL from "../../ApiAdapter";

class StoryDistributionPie extends Component {
  state = { pieData: [] };

  componentDidMount() {
    this.fetchDataForChart();
  }

  fetchDataForChart = () => {
    console.log("StoryDistributionPie::fetchDataForChart");

    const config = {
      headers: {
        "content-type": "application/json",
        authorization: `${this.props.loginState.token}`
      }
    };

    axios
      .get(`${API_URL}/dashboard/pie/story-count-by-owner`, config)
      .then(res => {
        console.log(res);
        this.setState({ pieData: res.data });
      })
      .catch(err => {
        console.log("Fetching data for Pie chart Failed: " + err.message);
      });
  };

  render() {
    return (
      <ResponsivePieCanvas
        data={this.state.pieData}
        margin={{
          top: 40,
          right: 200,
          bottom: 40,
          left: 80
        }}
        pixelRatio={1}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors="paired"
        colorBy="id"
        borderColor="inherit:darker(0.6)"
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor="inherit"
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        legends={[
          {
            anchor: "right",
            direction: "column",
            translateX: 140,
            itemWidth: 60,
            itemHeight: 14,
            itemsSpacing: 2,
            symbolSize: 14,
            symbolShape: "circle"
          }
        ]}
      />
    );
  }
}

export default StoryDistributionPie;
