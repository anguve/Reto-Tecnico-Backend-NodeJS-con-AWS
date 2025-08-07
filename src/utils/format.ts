export function formatMergedData(person: any, planet: any, weather: any) {
  return {
    name: person.name,
    gender: person.gender,
    planet: planet?.name || 'Unknown',
    population: planet?.population || 'Unknown',
    weather: weather?.description || 'Unavailable',
    temperatureCelsius: weather?.temperatureC || null,
  };
}
