// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-editable-commands/register';
import { createColors } from 'colorette';
import { inspect } from 'util';
import { initializeApp, cert } from 'firebase-admin/app';
import config from '../config.js';

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
createColors({ useColor: true });

// Initialize Firebase
initializeApp({
	credential: cert(config.firebaseConfig)
});
