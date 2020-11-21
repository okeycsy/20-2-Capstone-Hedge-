

import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";
import * as d3 from "d3";
import data from '../카카오.csv';

function parseData(parse) {
	return function(d) {
		d.date = parse(d.index);
		d.open = +d.Open;
		d.high = +d.High;
		d.low = +d.Low;
		d.close = +d.Close;
		d.volume = +d.Volume;

		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");

/* original code
export function getData() {
	const promiseMSFT = fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)))
	return promiseMSFT;
*/

export function getData() {
	const promiseMSFT = d3.csv(data, parseData(parseDate))
	return promiseMSFT;
}

export default getData