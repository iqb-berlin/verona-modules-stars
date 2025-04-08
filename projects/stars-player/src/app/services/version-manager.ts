// @ts-ignore
import packageJSON from '../../../package.json';

/* General version strategy:
  Player + Editor:
  - isNewer -> abgelehnt
  - isOlder -> wunderbar

  - isLesserMajor is accepeted by Editor and sanitized
 */
export class VersionManager {
  private static acceptedLesserMajor = [3, 10, 0];
  private static currentVersion: [number, number, number] =
    packageJSON.config.unit_definition_version.split('.').map(Number) as [number, number, number];

  static getCurrentVersion(): string {
    return VersionManager.currentVersion.join('.');
  }

  static hasCompatibleVersion(unitDefinition: Record<string, unknown>): boolean {
    const unitDefinitionVersion = VersionManager.getUnitDefinitionVersion(unitDefinition);
    const result = !VersionManager.isNewer(unitDefinition) &&
      VersionManager.isSameMajor(unitDefinitionVersion);
    if (!result) {
      console.log('Current version: ', VersionManager.currentVersion);
      console.log('Found version: ', unitDefinitionVersion);
    }
    return result;
  }

  static isNewer(unitDefinition: Record<string, unknown>): boolean {
    return VersionManager.compare(VersionManager.getUnitDefinitionVersion(unitDefinition)) === 1;
  }

  static needsSanitization(unitDefinition: Record<string, unknown>): boolean {
    const unitDefinitionVersion = VersionManager.getUnitDefinitionVersion(unitDefinition);
    return !VersionManager.isSameMajor(unitDefinitionVersion) &&
      unitDefinitionVersion.join() === VersionManager.acceptedLesserMajor.join();
  }

  private static getUnitDefinitionVersion(unitDefinition: Record<string, any>): [number, number, number] {
    return unitDefinition.version.split('.').map(Number);
  }

  private static compare(unitDefinitionVersion: [number, number, number]): number {
    let i = 0;
    let result = 0;
    while (result === 0 && i < 3) {
      result = VersionManager.compareVersionDigit(unitDefinitionVersion[i], VersionManager.currentVersion[i]);
      i += 1;
    }
    return result;
  }

  /* -1 for older */
  private static compareVersionDigit(a: number, b: number): number {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  }

  private static isSameMajor(unitDefinitionVersion: [number, number, number]): boolean {
    return VersionManager.compareVersionDigit(unitDefinitionVersion[0], VersionManager.currentVersion[0]) === 0;
  }
}
