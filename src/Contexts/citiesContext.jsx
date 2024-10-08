import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from 'react';

const CitiesContext = createContext();

// const BASE_URL = 'http://localhost:9000';

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };

    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };
    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(city => city.id !== action.payload),
        currentCity: {},
      };
    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('unknown action type');
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: 'loading' });
        const data = JSON.parse(localStorage.getItem('cities') || []);
        dispatch({ type: 'cities/loaded', payload: data });
      } catch (error) {
        dispatch({
          type: 'rejected',
          payload: 'There was an Error loading data!',
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (+id === +currentCity.id) return;
      try {
        dispatch({ type: 'loading' });
        const data = JSON.parse(localStorage.getItem('cities') || []);
        const city = data.find(city => city.id === id);
        if (city) {
          dispatch({ type: 'city/loaded', payload: city });
        } else {
          throw new Error('City not found');
        }
      } catch (error) {
        dispatch({
          type: 'rejected',
          payload: 'There was an Error loading data!',
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    try {
      dispatch({ type: 'loading' });
      const data = JSON.parse(localStorage.getItem('cities') || '[]');
      newCity.id = Date.now();
      data.push(newCity);
      localStorage.setItem('cities', JSON.stringify(data));

      dispatch({ type: 'city/created', payload: newCity });
    } catch (error) {
      dispatch({
        type: 'rejected',
        payload: 'There was an Error creating the city',
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: 'loading' });

      const data = JSON.parse(localStorage.getItem('cities') || []);
      const newData = data.filter(city => city.id !== id);
      localStorage.setItem('cities', JSON.stringify(newData));

      dispatch({
        type: 'city/deleted',
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: 'rejected',
        payload: 'there was an error deleting a city',
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error('Cities context was used outside cities provider');
  return context;
}

export { CitiesProvider, useCities };
