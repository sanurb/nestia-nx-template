import { transports } from 'winston';

export const getTransports = () => [new transports.Console()];
