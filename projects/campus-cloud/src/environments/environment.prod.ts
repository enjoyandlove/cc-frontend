import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  root: '/dist/',
  production: true,
  flags: {
    FEEDS_CSV_COUNT: {
      whitelist: []
    }
  },
  keys: {
    readyApiKey: 'IUm65kXecFWch54mzJjpy63spWZX3AVp',
    beamerApiKey: 'b_Fi9BaLL/1kzue1MjGOiATUB5Kk8vkDKeO7nSqKSlFxo=',
    sentryDsn: 'https://0b6c76a5691d4b7399394aa79753acef@sentry.io/207033'
  }
};
