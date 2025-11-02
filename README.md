# Fitness App Monorepo

This repository contains the complete code for a simple fitness tracker demo:

- **fitness-app-back** – Spring Boot (Java 8) REST API that provides authentication, routes and check-in endpoints.
- **fitness-app-front** – React Native (Expo) client that consumes the API and runs on mobile.

Use this README as the setup guide so anyone who clones the project can get both halves running locally.

## 1. Prerequisites

| Component | Version | Notes |
|-----------|---------|-------|
| Java JDK  | 8       | Required to build/run the backend JAR. |
| Maven (optional)     | 3.6+    | Used for dependency management and packaging the Spring Boot app. |
| Node.js   | 20.x or higher | Required for the Expo/React Native front-end. |
| npm       | 10.x           | Installed automatically with Node.js. |
| Expo CLI  | Bundled locally | You do not need global Expo CLI. Use `npm start` which runs the bundled `expo` version from `package.json`. |

Verify installations:

```bash
java -version
mvn -v
node -v
npm -v
```

## 2. Repository structure

```
fitness-app-AUT-COMP826/
├── fitness-app-back/     # Spring Boot backend project
├── fitness-app-front/    # Expo/React Native frontend project
├── fitness-0.0.1.jar     # pre-built backend jar example
├── .gitignore            # gitignore file
├── .PerformanceTest.py            # back-end API performance test scrip
├── .curl.txt            # login for PerformanceTest.py 
├── .curl2.txt            # signup
├── .curl3.txt            # get routes
└── README.md             # This guide
```


## 3. Backend (java)

### 3.1 Run directly from source

```bash
cd fitness-app-back
mvn spring-boot:run
```

Alternatively, since a pre-built JAR is already included in the root directory (fitness-0.0.1.jar), you can run it directly after ensuring Java 8 is installed:

```bash
java -jar fitness-0.0.1.jar
```
The backend API will be available at: http://localhost:8080￼

### 2.2 Build a runnable JAR

This step is optional, because the jar has already been packaged and put in the root dir named fitness-0.0.1.jar
```bash
cd fitness-app-back
mvn clean package -DskipTests
java -jar target/fitness-0.0.1.jar
```

### 2.3 Default demo accounts

The following users are available out-of-the-box (passwords are `123456`):

- `alice`
- `bob`
- `charlie`

## 3. Frontend (Expo / React Native)

```bash
cd fitness-app-front
npm install
npm start
```

Expo will open a DevTools page. You can run:

- **Press `a` / `i`** – open Android/iOS simulators if available.
- **Download an expo go app** to scan the QR code

> ⚠️  **Note on Expo CLI Usage**  
> This project uses `react-native-maps`, which does not support Web. Please test using Expo Go on a physical device or mobile simulator.

> Recommended: Use Expo Go on a physical Android or iOS device.

### 3.1 Pointing the app at the backend

1. Ensure the backend server is reachable from the device/emulator and note its IP (e.g., `192.168.0.42`).
2. On the login screen tap **“Edit Server Address”**.
3. Enter the IPv4 address (without protocol/port) and tap **Apply**.
4. The value is stored in **AsyncStorage** and reused until changed. All screens (routes, map, history) will call `http://<IP>:8080` afterwards. *(This design is intended to make it easier for demo users to quickly configure their local backend IP during testing.
It is not intended for production use, and should be replaced with a secure and environment-aware configuration in real deployments.)*

### 3.2 Logging in

Use one of the demo accounts listed above or register a new account. After login you can:

- Browse the route catalogue.
- Start a route and check in at checkpoints (persisted to the backend).
- Review past activity in the History screen (sessions grouped into 15-minute windows).
- Access your Profile with stats
- View the Treasures you’ve earned
- logout


## 5. Troubleshooting


⚠️ **Note on AUT Wi-Fi Restrictions**

Due to firewall or NAT settings, the **AUT campus Wi-Fi does not support Expo Go** development mode over LAN.

This means:
- **Scanning the QR code using Expo Go will not work** on AUT Wi-Fi.
- You may experience timeout or infinite loading when trying to load the app.

✅ **Workarounds**:
1. **Use your mobile hotspot** as the network for both your computer and phone.
2. Or test at home or on an open Wi-Fi that allows local LAN traffic.

✅ This issue has been confirmed in testing.

| Issue | Fix |
|-------|-----|
| Frontend cannot reach backend | Confirm backend IP/port, device is on same network, and server IP in login screen matches.|
| `mvn`/`java` command not found | Install JDK8 and Maven, then reopen the terminal. |
| Expo fails to install packages | Delete `fitness-app-front/node_modules`, run `npm install` again. |
| JWT 401 errors after inactivity | Log out (Dashboard → Logout) and log back in; tokens are cleared automatically. |

For deeper backend config (DB, logging, ports), edit `fitness-app-back/src/main/resources/application.yml` or supply overrides when running the jar.

> ℹ️ **Note on Expo CLI Usage**  
> This project uses the locally installed Expo CLI via `npm start`.  
> Avoid installing Expo globally (`npm install -g expo-cli`) unless you have a specific need.  
> Node.js version **20.x or higher** is required to ensure compatibility with the latest Expo SDK.
