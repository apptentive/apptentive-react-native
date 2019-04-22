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
    static register(apptentiveConfiguration: ApptentiveConfiguration): Promise<any>;
    static presentMessageCenter(customData?: object): Promise<any>;
    static canShowMessageCenter(): Promise<any>;
    static canShowInteraction(event: string): Promise<any>;
    static engage(event: string, customData?: object): Promise<any>;
    static getPersonName(): Promise<any>;
    static setPersonName(value: string): Promise<any>;
    static getPersonEmail(): Promise<any>;
    static setPersonEmail(value: string): Promise<any>;
    static addCustomPersonData(key: string, value: any): Promise<any>;
    static removeCustomPersonData(key: string): Promise<any>;
    static addCustomDeviceData(key: string, value: any): Promise<any>;
    static removeCustomDeviceData(key: string): Promise<any>;
    static logIn(token: string): Promise<any>;
    static logOut(): Promise<any>;
    static onUnreadMessageCountChanged(value?: number): void;
    static onAuthenticationFailed(value?: string): void;
}
