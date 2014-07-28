package com.vp9.laucher.main.util;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.util.Log;

public class MyPreference {
	private static String TAG = MyPreference.class.getSimpleName();
	private static final String MyPREFERENCES = "MyPrefs";
	private static SharedPreferences sharedPreferences;
	
	public static SharedPreferences getPreference(Context context) {
		if (sharedPreferences == null) {
			sharedPreferences = context.getSharedPreferences(MyPREFERENCES, Context.MODE_APPEND);
		}
		return sharedPreferences;
	}
	
	public static void setBoolean(String key,boolean value) {
		if (sharedPreferences == null) {
			Log.d(TAG, "sharedPreferences chua duoc khoi tao");
			return;
		}
		Editor editor = sharedPreferences.edit();
		editor.putBoolean(key, value);
		editor.commit();
		
	}
	
	public static boolean getBoolean(String key) {
		if (sharedPreferences == null) {
			Log.d(TAG, "sharedPreferences chua duoc khoi tao");
			return false;
		}
		return sharedPreferences.getBoolean(key, false);
		
	}
	
	
}
