import {
  ApplicationCommandRegistries,
  RegisterBehavior,
} from '@sapphire/framework';
import '@sapphire/plugin-logger/register';
import { createColors } from 'colorette';
import { cert, initializeApp } from 'firebase-admin/app';
import readline from 'node:readline';
import { inspect } from 'node:util';
import config from '../config.js';

// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
createColors({ useColor: true });

// Initialize Firebase
initializeApp({
  credential: cert(config.firebaseConfig),
});

// Overwrite default behavior for registering commands
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
  RegisterBehavior.Overwrite
);
export function clearScreen() {
  const repeatCount = process.stdout.rows - 2;
  const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : '';
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}
clearScreen();
