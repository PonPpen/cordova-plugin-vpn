#!/usr/bin/env node
var rootdir          = process.cwd(),
    shell            = require("shelljs"),
    path             = require("path"),
    space            = " ",
    androidroot      = path.join(rootdir, "platforms/android"),
    replace          = require(path.join(rootdir, "scripts/text/replace-text")),
    currentProject   = require(path.join(rootdir, "huatech", "current-project")),
    projectConfig    = require(path.join(rootdir, "huatech", currentProject.name, "project-config")),
    priProjectConfig = require(path.join(rootdir, "huatech", currentProject.lastPrepare, "project-config")),
    plugins          = projectConfig.plugins,
    exec             = require('child_process').execSync,
    manifestFile     = path.join(rootdir, "platforms/android/AndroidManifest.xml"),
    appFile          = path.join(rootdir, "platforms/android/src/app/App.java")

function configRong() {
    console.log("configRong start...");
    //注册插件信息
    var imkitManifestFile = path.join(rootdir, "platforms/android/IMKIT/src/main/AndroidManifest.xml")
    var configXmlFile = path.join(rootdir, "platforms/android/res/xml/config.xml");
    var appendContent = path.join(rootdir, "scripts/text/androidAppendConfigContent");
    var rongCloudFile1 = path.join(rootdir, "platforms/android/src/io/rong/fast/activity/ConversationActivity.java");
    var rongCloudFile2 = path.join(rootdir, "platforms/android/src/io/rong/fast/activity/ConversationListActivity.java");
    var rongCloudFile3 = path.join(rootdir, "platforms/android/src/io/rong/fast/activity/SubConversationListActivtiy.java");


    //RONG_CLOUD_APP_KEY APPSECRET
    replace.replace_string_in_file(configXmlFile, ".*ConfigXmlAppendPlaceHolder.*", shell.cat(appendContent));
    replace.replace_string_in_file(imkitManifestFile, ".*RONG_CLOUD_APP_KEY.*", "<meta-data android:name=" + '"'
        + "RONG_CLOUD_APP_KEY" + '"' + " android:value=" + '"' + plugins.rongCloud.RONG_CLOUD_APP_KEY + '"' + "/>");
    replace.replace_string_in_file(imkitManifestFile, ".*APPSECRET.*", "<meta-data android:name=" + '"' + "APPSECRET"
        + '"' + " android:value=" + '"' + plugins.rongCloud.APPSECRET + '"' + "/>");
    replace.replace_string_in_file(imkitManifestFile, priProjectConfig.packageName, projectConfig.packageName);
    replace.replace_string_in_file(manifestFile, ".*SERVICEURL.*", "<meta-data android:name=" + '"' + "SERVICEURL" + '"' + " android:value=" + '"'
        + projectConfig.login.req_out_protocal + "://" + projectConfig.login.req_out_ip + ":" + projectConfig.login.req_out_port + "/"
        + projectConfig.login.eipms_out_context + "/" + "rongcloud" + '"' + "/>");
    replace.replace_string_in_file(manifestFile, priProjectConfig.packageName, projectConfig.packageName);
    replace.replace_string_in_file(rongCloudFile1, priProjectConfig.packageName, projectConfig.packageName);
    replace.replace_string_in_file(rongCloudFile2, priProjectConfig.packageName, projectConfig.packageName);
    replace.replace_string_in_file(rongCloudFile3, priProjectConfig.packageName, projectConfig.packageName);

    console.log("configRong done...");


    //replace.replace_string_in_file(manifestFile, "host=\".*\".*android:pathPrefix", "host="+'"'+projectConfig.packageName +'" '+" "+"android:pathPrefix" );
    //replace.replace_string_in_file(imkitManifestFile, "host=\".*\".*", "host="+'"'+projectConfig.packageName +'" ' );
    // replace.replace_string_in_file(rongCloudFile1, ".*//line-package-name-to-be-replaced","import " +projectConfig.packageName+".R;//line-package-name-to-be-replaced");
    // replace.replace_string_in_file(rongCloudFile2, ".*//line-package-name-to-be-replaced","import " +projectConfig.packageName+".R;//line-package-name-to-be-replaced");
    // replace.replace_string_in_file(rongCloudFireplace.replace_string_in_file(rongCloudFile1, ".*//line-package-name-to-be-replaced","import " +projectConfig.packageName+".R;//line-package-name-to-be-replaced");
}

function configMtj() {
    console.log("configMtj start...");
    replace.replace_string_in_file(manifestFile, ".*BaiduMobAd_STAT_ID.*", "<meta-data android:name=" + '"' + "BaiduMobAd_STAT_ID" + '"' + " android:value=" + '"' + plugins.mtj.BaiduMobAd_STAT_ID + '"' + "/>");
    replace.replace_string_in_file(manifestFile, ".*BaiduMobAd_CHANNEL.*", "<meta-data android:name=" + '"' + "BaiduMobAd_CHANNEL" + '"' + " android:value=" + '"' + plugins.mtj.BaiduMobAd_CHANNEL + '"' + "/>");
    console.log("configMtj done...");
}

function configJPush() {
    console.log("configJPush start...");
    replace.replace_string_in_file(manifestFile, ".*JPUSH_APPKEY.*", "<meta-data android:name=" + '"' + "JPUSH_APPKEY" + '"' + " android:value=" + '"' + projectConfig.plugins.jPush.JPUSH_APPKEY + '"' + "/>");
    console.log("configJPush done...");

}

function configVpn() {
    console.log("configVpn start...");
    replace.replace_string_in_file(manifestFile, ".*VPN_URL.*", "<meta-data android:name=" + '"' + "VPN_URL" + '"' + " android:value=" + '"' + projectConfig.plugins.vpn.VPN_URL + '"' + "/>");
    replace.replace_string_in_file(manifestFile, ".*VPN_PACKAGE_NAME.*", "<meta-data android:name=" + '"' + "VPN_PACKAGE_NAME" + '"' + " android:value=" + '"' + projectConfig.plugins.vpn.VPN_PACKAGE_NAME + '"' + "/>");
    console.log("configVpn done...");

}

function configOther() {
    console.log("configOther start...");
    var pluginAndroidJsonFile = path.join(rootdir, "plugins/android.json");
    var androidJsonFile = path.join(rootdir, "platforms/android/android.json");

    replace.replace_string_in_file(pluginAndroidJsonFile, priProjectConfig.packageName, projectConfig.packageName);
    replace.replace_string_in_file(androidJsonFile, priProjectConfig.packageName, projectConfig.packageName);
    console.log("configOther done...");

}

function configBugly() {
    console.log("configBugly start...");
    replace.replace_string_in_file(appFile, "CrashReport.initCrashReport.*", "CrashReport.initCrashReport(getApplicationContext()," + '"' + projectConfig.plugins.bugly.APP_ID + '"' + ", false);");
    console.log("configBugly done...");

}

//www 目录下的图片要放
function prepareIconsAndSplash() {
    console.log("prepareIconsAndSplash start ..");
    //var wwwBaseImgSource = path.join(rootdir, "huatech", currentProject.name, "huatech/base/resource/android/img");
    var wwwImgSource = path.join(rootdir, "huatech", currentProject.name, "android/resource/img");
    var wwwImgTarget = path.join(rootdir, "www");

    //shell.cp("-Rf", wwwBaseImgSource , wwwImgTarget);
    shell.cp("-Rf", wwwImgSource, wwwImgTarget);
    console.log("prepareIconsAndSplash done ..");
}


function main() {

}

main();
