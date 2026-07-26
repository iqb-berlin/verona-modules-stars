import { defineConfig } from 'cypress';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.spec.cy.ts',
    excludeSpecPattern: ['cypress/e2e/shared/**', 'cypress/e2e/editor/**', 'cypress/e2e/editor-bundled/**'],
    fixturesFolder: 'cypress/fixtures'
  }
});
