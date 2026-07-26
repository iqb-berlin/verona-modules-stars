type EditorPreviewWindow = Window & {
  previewStarts: string[];
  definitionTypes?: string[];
};

describe('STARS editor draft and preview', () => {
  const visitEditorWithPlayer = () => {
    cy.visit('/?playerUrl=http://localhost:4210');
  };

  const visitEditorWithTestPlayer = (
    order: 'load-ready' | 'ready-load',
    readyMode: 'always' | 'once' = 'always'
  ) => {
    const playerUrl = `http://localhost:4211/preview-player.html?order=${order}&ready=${readyMode}`;
    cy.visit(`/?playerUrl=${encodeURIComponent(playerUrl)}`, {
      onBeforeLoad(editorWindow) {
        (editorWindow as EditorPreviewWindow).previewStarts = [];
        editorWindow.addEventListener('message', event => {
          if (event.data?.type === 'preview-test-start') {
            (editorWindow as EditorPreviewWindow).previewStarts.push(
              event.data.definitionId
            );
          }
        });
      }
    });
  };

  const loadDefinition = (editorWindow: Window, unitDefinition: object) => {
    editorWindow.dispatchEvent(
      new editorWindow.MessageEvent('message', {
        source: editorWindow.parent,
        origin: editorWindow.location.origin,
        data: {
          type: 'voeStartCommand',
          sessionId: 'editor-e2e',
          unitDefinition: JSON.stringify(unitDefinition)
        }
      })
    );
  };

  it('shows an activated opening image immediately and blocks the runtime preview while invalid', () => {
    visitEditorWithPlayer();
    cy.contains('.section-title', 'Einführungs-Bild').click();
    cy.contains('label', 'Einführungs-Bild aktivieren').find('input').check();

    cy.contains('button', 'JSON-Definition').click();
    cy.get('pre')
      .should('contain.text', '"openingImage"')
      .and('contain.text', '"imageSource": ""');

    cy.contains('button', 'Live-Vorschau').click();
    cy.contains('.preview-status', 'Definition unvollständig').should(
      'be.visible'
    );
    cy.contains(
      '.preview-status',
      'Für das Einführungsbild ist eine Bildquelle erforderlich.'
    ).should('be.visible');
  });

  it('shows audio feedback immediately after activation', () => {
    visitEditorWithPlayer();
    cy.contains('.section-title', 'Audio-Feedback').click();
    cy.contains('label', 'Feedback aktivieren').find('input').check();
    cy.contains('button', 'JSON-Definition').click();

    cy.get('pre')
      .should('contain.text', '"audioFeedback"')
      .and('contain.text', '"trigger": "CONTINUE_BUTTON_CLICK"')
      .and('contain.text', '"feedback": []');
  });

  it('keeps IMAGE_ONLY configuration static and removes response-only parameters', () => {
    visitEditorWithPlayer();
    cy.window().then(editorWindow => {
      loadDefinition(editorWindow, {
        id: 'image-only-editor',
        interactionType: 'IMAGE_ONLY',
        interactionParameters: {
          variableId: 'BUTTONS',
          imageSource: 'data:image/png;base64,AA==',
          imagePosition: 'TOP',
          layout: 'TOP_CENTER',
          imageUseFullArea: true,
          options: { buttons: [{ text: 'Must not be interactive' }] },
          multiSelect: true,
          triggerNavigationOnSelect: true
        }
      });
    });

    cy.get('stars-interaction-buttons-editor').within(() => {
      cy.contains('label', 'Bild').should('exist');
      cy.contains('label', 'Variablen-ID').should('not.exist');
      cy.contains('label', 'Button-Typ').should('not.exist');
      cy.contains('label', 'Mehrfachauswahl').should('not.exist');
      cy.contains('label', 'Navigation bei Auswahl').should('not.exist');
      cy.contains('label', 'Options-Modus').should('not.exist');
    });

    cy.contains('button', 'JSON-Definition').click();
    cy.get('pre')
      .should('contain.text', '"interactionType": "IMAGE_ONLY"')
      .and('contain.text', '"imageSource": "data:image/png;base64,AA=="')
      .and('not.contain.text', '"variableId": "BUTTONS"')
      .and('not.contain.text', '"options"')
      .and('not.contain.text', '"multiSelect"')
      .and('not.contain.text', '"triggerNavigationOnSelect"');
  });

  it('preserves the unit definition type supplied by the host', () => {
    cy.visit('/?playerUrl=http://localhost:4210', {
      onBeforeLoad(editorWindow) {
        (editorWindow as EditorPreviewWindow).definitionTypes = [];
        const mockParent = new editorWindow.MessageChannel().port1;
        mockParent.postMessage = (message: {
          type?: string;
          unitDefinitionType?: string;
        }) => {
          if (
            message.type === 'voeDefinitionChangedNotification' &&
            message.unitDefinitionType
          ) {
            (editorWindow as EditorPreviewWindow).definitionTypes?.push(
              message.unitDefinitionType
            );
          }
        };
        Object.defineProperty(editorWindow, 'parent', {
          value: mockParent,
          configurable: true
        });
      }
    });
    cy.window().then(editorWindow => {
      editorWindow.dispatchEvent(
        new editorWindow.MessageEvent('message', {
          source: editorWindow.parent,
          origin: editorWindow.location.origin,
          data: {
            type: 'voeStartCommand',
            sessionId: 'editor-definition-type',
            unitDefinitionType: 'custom-stars-definition@2.0',
            unitDefinition: JSON.stringify({
              id: 'definition-type-test',
              interactionType: 'BUTTONS',
              interactionParameters: {
                variableId: 'BUTTONS',
                options: { buttons: [{ text: 'A' }] }
              }
            })
          }
        })
      );
    });
    cy.contains('label', 'Version').parent().find('input').clear()
      .type('2.1');
    cy.window().should(editorWindow => {
      expect((editorWindow as EditorPreviewWindow).definitionTypes).to.include(
        'custom-stars-definition@2.0'
      );
    });
  });

  it('loads a valid unit into the embedded player without a blank fallback', () => {
    visitEditorWithPlayer();
    cy.window().then(editorWindow => {
      loadDefinition(editorWindow, {
        id: 'editor-e2e',
        interactionType: 'BUTTONS',
        interactionParameters: {
          variableId: 'BUTTONS',
          options: { buttons: [{ text: 'A' }, { text: 'B' }] },
          multiSelect: false
        }
      });
    });

    cy.get('iframe[title="Eingebettete STARS-Player-Vorschau"]').should(
      'be.visible'
    );
    cy.get('.preview-status', { timeout: 6000 }).should('not.exist');
  });

  (['load-ready', 'ready-load'] as const).forEach(order => {
    it(`supports ${order} and updates without restarting the iframe`, () => {
      visitEditorWithTestPlayer(order);
      let initialIframe: HTMLIFrameElement;

      cy.get<HTMLIFrameElement>(
        'iframe[title="Eingebettete STARS-Player-Vorschau"]'
      ).then($iframe => {
        initialIframe = $iframe[0];
      });
      cy.window().then(editorWindow => {
        loadDefinition(editorWindow, {
          id: `${order}-first`,
          interactionType: 'BUTTONS',
          interactionParameters: {
            variableId: 'BUTTONS',
            options: { buttons: [{ text: 'A' }] },
            multiSelect: false
          }
        });
      });
      cy.window().should(editorWindow => {
        expect((editorWindow as EditorPreviewWindow).previewStarts).to.include(
          `${order}-first`
        );
      });
      cy.get('.preview-status').should('not.exist');

      cy.window().then(editorWindow => {
        loadDefinition(editorWindow, {
          id: `${order}-second`,
          interactionType: 'BUTTONS',
          interactionParameters: {
            variableId: 'BUTTONS',
            options: { buttons: [{ text: 'B' }] },
            multiSelect: false
          }
        });
      });
      cy.window().should(editorWindow => {
        expect((editorWindow as EditorPreviewWindow).previewStarts).to.include(
          `${order}-second`
        );
      });
      cy.get<HTMLIFrameElement>(
        'iframe[title="Eingebettete STARS-Player-Vorschau"]'
      ).should($iframe => {
        expect($iframe[0]).to.equal(initialIframe);
      });
    });
  });

  it('restores the last valid definition after an iframe reload while the draft is invalid', () => {
    visitEditorWithTestPlayer('load-ready');
    cy.window().then(editorWindow => {
      loadDefinition(editorWindow, {
        id: 'last-valid-after-reload',
        interactionType: 'BUTTONS',
        interactionParameters: {
          variableId: 'BUTTONS',
          options: { buttons: [{ text: 'A' }] }
        }
      });
    });
    cy.window().should(editorWindow => {
      expect((editorWindow as EditorPreviewWindow).previewStarts).to.include(
        'last-valid-after-reload'
      );
    });

    cy.window().then(editorWindow => {
      loadDefinition(editorWindow, {
        id: 'invalid-after-reload',
        openingImage: { imageSource: '' },
        interactionType: 'BUTTONS',
        interactionParameters: {
          variableId: 'BUTTONS',
          options: { buttons: [{ text: 'B' }] }
        }
      });
    });
    cy.contains('.preview-status', 'Definition unvollständig').should(
      'be.visible'
    );
    cy.get<HTMLIFrameElement>(
      'iframe[title="Eingebettete STARS-Player-Vorschau"]'
    ).then($iframe => {
      $iframe[0].setAttribute('src', $iframe[0].src);
    });
    cy.window().should(editorWindow => {
      const starts = (editorWindow as EditorPreviewWindow).previewStarts;
      expect(
        starts.filter(id => id === 'last-valid-after-reload')
      ).to.have.length(2);
    });
    cy.contains('.preview-status', 'Definition unvollständig').should(
      'be.visible'
    );
  });

  it('stops the iframe in the JSON tab and restores the last valid preview afterwards', () => {
    visitEditorWithTestPlayer('load-ready');
    let initialIframe: HTMLIFrameElement;
    cy.window().then(editorWindow => {
      loadDefinition(editorWindow, {
        id: 'valid-before-tab-change',
        interactionType: 'BUTTONS',
        interactionParameters: {
          variableId: 'BUTTONS',
          options: { buttons: [{ text: 'A' }] }
        }
      });
    });
    cy.window().should(editorWindow => {
      expect((editorWindow as EditorPreviewWindow).previewStarts).to.include(
        'valid-before-tab-change'
      );
    });
    cy.get<HTMLIFrameElement>(
      'iframe[title="Eingebettete STARS-Player-Vorschau"]'
    ).then($iframe => {
      initialIframe = $iframe[0];
    });

    cy.contains('button', 'JSON-Definition').click();
    cy.get('iframe[title="Eingebettete STARS-Player-Vorschau"]').should(
      'not.exist'
    );
    cy.window().then(editorWindow => {
      loadDefinition(editorWindow, {
        id: 'invalid-in-json-tab',
        openingImage: { imageSource: '' },
        interactionType: 'BUTTONS',
        interactionParameters: {
          variableId: 'BUTTONS',
          options: { buttons: [{ text: 'B' }] }
        }
      });
    });
    cy.contains('button', 'Live-Vorschau').click();

    cy.get<HTMLIFrameElement>(
      'iframe[title="Eingebettete STARS-Player-Vorschau"]'
    ).should($iframe => {
      expect($iframe[0]).not.to.equal(initialIframe);
    });
    cy.window().should(editorWindow => {
      const starts = (editorWindow as EditorPreviewWindow).previewStarts;
      expect(starts).to.deep.equal([
        'valid-before-tab-change',
        'valid-before-tab-change'
      ]);
    });
    cy.contains('.preview-status', 'Definition unvollständig').should(
      'be.visible'
    );
  });

  it('times out when a reloaded iframe does not announce readiness again', () => {
    visitEditorWithTestPlayer('load-ready', 'once');
    cy.window().then(editorWindow => {
      loadDefinition(editorWindow, {
        id: 'reload-timeout',
        interactionType: 'BUTTONS',
        interactionParameters: {
          variableId: 'BUTTONS',
          options: { buttons: [{ text: 'A' }] }
        }
      });
    });
    cy.window().should(editorWindow => {
      expect((editorWindow as EditorPreviewWindow).previewStarts).to.include(
        'reload-timeout'
      );
    });
    cy.get<HTMLIFrameElement>(
      'iframe[title="Eingebettete STARS-Player-Vorschau"]'
    ).then($iframe => {
      $iframe[0].setAttribute('src', $iframe[0].src);
    });
    cy.contains('.preview-status', 'Kein STARS-Player', {
      timeout: 6000
    }).should('be.visible');
    cy.contains('.preview-status button', 'Erneut laden').should('be.visible');
  });

  it('shows an unavailable status and retries an unreachable player', () => {
    cy.visit('/?playerUrl=http://localhost:4299');
    cy.contains('.preview-status', 'Kein STARS-Player', {
      timeout: 6000
    }).should('be.visible');
    cy.contains('.preview-status button', 'Erneut laden').click();
    cy.contains('.preview-status', 'Warte auf den STARS-Player').should(
      'be.visible'
    );
    cy.contains('.preview-status', 'Kein STARS-Player', {
      timeout: 6000
    }).should('be.visible');
  });

  it('rejects a non-local player URL override', () => {
    cy.visit('/?playerUrl=https%3A%2F%2Fexample.com%2Fpreview-player.html');
    cy.get('iframe[title="Eingebettete STARS-Player-Vorschau"]')
      .should('have.attr', 'src')
      .and('match', /^http:\/\/localhost:4200\/?$/);
  });
});
