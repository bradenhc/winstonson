const winston = require('winston');
const moment = require('moment');

let _level = 'debug';

let _dateFormat = null;

const _customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        trace: 3,
        debug: 4
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'cyan',
        trace: 'magenta',
        debug: 'white'
    }
};

const _logFormatter = winston.format.printf(info => {
    let date = _dateFormat ? info.timestamp.format(_dateFormat) : info.timestamp.format();
    return `${info.level}: ${date} [${info.filename}] ${info.code ? '(' + info.code + ')' : ''} ${info.message}`;
});

const _transports = {
    console: new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), _logFormatter)
    }),
    fileGeneral: new winston.transports.File({ filename: 'out.log', format: _logFormatter }),
    fileError: new winston.transports.File({ filename: 'error.log', level: 'error', format: _logFormatter })
};

const _logger = winston.createLogger({
    levels: _customLevels,
    level: _level,
    transports: [_transports.fileError, _transports.fileGeneral]
});

if (process.env.NODE_ENV !== 'production') {
    _logger.add(_transports.console);
}

if (process.env.NODE_ENV === 'test') {
    _transports.console.silent = true;
}

module.exports = function(m) {
    let pathParts = m.id.split('/');
    let filename = pathParts[pathParts.length - 1];
    return {
        debug: function(message) {
            _logger.log({ level: 'debug', message: message, timestamp: moment(), filename });
        },
        trace: function(message) {
            _logger.log({ level: 'trace', message, timestamp: moment(), filename });
        },
        info: function(message) {
            _logger.log({ level: 'info', message: message, timestamp: moment(), filename });
        },
        warn: function(message) {
            _logger.log({ level: 'warn', message: message, timestamp: moment(), filename });
        },
        error: function(message) {
            if (typeof message === 'object' && message instanceof Error) {
                _logger.log({
                    level: 'error',
                    message: message.message,
                    code: message.code,
                    timestamp: moment(),
                    filename
                });
            } else {
                _logger.log({ level: 'error', message: message, timestamp: moment(), filename });
            }
        },
        level: function(level) {
            if (level) {
                _level = level;
                _logger.level = level;
                _transports.console.level = level;
                _transports.fileGeneral.level = level;
            } else {
                return _level;
            }
        },
        mute: function() {
            _transports.console.silent = true;
        },
        unmute: function() {
            _transports.console.silent = false;
        },
        setDateFormat(format) {
            _dateFormat = format;
        },
        stream(level) {
            return {
                write: function(message, enc) {
                    _logger.log({
                        level,
                        message: message.replace(/\n/g, ''), // removing any extra newlines
                        timestamp: moment(),
                        filename
                    });
                }
            };
        }
    };
};
