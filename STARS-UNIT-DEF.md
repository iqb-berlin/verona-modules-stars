# Stars Unit Definition Spezifikation
stars-unit-definition@0.1, Juni 2025

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
  "navNextButtonMode": "onInteraction",
  "backgroundColor": "#E3D8FF",
  "sections": [
    {
      // Section-Definition
    }
  ]
}
```

| Eigenschaft        | Typ      | Erforderlich | Beschreibung                                         |
|-------------------|----------|--------------|------------------------------------------------------|
| `type`            | String   | Ja           | Muss "stars-unit-definition" sein                    |
| `version`         | String   | Ja           | Versionsnummer, aktuelle Version ist "0.1.0"         |
| `stateVariables`  | Array    | Nein         | Variablen zur Verfolgung globaler Zustände           |
| `navNextButtonMode`| String  | Ja           | "onInteraction" oder "always"                        |
| `backgroundColor` | String   | Nein         | Hintergrundfarbe der Unit (z.B. "#E3D8FF")          |
| `sections`        | Array    | Ja           | Liste der Sections innerhalb der Unit                |

## Section-Definition

Eine Section enthält Bereiche für Anweisungen (instructions), Stimuli und Interaktionselemente.

```json
{
  "id": "section1",
  "layoutId": "PicPicLayout",
  "variant": "grid_layout",
  "coding": {
    "fullCredit": "2"
  },
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
| `variant`            | String   | Nein         | Variante des Layouts: "grid_layout", "row_layout"   |
| `coding`             | Object   | Nein         | Bewertungsschema für die Section                     |
| `stimulus`           | Object   | Nein         | Das Stimulus-Element                                 |
| `interaction`        | Object   | Nein         | Das Interaktions-Element                             |
| `instructions`       | Object   | Nein         | Das Anweisungs-Element                               |

### Layouts

Es gibt zwei Haupt-Layouttypen:

1. **PicPicLayout**: Ein flexibles Layout mit separaten Bereichen
  - Seitenbereich für Anweisungen (instructions)
  - Oberer/unterer Bereich für Stimulus (je nach position)
  - Mittlerer Bereich für Interaktion
  - Varianten:
    - `grid_layout`: Raster-Layout für Optionen
    - `row_layout`: Alle Elemente in einer Reihe

2. **PicTextLayout**: Ein einfacheres Layout mit Bild- und Textbereichen in einer Zeile

### Coding-Schema

```json
{
  "coding": {
    "fullCredit": "2"
  }
}
```

| Eigenschaft     | Typ    | Erforderlich | Beschreibung                                    |
|----------------|--------|--------------|------------------------------------------------|
| `fullCredit`   | String | Ja           | Wert für volle Punktzahl                       |

#### Coding-Werte nach Interaktionstyp

**RadioGroupImages / RadioGroupText:**
- Wert ist der **Index der richtigen Option** (1-basiert)
- Beispiel: `"fullCredit": "2"` bedeutet die zweite Option ist korrekt

**MultiChoiceImages:**
- Wert ist ein **Binärstring** der die Auswahl repräsentiert
- Jede Position entspricht einer Option: "1" = ausgewählt, "0" = nicht ausgewählt
- Beispiel: `"fullCredit": "010010"` bedeutet bei 6 Optionen sind die 2. und 5. Option korrekt

**SyllableCounter:**
- Wert ist die **Anzahl der korrekten Silben**
- Beispiel: `"fullCredit": "3"` bedeutet 3 Silben ist die richtige Antwort

**ReducedKeyboard:**
- Wert ist das **korrekte Wort** als String
- Beispiel: `"fullCredit": "Kopf"` bedeutet "Kopf" ist die richtige Antwort

**BinaryChoice:**
- Wert ist `"1"` für richtig (true) oder `"0"` für falsch (false)
- Beispiel: `"fullCredit": "1"` bedeutet "richtig" ist die korrekte Antwort

## Element-Typen

Jede Section kann verschiedene Elemente enthalten, die in drei Kategorien fallen: Stimulus, Interaction und Instructions.

### 1. Stimulus-Elemente

Elemente zur Präsentation von Inhalten.

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
| `imgSrc`      | String | Ja           | Base64-kodierte Daten oder URL     |
| `altText`     | String | Ja           | Alternative Textbeschreibung       |
| `imgFileName` | String | Nein         | Originaldateiname                  |
| `position`    | String | Nein         | "top" oder "bottom" (in PicPicLayout) |

### 2. Interaktions-Elemente

Elemente zur Erfassung von Benutzereingaben:

#### RadioGroupImages-Element

Einzelauswahl mit Bildern (für Aufgaben wie WS_BA, SV_BA, WS_SR).

```json
{
  "id": "radio-group-images_1",
  "alias": "single_choice",
  "type": "radio-group-images",
  "required": true,
  "requiredWarnMessage": "Bitte eine Option auswählen",
  "value": null,
  "options": [
    {
      "id": "option_1",
      "imgSrc": "data:image/png;base64,...",
      "imgFileName": "option1.png",
      "altText": "Beschreibung Option 1"
    },
    {
      "id": "option_2",
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
| `required`           | Boolean | Ja           | Ist Auswahl erforderlich?          |
| `requiredWarnMessage`| String  | Nein         | Warnmeldung bei fehlender Auswahl  |
| `value`              | Mixed   | Ja           | Anfangswert (meist null)           |
| `options`            | Array   | Ja           | Liste der Optionen                 |

#### MultiChoiceImages-Element

Mehrfachauswahl mit Bildern.

```json
{
  "id": "multi-choice-images_1",
  "alias": "multiple_choice",
  "type": "multi-choice-images",
  "required": false,
  "requiredWarnMessage": "Bitte mind. eine Option auswählen",
  "value": null,
  "options": [
    {
      "id": "option_1",
      "imgSrc": "data:image/png;base64,...",
      "imgFileName": "option1.png",
      "altText": "Beschreibung Option 1"
    }
  ]
}
```

| Eigenschaft          | Typ     | Erforderlich | Beschreibung                       |
|----------------------|---------|--------------|-----------------------------------|
| `id`                 | String  | Ja           | Eindeutige ID                      |
| `alias`              | String  | Ja           | Alternativer Bezeichner            |
| `type`               | String  | Ja           | Muss "multi-choice-images" sein    |
| `required`           | Boolean | Ja           | Ist Auswahl erforderlich?          |
| `requiredWarnMessage`| String  | Nein         | Warnmeldung bei fehlender Auswahl  |
| `value`              | Mixed   | Ja           | Anfangswert (meist null)           |
| `options`            | Array   | Ja           | Liste der Optionen                 |

#### RadioGroupText-Element

Einzelauswahl mit Textoptionen (für Aufgaben wie FSE1_Bid, BSK2_WBZ).

```json
{
  "id": "radio-group-text_1",
  "alias": "letter_selection",
  "type": "radio-group-text",
  "required": true,
  "requiredWarnMessage": "Bitte eine Option auswählen",
  "value": null,
  "options": [
    {
      "id": "text_option_1",
      "text": "A"
    },
    {
      "id": "text_option_2", 
      "text": "G"
    }
  ]
}
```

| Eigenschaft          | Typ     | Erforderlich | Beschreibung                       |
|----------------------|---------|--------------|-----------------------------------|
| `id`                 | String  | Ja           | Eindeutige ID                      |
| `alias`              | String  | Ja           | Alternativer Bezeichner            |
| `type`               | String  | Ja           | Muss "radio-group-text" sein       |
| `required`           | Boolean | Ja           | Ist Auswahl erforderlich?          |
| `requiredWarnMessage`| String  | Nein         | Warnmeldung bei fehlender Auswahl  |
| `value`              | Mixed   | Ja           | Anfangswert (meist null)           |
| `options`            | Array   | Ja           | Liste der Textoptionen             |

#### BinaryChoice-Element

Binäre Auswahl (Richtig/Falsch) mit vordefinierten Icons (für Aufgaben wie FSE1_Diff, SV_IE).

```json
{
  "id": "correctness_choice",
  "alias": "binary_choice",
  "type": "binary-choice",
  "required": true,
  "requiredWarnMessage": "Bitte eine Option auswählen",
  "value": null
}
```

| Eigenschaft          | Typ     | Erforderlich | Beschreibung                       |
|----------------------|---------|--------------|-----------------------------------|
| `id`                 | String  | Ja           | Eindeutige ID                      |
| `alias`              | String  | Ja           | Alternativer Bezeichner            |
| `type`               | String  | Ja           | Muss "binary-choice" sein          |
| `required`           | Boolean | Ja           | Ist Auswahl erforderlich?          |
| `requiredWarnMessage`| String  | Nein         | Warnmeldung bei fehlender Auswahl  |
| `value`              | Mixed   | Ja           | Anfangswert (meist null)           |

**Hinweis**: Das BinaryChoice-Element hat fest definierte Icons (Haken für richtig, X für falsch) und keine konfigurierbaren Optionen.

#### SyllableCounter-Element

Silbenzähler mit konfigurierbarem Layout (für Aufgaben wie PB1_SiS, PB2_PhS).

```json
{
  "id": "syllable_counter_1",
  "alias": "Silbenzaehler",
  "type": "syllable-counter",
  "required": true,
  "layout": "vertical",
  "value": null,
  "maxSyllables": 4,
  "imgSrc": "data:image/png;base64,..."
}
```

| Eigenschaft     | Typ     | Erforderlich | Beschreibung                              |
|----------------|---------|--------------|------------------------------------------|
| `id`           | String  | Ja           | Eindeutige ID                             |
| `alias`        | String  | Ja           | Alternativer Bezeichner                   |
| `type`         | String  | Ja           | Muss "syllable-counter" sein              |
| `required`     | Boolean | Ja           | Ist Auswahl erforderlich?                 |
| `layout`       | String  | Ja           | "vertical" oder "row"                     |
| `value`        | Mixed   | Ja           | Anfangswert (meist null)                  |
| `maxSyllables` | Number  | Ja           | Maximale Anzahl der Silben (1-10)         |
| `imgSrc`       | String  | Nein         | Base64-Bild für die Silbendarstellung    |

**Layouts:**
- `vertical`: Radio-Button-Gruppe mit mehreren Händen pro Option (1 Hand, 2 Hände, etc.)
- `row`: Multi-Choice mit einzelnen Händen zum Anklicken

#### ReducedKeyboard-Element

Reduzierte Tastatur für Texteingabe (für Aufgaben wie BSK2_BD).

```json
{
  "id": "reduced-keyboard_1",
  "alias": "reduced-keyboard-alias",
  "type": "reduced-keyboard",
  "required": true,
  "value": "",
  "maxLength": 10,
  "showBackspace": true,
  "buttons": [
    {
      "id": "button_k",
      "text": "K"
    },
    {
      "id": "button_o", 
      "text": "O"
    }
  ]
}
```

| Eigenschaft    | Typ     | Erforderlich | Beschreibung                          |
|---------------|---------|--------------|--------------------------------------|
| `id`          | String  | Ja           | Eindeutige ID                         |
| `alias`       | String  | Ja           | Alternativer Bezeichner               |
| `type`        | String  | Ja           | Muss "reduced-keyboard" sein          |
| `required`    | Boolean | Ja           | Ist Eingabe erforderlich?             |
| `value`       | String  | Ja           | Anfangswert (meist "")                |
| `maxLength`   | Number  | Nein         | Maximale Zeichen (1-50)               |
| `showBackspace`| Boolean| Nein         | Backspace-Button anzeigen             |
| `buttons`     | Array   | Ja           | Liste der verfügbaren Tasten         |

**Button-Definition:**
```json
{
  "id": "button_k",
  "text": "K",
  "value": "k",
  "lowerCaseText": "k"
}
```

### 3. Instructions-Elemente

Elemente zur Bereitstellung von Anweisungen und Erläuterungen.

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
  "image": {
    "imgSrc": "",
    "altText": "Klicken zum Abspielen"
  }
}
```

| Eigenschaft    | Typ    | Erforderlich | Beschreibung                       |
|----------------|--------|--------------|-----------------------------------|
| `id`           | String | Ja           | Eindeutige ID                      |
| `alias`        | String | Ja           | Alternativer Bezeichner            |
| `type`         | String | Ja           | Muss "audio" sein                  |
| `audioSrc`     | String | Ja           | Base64-kodierte Audiodaten         |
| `audioFileName`| String | Nein         | Originaldateiname                  |
| `image`        | Object | Nein         | Play-Button Konfiguration          |

**Hinweis**: Das `image.imgSrc` sollte immer ein leerer String sein, da standardmäßige Audio-Icons verwendet werden.

## Anwendungsbeispiele

### Beispiel 1: Bildauswahl mit Audio-Anweisung (WS_BA)

```json
{
  "type": "stars-unit-definition",
  "version": "0.1.0",
  "navNextButtonMode": "onInteraction",
  "backgroundColor": "#E3D8FF",
  "sections": [{
    "id": "section1",
    "layoutId": "PicPicLayout",
    "variant": "grid_layout",
    "coding": {
      "fullCredit": "2"
    },
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
      "required": true,
      "requiredWarnMessage": "Bitte wähle ein Bild aus",
      "value": null,
      "options": [
        {"id": "opt1", "imgSrc": "...", "altText": "..."},
        {"id": "opt2", "imgSrc": "...", "altText": "..."}
      ]
    },
    "instructions": {
      "id": "audio_instruction",
      "alias": "audio_instruction",
      "type": "audio",
      "audioSrc": "data:audio/mpeg;base64,...",
      "image": {
        "imgSrc": "",
        "altText": "Anweisungen abspielen"
      }
    }
  }]
}
```

### Beispiel 2: Buchstabenauswahl (FSE1_Bid)

```json
{
  "type": "stars-unit-definition",
  "version": "0.1.0",
  "navNextButtonMode": "onInteraction",
  "backgroundColor": "#E3D8FF",
  "sections": [{
    "id": "section1",
    "layoutId": "PicPicLayout",
    "variant": "grid_layout",
    "coding": {
      "fullCredit": "2"
    },
    "interaction": {
      "id": "radio-group-text_1",
      "alias": "letter_selection",
      "type": "radio-group-text",
      "required": true,
      "value": null,
      "options": [
        {"id": "text_option_1", "text": "A"},
        {"id": "text_option_2", "text": "G"},
        {"id": "text_option_3", "text": "H"},
        {"id": "text_option_4", "text": "S"}
      ]
    },
    "instructions": {
      "id": "audio_instruction",
      "type": "audio",
      "audioSrc": "data:audio/mpeg;base64,...",
      "image": {
        "imgSrc": "",
        "altText": "Anweisungen abspielen"
      }
    }
  }]
}
```

### Beispiel 3: Silbenzählung (PB1_SiS)

```json
{
  "type": "stars-unit-definition",
  "version": "0.1.0",
  "navNextButtonMode": "onInteraction",
  "backgroundColor": "#E3D8FF",
  "sections": [{
    "id": "section1",
    "layoutId": "PicPicLayout",
    "coding": {
      "fullCredit": "3"
    },
    "stimulus": {
      "id": "stimulus_image",
      "type": "image",
      "imgSrc": "data:image/png;base64,...",
      "altText": "Wort zum Silbenzählen",
      "position": "top"
    },
    "interaction": {
      "id": "syllable_counter_1",
      "alias": "Silbenzaehler",
      "type": "syllable-counter",
      "required": true,
      "layout": "vertical",
      "value": null,
      "maxSyllables": 4,
      "imgSrc": "data:image/png;base64,..."
    },
    "instructions": {
      "id": "audio_instruction",
      "type": "audio",
      "audioSrc": "data:audio/mpeg;base64,...",
      "image": {
        "imgSrc": "",
        "altText": "Anweisungen abspielen"
      }
    }
  }]
}
```

### Beispiel 4: Binäre Auswahl (SV_IE)

```json
{
  "type": "stars-unit-definition",
  "version": "0.1.0",
  "navNextButtonMode": "onInteraction",
  "backgroundColor": "#E3D8FF",
  "sections": [{
    "id": "section1",
    "layoutId": "PicPicLayout",
    "coding": {
      "fullCredit": "1"
    },
    "interaction": {
      "id": "correctness_choice",
      "alias": "binary_choice",
      "type": "binary-choice",
      "required": true,
      "value": null
    },
    "instructions": {
      "id": "audio_instruction",
      "type": "audio",
      "audioSrc": "data:audio/mpeg;base64,...",
      "image": {
        "imgSrc": "",
        "altText": "Anweisungen abspielen"
      }
    }
  }]
}
```

### Beispiel 5: Texteingabe mit reduzierter Tastatur (BSK2_BD)

```json
{
  "type": "stars-unit-definition",
  "version": "0.1.0",
  "navNextButtonMode": "onInteraction",
  "backgroundColor": "#E3D8FF",
  "sections": [{
    "id": "section1",
    "layoutId": "PicPicLayout",
    "coding": {
      "fullCredit": "Kopf"
    },
    "stimulus": {
      "id": "stimulus_image",
      "type": "image", 
      "imgSrc": "data:image/png;base64,...",
      "altText": "Bild zum Beschreiben",
      "position": "top"
    },
    "interaction": {
      "id": "reduced-keyboard_1",
      "alias": "reduced-keyboard-alias",
      "type": "reduced-keyboard",
      "required": true,
      "value": "",
      "maxLength": 10,
      "showBackspace": true,
      "buttons": [
        {"id": "button_k", "text": "K"},
        {"id": "button_o", "text": "O"},
        {"id": "button_p", "text": "P"},
        {"id": "button_f", "text": "F"}
      ]
    },
    "instructions": {
      "id": "audio_instruction",
      "type": "audio",
      "audioSrc": "data:audio/mpeg;base64,...",
      "image": {
        "imgSrc": "",
        "altText": "Anweisungen abspielen"
      }
    }
  }]
}
```

## Aufgabentyp-Zuordnung

Die folgenden Aufgabentypen können mit den entsprechenden Interaktionselementen umgesetzt werden:

| Aufgabentyp | Interaktionselement | Layout | Beschreibung |
|-------------|-------------------|--------|--------------|
| **FSE1_Diff** | `binary-choice` | PicPicLayout | Unterscheidung zwischen Buchstaben und buchstabenähnlichen Zeichen |
| **FSE1_Bid** | `radio-group-text` | PicPicLayout | Buchstaben identifizieren |
| **PB1_SiS** | `syllable-counter` | PicPicLayout | Silben segmentieren |
| **PB_Laut** | `radio-group-images` | PicPicLayout/PicTextLayout | Laute erkennen |
| **PB2_PhS** | `syllable-counter` | PicPicLayout | Phoneme segmentieren |
| **WS_BA** | `radio-group-images` | PicPicLayout | Bildauswahl (Wortschatz rezeptiv) |
| **WS_SR** | `radio-group-images` oder `multi-choice-images` | PicPicLayout | Semantische Relationen |
| **SV_BA** | `radio-group-images` | PicPicLayout | Bildauswahl (Satzverstehen) |
| **SV_IE** | `binary-choice` | PicPicLayout | Inkongruenzen erkennen |
| **BSK2_SBZ** | `radio-group-images` | PicPicLayout | Wort/Satz-Bild-Zuordnung |
| **BSK2_BD** | `reduced-keyboard` | PicPicLayout | Bilddiktat |

## Hinweise und Einschränkungen

1. **Verfügbare Interaktionselemente**: Die folgenden Interaktionselemente werden unterstützt:
  - `radio-group-images`: Einzelauswahl mit Bildern
  - `multi-choice-images`: Mehrfachauswahl mit Bildern
  - `radio-group-text`: Einzelauswahl mit Text
  - `binary-choice`: Binäre Auswahl (Richtig/Falsch)
  - `syllable-counter`: Silbenzähler
  - `reduced-keyboard`: Reduzierte Tastatur

2. **Verfügbare Stimulus-Elemente**: Für Stimulus werden folgende Typen unterstützt:
  - `text`: Für Textinhalte
  - `image`: Für Bilder

3. **Verfügbare Instructions-Elemente**: Für Instructions werden folgende Typen unterstützt:
  - `text`: Für Textinhalte
  - `image`: Für Bilder
  - `audio`: Für Audioinhalte

4. **Mehrere Elemente pro Abschnitt**: Jeder Abschnitt einer Section (instructions, stimulus, interaction) kann derzeit nur ein Element enthalten.

5. **Medien-Quellen**: Die aktuelle Implementierung unterstützt Base64-kodierte Inhalte direkt eingebettet in der JSON-Definition (z.B. "data:image/png;base64,...").

6. **Layout-Automatik**:
  - Für einzelne Buchstaben wird automatisch PicPicLayout mit grid_layout verwendet
  - Für Wörter wird automatisch das entsprechende Layout gewählt
  - Bei Silbenzählern mit vertikalem Layout wird ein spezielles Grid verwendet

7. **Coding-System**: Das Bewertungssystem unterstützt nur volle Punkte (`fullCredit`) mit spezifischen Werten je Interaktionstyp:
  - **Single-Choice-Elemente**: Index der richtigen Option (1-basiert)
  - **Multi-Choice-Elemente**: Binärstring der Auswahl (z.B. "010010")
  - **Syllable Counter**: Anzahl der korrekten Silben
  - **Reduced Keyboard**: Das korrekte Wort als String
  - **Binary Choice**: "1" für richtig, "0" für falsch

8. **Navigation**: Der `navNextButtonMode` steuert, wann der Weiter-Button angezeigt wird:
  - `"onInteraction"`: Nur nach Benutzerinteraktion
  - `"always"`: Immer sichtbar
