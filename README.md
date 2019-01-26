# winstonson (v1.0.0)
Simple logging wrapper around [Winston](https://www.npmjs.com/package/winston) for Node.js with support for Morgan middleware in Express.

```text
npm install winstonson
```

Winstonson is an very simple, opinionated logging wrapper around the [Winston](https://www.npmjs.com/package/winston) logging library. It defines three different logs:
- Console - prints output to the console
- Error - writes error messages to an `error.log` file
- Out - writes all logging messages to an `out.log` file

## Usage

```js
const logger = require('winstonson')(module);
```

Note the `module` in parentheses after requiring this library. This allows the resulting logger to output logging messages *unique to the file in which it is required*. Currently this means printing the filename of the  JavaScript file that includes the logger, but additional metadata could be included in later versions.

Logging severities are shown below, in increasing order of severity:
- `debug`
- `trace`
- `info`
- `warn`
- `error`
You can set the level of the logger **globally** by using the `logger.level('<level>')` function.


You can utilize any one of the five common logging functions to output log messages:

```js
logger.debug('I am a debug message!');
logger.trace('I am a trace message!');
logger.info('I am an informative message!');
logger.warn('I am a warning!');
logger.error('I am an error message! Something really bad happened!');
```

### Use with Express and Morgan
Winstonson allows you to capture the output of the Morgan middleware in Express thorugh the use of the `stream()` function. 

```js
const express = require('express');
const morgan = require('morgan');
const logger = require('winstonson')(module);
const app = express();

app.use(morgan('tiny', { stream: logger.stream('trace')}));

// Additional Express code |
// ...                     V
```

The provided level determines at what level the messages should be logged and corresponds to the Winstonson level set using `level()`. The output from Morgan will be located in the `message` portion of the log output (see below).

You can trace an HTTP request when it comes in and leaves by using Morgan in the following way:

```js
app.use(morgan('---> :remote-addr :remote-user ":method :url HTTP/:http-version"', { 
    immediate: true, 
    stream: logger.stream('trace')
}));
app.use(morgan('<--- :method :url :status :res[content-length]', { 
    immediate: false, 
    stream: logger.stream('trace')
}));
```

### Log Message Format
Currently the log message format is static, but this will change in future versions. An example of the default format is provided below:

```text
# level: timestamp [file] (code) message
verbose: 1545878224449 [example.js]  (100) Hello, world!
```

The `code` is defined on the `Error` object passed to the `logger.error()` function. If no code is defined, the code will simply be omitted from the output.

You can also mute/unmute output to the console with the `logger.mute()` and `logger.unmute()` functions respectively.
