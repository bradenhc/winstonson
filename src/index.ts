import moment from "moment";
import winston from "winston";

type DebugLevel = "debug" | "trace" | "info" | "warn" | "error";

let _level: DebugLevel = "debug";

let _dateFormat: string = null;

const _customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    trace: 3,
    debug: 4
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "cyan",
    trace: "magenta",
    debug: "white"
  }
};

const _logFormatter = winston.format.printf((info) => {
  const date = _dateFormat ? info.timestamp.format(_dateFormat) : info.timestamp.format();
  return `${info.level}: ${date} [${info.filename}] ${info.message}`;
});

const _transports = {
  console: new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), _logFormatter)
  }),
  fileGeneral: new winston.transports.File({
    filename: "out.log",
    format: _logFormatter
  }),
  fileError: new winston.transports.File({
    filename: "error.log",
    level: "error",
    format: _logFormatter
  })
};

const _logger = winston.createLogger({
  levels: _customLevels.levels,
  level: _level,
  transports: [_transports.fileError, _transports.fileGeneral]
});

winston.addColors(_customLevels.colors);

if (process.env.NODE_ENV !== "production") {
  _logger.add(_transports.console);
}

if (process.env.NODE_ENV === "test") {
  _transports.console.silent = true;
}

export default function(m: NodeModule) {
  const pathParts = m.id.split("/");
  const filename = pathParts[pathParts.length - 1];
  return {
    debug(message: string) {
      _logger.log({
        level: "debug",
        message,
        timestamp: moment(),
        filename
      });
    },
    trace(message: string) {
      _logger.log({ level: "trace", message, timestamp: moment(), filename });
    },
    info(message: string) {
      _logger.log({
        level: "info",
        message,
        timestamp: moment(),
        filename
      });
    },
    warn(message: string) {
      _logger.log({
        level: "warn",
        message,
        timestamp: moment(),
        filename
      });
    },
    error(message: string | Error) {
      if (typeof message === "object" && message instanceof Error) {
        _logger.log({
          level: "error",
          message: message.message,
          timestamp: moment(),
          filename
        });
      } else {
        _logger.log({
          level: "error",
          message,
          timestamp: moment(),
          filename
        });
      }
    },
    level(level: DebugLevel) {
      if (level) {
        _level = level;
        _logger.level = level;
        _transports.console.level = level;
        _transports.fileGeneral.level = level;
      } else {
        return _level;
      }
    },
    mute() {
      _transports.console.silent = true;
    },
    unmute() {
      _transports.console.silent = false;
    },
    setDateFormat(format: string) {
      _dateFormat = format;
    },
    stream(level: DebugLevel) {
      return {
        write(message: string, enc: string) {
          _logger.log({
            level,
            message: message.replace(/\n/g, ""), // removing any extra newlines
            timestamp: moment(),
            filename
          });
        }
      };
    }
  };
}
