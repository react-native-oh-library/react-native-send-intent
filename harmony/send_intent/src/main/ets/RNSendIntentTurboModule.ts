/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */


import { UITurboModuleContext, RNOHLogger, TurboModule } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import call from '@ohos.telephony.call';
import { Want } from '@kit.AbilityKit';
import picker from '@ohos.file.picker';
import { BusinessError } from '@kit.BasicServicesKit';
import { sim } from '@kit.TelephonyKit';
import { Event, JSON } from '@kit.ArkTS';
import { systemShare } from '@kit.ShareKit';
import { uniformTypeDescriptor as utd } from '@kit.ArkData';
import { promptAction } from '@kit.ArkUI';
import { geoLocationManager } from '@kit.LocationKit';
import wantConstant from '@ohos.app.ability.wantConstant';

const LOGGER_NAME = '[RHOH] RNKeys';

export class RNSendIntentTurboModule extends TurboModule implements TM.SendIntentNativeModule.Spec {
  private logger: RNOHLogger;

  constructor(ctx: UITurboModuleContext) {
    super(ctx);
    this.logger = this.ctx.logger.clone(LOGGER_NAME);
  }

  TEXT_PLAIN(): string {
    return 'text/plain'
  }

  TEXT_HTML(): string {
    return 'text/html'
  }

  sendText(config: TM.SendIntentNativeModule.TextIntentConfig): void {
    let data: systemShare.SharedData = new systemShare.SharedData({
      utd: utd.UniformDataType.PLAIN_TEXT,
      content: `${config}`,
    });
    let controller: systemShare.ShareController = new systemShare.ShareController(data);
    let context = this.ctx.uiAbilityContext;
    controller.show(context, {
      previewMode: systemShare.SharePreviewMode.DETAIL,
      selectionMode: systemShare.SelectionMode.SINGLE
    });
  }

  sendPhoneDial(phoneNumber: string, phoneAppOnly: boolean): void {
    call.makeCall(phoneNumber, (err) => {
      if (!err) {
        this.logger.info("make call success.");
      } else {
        this.logger.error("make call fail, err is:" + JSON.stringify(err));
      }
    });
  }

  sendPhoneCall(phoneNumber: string, phoneAppOnly: boolean): void {
    call.makeCall(phoneNumber, (err) => {
      if (!err) {
        this.logger.info("make call success.");
      } else {
        this.logger.error("make call fail, err is:" + JSON.stringify(err));
      }
    });
  }

  sendSms(phoneNumber: string, body: string): void {
    let context = this.ctx.uiAbilityContext;
    class info {
      telephone: string
      constructor() {
        this.telephone = phoneNumber
      }
    }
    let contactInfo: Array<Object> = new Array()
    contactInfo[0] = new info();
    let want: Want = {
      bundleName: 'com.ohos.mms',
      abilityName: 'com.ohos.mms.MainAbility',
      parameters: {
        contactObjects: JSON.stringify(contactInfo),
        content: body,
        pageFlag: 'conversation'
      }
    };
    context.startAbility(want)
  }

  addCalendarEvent(config: TM.SendIntentNativeModule.CalendarEventConfig): void {
    let context = this.ctx.uiAbilityContext;
    let want: Want = {
      bundleName: 'com.huawei.hmos.calendar',
      abilityName: 'MainAbility',
    };
    context.startAbility(want)
  }

  isAppInstalled(packageName: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  installRemoteApp(uri: string, saveAs: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  openCalendar(): void {
    let context = this.ctx.uiAbilityContext;
    let want: Want = {
      bundleName: 'com.huawei.hmos.calendar',
      abilityName: 'MainAbility',
    };
    context.startAbility(want).then(() => {
    });
  }

  sendMail(recepientMail: string, subject: string, body: string): void {
    let context = this.ctx.uiAbilityContext;
    let want: Want = {
      action: 'ohos.want.action.sendData',
      uri: `${recepientMail}?subject=${subject}&body=${body}`
    };
    context.startAbility(want)
  };

  openChooserWithOptions(options: TM.SendIntentNativeModule.ChooserOptions, title: string): void {
    let context = this.ctx.uiAbilityContext;
    if (options.text) {
      let data: systemShare.SharedData = new systemShare.SharedData({
        utd: utd.UniformDataType.PLAIN_TEXT,
        content: options.text
      });
      let controller: systemShare.ShareController = new systemShare.ShareController(data);
      controller.show(context, {
        previewMode: systemShare.SharePreviewMode.DETAIL,
        selectionMode: systemShare.SelectionMode.SINGLE
      });
    }
    if (options.imageUrl) {
      let data: systemShare.SharedData = new systemShare.SharedData({
        utd: utd.UniformDataType.PNG,
        content: options.imageUrl
      });
      let controller: systemShare.ShareController = new systemShare.ShareController(data);
      controller.show(context, {
        previewMode: systemShare.SharePreviewMode.DETAIL,
        selectionMode: systemShare.SelectionMode.SINGLE
      });
    }
    if (options.videoUrl) {
      let data: systemShare.SharedData = new systemShare.SharedData({
        utd: utd.UniformDataType.VIDEO,
        content: options.videoUrl
      });
      let controller: systemShare.ShareController = new systemShare.ShareController(data);
      controller.show(context, {
        previewMode: systemShare.SharePreviewMode.DETAIL,
        selectionMode: systemShare.SelectionMode.SINGLE
      });
    }
  }

  openChooserWithMultipleOptions(options: TM.SendIntentNativeModule.ChooserOptions[], title: string): void {
    let context = this.ctx.uiAbilityContext;
    let data: systemShare.SharedData = new systemShare.SharedData({
      utd: utd.UniformDataType.PLAIN_TEXT,
      content: title
    });
    options.forEach((item) => {
      if (item.text) {
        data.addRecord({
          utd: utd.UniformDataType.TEXT,
          content: item.text
        });
      }
      if (item.imageUrl) {
        data.addRecord({
          utd: utd.UniformDataType.PNG,
          content: item.imageUrl
        });
      }
      if (item.videoUrl) {
        data.addRecord({
          utd: utd.UniformDataType.VIDEO,
          content: item.videoUrl
        });
      }
    })
    let controller: systemShare.ShareController = new systemShare.ShareController(data);
    controller.show(context, {
      previewMode: systemShare.SharePreviewMode.DETAIL,
      selectionMode: systemShare.SelectionMode.SINGLE
    });
  }

  openMaps(query: string): void {
    let context = this.ctx.uiAbilityContext;
    let geocodeRequest: geoLocationManager.GeoCodeRequest = { "description": query, "maxItems": 1 };
    try {
      geoLocationManager.getAddressesFromLocationName(geocodeRequest, (err, data) => {
        if (err) {
          let want: Want = {
            bundleName: 'com.huawei.hmos.maps.app',
            abilityName: 'EntryAbility',
          };
          context.startAbility(want)
        } else {
          let want: Want = {
            bundleName: 'com.huawei.hmos.maps.app',
            uri: 'maps://locationInfo',
            parameters: {
              linkSource: 'com.other.app',
              destinationLatitude: data[0].latitude,
              destinationLongitude: data[0].longitude,
              destinationName: query
            }
          };
          context.startAbility(want)
        }
      });
    } catch (err) {
      return err
    }
  }

  openCamera(): void {
    let context = this.ctx.uiAbilityContext;
    let want: Want = {
      action: 'ohos.want.action.imageCapture',
    };
    context.startAbility(want)
  }

  openMapsWithRoute(query: string, mode: string): void {
    let context = this.ctx.uiAbilityContext;
    let geocodeRequest: geoLocationManager.GeoCodeRequest = { "description": query, "maxItems": 1 };
    try {
      geoLocationManager.getAddressesFromLocationName(geocodeRequest, (err, data) => {
        if (err) {
          let want: Want = {
            bundleName: 'com.huawei.hmos.maps.app',
            abilityName: 'EntryAbility',
          };
          context.startAbility(want)
        } else {
          let num = 0;
          if (mode === 'd') {
            num = 0
          }
          if (mode === 'w') {
            num = 1
          }
          if (mode === 'b') {
            num = 2
          }
          let want: Want = {
            bundleName: 'com.huawei.hmos.maps.app',
            uri: 'maps://locationInfo',
            parameters: {
              linkSource: 'com.other.app',
              destinationLatitude: data[0].latitude,
              destinationLongitude: data[0].longitude,
              destinationName: query,
              vehicleType: num
            }
          };
          context.startAbility(want)
        }
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  shareTextToLine(options: TM.SendIntentNativeModule.TextToLineOptions): void {
    throw new Error('Method not implemented.');
  }

  shareImageToInstagram(mimeType: string, mediaPath: string): void {
    throw new Error('Method not implemented.');
  }

  openSettings(settingsName: string): void {
    let context = this.ctx.uiAbilityContext;
    let want: Want = {
      bundleName: 'com.huawei.hmos.settings',
      abilityName: 'com.huawei.hmos.settings.MainAbility',
      uri: settingsName
    };
    context.startAbility(want)
  }

  getVoiceMailNumber(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  getPhoneNumber(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  gotoHomeScreen(): void {
    try {
      let context = this.ctx.uiAbilityContext;
      context.terminateSelf((err: BusinessError) => {
        if (err.code) {
          this.logger.error(`terminateSelf failed, code is ${err.code}, message is ${err.message}`);
          return;
        }
        this.logger.info('terminateSelf succeed');
      });
    } catch (err) {
      let code = (err as BusinessError).code;
      let message = (err as BusinessError).message;
      this.logger.error(`terminateSelf failed, code is ${code}, message is ${message}`);
    }
  }

  openApp(packageName: string, extras: Object): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let context = this.ctx.uiAbilityContext;
      let want: Want = {
        bundleName: packageName,
        abilityName: 'EntryAbility'
      };
      context.startAbility(want)
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          resolve(false)
        })
    });
  }

  openAppWithData(packageName: string, dataUri: string, mimeType: string, extras: Object): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let context = this.ctx.uiAbilityContext;
      let want: Want = {
        bundleName: packageName,
        uri: dataUri,
        type: mimeType,
        parameters: {}
      };
      context.startAbility(want)
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          resolve(false)
        })
    });
  }

  openChromeIntent(dataUri: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let context = this.ctx.uiAbilityContext;
      let want: Want = {
        "action": "ohos.want.action.viewData",
        "entities": ["entity.system.browsable"],
        "uri": dataUri,
      };
      context.startAbility(want)
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          resolve(false)
        })
    });
  }

  openDownloadManager(): void {
    let context = this.ctx.uiAbilityContext;
    let want: Want = {
      bundleName: 'com.huawei.hmos.files',
      abilityName: 'EntryAbility'
    };
    context.startAbility(want)
  }

  openFileChooser(options: TM.SendIntentNativeModule.FileChooserOptions, title: string): void {
    let context = this.ctx.uiAbilityContext;
    if(options.subject) {
      let want: Want = {
        action: 'ohos.want.action.sendData',
        uri: `?subject=${options.subject}&body=$`
      };
      context.startAbility(want)
    }else {
      let want: Want = {
        uri: options.fileUrl,
        type: options.type,
        flags: wantConstant.Flags.FLAG_AUTH_WRITE_URI_PERMISSION,
      }
      context.startAbility(want)
    }
  }

  openFilePicker(options: TM.SendIntentNativeModule.FilePickerOptions, filePath: (url) => void):void {
    let uris: Array<string> = [];
    const documentViewPicker = new picker.DocumentViewPicker();
    const documentSelectOptions = new picker.DocumentSelectOptions();
    documentViewPicker.select(documentSelectOptions).then((documentSelectResult: Array<string>) => {
      uris = documentSelectResult;
      filePath(uris)
      return uris
    }).catch((err) => {
      this.logger.error(`Invoke documentViewPicker.select failed, code is ${err.code}, message is ${err.message}`)
    })
  }

  openEmailApp(): void {
    let context = this.ctx.uiAbilityContext;
    let want: Want = {
      bundleName: 'com.huawei.hmos.email',
      abilityName: 'EntryAbility'
    };
    context.startAbility(want)
      .then(() => {

      })
      .catch((err: BusinessError) => {
        this.logger.error(`Failed to startAbility. Code: ${err.code}, message: ${err.message}`);
        if (err.code == 16000001) {
          promptAction.showToast({
            message: '请先安装应用',
            duration: 2000
          });
        }
      });
  }

  openAllEmailApp(): void {
    let context = this.ctx.uiAbilityContext;
    let want: Want = {
      bundleName: 'com.huawei.hmos.email',
      abilityName: 'EntryAbility'
    };
    context.startAbility(want)
      .then(() => {

      })
      .catch((err: BusinessError) => {
        this.logger.error(`Failed to startAbility. Code: ${err.code}, message: ${err.message}`);
        if (err.code == 16000001) {
          promptAction.showToast({
            message: '请先安装应用',
            duration: 2000
          });
        }
      });
  }

  requestIgnoreBatteryOptimizations(): Promise<boolean> {
    let context = this.ctx.uiAbilityContext;
    let want: Want = {
      bundleName: 'com.huawei.hmos.settings',
      abilityName: 'com.huawei.hmos.settings.MainAbility',
      uri: 'battery'
    };
    context.startAbility(want)
    return Promise.resolve(true)
  }

  showIgnoreBatteryOptimizationsSettings(): void {
    let context = this.ctx.uiAbilityContext;
    let want: Want = {
      bundleName: 'com.huawei.hmos.settings',
      abilityName: 'com.huawei.hmos.settings.MainAbility',
      uri: 'battery'
    };
    context.startAbility(want)
      .then(() => {
        return Promise.resolve(true)
      })
      .catch((err) => {
        this.logger.error("make call fail, err is:" + JSON.stringify(err));
      })
  }

  openAppWithUri(intentUri: string, extras: Object): Promise<boolean> {
    let context = this.ctx.uiAbilityContext;
    context.startAbility({ bundleName: intentUri, abilityName: 'MainAbility' })
      .then(() => {

      })
      .catch(() => {
        const want: Want = {
          action: 'ohos.want.action.appdetail',
          uri: `store://appgallery.huawei.com/app/detail?id=${intentUri}`
        };
        context.startAbility(want)
      })
    return Promise.resolve(true)
  }
}