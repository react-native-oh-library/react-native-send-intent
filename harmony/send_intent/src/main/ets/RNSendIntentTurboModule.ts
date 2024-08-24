/*
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { RNOHContext, RNOHLogger, TurboModule } from '@rnoh/react-native-openharmony/ts';
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

  constructor(ctx: RNOHContext) {
    super(ctx);
    this.logger = this.ctx.logger.clone(LOGGER_NAME);
  }

  sendText(config: TM.SendIntentNativeModule.TextIntentConfig): void {
    let data: systemShare.SharedData = new systemShare.SharedData({
      utd: utd.UniformDataType.PLAIN_TEXT,
      content: `${config.text}`,
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
          uri: item.text
        });
      }
      if (item.imageUrl) {
        data.addRecord({
          utd: utd.UniformDataType.PNG,
          uri: item.imageUrl
        });
      }
      if (item.videoUrl) {
        data.addRecord({
          utd: utd.UniformDataType.VIDEO,
          uri: item.videoUrl
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
    let context = this.ctx.uiAbilityContext;
    let flag
    let want: Want = {
      bundleName: packageName,
      abilityName: 'EntryAbility'
    };
    context.startAbility(want)
      .then(() => {
        flag = true
        Promise.resolve(true)
      })
      .catch(() => {
        flag = false
        Promise.resolve(false)
      })
    return Promise.resolve(flag)
  }

  openAppWithData(packageName: string, dataUri: string, mimeType: string, extras: Object): Promise<boolean> {
    let context = this.ctx.uiAbilityContext;
    let flag
    let want: Want = {
      bundleName: packageName,
      uri: dataUri,
      type: mimeType,
      parameters: {}
    };
    context.startAbility(want)
      .then(() => {
        flag = true
        Promise.resolve(true)
      })
      .catch(() => {
        flag = false
        Promise.resolve(false)
      })
    return Promise.resolve(flag)
  }

  openChromeIntent(dataUri: string): Promise<boolean> {
    let context = this.ctx.uiAbilityContext;
    let flag
    let want: Want = {
      "action": "ohos.want.action.viewData",
      "entities": ["entity.system.browsable"],
      "uri": dataUri,
    }
    context.startAbility(want)
      .then(() => {
        flag = true
        Promise.resolve(true)
      })
      .catch(() => {
        flag = false
        Promise.resolve(false)
      })
    return Promise.resolve(flag)
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
      let uris: Array<string> = [];
      const documentViewPicker = new picker.DocumentViewPicker();
      const documentSelectOptions = new picker.DocumentSelectOptions();
      documentViewPicker.select(documentSelectOptions).then((documentSelectResult: Array<string>) => {
        uris = documentSelectResult;
      }).catch((err) => {
        this.logger.error(`Invoke documentViewPicker.select failed, code is ${err.code}, message is ${err.message}`)
      })
    }

  }

  // 打开电子邮件
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