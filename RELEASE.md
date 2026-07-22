# Release Note 0.6.42 #

## Neu
+ triggerNavigationOnEnd wurde zu audioFeedback hinzugefügt, um es zu ermöglichen, zur nächsten unit zu wechseln, ohne auf die Weiter-button klicken zu müssen.
+ Die Weiter-button wird nur deaktiviert, während das Audio-Feedback läuft (zuvor war sie auch deaktiviert, während mainAudio lief).
+ interactionType: BUTTONS: Wenn triggerNavigationOnSelect auf true gesetzt ist, werden Interaktionen deaktiviert, um eine Änderung der Antwort zu verhindern.

## Bugfixes

+ interactionType: POLYGON_BUTTONS: tap-highlight wurde transparent hinzugefügt, für Safari.
+ Der fehlerhafte Drop-Shadow in Safari wurde für Icons und Mini-Audio-Schaltflächen behoben.
