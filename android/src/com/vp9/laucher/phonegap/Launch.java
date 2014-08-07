package com.vp9.laucher.phonegap;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.LOG;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;

import com.vp9.tv.MainActivity;
//import android.util.Log;
//import android.widget.Toast;
//import android.widget.Toast;

public class Launch extends CordovaPlugin {

	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		LOG.d("Launch", "------------ " + args.toString());
		if(action.equals("app")){
			try {
				
				String appPackage = args.getJSONObject(0).getString("package").trim();
				String appActivity= args.getJSONObject(0).getString("activity").trim();
				String appType = "";
				String appServer = "";
				String appChannelNumber = "";
				
				if(args.getJSONObject(0).has("type")){
					appType= args.getJSONObject(0).getString("type").trim();
				}
				if(args.getJSONObject(0).has("server")){
					appServer= args.getJSONObject(0).getString("server").trim();
				}
				if ("tivi".equals(appType)) {
					if(args.getJSONObject(0).has("channelNumber")){
						appChannelNumber= args.getJSONObject(0).getString("channelNumber").trim();
					}
				}

				
				
//				Toast.makeText(this.cordova.getActivity(), appPackage + " - " + appActivity + " - " + appType, Toast.LENGTH_LONG).show();
				//Log.e("TAG " + this.getClass().getSimpleName(), appPackage + "-" + appActivity) ;
				
				/*Intent intent = this.cordova.getActivity().getPackageManager().getLaunchIntentForPackage(appPackage);
				intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				this.cordova.getActivity().startActivity(intent);*/
				
				if(appActivity.equals(".MainActivity") && appPackage.equals("com.vp9.tv")){
		            Intent intents = new Intent(this.cordova.getActivity().getBaseContext(), MainActivity.class);
		            intents.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		            intents.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
		            intents.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
					Bundle b = new Bundle();
					if (appType != null && appType != "") {
						b.putString("type",appType);
					}
					
					if (appServer != null && appServer != "") {
						b.putString("server",appServer);
					}
					
					if (appChannelNumber != "" && appChannelNumber != null) {
						b.putString("channelNum", appChannelNumber);
					}
					intents.putExtra("start", b);
		            this.cordova.getActivity().startActivity(intents);

				}else{
					ComponentName name=new ComponentName(appPackage,
							appActivity);
					Intent i=new Intent(Intent.ACTION_MAIN);
					
					i.addCategory(Intent.CATEGORY_LAUNCHER);
					i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK |
					Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
					i.setComponent(name);

					this.cordova.getActivity().startActivity(i);    
				}
				
				
						
				
//				callbackContext.success(new JSONObject().put("returnVal", "Success Launch"));
				
			} catch (Exception e) {
//				Log.e("TAG " + this.getClass().getSimpleName() , "Exception: " + e.getMessage()) ;
//				Toast.makeText(this.cordova.getActivity(), "Exception" , Toast.LENGTH_LONG).show();

				
				String appPackage = args.getJSONObject(0).getString("package").trim();
				String appActivity = args.getJSONObject(0).getString("activity").trim();
				String appType = "";
				String appServer = "";
				String appChannelNumber = "";
				
				if(args.getJSONObject(0).has("type")){
					appType= args.getJSONObject(0).getString("type").trim();
				}
				if(args.getJSONObject(0).has("server")){
					appServer= args.getJSONObject(0).getString("server").trim();
				}
				
				if ("tivi".equals(appType)) {
					if(args.getJSONObject(0).has("channelNumber")){
						appChannelNumber= args.getJSONObject(0).getString("channelNumber").trim();
					}
				}
				
				if (appActivity.substring(0, 1).indexOf(".") < 0) {
					appActivity = "." + appActivity;
				}
				
				
//				Toast.makeText(this.cordova.getActivity(), appPackage + " - " + appActivity + " - " + appType, Toast.LENGTH_LONG).show();

				ComponentName name=new ComponentName(appPackage,appPackage+appActivity);
				Intent i=new Intent(Intent.ACTION_MAIN);
				
				i.addCategory(Intent.CATEGORY_LAUNCHER);
				i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK |
				Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
				i.setComponent(name);
				
//				Bundle b = new Bundle();
//				if (appType != null && appType != "") {	
//					b.putString("type",appType);
//				}
//				if (appServer != null && appServer != "") {
//					b.putString("server",appServer);
//				}
//				if (appChannelNumber != "" && appChannelNumber != null) {
//					b.putString("channelNum", appChannelNumber);
//				}
//				
//				i.putExtra("start", b);
				
				this.cordova.getActivity().startActivity(i);   
//				callbackContext.error(new JSONObject().put("returnVal", "Fail Launch"));
			}
		}

		if(action.equals("setting")){
			String appSettings = args.getJSONObject(0).getString("setting");
			
			if(appSettings.equals("accessability")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS));		
			}else if(appSettings.equals("addaccount")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_ADD_ACCOUNT));		
			}else if(appSettings.equals("airplanemode")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_AIRPLANE_MODE_SETTINGS));		
			}else if(appSettings.equals("apn")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_APN_SETTINGS));		
			}else if(appSettings.equals("appdetails")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS));		
			}else if(appSettings.equals("appdevelopment")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_APPLICATION_DEVELOPMENT_SETTINGS));		
			}else if(appSettings.equals("apps")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_APPLICATION_SETTINGS));		
			}else if(appSettings.equals("bluetooth")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_BLUETOOTH_SETTINGS));		
			}else if(appSettings.equals("dataroaming")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_DATA_ROAMING_SETTINGS));		
			}else if(appSettings.equals("date")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_DATE_SETTINGS));		
			}else if(appSettings.equals("deviceinfo")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_DEVICE_INFO_SETTINGS));		
			}else if(appSettings.equals("display")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_DISPLAY_SETTINGS));		
			}else if(appSettings.equals("inputmethod")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_INPUT_METHOD_SETTINGS));		
			}else if(appSettings.equals("inputmethodsubtype")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_INPUT_METHOD_SUBTYPE_SETTINGS));		
			}else if(appSettings.equals("internalstorage")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_INTERNAL_STORAGE_SETTINGS));		
			}else if(appSettings.equals("locale")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_LOCALE_SETTINGS));		
			}else if(appSettings.equals("locationsource")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS));		
			}else if(appSettings.equals("manageallapps")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_MANAGE_ALL_APPLICATIONS_SETTINGS));		
			}else if(appSettings.equals("manageapps")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_MANAGE_APPLICATIONS_SETTINGS));		
			}else if(appSettings.equals("memorycard")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_MEMORY_CARD_SETTINGS));		
			}else if(appSettings.equals("networkoperator")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_NETWORK_OPERATOR_SETTINGS));		
			}else if(appSettings.equals("nfcsharing")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_NFCSHARING_SETTINGS));		
			}else if(appSettings.equals("nfc")){
//				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_NFC_SETTINGS));		
			}else if(appSettings.equals("privacy")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_PRIVACY_SETTINGS));		
			}else if(appSettings.equals("quicklaunch")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_QUICK_LAUNCH_SETTINGS));		
			}else if(appSettings.equals("search")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_SEARCH_SETTINGS));		
			}else if(appSettings.equals("security")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_SECURITY_SETTINGS));		
			}else if(appSettings.equals("sound")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_SOUND_SETTINGS));		
			}else if(appSettings.equals("sync")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_SYNC_SETTINGS));		
			}else if(appSettings.equals("userdictionary")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_USER_DICTIONARY_SETTINGS));		
			}else if(appSettings.equals("wifiip")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_WIFI_IP_SETTINGS));		
			}else if(appSettings.equals("wifi")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_WIFI_SETTINGS));			
			}else if(appSettings.equals("wireless")){
				this.cordova.getActivity().startActivity(new Intent(Settings.ACTION_WIRELESS_SETTINGS));	
			}else if(appSettings.equals("battery")){
				this.cordova.getActivity().startActivity(new Intent(Intent.ACTION_POWER_USAGE_SUMMARY));				
			}
		}

		return true;
	}
}
