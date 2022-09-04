# Important features

- easily add plan (time/location) into an empty slot of schedule
  1. add to existing event
  2. add to new event (use location as name)
- calendar view
  - can block-out dates as busy

# Interesting features

- all plan locations as pins on map
- expense tracking (could be plan type)

# Build android

```
keytool -genkeypair -v -keystore upload.keystore -alias eventful -keyalg RSA -keysize 2048 -validity 10000
yarn turtle setup:android
yarn turtle build:android --keystore-path upload.keystore --keystore-alias eventful
```

OR 

```
yarn eas build -p android --profile development
```

download artifact from https://expo.dev

`adb install app-relase.apk`