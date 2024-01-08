const stream = require('node:stream');
const os = require('node:os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.string = null;
  }

  _transform(chunk, encoding, callback) {
    const str = chunk.toString();
    const lines = ((this.string !== null ? this.string : '') + str).split(os.EOL);

    this.string = lines.pop();

    for (const line of lines) {
      this.push(line);
    }

    callback();
  }

  _flush(callback) {
    this.push(this.string !== null ? this.string : '');
    callback();
  }
}

module.exports = LineSplitStream;
