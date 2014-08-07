package com.vp9.laucher.phonegap;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.StatFs;
import android.util.Log;

public class Wificontrols extends CordovaPlugin {

	BroadcastReceiver wifireceiver;
	String callback;
	private int levelNumber = 5;

	public Wificontrols() {
		this.wifireceiver = new BroadcastReceiver() {
			@Override
			public void onReceive(Context context, Intent intent) {
				WifiManager wifimanager = (WifiManager) context
						.getSystemService(Context.WIFI_SERVICE);
				WifiInfo wifiInfo = wifimanager.getConnectionInfo();
				int linkSpeed = wifiInfo.getLinkSpeed();
				int level = WifiManager.calculateSignalLevel(
						wifiInfo.getRssi(), levelNumber);

				Log.d("TAG", "-----------------linkspeed " + linkSpeed
						+ "rssi: " + wifiInfo.getRssi() + " - level" + level);

				if (intent.getAction().equals(WifiManager.RSSI_CHANGED_ACTION)) {
					updateSignalStrength(intent.getIntExtra(
							WifiManager.EXTRA_NEW_RSSI, -1));
				}
			}
		};
	}

	private void updateSignalStrength(int strengthDbm) {
		this.webView.sendJavascript(callback + "(" + strengthDbm + ")");
	}

	@Override
	public void onPause(boolean multitasking) {
		stopListen();
	}

	@Override
	public void onResume(boolean multitasking) {
		startListen();
	}

	@Override
	public void onDestroy() {
		try {
			this.cordova.getActivity().unregisterReceiver(wifireceiver);
		} catch (IllegalArgumentException e) {
		}
	}

	private void startListen() {
		IntentFilter rssiFilter = new IntentFilter();
		rssiFilter.addAction(WifiManager.RSSI_CHANGED_ACTION);
		this.cordova.getActivity().registerReceiver(wifireceiver, rssiFilter);
	}

	private void stopListen() {
		try {
			this.cordova.getActivity().unregisterReceiver(wifireceiver);
		} catch (IllegalArgumentException e) {
		}

	}

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {

		WifiManager wifiManager = (WifiManager) this.cordova.getActivity()
				.getSystemService(Context.WIFI_SERVICE);

		if (action.equals("check")) {
			if (wifiManager.isWifiEnabled()) {
				callback = args.getJSONObject(0).getString("success");
				startListen();
				callbackContext
						.success(new JSONObject().put("returnVal", true));
			} else {
				callbackContext.success(new JSONObject()
						.put("returnVal", false));
			}
		}

		if (action.equals("enable")) {
			callback = args.getJSONObject(0).getString("success");
			startListen();
			wifiManager.setWifiEnabled(true);
			callbackContext.success(new JSONObject().put("returnVal", true));

		}

		if (action.equals("disable")) {
			stopListen();
			wifiManager.setWifiEnabled(false);
			callbackContext.success(new JSONObject().put("returnVal", false));
		}

		if (action.equals("toggle")) {
			if (wifiManager.isWifiEnabled()) {
				stopListen();
				wifiManager.setWifiEnabled(false);
				callbackContext.success(new JSONObject()
						.put("returnVal", false));
			} else {
				callback = args.getJSONObject(0).getString("success");
				startListen();
				wifiManager.setWifiEnabled(true);
				callbackContext
						.success(new JSONObject().put("returnVal", true));
			}
		}

		if (action.equals("getkbpersec")) {
			long timestart = System.currentTimeMillis();
			float _KbPerSec = 0;
			try {
				String downloadUrl = "http://tv.vp9.tv/game/upload/images/candy_crush_saga.png";
				String appName = "test.apk";
				boolean isInstall = true;

				URL url;
				HttpURLConnection c;

				url = new URL(downloadUrl);
				c = (HttpURLConnection) url.openConnection();
				c.setRequestMethod("GET");
				c.setDoOutput(true);
				c.connect();

				String PATH = "/mnt/sdcard/Download/";

				File file = new File(PATH);
				file.mkdirs();
				File outputFile = new File(file, appName);
				if (outputFile.exists()) {
					outputFile.delete();
				}
				FileOutputStream fos = new FileOutputStream(outputFile);

				InputStream is = c.getInputStream();

				int fileLength = c.getContentLength();

				long availableSpaceInBytes = getAvailableSpaceInBytes();

				if (fileLength >= availableSpaceInBytes) {
					// displayQuitDownloadDiaglog();
					isInstall = false;
				} else {
					byte[] buffer = new byte[1024];
					long total = 0;
					int count = 0;
					while ((count = is.read(buffer)) != -1) {
						total += count;
						// Publish the progress
						fos.write(buffer, 0, count);

					}
					
					
//					Log.d("TAG3",
//							"---------- class: "
//									+ Wificontrols.class.getSimpleName()
//									+ " fileLength: " + fileLength
//									+ " availableSpaceInBytes: "
//									+ availableSpaceInBytes);
//
//					Log.d("TAG3", "total: " + (total / 1024));
//					Log.d("TAG3", "time: "
//							+ (System.currentTimeMillis() - timestart) / 1000);

					float kilobytes = total / 1024;
					float time = (System.currentTimeMillis() - timestart) / 1000;

					try {
						if (time == 0) {
							time = 1;
						}
						_KbPerSec = kilobytes / time;
					} catch (Exception e) {
						Log.e(Wificontrols.class.getSimpleName() + " + TAG Exception", e.getMessage());
					}

					fos.close();
					is.close();
				}
				 callbackContext.success(new JSONObject().put("returnVal", _KbPerSec));
			} catch (MalformedURLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		return true;
	}

	public long getAvailableSpaceInBytes() {
		long availableSpace = -1L;
		// StatFs stat = new
		// StatFs(Environment.getExternalStorageDirectory().getPath());
		StatFs stat = new StatFs("/mnt/sdcard");
		availableSpace = (long) stat.getAvailableBlocks()
				* (long) stat.getBlockSize();

		return availableSpace;
	}
}
