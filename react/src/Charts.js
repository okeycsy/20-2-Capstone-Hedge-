
import React, { useState } from 'react';
import { render } from 'react-dom';
import { Text } from 'react-native'


import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";

import { VictoryChart, VictoryTheme, VictoryAxis, VictoryCandlestick, VictoryZoomContainer } from 'victory-native'


function parseData(parse) {
	return function(d) {
		d.x = parse(d.날짜);
		d.open = +d.Open;
		d.high = +d.High;
		d.low = +d.Low;
		d.close = +d.Close;
		d.volume = +d.Volume;

		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");

function getData(company) {
	const url = "http://swlab.uos.ac.kr/share_" + company
	const promiseMSFT = fetch(url)
		.then(response => response.text())
		.then(data => csvParse(data, parseData(parseDate)))

	console.log('fetch done')
	return promiseMSFT;
}

class ChartComponent extends React.Component {
	componentDidMount() {
		getData(this.props.company).then((data) => {
			this.setState({ data : data })
			this.props.load(
				this.state.data[data.length - 2].Close, this.state.data[data.length - 1].Close,
				this.state.data[data.length - 1].High, this.state.data[data.length - 1].Low,
				this.state.data[data.length - 1].Volume)
		})
	}
	render() {
		if (this.state == null) {
			return <Text>Loading...</Text>
		}
		return (
			<VictoryChart
				theme={VictoryTheme.material}
				scale={{ x: "time" }}>
				<VictoryAxis tickFormat={(t) => `${t.getMonth()}월 ${t.getDate()}일`}/>
				<VictoryAxis dependentAxis/>
				<VictoryCandlestick
				candleColors={{ positive: "#ff776b", negative: "#6b75ff" }}
				data={this.state.data}
				/>
			</VictoryChart>
		)
	}
}

export default ChartComponent