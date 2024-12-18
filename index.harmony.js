/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

/**
 * @providesModule SendIntentAndroid
 */
import { TurboModuleRegistry  } from 'react-native';
var RNSendIntentHarmony = TurboModuleRegistry.get('SendIntentNativeModule');
var SendIntentHarmony = {
    TEXT_PLAIN: "text/plain",
    TEXT_HTML: "text/html",
    sendText(config) {
        RNSendIntentHarmony.sendText(config.text, config.type || "text/plain");
    },
    sendPhoneCall(phoneNumber, phoneAppOnly = false) {
        RNSendIntentHarmony.sendPhoneCall(phoneNumber, phoneAppOnly);
    },
    sendPhoneDial(phoneNumber, phoneAppOnly = false) {
        RNSendIntentHarmony.sendPhoneDial(phoneNumber, phoneAppOnly);
    },
    sendSms(phoneNumber, body = null) {
        RNSendIntentHarmony.sendSms(phoneNumber, body);
    },
    addCalendarEvent(config) {
        RNSendIntentHarmony.addCalendarEvent(
            config.title,
            config.description,
            config.startDate,
            config.endDate,
            config.recurrence,
            config.location,
            config.isAllDay || false
        );
    },
    isAppInstalled(packageName) {
        return RNSendIntentHarmony.isAppInstalled(packageName);
    },
    installRemoteApp(uri, saveAs) {
        return RNSendIntentHarmony.installRemoteApp(uri, saveAs);
    },
    openCalendar() {
        RNSendIntentHarmony.openCalendar();
    },
    sendMail(mail, subject = "", body = "") {
        RNSendIntentHarmony.sendMail(mail, subject, body);
    },
    openChooserWithOptions(options, title) {
        RNSendIntentHarmony.openChooserWithOptions(options, title);
    },
    openChooserWithMultipleOptions(options, title) {
        RNSendIntentHarmony.openChooserWithMultipleOptions(options, title);
    },
    openMaps(query) {
        RNSendIntentHarmony.openMaps(query);
    },
    openCamera() {
        RNSendIntentHarmony.openCamera();
    },
    openMapsWithRoute(query, mode) {
        RNSendIntentHarmony.openMapsWithRoute(query, mode);
    },
    shareTextToLine(options) {
        RNSendIntentHarmony.shareTextToLine(options);
    },
    shareImageToInstagram(type, mediaPath) {
        RNSendIntentHarmony.shareImageToInstagram(type, mediaPath);
    },
    openSettings(settingsName) {
        RNSendIntentHarmony.openSettings(settingsName);
    },
    getVoiceMailNumber() {
        return RNSendIntentHarmony.getVoiceMailNumber();
    },
    getPhoneNumber() {
        return RNSendIntentHarmony.getPhoneNumber();
    },
    gotoHomeScreen() {
        return RNSendIntentHarmony.gotoHomeScreen();
    },
    openApp(packageName, extras) {
        return RNSendIntentHarmony.openApp(packageName, extras || {});
    },
    /** Creates an ACTION_VIEW Intent for the given package with the given data, optional mimetype and extras.
     *  The extras are an object containing String, or other objects of the following format:
     * { type: "int", value: 4 }
     * Other possible types are int, short, byte, char, long and float.
     */
    openAppWithData(packageName, dataUri, mimeType, extras) {
        return RNSendIntentHarmony.openAppWithData(packageName, dataUri, mimeType, extras || {});
    },
    /**
     * This method follows the chrome intent syntax: https://developer.chrome.com/multidevice/android/intents.
     *
     * Opens intent with package name defined in the dataUri field.
     * When intent cannot be resolved, open the URL in browser_fallback_url in the mobile's browser.
     * @param {string} dataUri - the intent url. Looks like: `intent://www.spm.com/qrlogin#Intent;scheme=https;package=example.package;S.browser_fallback_url=https://www.spm.com/download;end`.
     * @returns {Promise<boolean>} true if app or fallback URL is opened, false otherwise.
     */
    openChromeIntent(dataUri) {
        return RNSendIntentHarmony.openChromeIntent(dataUri);
    },
    openFileChooser(options, title) {
        return RNSendIntentHarmony.openFileChooser(options, title);
    },
    openFilePicker({ type = "*/*", title = "Choose File" }, callback) {
        return RNSendIntentHarmony.openFilePicker({ type, title }, callback);
    },
    openEmailApp() {
        RNSendIntentHarmony.openEmailApp();
    },
    openAllEmailApp() {
        RNSendIntentHarmony.openAllEmailApp();
    },
    openDownloadManager() {
        RNSendIntentHarmony.openDownloadManager();
    },
    requestIgnoreBatteryOptimizations() {
        return RNSendIntentHarmony.requestIgnoreBatteryOptimizations();
    },
    showIgnoreBatteryOptimizationsSettings() {
        RNSendIntentHarmony.showIgnoreBatteryOptimizationsSettings();
    },
    openAppWithUri(intentUri, extras) {
        return RNSendIntentHarmony.openAppWithUri(intentUri, extras || {});
    },
};
module.exports = SendIntentHarmony;
