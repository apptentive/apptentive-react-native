import { Alert } from 'react-native';

const showAlert = (title, message, closeHandler) => {
  Alert.alert(
    title,
    message,
    [
      {
        accessibilityLabel: 'alert',
        testID: 'alert',
        text: 'OK',
        style: 'cancel',
        onPress: () => {
          if (closeHandler !== undefined) {
            closeHandler();
          }
        },
      },
    ],
    { cancelable: false }
  );
};

export default showAlert;
