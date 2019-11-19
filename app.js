/* E3 app.js */
"use strict";

const log = console.log;
const JSON_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZ";
const yargs = require("yargs")
	.option("addRest", {
		type: "array" // Allows you to have an array of arguments for particular command
	})
	.option("addResv", {
		type: "array"
	})
	.option("addDelay", {
		type: "array"
	});

const reservations = require("./reservations");

// datetime available if needed
const datetime = require("date-and-time");

const yargs_argv = yargs.argv;

if ("addRest" in yargs_argv) {
	const args = yargs_argv["addRest"];
	const rest = reservations.addRestaurant(args[0], args[1]);
	if (rest.length > 0) {
		/* complete */
		const restaurantName = rest[0].name;
		const outPutStirng = `Added restaurant ${restaurantName}`;
		console.log(outPutStirng);
	} else {
		/* complete */
		console.log("Duplicate restaurant not added.");
	}
}

if ("addResv" in yargs_argv) {
	const args = yargs_argv["addResv"];
	const resv = reservations.addReservation(args[0], args[1], args[2]);
	const restaurant = args[0];
	const date = resv.time;
	const dateString = datetime.format(date, "MMM DD YYYY, h:mm A", true);
	const number = args[2];
	let resultString = ""
	resultString = `Added reservation at ${restaurant} on ${dateString} for ${number} people.`;
	log(resultString);
}

if ("allRest" in yargs_argv) {
	const restaurants = reservations.getAllRestaurants(); // get the array
	("Red Lobster: Seafood at low prices - 2 active reservations");
	(":Fresh: Vegan delights - 4 active reservations");
	// Produce output below
	let resultString = ""
	if (restaurants != []) {
		resultString = restaurants.reduce(
			(result, restaurant) =>
				result.concat(
					restaurant.name +
					":" +
					" " +
					restaurant.description +
					" - " +
					restaurant.numReservations +
					" active: reservations\n"
				),
			""
		)
	}
	log(resultString.trim());
}

if ("restInfo" in yargs_argv) {
	const restaurant = reservations.getRestaurantByName(yargs_argv["restInfo"]);
	let resultString = ""
	if (restaurant !== {}) {
		resultString =
			restaurant.name +
			": " +
			restaurant.description +
			" - " +
			restaurant.numReservations +
			" active reservations";
	}
	// Produce output below
	//Red Lobster: Seafood at low prices - 2 active reservations
	log(resultString.trim());
}

//$ node app.js --allResv "Red Lobster"
if ("allResv" in yargs_argv) {
	const restaurantName = yargs_argv["allResv"];
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(
		restaurantName
	); // get the arary
	// Produce output below
	let resultString = ""
	if (reservationsForRestaurant.length > 0) {
		resultString = reservations.reservationString(reservationsForRestaurant);
	}
	log(resultString.trim());
}

if ("hourResv" in yargs_argv) {
	// Produce output below
	//- Red Lobster: Mar 17 2019, 5:15 p.m., table for 5
	const time = yargs_argv["hourResv"];
	const reservationsForHour = reservations.getReservationsForHour(time); // get the arary
	let resultString = "";
	for (let i = 0; i < reservationsForHour.length; i++) {
		const reservation = reservationsForHour[i];
		const reservationTime = reservation.time;
		const reservationPeopple = reservation.people;
		const reservationRestaurant = reservation.restaurant;
		const finaldateTimeString = datetime.format(
			reservationTime,
			"MMM DD YYYY, h:mm A",
			true
		)
		const reservationString = `- ${reservationRestaurant}: ${finaldateTimeString}, table for ${reservationPeopple}\n`;
		resultString = resultString.concat(reservationString);
	}
	log(resultString.trim());
}

if ("checkOff" in yargs_argv) {
	//Checked off reservation on Mar 17 2019, 5:15 p.m., table for 5
	const restaurantName = yargs_argv["checkOff"];
	const earliestReservation = reservations.checkOffEarliestReservation(
		restaurantName
	);
	// Produce output below
	const reservationTime = earliestReservation.time;
	const finaldateTimeString = datetime.format(
		reservationTime,
		"MMM DD YYYY, h:mm A",
		true
	);
	const reservationPeopple = earliestReservation.people;
	const reservationString = `Checked off reservation on ${finaldateTimeString}, table for ${reservationPeopple}`;
	log(reservationString);
}

if ("addDelay" in yargs_argv) {
	//$ node app.js --addDelay "Red Lobster" 60
	const args = yargs_argv["addDelay"];
	const resv = reservations.addDelayToReservations(args[0], args[1]);
	// Produce output below
	let resultString = ""
	if(resv.length > 0){
	resultString = reservations.reservationString(resv);
	}
	log(resultString);
}

if ("status" in yargs_argv) {
	const status = reservations.getSystemStatus();
	const startTime = status.systemStartTime;
	const dateObj = datetime.parse(startTime, JSON_TIME_FORMAT, true);
	const finaldateTimeString = datetime.format(dateObj, "MMM DD YYYY, h:mm A", true);
	const numRest = status.numRestaurants;
	const numReser = status.totalReservations;
	const busyName = status.currentBusiestRestaurantName;
	const resultString = `Number of restaurants: ${numRest}\nNumber of total reservations:${numReser}\nBusiest restaurant: ${busyName}\nSystem started at:  ${finaldateTimeString}`;
	// Produce output below
	log(resultString);
}
