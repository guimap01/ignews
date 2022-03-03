import { Readable } from 'stream';

export const convertReadableStream = async (readable: Readable) => {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};
