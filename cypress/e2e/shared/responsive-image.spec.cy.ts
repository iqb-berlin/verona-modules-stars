export function testResponsiveImageFeatures(interactionType: string, configFile: string, selector: string) {
  describe(`Responsive Image Features for interactionType - ${interactionType}`, () => {
    beforeEach(() => {
      cy.setupTestData(configFile, interactionType);
    });

    it('should not grow larger than its natural size on large viewports', () => {
      cy.viewport(1920, 1080);
      // Ensure that the img exists
      cy.get(selector).should($img => {
        const img = $img[0] as HTMLImageElement;
        // Add a check for naturalWidth to be sure it's loaded
        expect(img.naturalWidth).to.be.greaterThan(0);
        expect(img.clientWidth).to.be.at.most(img.naturalWidth);
        expect(img.clientHeight).to.be.at.most(img.naturalHeight);
      });
    });

    it('should shrink when the viewport is smaller than natural size', () => {
      cy.get(selector).then($img => {
        const img = $img[0] as HTMLImageElement;
        const naturalWidth = img.naturalWidth;

        // Set viewport smaller than natural width (but not too small to break layout entirely)
        const smallWidth = Math.min(naturalWidth - 100, 400);
        if (smallWidth > 100) {
          cy.viewport(smallWidth, 500);
          cy.get(selector).should($img2 => {
            const img2 = $img2[0] as HTMLImageElement;
            expect(img2.clientWidth).to.be.lessThan(naturalWidth);
          });
        }
      });
    });

    it('should maintain aspect ratio while shrinking', () => {
      cy.viewport(500, 500);
      cy.get(selector).should($img => {
        const img = $img[0] as HTMLImageElement;
        const naturalRatio = img.naturalWidth / img.naturalHeight;
        const renderedRatio = img.clientWidth / img.clientHeight;

        expect(renderedRatio).to.be.closeTo(naturalRatio, 0.05);
      });
    });
  });
}
