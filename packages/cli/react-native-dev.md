curl 'http://localhost:8081/' --head \
-H 'Host: localhost:8081' \
-H 'expo-platform: ios' \
-H 'Expo-Dev-Client-ID: 739C3EF3-C848-4B1F-B0B4-4D658CEE389B' \
-H 'Accept: */*' \
-H 'User-Agent: myapp/1 CFNetwork/1390 Darwin/22.2.0' \
-H 'Accept-Language: en-US,en;q=0.9' \
-H 'Connection: keep-alive' \
--proxy http://localhost:9090

HTTP/1.1 200 OK
Exponent-Server: [object Object]
Date: Tue, 17 Jan 2023 06:45:14 GMT
Connection: keep-alive
Keep-Alive: timeout=5

---

curl 'http://localhost:8081/' \
-H 'Host: localhost:8081' \
-H 'Expo-Release-Channel: default' \
-H 'Accept: multipart/mixed,application/expo+json,application/json' \
-H 'Expo-Dev-Client-ID: 739C3EF3-C848-4B1F-B0B4-4D658CEE389B' \
-H 'Accept-Language: en-US,en;q=0.9' \
-H 'Connection: keep-alive' \
-H 'Expo-Updates-Environment: DEVELOPMENT' \
-H 'Expo-SDK-Version: 47.0.0' \
-H 'Expo-API-Version: 1' \
-H 'Expo-Accept-Signature: false' \
-H 'Expo-JSON-Error: true' \
-H 'User-Agent: myapp/1 CFNetwork/1390 Darwin/22.2.0' \
-H 'Expo-Platform: ios' \
-H 'EAS-Client-ID: 6EAC1EDF-B519-4A55-8D86-4F1757E5017A' \
--proxy http://localhost:9090

HTTP/1.1 200 OK
Exponent-Server: [object Object]
Date: Tue, 17 Jan 2023 06:45:14 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 1564

{"name":"myapp","slug":"myapp","scheme":"myapp","version":"1.0.0","jsEngine":"jsc","orientation":"portrait","icon":"./assets/icon.png","userInterfaceStyle":"light","splash":{"image":"./assets/splash.png","resizeMode":"contain","backgroundColor":"#ffffff","imageUrl":"http://127.0.0.1:8081/assets/./assets/splash.png"},"updates":{"fallbackToCacheTimeout":0},"assetBundlePatterns":["**/*"],"ios":{"supportsTablet":true,"bundleIdentifier":"com.natew.myapp"},"android":{"package":"com.tamagui.myapp","adaptiveIcon":{"foregroundImage":"./assets/adaptive-icon.png","backgroundColor":"#FFFFFF","foregroundImageUrl":"http://127.0.0.1:8081/assets/./assets/adaptive-icon.png"}},"web":{"favicon":"./assets/favicon.png"},"extra":{"eas":{"projectId":"061b4470-78c7-4d6a-b850-8167fb0a3434"}},"_internal":{"isDebug":false,"projectRoot":"/Users/n8/tamagui/apps/kitchen-sink","dynamicConfigPath":null,"staticConfigPath":"/Users/n8/tamagui/apps/kitchen-sink/app.json","packageJsonPath":"/Users/n8/tamagui/apps/kitchen-sink/package.json"},"sdkVersion":"47.0.0","platforms":["ios","android","web"],"iconUrl":"http://127.0.0.1:8081/assets/./assets/icon.png","debuggerHost":"127.0.0.1:8081","logUrl":"http://127.0.0.1:8081/logs","developer":{"tool":"expo-cli","projectRoot":"/Users/n8/tamagui/apps/kitchen-sink"},"packagerOpts":{"dev":true},"mainModuleName":"index","__flipperHack":"React Native packager is running","hostUri":"127.0.0.1:8081","bundleUrl":"http://127.0.0.1:8081/index.bundle?platform=ios&dev=true&hot=false","id":"@anonymous/myapp-473c4543-3c36-4786-9db1-c66a62ac9b78"}
