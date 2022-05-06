const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const TEST = process.env.APP_ENV === 'test';

export { fetcher, urlRegex, TEST };
