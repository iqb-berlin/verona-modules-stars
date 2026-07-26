# Release Note 0.7.0 #

## Neu

+ Legeaufgaben speichern Zehner und Einer gemeinsam in einer Antwortvariable. Das
  neue Stringformat lautet `<Zehnerwert>_<Einerwert>`, zum Beispiel `20_2` für zwei
  Zehnerstreifen und zwei Einer. Zuvor wurde der Gesamtwert numerisch gespeichert
  und die Anzahl der Zehner zusätzlich in einer Variablen mit dem Suffix `_TENS`.
+ Beim Laden vorhandener Bearbeitungsstände werden Antworten im bisherigen
  numerischen Format weiterhin unterstützt. Neu erzeugte Antworten verwenden nur
  noch das neue Stringformat. Auswertungen und Exporte, die Legeaufgaben verarbeiten,
  müssen deshalb vor dem Umstieg auf 0.7.0 angepasst werden.
+ Audio-Feedback kann nach dem Abspielen automatisch zur nächsten Seite navigieren.
+ Bei Auswahlbuttons kann die Interaktion nach einer navigationsauslösenden Auswahl
  gesperrt werden.

## Updates

+ Update auf Angular 22 und TypeScript 6.
+ Der Weiter-Button bleibt nur während Feedback-Audio gesperrt; anderes Audio
  blockiert die Navigation nicht mehr.
+ Darstellung und Bedienung von Polygonen, Zahlenstrahl, Pyramide, Gleichungen,
  Drop-Zonen, Smileys sowie Audio- und Videoelementen wurden überarbeitet.
+ Neue extra-kleine quadratische Buttonvariante.

## Migration

Für Legeaufgaben muss Code, der bisher eine Zahl und optional `<Variablenname>_TENS`
ausgelesen hat, stattdessen den String an `_` aufteilen. Beispiel:

```text
bis 0.6.x: VALUE = 22, VALUE_TENS = 2
ab 0.7.0:  VALUE = "20_2"
```

Das `_TENS`-Antwortfeld wird für neue Antworten nicht mehr erzeugt.
