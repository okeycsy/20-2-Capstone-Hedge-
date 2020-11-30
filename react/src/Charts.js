
import React, { useState } from 'react';
import { render } from 'react-dom';
import { Text } from 'react-native'
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
			return <Text>Loading...</Text>
		}
		return (
			<TypeChooser>
				{type => <Stockcharts type={type} data={this.state.data} />}
			</TypeChooser>
		)
	}
}

export default ChartComponent