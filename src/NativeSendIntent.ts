import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';
interface CalendarEventConfig {
    title: string
    description: string
    /**
     * A datetime string with following format: yyyy-MM-dd HH:mm
     */
    startDate: string
    /**
     * A datetime string with following format: yyyy-MM-dd HH:mm
     */
    endDate: string
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly'
    location: string
    /**
     * **default**: false
     */
    isAllDay?: boolean
}

interface ChooserOptions {
    subject?: string
    text?: string
    imageUrl?: string
    videoUrl?: string
}

interface TextToLineOptions {
    text?: string
}

interface FileChooserOptions {
    fileUrl: string
    subject?: string
    type: string
}

interface FilePickerOptions {
    type?: string
    title?: string
}
// type TextType = typeof TEXT_HTML | typeof TEXT_PLAIN | undefined
interface TextIntentConfig {
    title: string
    text: string
    type: string
}
export interface Spec extends TurboModule {
    TEXT_PLAIN: () => string
    TEXT_HTML: () => string
    sendText: (config: TextIntentConfig) => void
    sendPhoneCall: (phoneNumber: string, phoneAppOnly?: boolean) => void
    sendPhoneDial: (phoneNumber: string, phoneAppOnly?: boolean) => void
    sendSms: (phoneNumber: string, body?: string | null) => void
    addCalendarEvent: (config: CalendarEventConfig) => void
    isAppInstalled: (packageName: string) => Promise<boolean>
    installRemoteApp: (uri: string, saveAs: string) => Promise<boolean>
    openCalendar: () => void
    sendMail: (recepientMail: string, subject?: string, body?: string) => void
    openChooserWithOptions: (options: ChooserOptions, title: string) => void
    openChooserWithMultipleOptions: (options: ChooserOptions[], title: string) => void
    openMaps: (query: string) => void
    openCamera: () => void
    openMapsWithRoute: (query: string, mode: string) => void
    shareTextToLine: (options: TextToLineOptions) => void
    shareImageToInstagram: (mimeType: string, mediaPath: string) => void
    openSettings: (settingsName: string) => void
    getVoiceMailNumber: () => Promise<string>
    getPhoneNumber: () => Promise<string>
    gotoHomeScreen: () => void
    openApp: (packageName: string, extras: { [index: string]: string }) => Promise<boolean>
    openAppWithData: (packageName: string, dataUri: string, mimeType?: string, extras?: { [index: string]: string }) => Promise<boolean>
    openChromeIntent: (dataUri: string) => Promise<boolean>
    openDownloadManager: () => void
    openFileChooser: (options: FileChooserOptions, title: string) => void
    openFilePicker: (options : FilePickerOptions, filePath:() => void) => void
    openEmailApp: () => void
    openAllEmailApp: () => void
    requestIgnoreBatteryOptimizations: () => Promise<boolean>
    showIgnoreBatteryOptimizationsSettings: () => void
    openAppWithUri: (intentUri: string, extras?: { [index: string]: string }) => Promise<boolean>
};
export const NativeSendIntent =  TurboModuleRegistry.getEnforcing<Spec>('SendIntentNativeModule');