/* Reservations.js */
"use strict";

const log = console.log;
const fs = require("fs");
const datetime = require("date-and-time");
const JSON_TIME_FORMAT = "MMM DD YYYY HH:mm:ss";

const startSystem = () => {
    let status = {};

    try {
        status = getSystemStatus();
    } catch (e) {
        status = {
            numRestaurants: 0,
            totalReservations: 0,
            currentBusiestRestaurantName: null,
            systemStartTime: new Date()
        };

        fs.writeFileSync("status.json", JSON.stringify(status));
    }

    return status;
};

/*********/

// You may edit getSystemStatus below.  You will need to call updateSystemStatus() here, which will write to the json file
const getSystemStatus = () => {
    const status = JSON.parse(fs.readFileSync("status.json"));
    const startTime = status.systemStartTime;
    const reservations = getAllReservations();
    const restaurants = getAllRestaurants();
    let curMax = 0;
    let maxRestaurant = "";
    for (let i = 0; i < restaurants.length; i++) {
        if (restaurants[i].numReservations >= curMax) {
            curMax = restaurants[i].numReservations;
            maxRestaurant = restaurants[i].name;
        }
    }
    const numReservation = reservations.length;
    const numRestaurant = restaurants.length;
    const result = {
        numRestaurants: numRestaurant,
        totalReservations: numReservation,
        currentBusiestRestaurantName: maxRestaurant,
        systemStartTime: startTime
    };
    updateSystemStatus(result);
    return result;
};

/* Helper functions to save JSON */
// You can add arguments to updateSystemStatus if you want.
const updateSystemStatus = status => {
    /* Add your code below */
    fs.writeFileSync("status.json", JSON.stringify(status));
};

const saveRestaurantsToJSONFile = restaurants => {
    /* this function takes a list of restaurants as input and save it into restaurant.jsfile*/
    /* Add your code below */
    try {
        fs.writeFileSync("restaurants.json", JSON.stringify(restaurants));
    } catch (error) {
        console.log("File write error");
    }
};

const saveReservationsToJSONFile = reservations => {
    /* Add your code below */
    try {
        fs.writeFileSync("reservations.json", JSON.stringify(reservations));
    } catch (error) {
        console.log("File write error");
    }
};

/*********/

// Should return an array of length 0 or 1.
const addRestaurant = (name, description) => {
    // Check for duplicate names
    const restaurants = getAllRestaurants();
    const flagIfDuplicateName = restaurants.filter(
        restaurant => restaurant.name === name
    );
    if (flagIfDuplicateName.length != 0) {
        return [];
    } else {
        // if no duplicate names:
        const addedRestaurant = {
            name: name,
            description: description,
            numReservations: 0
        };
        restaurants.push(addedRestaurant);
        saveRestaurantsToJSONFile(restaurants);
        return [addedRestaurant];
    }
};

// should return the added reservation object
const addReservation = (restaurant, time, people) => {
    /* Add your code below */
    const dateObj = datetime.parse(time, JSON_TIME_FORMAT,true);
    const reservation = {
        restaurant: restaurant,
        time: dateObj,
        people: people
	};
    updateRestaurant(restaurant);
    updateReservation(reservation);
    return reservation;
};

const updateReservation = reservation => {
    try {
        const allReservations = getAllReservations();
        allReservations.push(reservation);
        saveReservationsToJSONFile(allReservations);
    } catch (error) {
        log("Cannot save reservation");
    }
};

const updateRestaurant = targetRestaurantName => {
    const allRestaurants = getAllRestaurants();
    const resultRestaurants = allRestaurants.filter(
        restaurant => restaurant.name !== targetRestaurantName
    );
    try {
        const targetRestaurantlist = allRestaurants.filter(
            restaurant => restaurant.name == targetRestaurantName
        );
        const targetRestaurant = targetRestaurantlist[0];
        targetRestaurant.numReservations += 1;
        resultRestaurants.push(targetRestaurant);
        saveRestaurantsToJSONFile(resultRestaurants);
    } catch (error) {
        log("Do not add reservation into a restaurant that has not been added");
    }
};

/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
    /* Add your code below */
    try {
        const restaurantFile = fs.readFileSync("restaurants.json");

        return JSON.parse(restaurantFile);
    } catch (e) {
        return [];
    }
};

// Should return the restaurant object if found, or an empty object if the restaurant is not found.
const getRestaurantByName = name => {
    /* Add your code below */
    const allRestaurants = getAllRestaurants();
    const targetRestaurant = allRestaurants.filter(
        restaurant => restaurant.name === name
    );
    if (targetRestaurant.length == 0) {
        return {};
    } else {
        return targetRestaurant[0];
    }
};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
    /* Add your code below */
    try {
        const reservationFile = fs.readFileSync("reservations.json");
        const reservations = JSON.parse(reservationFile);
        for (let reservation of reservations) {
            reservation.time = datetime.parse(
                reservation.time,
                "YYYY-MM-DDTHH:mm:ss.SSSZ",
                true
            );
        }
        return reservations;
    } catch (error) {
        return [];
    }
};

const srotTime = (r1, r2) => {
    if (r1.time < r2.time) {
        return -1;
    }
    if (r1.time == r2.time) {
        return 0;
    } else {
        return 1;
    }
};

// Should return an array
const getAllReservationsForRestaurant = name => {
    /* Add your code below */
    try {
        const allReservations = getAllReservations();
        const targetRestaurant = allReservations.filter(
            reservation => reservation.restaurant === name
        );
        const sortedReservation = targetRestaurant.sort(srotTime);
        return sortedReservation;
    } catch (e) {
        log("We had some error in get all reservation");
        log(e);
    }
};
// Should return an array
const getAllReservationsNotForRestaurant = name => {
    /* Add your code below */
    try {
        const allReservations = getAllReservations();
        const targetRestaurant = allReservations.filter(
            reservation => reservation.restaurant !== name
        );
        const sortedReservation = targetRestaurant.sort(srotTime);
        return sortedReservation;
    } catch (e) {
        log("We had some error in get all reservation");
        log(e);
    }
};

// Should return an array
const getReservationsForHour = time => {
    /* Add you r code below */
    //time= Mar 17 2019 16:30:00

    const allReservations = getAllReservations();
	const dateTimeObj = datetime.parse(time, "MMM DD YYYY HH:mm:ss",true);
	const oneHourMore = datetime.addHours(dateTimeObj, 1);
	//date.subtract(today, yesterday).toHours();
    const resevationsInHour = allReservations.filter(
		reservation =>	
            datetime.subtract(oneHourMore, reservation.time).toMilliseconds() > 0 &&
			datetime.subtract(reservation.time, dateTimeObj).toMilliseconds() >= 0
	);
	const sortedReservation = resevationsInHour.sort(srotTime);
    return sortedReservation;
};

// should return a reservation object
const checkOffEarliestReservation = restaurantName => {
    const goodReservations = getAllReservationsForRestaurant(restaurantName);
    if (goodReservations.length > 0) {
        const targetResrvationTime = goodReservations[0].time;
        const targetRestaurantName = goodReservations[0].restaurant;
        removeFromReservation(targetResrvationTime, targetRestaurantName);
		removeFromRestaurant(targetRestaurantName);
		const checkedOffReservation = goodReservations[0]; // remove null and assign it to proper value
		return checkedOffReservation;
	}
	else{
		return {}
	}
};

const removeFromReservation = (targetResrvationTime, targetRestaurantName) => {
    try {
		const allReservations = getAllReservations(targetRestaurantName);
        const resultReservations = allReservations.filter(
            reservation =>
                (datetime
                    .subtract(reservation.time, targetResrvationTime)
                    .toMilliseconds() > 0) || (reservation.restaurant != targetRestaurantName)
		)
        saveReservationsToJSONFile(resultReservations);
    } catch (error) {
        log("Cannot save reservation");
    }
};

const removeFromRestaurant = targetRestaurantName => {
    const allRestaurants = getAllRestaurants();
    const resultRestaurants = allRestaurants.filter(
        restaurant => restaurant.name !== targetRestaurantName
    );
    try {
        const targetRestaurantlist = allRestaurants.filter(
            restaurant => restaurant.name == targetRestaurantName
        );
        const targetRestaurant = targetRestaurantlist[0];
        targetRestaurant.numReservations -= 1;
        resultRestaurants.push(targetRestaurant);
        saveRestaurantsToJSONFile(resultRestaurants);
    } catch (error) {
        log("Do not add reservation into a restaurant that has not been added");
    }
};

const addDelayToReservations = (restaurant, minutes) => {
    //addMinutes(dateObj, minutes)
    // Hint: try to use a functional array method
    const goodReservations = getAllReservationsForRestaurant(restaurant);
    const badReservations = getAllReservationsNotForRestaurant(restaurant);
    goodReservations.map(
        reservation =>
            (reservation.time = datetime.addMinutes(reservation.time, minutes))
    );
    const resultReservations = badReservations.concat(goodReservations);
    saveReservationsToJSONFile(resultReservations);
    return goodReservations;
};

const reservationString = Reservations => {
    let resultString = "";
    for (let i = 0; i < Reservations.length; i++) {
        const reservation = Reservations[i];
        const reservationTime = reservation.time;
        const reservationPeopple = reservation.people;
        const finaldateTimeString = datetime.format(
            reservationTime,
			"MMM DD YYYY, h:mm A",
			true
        );
        const reservationString = `- ${finaldateTimeString}, table for ${reservationPeopple}\n`;
        resultString = resultString.concat(reservationString);
    }
    return resultString.trim();
};

startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in app.js..but they're here.
module.exports = {
    addRestaurant,
    getSystemStatus,
    getRestaurantByName,
    getAllRestaurants,
    getAllReservations,
    getAllReservationsForRestaurant,
    addReservation,
    checkOffEarliestReservation,
    getReservationsForHour,
    addDelayToReservations,
    reservationString
};
