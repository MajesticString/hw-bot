import config from '../config.js';
import '@sapphire/plugin-logger/register';
import { createColors } from 'colorette';
import { initializeApp, cert } from 'firebase-admin/app';
import { inspect } from 'node:util';
import {
  ApplicationCommandRegistries,
  RegisterBehavior,
} from '@sapphire/framework';

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
