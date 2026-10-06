import { defineConfig } from 'cypress';
import fs from 'fs';
import path from 'path';
import coverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      coverageTask(on, config);
      return config;
    },
    specPattern: 'cypress/e2e/**/*.spec.cy.ts',
    excludeSpecPattern: 'cypress/e2e/shared/**',
    fixturesFolder: 'cypress/fixtures',
    // Coverage is only collected by `npm run e2e-coverage`, which turns it on against the instrumented
    // build. Against the plain dev server the plugin would only warn and overwrite the last real report.
    expose: {
      coverage: false
    }
  }
});
