# Release Note 0.6.29 #

## Neu

+ Der Haupt-Audio-Button pulsiert nun etwas langsamer als zuvor.
+ Neue SVGs wurden erstellt und für PLACE_VALUE (Legeformat) Zehner-Icons hinzugefügt. Der Icon-Rahmen erhält zusätzliches Innenabstand (Padding).
+ Layout-Änderungen: Der Innenabstand unter den Buttons wird bei imageUseFullArea: true erhöht (90px) – dies ist nun im gesamten Projekt einheitlich.
+ Wrapper und SVGs für den Haupt-Audio-Button und den Weiter-Button wurden korrigiert; sie haben nun gleiche Größe, gleichen Innenabstand und gleiche Box-Schatten.
+ Der Parameter triggerNavigationOnEnd wurde zu interactionType: VIDEO hinzugefügt. Wenn dieser verwendet wird, wechselt die Einheit am Ende des Videos nach 0,5 Sekunden automatisch zur nächsten (ohne Klick auf den Weiter-Button).
+ Neue E2E-Tests wurden hinzugefügt, um das frühere Zustandsverhalten zu prüfen und sicherzustellen, dass das Haupt-Audio beim Wechsel zu einer neuen Einheit zurückgesetzt wird.

## Bugfix

+ Einige Fehler wurden behoben, damit der Box-Schatten des Haupt-Audios und der Mini-Audios unter den Buttons beim Klicken in Safari korrekt angezeigt wird.
+ Mehrere Fehler wurden behoben, die dazu führten, dass der frühere Zustand und die erste Klick-Ebene nicht korrekt funktionierten.
