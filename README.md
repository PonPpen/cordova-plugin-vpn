---
title: VPN
description: 深信服vpn插件.
---

## Installation

**Example**
```js
/**
 * vpn 拨号登录
 * @description  vpnUserName vpn账号
 * @description  vpnPassword vpn密码
 * @description  vpnUrl vpn地址
 */
window.plugins.vpnPlugin.auth((result) => {
}, (err) => {
}, vpnUserName, vpnPassword, vpnUrl);

//vpn 登出
window.plugins.vpnPlugin.logout((result)=> {
}, (err)=> {
});

//vpn 检测 【vpn在线、vpn离线】
window.plugins.vpnPlugin.vpnStatus((result)=> {
}, (err)=> {
    observer.next(err);
});

**TIP**
cordova-plugin-android-permissions  添加安卓权限