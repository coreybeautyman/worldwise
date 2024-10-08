import CountryItem from './CountryItem';
import styles from './CSS/CountryList.module.css';
import Spinner from './Spinner';
import Message from './Message';
import { useCities } from '../Contexts/citiesContext';

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities || !cities.length)
    return <Message message="Add you're first city by clicking on the map" />;

  const countries = cities.reduce((arr, city) => {
    if (!arr.map(el => el.country).includes(city.country)) {
      return [
        ...arr,
        { country: city.country, emoji: city.emoji, id: city.id },
      ];
    } else {
      return arr;
    }
  }, []);

  return (
    <div className={styles.countryList}>
      {countries.map(country => (
        <CountryItem country={country} key={country.id} />
      ))}
    </div>
  );
}

export default CountryList;
