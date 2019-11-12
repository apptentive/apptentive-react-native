import { Alert } from 'react-native';

function showAlert(title, message, closeHandler) {
  Alert.alert(
    title,
    message,
    [
      {text: 'OK', style: 'cancel', onPress: () => {
        if (closeHandler !== undefined) {
          closeHandler()
        }
      }},
    ],
    { cancelable: false }
  )
}

module.exports = {
  showAlert
}
