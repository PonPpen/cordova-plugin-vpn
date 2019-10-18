package plugin.vpn;

import android.content.Intent;
import com.sangfor.ssl.*;
import com.sangfor.ssl.common.ErrorCode;
import com.sangfor.ssl.service.utils.logger.Log;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONException;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;


public class VpnPlugin extends CordovaPlugin implements LoginResultListener {

    private CallbackContext callbackContext;
    private SangforAuthManager mSFManager = null;
    //主认证默认采用用户名+密码方式
    private VPNMode mVpnMode = VPNMode.EASYAPP;  //默认开启L3VPN模式 、EASYAPP模式

    private URL mVpnAddressURL = null;

    @Override
    public boolean execute(String action, CordovaArgs args, final CallbackContext callbackContext) throws JSONException {

        this.callbackContext = callbackContext;
        if (action.equals("auth")) {


            final String userName = args.getString(0);
            final String passWord = args.getString(1);
            final String vpnUrl = args.getString(2);

            if (this.mSFManager == null) {
                this.mSFManager = SangforAuthManager.getInstance();// 2.设置VPN认证结果回调
            }
            try {
                mSFManager.setLoginResultListener(this);
            } catch (SFException e) {
                Log.info("vpn", "SFException:%s", e);
            }
            mSFManager.setAuthConnectTimeOut(3);//登录超时时间
            List<String> whiteList = new ArrayList<String>();
            // whiteList.add(app.App.getMetaData(cordova.getActivity(), "VPN_PACKAGE_NAME"));
            // mSFManager.addAllowedL3VPNApps(whiteList);//应用加入白名单
            //String vpnUrl = app.App.getMetaData(cordova.getActivity(), "VPN_URL");
            try {
//                if (!vpnUrl.startsWith("https://")) { //vpn地址是否是以https开头，不以https开头时，为其添加https
//                    int index = vpnUrl.indexOf("//");
//                    if (index == -1) {//没有协议头的情况下添加https协议头
//                        vpnUrl = "https://" + vpnUrl;
//                    } else {
//                        Log.info("vpn", "登录失败，url必须以https开头");
//                        return false;
//                    }
//                }
                //将地址字符串封装成url
                mVpnAddressURL = new URL(vpnUrl);


                cordova.getActivity().runOnUiThread(new Runnable() {
                    public void run() {
                        try {
                            cordova.setActivityResultCallback(VpnPlugin.this);
                            PluginResult pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
                            pluginResult.setKeepCallback(true);
                            VpnPlugin.this.callbackContext.sendPluginResult(pluginResult);
                            mSFManager.startPasswordAuthLogin(cordova.getActivity().getApplication(),
                                    cordova.getActivity(), mVpnMode, mVpnAddressURL, userName, passWord);

                        } catch (SFException e) {
                            e.printStackTrace();
                            VpnPlugin.this.callbackContext.error("vpn登录失败3");
                        }
                    }

                });
                return true;

            } catch (MalformedURLException e) {
                Log.info("vpn", "登录失败，无效的URL");
                return false;
            }

        } else if (action.equals("logout")) {

            cordova.getActivity().runOnUiThread(new Runnable() {
                public void run() {
                    SangforAuthManager.getInstance().vpnLogout();
                    VpnPlugin.this.callbackContext.success();
                }

            });
            return true;
        }else if(action.equals("vpnStatus")){
            String s = getVpnStatus();
            VpnPlugin.this.callbackContext.success(s);
            return true;
        }
        return false;
    }

    public String getVpnStatus(){
        String status = "";
        VPNStatus vpnStatus = SangforAuthManager.getInstance().queryStatus();
        switch (vpnStatus){
            case VPNONLINE:
                status = "vpn在线";
                break;
            case VPNOFFLINE:
                status = "vpn离线";
                break;
        }
        return status;
    } 



    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        switch (requestCode) {

            case IVpnDelegate.REQUEST_L3VPNSERVICE:
                /* L3VPN模式下下必须回调此方法
                 * 注意：当前Activity的launchMode不能设置为 singleInstance，否则L3VPN服务启动会失败。
                 */
                mSFManager.onActivityResult(requestCode, resultCode);
                break;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }


    @Override
    public void onLoginFailed(ErrorCode errorCode, String errorStr) {
        //停止登录进度框
        PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR,errorStr);
        pluginResult.setKeepCallback(false);
        this.callbackContext.sendPluginResult(pluginResult);
        Log.info("vpn", "登录失败");
    }

    /**
     * 登录进行中回调接口
     *
     * @param nextAuthType 下次认证类型
     *                     组合认证时必须实现该接口
     */
    @Override
    public void onLoginProcess(int nextAuthType, BaseMessage message) {
        Log.info("vpn", "登录进行中");

    }

    /**
     * 登录成功回调
     */
    @Override
    public void onLoginSuccess() {
        Log.info("vpn", "登录进行中");
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK);
        pluginResult.setKeepCallback(false);
        this.callbackContext.sendPluginResult(pluginResult);
    }
}