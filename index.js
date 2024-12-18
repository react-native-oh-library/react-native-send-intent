/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

/**
 * @providesModule SendIntentAndroid
 */

import SendIntentAndroid from 'react-native-send-intent';
import SendIntentHarmony from './index.harmony';
import { Platform } from 'react-native'

const isIosAndroid =  Platform.OS === 'android';
const exportIntent = isIosAndroid ? SendIntentAndroid : SendIntentHarmony;

export default exportIntent;