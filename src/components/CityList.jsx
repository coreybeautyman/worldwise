import CityItem from './CityItem';
import styles from './CityList.module.css';
import Spinner from './Spinner';
import Message from './Message';
import { useCities } from '../Contexts/CitiesContext';

function CityList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="Add you're first city by clicking on the map" />;

  return (
    <div className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </div>
  );
}

export default CityList;
