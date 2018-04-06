import winston from 'winston';

let transports = [];

let timestamp = () => new Date(Date.now()).toLocaleString();

transports.push(new (winston.transports.Console)({
    level: 'info',
    colorize: true,
    prettyPrint: true,
    timestamp
}));

const log = new winston.Logger({ transports });

export default log;
