package com.vp9.laucher.main.receiver;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.cordova.CordovaWebView;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import com.vp9.laucher.main.application.Vp9Application;

public class PackageReceive extends BroadcastReceiver {
	private static String TAG = PackageReceive.class.getSimpleName();

	@Override
	public void onReceive(Context cxt, Intent intent) {

		Vp9Application vp9Application = (Vp9Application) cxt.getApplicationContext();
		CordovaWebView appView = vp9Application.getAppView();

		Toast.makeText(cxt, "VP9 UpdatePackageReceive", Toast.LENGTH_LONG).show();
		Log.d("TAG", " ------------------------------- VP9 UpdatePackageReceive");

		if (intent.getAction().equals(Intent.ACTION_PACKAGE_ADDED)) {
			// android.intent.action.PACKAGE_ADDED
			if (appView != null) {
				Log.d("TAG", " ------------------------------- appview != null");
				String result = generateIcon(cxt, intent);
				appView.sendJavascript("refreshView('addapp', '" + result + "')");
			}else{
				Log.d("TAG", " ------------------------------- appview == null");
			}
		} else if (intent.getAction().equals(Intent.ACTION_PACKAGE_REMOVED) ) {
			if (appView != null) {
				Log.d("TAG", " ------------------------------- appview != null");
				String result = removeIcon(intent);
				appView.sendJavascript("refreshView('removeapp',  '" + result + "')");
			}else{
				Log.d("TAG", " ------------------------------- appview == null");
			}
		}
	}

	private String generateIcon(Context cxt, Intent intent) {
		PackageManager pm = cxt.getPackageManager();
		ApplicationInfo ai;
		String applicationName;
		String packageName = null;
		try {
			packageName = intent.getData().toString().split(":")[1];
			Log.d("TAG4", packageName);
			ai = pm.getApplicationInfo(packageName, 0);
		} catch (final NameNotFoundException e) {
			ai = null;
		}
		applicationName = (String) (ai != null ? pm.getApplicationLabel(ai) : "(unknown)");

		Intent launchIntentForPackage = pm.getLaunchIntentForPackage(packageName);
		String[] appIntent = launchIntentForPackage.toString().split("/");

		String activityName = appIntent[1].substring(0, appIntent[1].length() - 2);

		String filename = packageName;
		Drawable appIcon = null;

		if (filename.contains("VP9")) {
			filename = packageName + activityName;
		}
		try {
			appIcon = pm.getApplicationIcon(packageName);
		} catch (NameNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		File sdcard = Environment.getExternalStorageDirectory();
		File file = new File(sdcard, "/VP9Launcher/settings/icons/" + filename + ".png");
		FileOutputStream foStream = null;

		Bitmap bitmap = ((BitmapDrawable) appIcon).getBitmap();

		ByteArrayOutputStream oStream = new ByteArrayOutputStream();
		bitmap.compress(Bitmap.CompressFormat.PNG, 100, oStream); // bm is the
																	// bitmap
																	// object

		byte[] b = oStream.toByteArray();
		try {
			foStream = new FileOutputStream(file);
			oStream.write(b);
			oStream.writeTo(foStream);
			oStream.close();
			foStream.close();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		appIcon = null;
		file = null;
		b = null;
		foStream = null;
		oStream = null;
		bitmap = null;

		/*
		 * add thong tin app vao json
		 */
		JSONObject json = new JSONObject();
		try {
			json.put("name", applicationName).put("activity", activityName).put("package", packageName).put("path", "file:///" + sdcard.getAbsolutePath() + "/VP9Launcher/settings/icons/" + filename + ".png");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return json.toString();
	}

	private String removeIcon(Intent intent) {
		String packageName = null;

		packageName = intent.getData().toString().split(":")[1];

		File sdcard = Environment.getExternalStorageDirectory();
		File file = new File(sdcard, "/VP9Launcher/settings/icons/" + packageName + ".png");
		boolean result = file.delete();
		return result == true ? packageName : "";
	}
}
