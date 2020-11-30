
import React, { useState } from 'react';
import { render } from 'react-dom';
import Stockcharts from "./Stockcharts-tutorial";
import { getData } from "./Stockcharts-utils"

import { TypeChooser } from "react-stockcharts/lib/helper";
import { LongPressGestureHandler } from 'react-native-gesture-handler';
class ChartComponent extends React.Component {
	componentDidMount() {
		getData(this.props.company).then(data => {
			this.setState({ data })
			this.props.load(
				data[data.length - 2].Close, data[data.length - 1].Close,
				data[data.length - 1].High, data[data.length - 1].Low,
				data[data.length - 1].Volume)
		})
	}
	render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
			<Stockcharts data={this.state.data}/>
		)
	}
}

render(
	<ChartComponent />,
	document.getElementById("root")
);

export default ChartComponent