# Welcome to the FEAGI App

## KAT INTRO 😸

GIT READY TO LEARN 📚 Every struggle is a lesson...

This boilerplate app has been created from React Native x Expo documentation. (Expo is the standard framework for React Native.)

Let's get started!

- You will need [Node](https://nodejs.org/en) installed.

- Run `npm install -g eas-cli`

- Sign up for a free Expo account: https://expo.dev/signup

- Run `eas login`

- Run `npm install`

- Coding for iPhone:

  - The React Native docs say that the iOS simulator requires a Mac, but you can also use an external iOS device like an iPhone. If you don't have access to an Apple device, skip to "Coding for Android" below.
  - Mac: In XCode, make sure you have Command Line Tools enabled under the Locations tab
  - Mac: React Native highly recommends installing Watchman for better performance: `brew install watchman`
  - iPhone: You DO NOT need an Apple Developer Program account to test the app on your phone. All you need is to install the Expo Go app and sign in to your account. Then, run `npx expo start` in this codebase and select Expo Go in the terminal. Scan the QR code with your phone and choose to open with Expo Go.
  - Note, when using the simulator, it's best to go with the development build, which is intended for production grade apps.

- Coding for Android:

  - If you don't have access to an Apple device, focus on the Android app (unless you can find a workaround for iOS simulation on Windows/Linux, which is probable).

  - Broadly follow the [starter guide](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=development-build), but make sure to keep it within this unified codebase (some of these steps are only for initializing, which we've already done). Expo supports Android and iOS in the same codebase -- that's the beauty of React Native!

- BOTH: Run `npx expo start`. In the output, you'll find options to open the app in a

  - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
  - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
  - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
  - [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Start Developing

- You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

- Continue with next steps at Expo's [Start Developing](https://docs.expo.dev/get-started/start-developing/)

- If you prefer, you can create a simple practice app by following [this Expo guide](https://docs.expo.dev/tutorial/introduction/). It may be a detour, but not a bad idea if you get stuck.

- When you begin coding the app, you can learn React Native from the lovely docs: https://reactnative.dev/docs/getting-started

## Get a fresh project

If you want to remove the Expo starter code, you can run the following command. It will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

```bash
npm run reset-project
```

## Hot Tip ❗

Always assume there is a way to do what you want. React Native is used by millions of developers worldwide, and for apps as major as Discord.

For example, you can simulate pinching in the iOS simulator with option + drag. There are libraries for all sorts of functionalities. Before you give up on something or recreate the wheel, Google, talk to chatbots, and see if what you want already exists.

## Troubleshooting

- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions
- Claude.ai, ChatGPT, etc., can be helpful in a pinch
- If you're struggling to get the initial codebase up and running, try creating a separate practice skeleton by following the [steps](https://reactnative.dev/docs/environment-setup) that I followed to create this codebase. You may identify some missing packages, or at least get some more context.
