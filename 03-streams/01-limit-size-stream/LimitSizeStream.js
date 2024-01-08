const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.bytesReceived = 0;
  }

  _transform(chunk, encoding, callback) {
    if (chunk.length + this.bytesReceived <= this.limit) {
      this.bytesReceived += chunk.length;

      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
