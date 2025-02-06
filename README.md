# FEAGI Mobile App

## 🏞️ Overview

Your objective is to build a simple React Native phone app that can display the Brain Visualizer with an active FEAGI instance.

It should be able to transmit phone-specific inputs to the FEAGI instance, such as webcam feed and accelerometer.

It should have dropdowns from a hamburger menu that allow users to edit settings.

_Ideally_, two functionally identical apps will be built: one for iPhone, and one for Android. The app should also display correctly on tablets.

## 🧰 Resources

- You can view project files in [this](https://drive.google.com/drive/folders/1M7GgSg09hMdSc9r305FQSnyVuaY4O54f) Google Drive folder.

- Check out SETUP.md for getting started with the codebase.

## 🤝 Cooperative Element

Rather than building a fullstack app, you are implementing the frontend and sending/receiving data to/from a separate backend. You will need to communicate with Nadji to know which API endpoints to call, what data to pass, and what responses to expect. This reflects a common industry separation between frontend and backend development teams.

## 📱 Requirements

- A phone app that runs properly on iPhone or Android (ideally both)

### Technology

- [React Native](https://reactnative.dev/)
- Expo (React Native framework)
- To display FEAGI, you can use the [Webview](https://github.com/react-native-webview/react-native-webview) library
- Git/Github
- Your IDE of choice (Visual Studio Code, etc.)

### Screens/Views & UI

Reference the UI/UX PDF in the aforementioned Drive folder for details.

- [ ] Home/loading screen
- [ ] "Plug In" screen
- [ ] Network Configuration screen
- [ ] BM (Brain Monitor) screen
- [ ] Hamburger menu at top of app
- [ ] Settings dropdowns from hamburger
- [ ] Responsive: works on different viewports, and in both portrait & landscape mode


### End Users/Use Cases

- As an AI/ML engineer using FEAGI to develop a robot control system, I want a simple and handy tool to monitor and tune the model during runtime.
- As a robot operator using FEAGI to control a robot, I want a simple and portable tool that allows for manual and versatile overrides during robot operations.
- As a robot hobbyist, I want a simple-to-use mobile app that enables me to play with robots.


### Functionality

- [ ] Display a FEAGI instance running in the playground or NRS (should support both)
- [ ] Get and transmit phone sensor data to FEAGI instance: webcam, gyroscope, accelerometer
- [ ] Allow user to edit settings and transmit their changes to backend

### Nice to Have (not required)

- [ ] Functionally identical apps for both iPhone & Android
- [ ] Light/dark mode

## 🏁 Milestones

- [ ] Get the initial codebase up and running on a local simulator or phone
- [ ] Add all views from the mockup
- [ ] Get the BV running a remote FEAGI instance
- [ ] Add the hamburger menu and settings dropdowns
- [ ] Communicate settings changes to the backend
- [ ] Communicate phone sensor data to the backend

## ✅ Deliverables

- [ ] Complete the phone app
- [ ] Create a simple FEAGI genome of any kind
- [ ] Write a technical blog about the experience ([examples](https://neurorobotics.studio/blog))
