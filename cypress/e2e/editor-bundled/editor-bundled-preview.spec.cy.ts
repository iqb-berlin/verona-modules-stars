describe('STARS bundled editor preview', () => {
  it('boots the embedded Blob player and preserves UTF-8 content', () => {
    cy.visit('/index_packed.html');
    cy.window().then(editorWindow => {
      editorWindow.dispatchEvent(new editorWindow.MessageEvent('message', {
        source: editorWindow.parent,
        origin: editorWindow.location.origin,
        data: {
          type: 'voeStartCommand',
          sessionId: 'editor-bundled-e2e',
          unitDefinition: JSON.stringify({
            id: 'editor-bundled-e2e',
            interactionType: 'BUTTONS',
            interactionParameters: {
              variableId: 'BUTTONS',
              options: { buttons: [{ text: 'Änderung' }] },
              multiSelect: false
            }
          })
        }
      }));
    });

    cy.window({ timeout: 10000 }).should(editorWindow => {
      const iframe = editorWindow.document.querySelector<HTMLIFrameElement>(
        'iframe[title="Eingebettete STARS-Player-Vorschau"]'
      );
      const iframeDocument = iframe?.contentDocument;
      expect(iframeDocument?.querySelector('#meta_data')?.textContent)
        .to.contain('IQB-Player für Stars');
      expect(iframeDocument?.querySelector('[data-cy="button-0"]')?.textContent)
        .to.contain('Änderung');
    });
    cy.get('.preview-status').should('not.exist');
  });
});
