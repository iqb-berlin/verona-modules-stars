
# Stars Unit Definition Spezifikation
stars-unit-definition@0.1, Mai 2025

## Versionsangabe

| Schlüsselwort          | Bedeutung                    | Parameter |
|------------------------|------------------------------|-----------|
| `stars-unit-definition` | Angabe der genutzten Version | `0.1.0`   |

_**Beispiel**_

```json
{
  "type": "stars-unit-definition",
  "version": "0.1.0"
}
```

## Grundstruktur einer Unit-Definition

Eine Unit besteht aus einer oder mehreren Sections. Jede Section entspricht einer Seite oder einem Item innerhalb der Unit.

```json
{
  "type": "stars-unit-definition",
  "version": "0.1.0",
  "stateVariables": [],
  "showUnitNavNext": false,
  "sections": [
    {
      // Section-Definition
    }
  ]
}
```

| Eigenschaft      | Typ      | Erforderlich | Beschreibung                                         |
|------------------|----------|--------------|------------------------------------------------------|
| `type`           | String   | Ja           | Muss "stars-unit-definition" sein                    |
| `version`        | String   | Ja           | Versionsnummer, aktuelle Version ist "0.1.0"         |
| `stateVariables` | Array    | Nein         | Variablen zur Verfolgung globaler Zustände           |
| `showUnitNavNext`| Boolean  | Nein         | Steuert die Anzeige von Navigationsbuttons           |
| `sections`       | Array    | Ja           | Liste der Sections innerhalb der Unit                |

## Section-Definition

Eine Section enthält Bereiche für Anweisungen (instructions), Stimuli und Interaktionselemente.

```json
{
  "id": "section1",
  "layoutId": "PicPicLayout",
  "variant": "row_layout",
  "showSectionNavNext": false,
  "stimulus": {
    // Stimulus-Element
  },
  "interaction": {
    // Interaktions-Element
  },
  "instructions": {
    // Anweisungs-Element
  }
}
```

| Eigenschaft          | Typ      | Erforderlich | Beschreibung                                         |
|----------------------|----------|--------------|------------------------------------------------------|
| `id`                 | String   | Ja           | Eindeutige ID für die Section                        |
| `layoutId`           | String   | Ja           | Layout-Typ: "PicPicLayout" oder "PicTextLayout"      |
| `variant`            | String   | Nein         | Variante des Layouts: "grid_layout", "row_layout" |
| `showSectionNavNext` | Boolean  | Nein         | Steuert die Anzeige von Navigationsbuttons in der Section |
| `stimulus`           | Object   | Nein         | Das Stimulus-Element                                 |
| `interaction`        | Object   | Nein         | Das Interaktions-Element                             |
| `instructions`       | Object   | Nein         | Das Anweisungs-Element                               |

### Layouts

Es gibt zwei Haupt-Layouttypen:

1. **PicPicLayout**: Ein Raster-Layout mit separaten Bereichen
- Seitenbereich für Anweisungen
- Oberer, mittlerer und unterer Bereich für Inhalte
- Varianten:
  - `grid_layout`: 2xN-Raster für Elemente in der Mitte
  - `row_layout`: Alle Elemente in einer Reihe

2. **PicTextLayout**: Ein einfacheres Layout mit Bild- und Textbereichen in einer Zeile


## Element-Typen

Jede Section kann verschiedene Elemente enthalten, die in drei Kategorien fallen: Stimulus, Interaction und Instructions.

### 1. Stimulus-Elemente

Elemente zur Präsentation von Inhalten. Für Stimulus-Elemente werden nur folgende Typen unterstützt:

#### Text-Element

```json
{
  "id": "text_1",
  "alias": "instruction_text",
  "type": "text",
  "text": "Dies ist der anzuzeigende Text",
  "position": "top"
}
```

| Eigenschaft | Typ    | Erforderlich | Beschreibung                       |
|-------------|--------|--------------|-----------------------------------|
| `id`        | String | Ja           | Eindeutige ID                      |
| `alias`     | String | Ja           | Alternativer Bezeichner            |
| `type`      | String | Ja           | Muss "text" sein                   |
| `text`      | String | Ja           | Der anzuzeigende Text              |
| `position`  | String | Nein         | "top" oder "bottom" (in PicPicLayout) |

#### Bild-Element

```json
{
  "id": "image_1",
  "alias": "example_image",
  "type": "image",
  "imgSrc": "data:image/png;base64,...",
  "altText": "Beschreibung des Bildes",
  "imgFileName": "beispiel.png",
  "position": "top"
}
```

| Eigenschaft   | Typ    | Erforderlich | Beschreibung                       |
|---------------|--------|--------------|-----------------------------------|
| `id`          | String | Ja           | Eindeutige ID                      |
| `alias`       | String | Ja           | Alternativer Bezeichner            |
| `type`        | String | Ja           | Muss "image" sein                  |
| `imgSrc`      | String | Ja           | Base64-kodierte Daten (Format: "data:image/png;base64,...") |
| `altText`     | String | Ja           | Alternative Textbeschreibung       |
| `imgFileName` | String | Nein         | Originaldateiname                  |
| `position`    | String | Nein         | "top" oder "bottom" (in PicPicLayout) |

### 2. Interaktions-Elemente

Elemente zur Erfassung von Benutzereingaben:

**Hinweis**: In der aktuellen Implementierung werden nur die folgenden zwei Interaktionselemente unterstützt:

#### RadioGroupImages-Element

```json
{
  "id": "radio-group-images_1",
  "alias": "single_choice",
  "type": "radio-group-images",
  "label": "Wähle eine Option",
  "required": false,
  "requiredWarnMessage": "Bitte eine Option auswählen",
  "value": null,
  "options": [
    {
      "id": "option_1",
      "text": "Option 1",
      "imgSrc": "data:image/png;base64,...",
      "imgFileName": "option1.png",
      "altText": "Beschreibung Option 1"
    },
    {
      "id": "option_2",
      "text": "Option 2",
      "imgSrc": "data:image/png;base64,...",
      "imgFileName": "option2.png",
      "altText": "Beschreibung Option 2"
    }
  ]
}
```

| Eigenschaft          | Typ     | Erforderlich | Beschreibung                       |
|----------------------|---------|--------------|-----------------------------------|
| `id`                 | String  | Ja           | Eindeutige ID                      |
| `alias`              | String  | Ja           | Alternativer Bezeichner            |
| `type`               | String  | Ja           | Muss "radio-group-images" sein     |
| `label`              | String  | Ja           | Gruppenbeschriftung                |
| `required`           | Boolean | Ja           | Ist Auswahl erforderlich?          |
| `requiredWarnMessage`| String  | Ja           | Warnmeldung bei fehlender Auswahl  |
| `value`              | Mixed   | Ja           | Anfangswert (meist null)           |
| `options`            | Array   | Ja           | Liste der Optionen                 |

#### MultiChoiceImages-Element

```json
{
  "id": "multi-choice-images_1",
  "alias": "multiple_choice",
  "type": "multi-choice-images",
  "label": "Wähle alle zutreffenden Optionen",
  "required": false,
  "requiredWarnMessage": "Bitte mind. eine Option auswählen",
  "value": null,
  "options": [
    {
      "id": "option_1",
      "text": "Option 1",
      "imgSrc": "data:image/png;base64,...",
      "imgFileName": "option1.png",
      "altText": "Beschreibung Option 1"
    },
    {
      "id": "option_2",
      "text": "Option 2",
      "imgSrc": "data:image/png;base64,...",
      "imgFileName": "option2.png",
      "altText": "Beschreibung Option 2"
    }
  ]
}
```

| Eigenschaft          | Typ     | Erforderlich | Beschreibung                       |
|----------------------|---------|--------------|-----------------------------------|
| `id`                 | String  | Ja           | Eindeutige ID                      |
| `alias`              | String  | Ja           | Alternativer Bezeichner            |
| `type`               | String  | Ja           | Muss "multi-choice-images" sein    |
| `label`              | String  | Ja           | Gruppenbeschriftung                |
| `required`           | Boolean | Ja           | Ist Auswahl erforderlich?          |
| `requiredWarnMessage`| String  | Ja           | Warnmeldung bei fehlender Auswahl  |
| `value`              | Mixed   | Ja           | Anfangswert (meist null)           |
| `options`            | Array   | Ja           | Liste der Optionen                 |

### 3. Instructions-Elemente

Elemente zur Bereitstellung von Anweisungen und Erläuterungen. Für Instructions-Elemente werden folgende Typen unterstützt:

#### Text-Element

Identisch mit dem Text-Element im Stimulus-Bereich (siehe oben).

#### Bild-Element

Identisch mit dem Bild-Element im Stimulus-Bereich (siehe oben).

#### Audio-Element

```json
{
  "id": "audio_1",
  "alias": "instruction_audio",
  "type": "audio",
  "audioSrc": "data:audio/mpeg;base64,...",
  "audioFileName": "anweisung.mp3",
  "player": {
    "autostart": false,
    "autostartDelay": 0,
    "loop": false,
    "startControl": true,
    "pauseControl": false,
    "progressBar": false,
    "interactiveProgressbar": false,
    "volumeControl": false,
    "defaultVolume": 0.8,
    "minVolume": 0.2,
    "muteControl": false,
    "interactiveMuteControl": false,
    "hintLabel": "",
    "hintLabelDelay": 5000,
    "activeAfterID": "",
    "minRuns": 1,
    "maxRuns": 1,
    "showRestRuns": false,
    "showRestTime": false,
    "playbackTime": 0
  },
  "image": {
    "imgSrc": "data:image/png;base64,...",
    "altText": "Klicken zum Abspielen",
    "imgFileName": "play_button.png"
  }
}
```

| Eigenschaft    | Typ    | Erforderlich | Beschreibung                       |
|----------------|--------|--------------|-----------------------------------|
| `id`           | String | Ja           | Eindeutige ID                      |
| `alias`        | String | Ja           | Alternativer Bezeichner            |
| `type`         | String | Ja           | Muss "audio" sein                  |
| `audioSrc`     | String | Ja           | Base64-kodierte Daten (Format: "data:audio/mpeg;base64,...") |
| `audioFileName`| String | Nein         | Originaldateiname                  |
| `player`       | Object | Nein         | Konfiguration für den Audio-Player (siehe Hinweis) |
| `image`        | Object | Nein         | Optionales Bild, das als Play-Button dient |

**Hinweis**: Die `player`-Einstellungen sind in der aktuellen Implementierung größtenteils nicht funktional. Nur grundlegende Abspielfunktionen werden unterstützt, wenn ein Bild vorhanden ist.


## Anwendungsbeispiele

### Beispiel 1: Einfache Bildauswahl mit Audio-Anweisung

```json
{
  "type": "stars-unit-definition",
  "version": "0.1.0",
  "sections": [{
    "id": "section1",
    "layoutId": "PicPicLayout",
    "variant": "row_layout",
    "stimulus": {
      "id": "image_selection",
      "type": "image",
      "imgSrc": "data:image/png;base64,...",
      "altText": "Zu erkennendes Bild",
      "position": "top"
    },
    "interaction": {
      "id": "selection",
      "alias": "single-choice-image",
      "type": "radio-group-images",
      "label": "Wähle das passende Bild",
      "required": true,
      "requiredWarnMessage": "Bitte wähle ein Bild aus",
      "value": null,
      "options": [
        {"id": "opt1", "text": "Option 1", "imgSrc": "...", "altText": "..."},
        {"id": "opt2", "text": "Option 2", "imgSrc": "...", "altText": "..."},
        {"id": "opt3", "text": "Option 3", "imgSrc": "...", "altText": "..."}
      ]
    },
    "instructions": {
      "id": "audio_instruction",
      "alias": "audio_instruction",
      "type": "audio",
      "audioSrc": "data:audio/mpeg;base64,...",
      "image": {
        "imgSrc": "data:image/png;base64,...",
        "altText": "Anweisungen abspielen"
      }
    }
  }]
}
```

## Hinweise und Einschränkungen

1. **Verfügbare Interaktionselemente**: In der aktuellen Implementierung werden nur zwei Interaktionselementtypen unterstützt:
  - `radio-group-images`: Für Einzelauswahl mit Bildern
  - `multi-choice-images`: Für Mehrfachauswahl mit Bildern

   Andere Elementtypen wie `checkbox` werden aktuell in der `InteractionSelectionComponent` nicht unterstützt.

2. **Verfügbare Stimulus-Elemente**: Für Stimulus werden nur folgende Typen unterstützt:
  - `text`: Für Textinhalte
  - `image`: Für Bilder

   Audio-Elemente können nicht als Stimulus verwendet werden.

3. **Verfügbare Instructions-Elemente**: Für Instructions werden folgende Typen unterstützt:
  - `text`: Für Textinhalte
  - `image`: Für Bilder
  - `audio`: Für Audioinhalte

4. **Audio-Steuerelemente**: Die meisten Audio-Player-Konfigurationsoptionen sind in der aktuellen Implementation nicht funktional. Um Audio abspielbar zu machen, sollte ein Bild hinzugefügt werden, das als Play-Button dient.

5. **Mehrere Elemente pro Abschnitt**: Jeder Abschnitt einer Section (instructions, stimulus, interaction) kann derzeit nur ein Element enthalten.

6. **Medien-Quellen**: Die aktuelle Implementierung unterstützt nur Base64-kodierte Inhalte direkt eingebettet in der JSON-Definition (z.B. "data:image/png;base64,..."). Externe URLs werden nicht direkt unterstützt.
