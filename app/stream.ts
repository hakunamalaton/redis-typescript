import { generateArray, generateBulkString, generateError, generateNull, generateSimpleString } from "./formatResponse";
import { streamObject } from "./structure";

const streamCommands = {
  'xadd': 'xadd',
  'xrange': 'xrange',
}

const currentTopEntry: Record<string, { timeStamp: number, sequence: number }> = {};

function handleFullGeneration(streamKey: string) {
  const timeStampNumber = Date.now();
  let sequence = 0;
  if (!currentTopEntry[streamKey]) {
    currentTopEntry[streamKey] = { timeStamp: 0, sequence: 0 };
  }
  if (currentTopEntry[streamKey].timeStamp === timeStampNumber) {
    sequence = currentTopEntry[streamKey].sequence + 1;
  } else {
    sequence = 0;
  }
  return { timeStamp: timeStampNumber, sequence };
}

function handlePartialGeneration(streamKey: string, timeStamp: number) {
  let sequence;
  if (timeStamp === currentTopEntry[streamKey].timeStamp) {
    sequence = currentTopEntry[streamKey].sequence + 1;
  } else {
    sequence = 0;
  }
  return { timeStamp, sequence };
}

function parseStreamId(streamKey: string, id: string) {
  if (id === '*') {
    return handleFullGeneration(streamKey);
  }

  const [timeStamp, sequence] = id.split('-');
  const timeStampNumber = Number(timeStamp);
  const sequenceNumber = Number(sequence);

  if (Number.isNaN(timeStampNumber) || (Number.isNaN(sequenceNumber) && sequence !== '*')) {
    return generateError('ERR The ID specified in XADD is invalid');
  }

  if (timeStampNumber === 0 && sequenceNumber === 0) {
    return generateError('ERR The ID specified in XADD must be greater than 0-0');
  }

  if (!currentTopEntry[streamKey]) {
    currentTopEntry[streamKey] = { timeStamp: 0, sequence: 0 };
  }

  if (timeStampNumber < currentTopEntry[streamKey].timeStamp) {
    return generateError('ERR The ID specified in XADD is equal or smaller than the target stream top item');
  }

  if (timeStampNumber === currentTopEntry[streamKey].timeStamp && sequenceNumber <= currentTopEntry[streamKey].sequence) {
    return generateError('ERR The ID specified in XADD is equal or smaller than the target stream top item');
  }

  if (sequence === '*') {
    return handlePartialGeneration(streamKey, timeStampNumber);
  }

  return { timeStamp: timeStampNumber, sequence: sequenceNumber };
}

function extractStreamValues(args: Array<string>) {
  const valueObject: Record<string, string> = {};
  for (let i = 1; i < args.length; i += 2) {
    if (i === 1) {
      valueObject['id'] = args[i];
    } else {
      valueObject[args[i]] = args[i + 2];
      i += 2;
    }
  }
  return valueObject;
}

export function isStream(command: string): boolean {
  return Object.keys(streamCommands).includes(command.toLowerCase());
}

function generateStreamValue(value: Record<string, string>) {
  const result: Array<string> = [];

  Object.entries(value).forEach(([key, value]) => {
    if (key !== 'id') {
      result.push(key, value);
    }
  });

  return result;
}

function isXAdd(command: string): boolean {
  return command.toLowerCase() === streamCommands['xadd'];
}
function handleXAdd(streamKey: string, values: Record<string, string>): string {
  const parsed = parseStreamId(streamKey, values['id']);
  if (typeof parsed === 'string') {
    return parsed;
  }
  const { timeStamp, sequence } = parsed;

  if (!streamObject[streamKey]) {
    streamObject[streamKey] = {};
  }
  let id: string = values['id'];
  Object.entries(values).forEach(([key, value]) => {
    if (key === 'id') {
      streamObject[streamKey][id] = {
        id,
      };
    } else {
      streamObject[streamKey][id][key] = value;
    }
  });
  currentTopEntry[streamKey] = { timeStamp, sequence };

  return generateBulkString(id);
}

function isBetween(value: string, start: string | undefined, end: string | undefined): boolean {
  if (start && end) {
    return Number(value) >= Number(start) && Number(value) <= Number(end);
  } else if (start) {
    return Number(value) >= Number(start);
  } else if (end) {
    return Number(value) <= Number(end);
  }

  return true;
}

function isXRange(command: string): boolean {
  return command.toLowerCase() === streamCommands['xrange'];
}
function handleXRange(streamKey: string, start: string, end: string): string {
  if (!streamObject[streamKey]) {
    return generateArray([]);
  }

  const generatedValues: Array<[string, Array<string>]> = [];

  Object.entries(streamObject[streamKey]).forEach(([id, value]) => {
    const [timeStamp, sequence] = id.split('-');
    const [startTimeStamp, startSequence] = start.split('-');
    const [endTimeStamp, endSequence] = end.split('-');

    if (isBetween(timeStamp, startTimeStamp, endTimeStamp) && isBetween(sequence, startSequence, endSequence)) {
      generatedValues.push([id, generateStreamValue(value)]);
    }
  });

  return generateArray(generatedValues);
}

export function handleStream(command: string, key: string, args: Array<string>): string {
  if (isXAdd(command)) {
    return handleXAdd(key, extractStreamValues(args));
  } else if (isXRange(command)) {
    return handleXRange(key, args[1], args[3]);
  }
  return generateNull();
}
