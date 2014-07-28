package com.vp9.util;

import org.apache.cordova.LOG;

public class Config {
	public static final String PACKAGE_TVAPP = "com.vp9.tv";
	public static final String ACTIVITY_TVAPP = ".MainActivity";
	public static final String URL_TVAPP = "http://tv.vp9.tv";
	
	private static boolean isDebug = true;
	
	public static void LogE(String tag,String s) {
		if (isDebug) {
			LOG.e(tag, s);
		}
	}
	
	public static void LogD(String tag,String s) {
		if (isDebug) {
			LOG.d(tag, s);
		}
	}
}