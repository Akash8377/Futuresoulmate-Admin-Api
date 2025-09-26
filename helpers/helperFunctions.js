const airlinesData = require('../data/airlines.json');
const airportData = require('../data/airports.json');
const aircraftData = require('../data/aircraft.json');

// Create the maps once when the module loads
const airlineMap = (() => {
  const map = {};
  airlinesData.forEach((airline) => {
    if (airline.iata_code) map[airline.iata_code] = airline;
  });
  return map;
})();

const airportMap = (() => {
  const map = {};
  airportData.forEach((airport) => {
    if (airport.iata_code) {
      map[airport.iata_code] = {
        ...airport,
        city: airport.city && typeof airport.city === 'object' ? airport.city.name : airport.city,
      };
    }
  });
  return map;
})();

const aircraftMap = (() => {
  const map = {};
  aircraftData.forEach((aircraft) => {
    if (aircraft.iata_code) map[aircraft.iata_code] = aircraft;
  });
  return map;
})();

const getAirportName = (iata) => airportMap[iata]?.name || iata;
const getAirportCity = (iata) => airportMap[iata]?.city || iata; // Fixed to use the transformed city field
const getAirlineName = (iata) => airlineMap[iata]?.name || iata;
const getAircraftName = (iata) => aircraftMap[iata]?.name || iata;

module.exports = {
  getAirportName,
  getAirportCity,
  getAirlineName,
  getAircraftName,
};