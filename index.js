/**
 * @providesModule SendIntentAndroid
 */

import SendIntentAndroid from 'react-native-send-intent';
import SendIntentHarmony from './index.harmony';
import { Platform } from 'react-native'

const isIosAndroid =  Platform.OS === 'android';
const exportIntent = isIosAndroid ? SendIntentAndroid : SendIntentHarmony;

export default exportIntent;