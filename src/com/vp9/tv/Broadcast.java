package com.vp9.tv;

import org.apache.cordova.CordovaWebView;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import com.vp9.laucher.main.application.Vp9Application;

public class Broadcast extends BroadcastReceiver {

	private String TAG = Broadcast.class.getSimpleName();
	@Override
	public void onReceive(Context context, Intent intent) {
		
		String action = intent.getAction();
		String keycode = intent.getStringExtra("keycode");
		
//		Log.d(TAG, "-----------action:" + action + " keycode: " + keycode);
		Toast.makeText(context, "Broadcast: " + keycode, Toast.LENGTH_SHORT).show();
		
		Vp9Application vp9Application = (Vp9Application) context.getApplicationContext();
		if (vp9Application != null) {
			CordovaWebView appView = vp9Application.getAppView();
			if (appView != null) {
				appView.sendJavascript("keycodeBroadcast('" + keycode + "')");
			}			
		}
		
		
		
		
	}

}
