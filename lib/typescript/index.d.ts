export declare class ApptentiveConfiguration {
    apptentiveKey: string;
    apptentiveSignature: string;
    logLevel: string;
    distributionName: string;
    distributionVersion: string;
    shouldEncryptStorage: boolean;
    shouldSanitizeLogMessages: boolean;
    setTroubleshootingModeEnabled: boolean;
    constructor(key: string, signature: string);
}
export declare class Apptentive {
    static register(configuration: ApptentiveConfiguration): Promise<boolean>;
    static engage(event: string): Promise<boolean>;
    static presentMessageCenter(): Promise<boolean>;
    static setPersonName(name: string): Promise<boolean>;
    static getPersonName(): Promise<string>;
    static setPersonEmail(email: string): Promise<boolean>;
    static getPersonEmail(): Promise<string>;
    static addCustomPersonData(key: string, value: any): Promise<boolean>;
    /**
     * @deprecated The method should not be used. Use addCustomPersonData() instead
     */
    static addCustomPersonDataBool(key: string, value: boolean): Promise<boolean>;
    /**
     * @deprecated The method should not be used. Use addCustomPersonData() instead
     */
    static addCustomPersonDataNumber(key: string, value: number): Promise<boolean>;
    /**
     * @deprecated The method should not be used. Use addCustomPersonData() instead
     */
    static addCustomPersonDataString(key: string, value: string): Promise<boolean>;
    static removeCustomPersonData(key: string): Promise<boolean>;
    static addCustomDeviceData(key: string, value: any): Promise<boolean>;
    /**
     * @deprecated The method should not be used. Use addCustomDeviceData() instead
     */
    static addCustomDeviceDataBool(key: string, value: boolean): Promise<boolean>;
    /**
     * @deprecated The method should not be used. Use addCustomDeviceData() instead
     */
    static addCustomDeviceDataNumber(key: string, value: number): Promise<boolean>;
    /**
     * @deprecated The method should not be used. Use addCustomDeviceData() instead
     */
    static addCustomDeviceDataString(key: string, value: string): Promise<boolean>;
    static removeCustomDeviceData(key: string): Promise<boolean>;
    static canShowInteraction(event: string): Promise<boolean>;
    static canShowMessageCenter(): Promise<boolean>;
    static getUnreadMessageCount(): Promise<number>;
    /**
     * @return Current callback for the unread message count change in the Message Center.
     */
    static get onUnreadMessageCountChanged(): (count: number) => {};
    /**
     * Sets current callback for the unread message count change in the Message Center.
     * @param value Callback function with a single integer parameter.
     */
    static set onUnreadMessageCountChanged(value: (count: number) => {});
}
