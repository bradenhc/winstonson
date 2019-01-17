# winstonson (v1.0.0)
Simple logging wrapper around [Winston](https://www.npmjs.com/package/winston) for Node.js

```text
npm install winstonson
```

Winstonson is an very simple, opinionated logging wrapper around the [Winston](https://www.npmjs.com/package/winston) logging library. It defines three different logs:
- Console - prints output to the console
- Error - writes error messages to an `error.log` file
- Out - writes all logging messages to an `out.log` file

### Usage

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

### Log Message Format
Currently the log message format is static, but this will change in future versions. An example of the default format is provided below:

```text
# level: timestamp [file] message
verbose: 1545878224449 [example.js]  Hello, world!
```

You can also mute/unmute output to the console with the `logger.mute()` and `logger.unmute()` functions respectively.
