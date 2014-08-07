package com.vp9.laucher.main.application;

import org.apache.cordova.CordovaWebView;

import android.app.Application;
import android.widget.TextView;

public class Vp9Application extends Application {
	CordovaWebView appView;
	CordovaWebView runView;
	private TextView textViewChannelNum;

	public Vp9Application() {
	}

	public CordovaWebView getAppView() {
		if (appView != null) {
			return appView;
		}
		return null;
	}

	public void setAppView(CordovaWebView appView) {
		if (appView != null) {
			this.appView = appView;
		}
	}

	public CordovaWebView getRunView() {
		if (runView != null) {
			return runView;
		}
		return null;
	}

	public void setRunView(CordovaWebView runView) {
		if (runView != null) {
			this.runView = runView;
		}
	}

	public TextView getTextViewChannelNum() {
		return textViewChannelNum;
	}

	public void setTextViewChannelNum(TextView textViewChannelNum) {
		this.textViewChannelNum = textViewChannelNum;
	}

}
