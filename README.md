# Psnine
Psnine第三方安卓和iOS客户端, 基于React Native、Redux

<a href="https://play.google.com/store/apps/details?id=com.psnine"><img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" width="175px" align="center"></a><a href="https://itunes.apple.com/cn/app/psnine/id1279618123"><img src="art/store.svg" width="155px" align="center"></a>

# Features
- 支持PSNINE网站的所有功能
- 支持自动签到、消息快捷回复、图片快捷插入、拍摄图片直传、非WIFI环境懒加载图片等功能
- 支持过滤DNS劫持广告
- 支持主题的切换, 可以切换19种主题颜色, 以及对应的强调色和夜间主题

# Screenshots
<a href="art/1.gif"><img src="art/1.gif" width="32%"/></a>
<a href="art/2.gif"><img src="art/2.gif" width="32%"/></a>
<a href="art/3.gif"><img src="art/3.gif" width="32%"/></a>

# Download

## Android
- [Google Play][play link]
- [fir.im][fir link]

## iOS
- [Apple Store](https://itunes.apple.com/cn/app/psnine/id1279618123)

# Changelog
- [更新历史](./CHANGELOG.md)

# Todo
- [ ] 重构 (1.0.0)
  - [ ] react-native-navigation
  - [x] react-native-interactable (IOS)
  - [x] collapse-toolbar-layout (Android)
  - [x] coordinator-layout (Android)
  - [x] nested-scroll-view (Android)
  - [x] react-native-fs
  - [x] react-native-share
  - [x] react-native-snackbar
  - [x] react-native-photo-view
  - [x] react-native-image-picker
  - [x] react-native-vector-icons
  - [x] react-native-splash-screen
  - [x] react-native-linear-gradient
  - [x] react-native-google-analytics-bridge
- [x] 兼容
  - [x] iOS
  - [x] 安卓从5.0兼容至4.1

# Development
```
git clone https://github.com/smallpath/psnine.git
cd psnine
npm install --registry=https://registry.npm.taobao.org
```
下载 [psnine-patcher](https://github.com/smallpath/psnine-patcher) , 并将其中所有内容全部拷贝至`node_modules`

## Android
> 前置: Android Studio, SDK Platform 23 ~ 26, SDK Build-Tools 23.0.1、23.0.3、25.0.0、25.0.2、26.0.0、26.0.1

```
react-native run-android // for development
cd android && ./gradlew assembleRelease  // for release
```

## iOS
> 前置: XCode

```
react-native run-ios // for development
react-native run-ios --configuration Release // for release
```

# Statement
该项目已取得Psnine官方的第三方应用授权

# Contribution
如果发现了漏洞或者需要新功能, 请在本仓库新建issue, 也可联系邮箱`smallpath2013@gmail.com`

# License
```
Copyright (C) 2017 smallpath

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

[play badge]: https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png
[play link]: https://play.google.com/store/apps/details?id=com.psnine
[fir link]: https://fir.im/mf24