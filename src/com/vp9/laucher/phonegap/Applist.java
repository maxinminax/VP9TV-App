package com.vp9.laucher.phonegap;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Environment;
import android.util.Log;

public class Applist extends CordovaPlugin {

	private String TAG = Applist.class.getName();

	@Override
	public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
		if (action.equals("generateIcons")) {
			PackageManager pm = this.cordova.getActivity().getPackageManager();

			//
			Intent mainIntent = new Intent(Intent.ACTION_MAIN, null);
			mainIntent.addCategory(Intent.CATEGORY_LAUNCHER);

			final List<ResolveInfo> appList = pm.queryIntentActivities(mainIntent, 0);
			Collections.sort(appList, new ResolveInfo.DisplayNameComparator(pm));
			
			Log.d(TAG, "-------------- generateIcons");
			
			
			new GenerateIconsAsyncTask().execute(appList);
					
			
			

			// for (int i = 0; i < appList.size(); i++) {
			// final ResolveInfo temp = appList.get(i);
			//
			// new Thread(new Runnable() {
			//
			// @Override
			// public void run() {
			// String pkgName = temp.activityInfo.packageName;
			// String appName =
			// temp.loadLabel(Applist.this.cordova.getActivity().getPackageManager()).toString();
			//
			// String filename = "";
			// if (appName.contains("VP9")) {
			// String activityName =
			// temp.activityInfo.name.substring(temp.activityInfo.name.lastIndexOf("."));
			//
			// filename = pkgName + activityName;
			// }else{
			// filename = pkgName;
			// }
			//
			// Drawable appIcon =
			// temp.loadIcon(Applist.this.cordova.getActivity().getPackageManager());
			// File sdcard = Environment.getExternalStorageDirectory();
			// File file = new File(sdcard,
			// "/VP9Launcher/settings/icons/"+filename+".png");
			//
			// FileOutputStream foStream = null;
			//
			// Bitmap bitmap = ((BitmapDrawable)appIcon).getBitmap();
			//
			// ByteArrayOutputStream oStream = new ByteArrayOutputStream();
			// bitmap.compress(Bitmap.CompressFormat.PNG, 100, oStream); //bm is
			// the bitmap object
			//
			// byte[] b = oStream.toByteArray();
			// try {
			// foStream = new FileOutputStream(file);
			// oStream.write(b);
			// oStream.writeTo(foStream);
			// oStream.close();
			// foStream.close();
			// } catch (IOException e1) {
			// // TODO Auto-generated catch block
			// e1.printStackTrace();
			// }
			// appIcon = null;
			// file = null;
			// b = null;
			// foStream = null;
			// oStream = null;
			// bitmap = null;
			//
			// }
			// }).start();
			//
			// }
			//
			// appList = null;
			// pm = null;
			// System.gc();

		}

		if (action.equals("appList")) {

			final PackageManager pm = this.cordova.getActivity().getPackageManager();
			File sdcard = Environment.getExternalStorageDirectory();

			JSONArray jArray = new JSONArray();

			// Lay danh sach app co Intent.CATEGORY_HOME
			ArrayList<String> packageHomeApp = new ArrayList<String>();
			Intent homeIntent = new Intent(Intent.ACTION_MAIN, null);
			homeIntent.addCategory(Intent.CATEGORY_HOME);
			List<ResolveInfo> homeAppList = pm.queryIntentActivities(homeIntent, 0);

			for (ResolveInfo temp : homeAppList) {
				String pkgName = temp.activityInfo.packageName;
				packageHomeApp.add(pkgName);
			}

			// Lay danh sach app co Intent.CATEGORY_LAUNCHER
			Intent mainIntent = new Intent(Intent.ACTION_MAIN, null);
			mainIntent.addCategory(Intent.CATEGORY_LAUNCHER);

			List<ResolveInfo> appList = pm.queryIntentActivities(mainIntent, 0);
			Collections.sort(appList, new ResolveInfo.DisplayNameComparator(pm));

			for (ResolveInfo temp : appList) {

				String pkgName = temp.activityInfo.packageName;

				// Log.d("TAG", "-----------:" +
				// !packageHomeApp.contains(pkgName));
				if (!packageHomeApp.contains(pkgName)) {

					Intent appActivity = pm.getLaunchIntentForPackage(temp.activityInfo.packageName);

					String appName = temp.loadLabel(this.cordova.getActivity().getPackageManager()).toString();

					// Log.e("my logs", "appName: " + appName + " - package: " +
					// pkgName + " -activity: " + appActivity + " - " +
					// temp.activityInfo.name);

					try {

						if (appActivity != null) {

							String[] appIntent = appActivity.toString().split("/");

							String appIFormated = appIntent[1].substring(0, appIntent[1].length() - 2);

							JSONObject json = new JSONObject();

							String filename = "";

							if (appName.contains("VP9")) {

								String activityName = temp.activityInfo.name.substring(temp.activityInfo.name.lastIndexOf("."));

								filename = pkgName + activityName;
								// Log.e("TAG " +
								// this.getClass().getSimpleName() ,"AppName: "
								// + appName + " Activity: " + activityName +
								// " PackageName: " + pkgName);

								json.put("name", appName).put("activity", activityName).put("package", pkgName)
										.put("path", "file:///" + sdcard.getAbsolutePath() + "/VP9Launcher/settings/icons/" + filename + ".png");
								jArray.put(json);

							} else {
								filename = pkgName;
								json.put("name", appName).put("activity", appIFormated).put("package", pkgName)
										.put("path", "file:///" + sdcard.getAbsolutePath() + "/VP9Launcher/settings/icons/" + filename + ".png");
								jArray.put(json);
							}

						}

					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}

			}

			String results = jArray.toString();

			callbackContext.success(new JSONObject().put("returnVal", results));
		}

		if (action.equals("generatelistappVP9")) {
			String url = args.getJSONObject(0).getString("url");

			Log.d("TAG", "-----------------generatelistappVP9");
			StringBuilder builder = new StringBuilder();
			HttpClient client = new DefaultHttpClient();
			HttpGet httpGet = new HttpGet(url + "/serverInfo.json");
			try {
				HttpResponse response = client.execute(httpGet);
				StatusLine statusLine = response.getStatusLine();
				int statusCode = statusLine.getStatusCode();
				if (statusCode == 200) {
					HttpEntity entity = response.getEntity();
					InputStream content = entity.getContent();
					BufferedReader reader = new BufferedReader(new InputStreamReader(content));

					// int available = content.available();
					// byte[] data = new byte[available];
					// content.read(data);
					String line;
					while ((line = reader.readLine()) != null) {
						builder.append(line.trim());
					}

					Log.d("TAG", "-----------------builder: " + builder.toString());
					// JSONArray jArray = new JSONArray(builder.toString());
					// Log.v("Getter",
					// "-----------------------------------Your data: " +
					// jArray.toString()); //response data

					callbackContext.success(builder.toString());
					// callbackContext.success(new JSONObject().put("returnVal",
					// "BBBBBBBBBBBB"));

				} else {
					// Log.e("Getter",
					// "-----------------------------------Failed to download file");
					callbackContext.error("Unable to connect to the Internet");
				}

			} catch (ClientProtocolException e) {
				e.printStackTrace();
				callbackContext.error("Fail get app vp9");
			} catch (IOException e) {
				e.printStackTrace();
				callbackContext.error("Fail get app vp9");
			}
		}

		if (action.equals("appList2")) {

			// Log.d("TAG", "native applist2");
			// Log.d("TAG", args.toString());
			PackageManager pm = this.cordova.getActivity().getPackageManager();

			File sdcard = Environment.getExternalStorageDirectory();

			JSONArray jArray = new JSONArray();
			JSONObject obj = args.getJSONObject(0);
			String packageName;
			if (obj != null && obj.getString("package") != null) {

				packageName = obj.getString("package");
				// Log.d(TAG, "-----------packageName: " + packageName);
				ApplicationInfo ai;
				String applicationName = "";
				try {
					ai = pm.getApplicationInfo(packageName, 0);
				} catch (final NameNotFoundException e) {
					ai = null;
				}
				applicationName = (String) (ai != null ? pm.getApplicationLabel(ai) : "(unknown)");
				// Log.d(TAG, "-----------applicationName: " + applicationName);
				Intent launchIntentForPackage = pm.getLaunchIntentForPackage(packageName);
				String[] appIntent = launchIntentForPackage.toString().split("/");

				String activityName = appIntent[1].substring(0, appIntent[1].length() - 2);
				// Log.d(TAG, "-----------applicationName: " + activityName);
				String filename = packageName;

				if (filename.contains("VP9")) {
					filename = packageName + activityName;
				}

				JSONObject json = new JSONObject();
				json.put("name", applicationName).put("activity", activityName).put("package", packageName)
						.put("path", "file:///" + sdcard.getAbsolutePath() + "/VP9Launcher/settings/icons/" + filename + ".png");
				jArray.put(json);
			}

			// Log.d("TAG", "------------------jArray.toString(): " +
			// jArray.toString());
			String results = jArray.toString();
			callbackContext.success(new JSONObject().put("returnVal", results));

			// callbackContext.success(new JSONObject().put("returnVal", "ok"));
		}

		return true;
	}

	private class GenerateIconsAsyncTask extends AsyncTask<List<ResolveInfo>, Void, Boolean> {
//		CallbackContext callbackContext;

		public GenerateIconsAsyncTask() {			

		}

		protected void onPostExecute(String feed) {
			// TODO: check this.exception
			// TODO: do something with the feed
		}

		@Override
		protected Boolean doInBackground(List<ResolveInfo>... params) {
			// TODO Auto-generated method stub
			List<ResolveInfo> applist = params[0];
			for (int i = 0; i < applist.size(); i++) {
				final ResolveInfo temp = applist.get(i);

				String pkgName = temp.activityInfo.packageName;
				String appName = temp.loadLabel(Applist.this.cordova.getActivity().getPackageManager()).toString();

				String filename = "";
				if (appName.contains("VP9")) {
					String activityName = temp.activityInfo.name.substring(temp.activityInfo.name.lastIndexOf("."));

					filename = pkgName + activityName;
				} else {
					filename = pkgName;
				}

				Drawable appIcon = temp.loadIcon(Applist.this.cordova.getActivity().getPackageManager());
				File sdcard = Environment.getExternalStorageDirectory();
				File file = new File(sdcard, "/VP9Launcher/settings/icons/" + filename + ".png");

				FileOutputStream foStream = null;

				Bitmap bitmap = ((BitmapDrawable) appIcon).getBitmap();

				ByteArrayOutputStream oStream = new ByteArrayOutputStream();
				bitmap.compress(Bitmap.CompressFormat.PNG, 100, oStream); // bm
																			// is
																			// the
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

			}
			System.gc();

			return true;
		}
	}
}
