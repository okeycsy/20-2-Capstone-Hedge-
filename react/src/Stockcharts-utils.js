

import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";
import * as d3 from "d3";

function parseData(parse) {
	return function(d) {
		d.date = parse(d.날짜);
		d.open = +d.Open;
		d.high = +d.High;
		d.low = +d.Low;
		d.close = +d.Close;
		d.volume = +d.Volume;

		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");

export function getData(company) {
	const url = "http://swlab.uos.ac.kr/share" + company
	const promiseMSFT = fetch(url)
		.then(response => response.text())
		.then(data => csvParse(data, parseData(parseDate)))
	return promiseMSFT;
}

export default getData