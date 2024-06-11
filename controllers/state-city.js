import { State, City } from 'country-state-city';

const COUNTRY_CODE = 'IN';
var states = [];

function fetchStates (req, res) {
    states = State.getStatesOfCountry(COUNTRY_CODE);
    res.status(200).json({data : states.
        map(state => state.name )
    });
}

async function fetchCities (req, res) {
    const selectedState = req.query.selectedState;
    const stateCode = states.find(state => {
        if(state.name === selectedState){
            return state;
        }
    }).isoCode;
    const cities = await City.getCitiesOfState(COUNTRY_CODE,stateCode);
    res.status(200).json({data : cities.map(city => {
        return city.name;
    })});
}

export {fetchStates, fetchCities};