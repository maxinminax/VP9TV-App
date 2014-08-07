package com.vp9.util;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

public enum AppPreferences {

	INSTANCE;

	public static final String IS_QUIT = "isQuit";

	private SharedPreferences pre;
	
	public static final String IS_CHANNEL_NUMBER = "is_channel_number";
	
	public static final String SUBTITLES = "subtitles";

	/**
	 * This method must be called in Application class.
	 * 
	 * @param context
	 */
	public static void assignContext(Context context) {
		if (INSTANCE.pre != null || context == null) {
			return;
		}
		INSTANCE.pre = PreferenceManager.getDefaultSharedPreferences(context);
	}

	public void saveQuit(boolean isQuit) {
		SharedPreferences.Editor editor = pre.edit();
		editor.putBoolean(IS_QUIT, isQuit);
		editor.commit();
	}

	public boolean isQuit() {
		return pre.getBoolean(IS_QUIT, true);
	}
	
	public void saveIsChannelNumber(boolean isChannelNumber) {
		SharedPreferences.Editor editor = pre.edit();
		editor.putBoolean(IS_CHANNEL_NUMBER, isChannelNumber);
		editor.commit();
	}
	
	public void saveSubtitles(ArrayList<String> subtitles) {
		SharedPreferences.Editor editor = pre.edit();
		editor.putStringSet(SUBTITLES, new HashSet<String>(subtitles));
		editor.commit();
	}
	
	
	public ArrayList<String> getSubtitles() {
		ArrayList<String> subtitles = null;
		Set<String> subtitlesSet = pre.getStringSet(SUBTITLES, new HashSet<String>());
		if(subtitlesSet != null){
			subtitles = new ArrayList<String>();
			
		    Iterator<String> iterator = subtitlesSet.iterator();

		    while(iterator.hasNext()){

		        String value = iterator.next();
		        
		        subtitles.add(value);
		    }
		}
		
		return subtitles;
	}
	
	
	public boolean isChannelNumber() {
		return pre.getBoolean(IS_CHANNEL_NUMBER, false);
	}
	
	
}
