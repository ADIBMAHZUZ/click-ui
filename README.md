# Table of Contents

- [Table of Contents](#table-of-contents)
- [Prerequisite](#prerequisite)
- [Installation](#installation)
- [Running project for development](#running-project-for-development)
- [Build project for production](#build-project-for-production)
- [License](#license)

# Prerequisite

To run this code in your device you have to make sure, `NodeJS` and `ionic` are installed globally on your machine. After that you can install all necessary dependencies for running project.


0. Check if `npm` is installed. Otherwise please install [`NodeJS`](https://nodejs.org/en/download/package-manager/).

```bash
npm -v
```
1. Install **ionic** command line interface globally.

```bash
npm install -g @ionic/cli
```

2. Install [**Android Studio**](https://developer.android.com/studio) for running and building your **android** application.

2. Install [**Xcode**](https://developer.android.com/studio) and [**Cocoapods**](https://cocoapods.org/) for running and building your **ios** application.

# Installation
Install all dependencies

```bash
npm install
```


# Running project for development

1. For **Browser**.

```bash
npm start
```

2. For **Android**.

```bash
npm run android
```

2. For **iOS**.

```bash
npm run ios
```

# Build project for production

0. Build project for production and copy assets to `android` and `ios` project.
   
```bash
npm run build:all
```

1. **Android** project is placed inside `android` folder and run on **Android Studio** to create file `.apk` for android application. 
    
    In brief, open `android` on **Android Studio** by command

    ```bash
    npm run open:android
    ```
    For installation on devices, just use devices download and run `.apk`.


1. **iOS** project is placed inside `ios` folder and run on **Xcode** to create file .ipa, up to **Appstore** for ios application. 
    
    In brief, open `ios` on **Xcode** by command

    ```bash
    npm run open:ios
    ```
    For up `ios` application to **Appstore**
    
    1. Keep your **Xcode** window after run `npm run open:ios`
    2. Click **folder** icon (Show the Project navigator), it will open main content in the center of the window. 
    3. Click **Signing & Capabilities** tab.
    3. Inside **Signing & Capabilities**, click **All** tab.
    4. Disable **Automatically manage signing**.
    5. Choose your provisioning profile. For example, choose **Pinkast CLICk App Appstore** (This provisioning profile is created only on [Appstore Connect Manager](https://developer.apple.com/account/resources/profiles/list). We created one already).
    6. Next to **Run** icon & **Stop** icon, change target device to **Generic iOS Device**.
    7. Choose **Product** on the super top navigation bar > choose **Archieve**, wait for minutes and a dialog will show up.
    8. Choose latest archived package and click **Distribute App**
    9. Choose **Appstore Connect**
    10. Choose **Upload** and wait for minutes.
    11. Check all options and **Next**
    12. Select your distribution certificate. For example, **(Apple Distribution - Created 8/19/20)**.
    13. Select your profile. For example, **Pinkast CLICk App Appstore** and **Next**.
    14. Click **Upload** for uploading your application to **Appstore Connect**.
    15. Done for developer. Your need to review and fill some related information in order to upload a build to **Appstore**.
   
# License

Follow by [NNG](www.nng.bz)
www.nng.bz
