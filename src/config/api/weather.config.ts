export const buildWeatherUrl = (latitude: number): string =>
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=167.6917&current_weather=true`;
