export class WeatherHourlyDto {
  rainProbability: number;
  sky: number;
  time: string;
  pty: number;
}

export class WeatherDto {
  maxTemp: number;
  minTemp: number;
  hourly: WeatherHourlyDto[];
}

export class WeatherWithStationDto extends WeatherDto {
  stationName: string;
}

export class WeatherStatusDto {
  value: number;
  time: string;
}
