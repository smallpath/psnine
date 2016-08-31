import {
  AsyncStorage,
} from 'react-native';

const logoutURL = 'http://psnine.com/sign/out';

export const safeLogout = async function() {
      const psnid = await AsyncStorage.getItem('@psnid');
      if(psnid == null)
        return;

      let data = await fetch(logoutURL);

      await AsyncStorage.removeItem('@psnid');
};