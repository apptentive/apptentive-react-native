// Type definitions for apptentive-react-native
// Project: apptentive-react-native
// Definitions by: Matthew Callis

export { ApptentiveConfiguration, Apptentive }

declare class ApptentiveConfiguration {
    constructor(apptentiveKey: string, apptentiveSignature: string);

    apptentiveKey: string;
    apptentiveSignature: string;
    logLevel: string;
    shouldSanitizeLogMessages: boolean;
    shouldEncryptStorage: boolean;

    toString(): string;
}

interface ApptentiveConfiguration {
  apptentiveKey: string;
  apptentiveSignature: string;
  logLevel: string;
  shouldSanitizeLogMessages: boolean;
  shouldEncryptStorage: boolean;
}

declare class Apptentive {
    static register(apptentiveConfiguration: ApptentiveConfiguration): Promise;
    static presentMessageCenter(customData: object): Promise;
    static canShowMessageCenter(): Promise;
    static canShowInteraction(event: string): Promise;
    static engage(event: string, customData: object): Promise;
    static getPersonName(): Promise;
    static setPersonName(value: string): Promise;
    static getPersonEmail(): Promise;
    static setPersonEmail(value: string): Promise;
    static addCustomPersonData(key: string, value: any): Promise;
    static removeCustomPersonData(key: string): Promise;
    static addCustomDeviceData(key: string, value: any): Promise;
    static removeCustomDeviceData(key: string): Promise;
    static logIn(token: string): Promise;
    static logOut(): Promise;
    static get onUnreadMessageCountChanged(): number;
    static set onUnreadMessageCountChanged(value: number): void;
    static get onAuthenticationFailed(): string;
    static set onAuthenticationFailed(value: string): void;
}

declare class ApptentivePlatformSpecific {
    createApptentiveEventEmitter(nativeModule: any);
    exportNumber(value: number): any;
}
