import { UnitDefinition } from '../../../projects/player/src/app/models/unit-definition';

export function testRibbonBars(interactionType: string, configFile: string) {
  describe(`Ribbon Bar Features for interactionType - ${interactionType}`, () => {
    const loadDefaultTestFile = () => {
      cy.setupTestData(configFile, interactionType);
      return cy.get('@testData') as unknown as Cypress.Chainable<UnitDefinition>;
    };

    const loadWhiteBgTestFile = () => {
      cy.setupTestData(`${interactionType}_ribbonBars_true_bg_white_test`, interactionType);
      return cy.get('@testData') as unknown as Cypress.Chainable<UnitDefinition>;
    };

    const checkRibbonBars = (testData: UnitDefinition) => {
      expect(testData.ribbonBars).to.equal(true);
    };

    const setupRibbonBarTest = (fileLoader: () => Cypress.Chainable<UnitDefinition>) => fileLoader().then(testData => {
      checkRibbonBars(testData);
      return cy.wrap(testData);
    });

    it('shows ribbon bars component if ribbonBars is true', () => {
      // Load the file
      loadDefaultTestFile().then(testData => {
        // Check if ribbonBars true and the component exists
        checkRibbonBars(testData);

        cy.get('[data-cy="ribbon-bar"]').should('exist');
      });
    });

    it('shows ribbon bar as WHITE if background is NOT white', () => {
      setupRibbonBarTest(loadDefaultTestFile).then(testData => {
        const bgColor = testData.backgroundColor?.toUpperCase() || '';
        const isBgColorWhite = ['#FFF', '#FFFFFF', '#EEE', '#EEEEEE', 'WHITE'].includes(bgColor);

        if (!isBgColorWhite) {
          cy.get('[data-cy="ribbon-bar"]')
            .should('have.css', 'background-image')
            .then(bg => {
              expect(bg).to.contain('repeating-linear-gradient');
              expect(bg).to.contain('rgb(255, 255, 255)'); // white color #FFFFFF
            });
        }
      });
    });

    it('shows ribbon bar as BLUE if background is white', () => {
      setupRibbonBarTest(loadWhiteBgTestFile).then(testData => {
        const bgColor = testData.backgroundColor?.toUpperCase() || '';
        const isBgColorWhite = ['#FFF', '#FFFFFF', '#EEE', '#EEEEEE', 'WHITE'].includes(bgColor);

        if (isBgColorWhite) {
          cy.get('[data-cy="ribbon-bar"]')
            .should('have.css', 'background-image')
            .then(bg => {
              expect(bg).to.contain('repeating-linear-gradient');
              expect(bg).to.contain('rgb(177, 223, 255)'); // sky color #B1DFFF
            });
        }
      });
    });
  });
}
