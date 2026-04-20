import { defineConfig } from 'cypress';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.spec.cy.ts',
    excludeSpecPattern: 'cypress/e2e/shared/**',
    fixturesFolder: 'cypress/fixtures'
  }
});
