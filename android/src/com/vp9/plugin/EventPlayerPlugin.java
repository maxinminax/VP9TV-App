package com.vp9.plugin;

import java.util.ArrayList;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import com.vp9.player.model.ChangeSubtitle;
import com.vp9.tv.VpMainActivity;
import com.vp9.util.ParamUtil;

public class EventPlayerPlugin extends CordovaPlugin {
	
	public static final String TAG = "EventPlayerPlugin";
	
	public static final String ACTION_BIND_EVENT_PLAYER_LISTENER = "ACTION_BIND_EVENT_PLAYER_LISTENER";
	
	public static final String ACTION_SET_START_VIDEO = "ACTION_SET_START_VIDEO";
	
	public static final String ACTION_SET_SHOW_EPG = "ACTION_SET_SHOW_EPG";
	
	public static final String ACTION_SET_CLOSE_EPG = "ACTION_SET_CLOSE_EPG";
	
	public static final String ACTION_SET_PLAY_VIDEO = "ACTION_SET_PLAY_VIDEO";
	
	public static final String ACTION_SET_PAUSE_VIDEO = "ACTION_SET_PAUSE_VIDEO";
	
	public static final String ACTION_SET_STOP_VIDEO = "ACTION_SET_STOP_VIDEO";
	
	public static final String ACTION_SET_CHANGE_SUBTITLE_VIDEO = "ACTION_SET_CHANGE_SUBTITLE_VIDEO";
	
	public static final String ACTION_SET_RESEND_INFORMATION = "ACTION_SET_RESEND_INFORMATION";
	
	public static final String ACTION_SET_SEEK_VIDEO = "ACTION_ADD_LISTENER";
	
	public static final String ACTION_ADD_PLAYER_LISTENER = "ACTION_ADD_PLAYER_LISTENER";
	
	public static final String ACTION_SET_FULL_SCREEN = "ACTION_SET_FULL_SCREEN";
	
	public static final String ACTION_SET_SCREEN_ORIENTATION = "ACTION_SET_SCREEN_ORIENTATION";
	
	public CallbackContext listenerCallbackContext;

	public EventPlayerPlugin(){
		super();
		Log.d(TAG, "Constructing EventPlayerPlugin");
	}
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    	Log.e(TAG, "execute: " + action + "/" + args);
    	if (ACTION_BIND_EVENT_PLAYER_LISTENER.equals(action)){
    		return bindListener(args, callbackContext);
    	} else if (ACTION_SET_START_VIDEO.equals(action)){
    		return startVideo(args, callbackContext);
    	} else if (ACTION_SET_SHOW_EPG.equals(action)){
    		return showEPG(args, callbackContext);
    	} else if (ACTION_SET_CLOSE_EPG.equals(action)){
    		return closeEPG(args, callbackContext);
    	}else if(ACTION_SET_PLAY_VIDEO.equals(action)){
    		return playVideo(args, callbackContext);
    	}else if(ACTION_SET_PAUSE_VIDEO.equals(action)){
    		return pauseVideo(args, callbackContext);
    	}else if(ACTION_SET_STOP_VIDEO.equals(action)){
    		return stopVideo(args, callbackContext);
    	}else if(ACTION_SET_SEEK_VIDEO.equals(action)){
    		return seekVideo(args, callbackContext);
    	}else if(ACTION_SET_CHANGE_SUBTITLE_VIDEO.equals(action)){
    		return changeSubtitleVideo(args, callbackContext);
    	}else if(ACTION_SET_RESEND_INFORMATION.equals(action)){
    		return resendInfoVideo(args, callbackContext);
    	}else if(ACTION_ADD_PLAYER_LISTENER.equals(action)){
    		return addListener(args, callbackContext);
    	}else if(ACTION_SET_FULL_SCREEN.equals(action)){
    		return changeDisplayScreen(args, callbackContext);
    	}else if(ACTION_SET_SCREEN_ORIENTATION.equals(action)){
    		return changeScreenOrientation(args, callbackContext);
    	}
    	
    	
    	return false;
    }
    
	private boolean changeScreenOrientation(JSONArray args,
			CallbackContext callbackContext) {
    	VpMainActivity vpMainActivity = (VpMainActivity) cordova;
    	if(vpMainActivity != null && args != null && args.length() > 0){
    		try {
				JSONObject json = args.getJSONObject(0);
				String orientation = json.getString("orientation");
				vpMainActivity.changeScreenOrientation(orientation);
				return true;
			} catch (JSONException e) {
				e.printStackTrace();
			}
    	}
		return false;
	}
	private boolean changeDisplayScreen(JSONArray args,
			CallbackContext callbackContext) {
    	VpMainActivity vpMainActivity = (VpMainActivity) cordova;
    	if(vpMainActivity != null && args != null && args.length() > 0){
    		try {
				JSONObject jsonScreen = args.getJSONObject(0);
				int intFullScreen = jsonScreen.getInt("fullscreen");
				vpMainActivity.changeDisplayScreen(intFullScreen);
				return true;
			} catch (JSONException e) {
				e.printStackTrace();
			}
    	}
		return false;
	}
	private boolean addListener(JSONArray args, CallbackContext callbackContext) {
    	VpMainActivity vpMainActivity = (VpMainActivity) cordova;
    	if(vpMainActivity != null){
    		vpMainActivity.addListenerRemoteVideo();
    		return true;
    	}
    	return false;
	}
	
    private boolean resendInfoVideo(JSONArray args,
			CallbackContext callbackContext) {
    	VpMainActivity vpMainActivity = (VpMainActivity) cordova;
    	if(vpMainActivity != null){
    		vpMainActivity.resendInfoRemoteVideo();
    		return true;
    	}
    	return false;
	}
	private boolean changeSubtitleVideo(JSONArray args,
			CallbackContext callbackContext) {
     	VpMainActivity vpMainActivity = (VpMainActivity) cordova;
    	if(vpMainActivity != null && args != null && args.length() > 0){
			try {
				ArrayList<ChangeSubtitle> changeSubtitles = new ArrayList<ChangeSubtitle>();
				for(int i = 0; i < args.length(); i++){
					JSONObject json = args.getJSONObject(i);
		    		if(json != null && json.has("subType")){
		    			String subType = ParamUtil.getJsonString(json, "subType", null);
		    			if(subType != null){
		    				boolean isChoice = false;
		    			    if(json.has("isChoice")){
		    			    	isChoice = ParamUtil.getJSONBoolean(json, "isChoice", false);
		    			    	ChangeSubtitle changeSubtitle = new ChangeSubtitle(subType, isChoice);
		    			    	changeSubtitles.add(changeSubtitle);
		    			    }
		    			}

		    			vpMainActivity.changeSubtitleRemoteVideo(changeSubtitles);
		        		return true;
		    		}
				}
				
			} catch (JSONException e) {
				e.printStackTrace();
			}

    	}
    	return false;
	}
	private boolean seekVideo(JSONArray args, CallbackContext callbackContext) {
     	VpMainActivity vpMainActivity = (VpMainActivity) cordova;
    	if(vpMainActivity != null && args != null && args.length() > 0){
			try {
				JSONObject jsonSeek = args.getJSONObject(0);
	    		if(jsonSeek != null && jsonSeek.has("time")){
	    			int timeSeek = ParamUtil.getJsonInt(jsonSeek, "time", 0);
	        		vpMainActivity.seekRemoteVideo(timeSeek);
	        		return true;
	    		}
			} catch (JSONException e) {
				e.printStackTrace();
			}

    	}
    	return false;
	}
	private boolean stopVideo(JSONArray args, CallbackContext callbackContext) {
    	VpMainActivity vpMainActivity = (VpMainActivity) cordova;
    	if(vpMainActivity != null){
    		vpMainActivity.stopRemoteVideo();
    		return true;
    	}
    	return false;
	}
	private boolean pauseVideo(JSONArray args, CallbackContext callbackContext) {
    	VpMainActivity vpMainActivity = (VpMainActivity) cordova;
    	if(vpMainActivity != null){
    		vpMainActivity.pauseRemoteVideo();
    		return true;
    	}
    	return false;
	}
	private boolean playVideo(JSONArray args, CallbackContext callbackContext) {
    	VpMainActivity vpMainActivity = (VpMainActivity) cordova;
    	if(vpMainActivity != null){
    		vpMainActivity.playRemoteVideo();
    		return true;
    	}
    	return false;
	}

	private boolean closeEPG(JSONArray args, CallbackContext callbackContext) {
    	VpMainActivity vpMainActivity = (VpMainActivity) cordova;
    	if(vpMainActivity != null){
    		vpMainActivity.closeEPG();
    		return true;
    	}
    	return false;
	}
    
    private boolean showEPG(JSONArray args, CallbackContext callbackContext) {
    	VpMainActivity vpMainActivity = (VpMainActivity) cordova;
    	if(vpMainActivity != null){
    		vpMainActivity.showEPG();
    		return true;
    	}
    	return false;
	}
    
	private boolean bindListener(JSONArray args, CallbackContext callbackContext) {
    	Log.d(TAG, "bindListener");
    	listenerCallbackContext = callbackContext;
    	PluginResult pluginResult = new PluginResult(PluginResult.Status.OK);
    	pluginResult.setKeepCallback(true);
    	callbackContext.sendPluginResult(pluginResult);
    	return true;
	}
    
    
    private boolean startVideo(JSONArray args, CallbackContext callbackContext) throws JSONException {
    	boolean isSuccess = false;
    	Log.d(TAG, "navPlayVideo");
    	PluginResult pluginResult;
    	if(args != null && args.length() > 0){
        	JSONObject jsonVideoInfo = args.getJSONObject(0);
        	VpMainActivity vpMainActivity = (VpMainActivity) cordova;
        	
        	if(vpMainActivity != null){
        		try {
        			isSuccess = vpMainActivity.startNativeVideo(jsonVideoInfo);
    			} catch (Exception e) {
    				e.printStackTrace();
    			}
        		
        		if(isSuccess){
        			pluginResult = new PluginResult(PluginResult.Status.OK);
        		}else{
        			pluginResult = new PluginResult(PluginResult.Status.INVALID_ACTION);
        		}
        		
        	}else{
        		pluginResult = new PluginResult(PluginResult.Status.INVALID_ACTION);
        	}
    	}else{
    		pluginResult = new PluginResult(PluginResult.Status.INVALID_ACTION);
    	}
    	callbackContext.sendPluginResult(pluginResult);
    	return isSuccess;
	}

    public void reportEvent(JSONObject eventData){
    	Log.d(TAG, "reportEvent");
    	Log.e("Bigsky", "reportEvent: " + eventData.toString());
    	PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, eventData);
    	pluginResult.setKeepCallback(true);
    	if(listenerCallbackContext != null){
    		listenerCallbackContext.sendPluginResult(pluginResult);
    	}
    }
}