// encodes an ArrayBuffer to base64 using a web worker, instead of blocking the main thread
class Base64Encoder {
  constructor() {
    // keep track of messages
    this._index = 0;

    this._resolves = {};

    const onmessage = ({ data }) => {
      const bytes = new Uint8Array(data.buffer);

      // from https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
      let binary = '';
      const len = bytes.byteLength;

      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      const base64 = btoa(binary);

      postMessage({
        base64,
        index: data.index,
      });
    };

    // create inline web worker to run onmessage()
    const blob = new Blob([`self.onmessage=${onmessage.toString()};`], {
      type: 'text/javascript',
    });

    const url = URL.createObjectURL(blob);

    this._worker = new Worker(url);

    URL.revokeObjectURL(url);

    this._worker.onmessage = ({ data }) => {
      const { base64, index } = data;

      // resolve promise returned earlier
      this._resolves[index](base64);
      this._resolves[index] = null;
    };
  }

  fromArrayBuffer(buffer) {
    return new Promise((resolve) => {
      this._resolves[this._index] = resolve;

      this._worker.postMessage(
        {
          buffer,
          index: this._index,
        },
        [buffer]
      );

      this._index++;
    });
  }

  destroy() {
    this._worker.terminate();
  }
}

// incrementally reads a blob
class FileStreamer {
  // anywhere between 256KB and 2048KB is performant, but smaller values
  // should mean a more responsive UI
  constructor(file, chunkSize = 256) {
    this.chunkSize = chunkSize * 1024;
    this.file = file;
    this.fileSize = file.size;
    this.offset = 0;
  }

  get isEndOfFile() {
    return this.offset >= this.fileSize;
  }

  get nextChunk() {
    return this.file.slice(this.offset, this.offset + this.chunkSize);
  }

  // emits the next chunk
  // {
  //   data: ArrayBuffer, the chunk data
  //   loaded: Number, bytes emitted
  //   total: Number, total bytes in file
  // }
  buffer() {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const buffer = e.target.result;

        this.offset += buffer.byteLength;

        resolve({
          data: buffer,
          loaded: this.offset,
          total: this.fileSize,
        });
      };

      fileReader.onerror = reject;

      fileReader.readAsArrayBuffer(this.nextChunk);
    });
  }

  // yields chunks until file is read to the end
  async *bufferIterator() {
    while (!this.isEndOfFile) {
      const result = await this.buffer();

      yield result;
    }
  }
}

export async function saveFile({
  blob,
  onProgress = () => {},
  directory = FilesystemDirectory.Documents,
  path,
}) {
  const fileStreamer = new FileStreamer(blob);

  const encoder = new Base64Encoder();

  // create & truncate file
  await Filesystem.writeFile({
    directory,
    path,
    data: '',
  });

  // read file as chunks
  for await (let chunk of fileStreamer.bufferIterator()) {
    const { data, total, loaded } = chunk;

    // append to file
    await Filesystem.appendFile({
      directory,
      path,
      data: await encoder.fromArrayBuffer(data),
    });

    // emit progress event
    const progress = loaded / total;

    if (!isNaN(progress) && isFinite(progress)) {
      onProgress(progress);
    } else {
      onProgress(null);
    }
  }

  encoder.destroy();
}
