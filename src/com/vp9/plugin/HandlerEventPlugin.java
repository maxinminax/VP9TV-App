package com.vp9.plugin;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.ActivityManager;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.pm.ResolveInfo;
import android.net.TrafficStats;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.StatFs;
import android.provider.Settings.Secure;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.vp9.laucher.main.application.Vp9Application;
import com.vp9.laucher.main.util.MyPreference;
import com.vp9.laucher.main.vp9launcher.Vp9Launcher;
import com.vp9.util.AppPreferences;
import com.vp9.util.ParamUtil;

public class HandlerEventPlugin extends CordovaPlugin {

	private String TAG = "HandlerEventPlugin";

	private static int uid;
	private static long totalRxBefore;
	private static long totalTxBefore;
	private static long BeforeTime;

	// traffic

	private double[] arrayTraffic = new double[5];
	private static int index = -1;
	private int len = 0;
	Timer timerUpdateTraffic;

	TextView textViewChannelNum;

	// end traffic

	@Override
	public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
		if (action.equals("quit_tv")) {
			// cordova.getThreadPool().execute(new Runnable() {
			// public void run() {
			// receive(args.toString(), callbackContext);
			// callbackContext.success(); // Thread-safe.
			// }
			// });

			// PackageManager manager =
			// webView.getContext().getPackageManager();
			// String versionName = " ";
			//
			// try {
			// PackageInfo info =
			// manager.getPackageInfo(webView.getContext().getPackageName(), 0);
			// versionName = info.versionName;
			// } catch (NameNotFoundException e) {
			// Log.e(TAG, e.getMessage());
			// }
			//
			// AlertDialog.Builder builder = new
			// AlertDialog.Builder(webView.getContext());
			// builder.setTitle("Quit");
			// builder.setMessage("Are you want to quit App Version " +
			// versionName + "?");
			// builder.setCancelable(true);
			//
			// builder.setPositiveButton("Quit", new
			// DialogInterface.OnClickListener() {
			// public void onClick(DialogInterface dialog, int id) {
			// exitApp();
			// }
			// });
			//
			// builder.setNegativeButton("Cancel", new
			// DialogInterface.OnClickListener() {
			// public void onClick(DialogInterface dialog, int id) {
			// dialog.dismiss();
			// }
			// });
			//
			// final AlertDialog dlg = builder.create();
			// dlg.show();
			//
			// final Timer t = new Timer();
			// t.schedule(new TimerTask() {
			// public void run() {
			// dlg.dismiss();
			// t.cancel();
			// }
			// }, 15000);

			// exitApp();
			this.cordova.getActivity().finish();
			callbackContext.success("success");
			return true;
		} else if (action.equals("launchChrome")) {
			if (args != null && args.length() > 0) {
				JSONObject obj = args.getJSONObject(0);
				String url_karao = obj.getString("url_karao");
				int id = ParamUtil.getValue(obj.getString("id"), -1);
				if (id > 0) {
					String packageName = "com.android.chrome";
					// String packageName = "com.chrome.beta";
					Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url_karao));
					browserIntent.putExtra("force_fullscreen", true);
					browserIntent.setPackage(packageName);
					browserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

					List<ResolveInfo> activitiesList = webView.getContext().getPackageManager().queryIntentActivities(browserIntent, -1);
					if (activitiesList.size() > 0) {
						// Found the browser on the device, launch it
						webView.getContext().startActivity(browserIntent);
					} else {
						// // The browser isn't installed, so we should prompt
						// the user to get
						// Intent playStoreIntent = new
						// Intent(Intent.ACTION_VIEW);
						// //
						// playStoreIntent.setData(Uri.parse("market://details?id="+packageName));
						// playStoreIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
						// webView.getContext().startActivity(playStoreIntent);

						AlertDialog.Builder builder = new AlertDialog.Builder(webView.getContext());
						builder.setTitle("Quit");
						builder.setMessage("Khong play duoc video. Thiet bi khong cai dat ung dung chrome");
						builder.setCancelable(true);

						builder.setPositiveButton("Okie", new DialogInterface.OnClickListener() {
							public void onClick(DialogInterface dialog, int id) {
								dialog.dismiss();
							}
						});

						builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
							public void onClick(DialogInterface dialog, int id) {
								dialog.dismiss();
							}
						});

						final AlertDialog dlg = builder.create();
						dlg.show();

						final Timer t = new Timer();
						t.schedule(new TimerTask() {
							public void run() {
								dlg.dismiss();
								t.cancel();
							}
						}, 15000);
					}
				}
				callbackContext.success("success");
				return true;
			}
		} else if (action.equals("playVideo")) {
			cordova.getActivity().runOnUiThread(new Runnable() {
				@Override
				public void run() {
					try {
						webView.loadUrl("javascript:handlerVideo()");
						callbackContext.success("success");
					} catch (IllegalStateException e) {
						e.printStackTrace();
					}
				}
			});

			return true;
		} else if (action.equals("install_app")) {
			handleInstallApp(args, callbackContext);
			callbackContext.success("success");
			return true;
		} else if (action.equals("back")) {
			cordova.getActivity().runOnUiThread(new Runnable() {
				@Override
				public void run() {
					try {
						webView.backHistory();
						callbackContext.success("success");
					} catch (IllegalStateException e) {
						e.printStackTrace();
					}
				}
			});
			return true;
		} else if (action.equals("getVersion")) {
			PackageManager manager = webView.getContext().getPackageManager();
			String versionName = "";
			try {
				PackageInfo info = manager.getPackageInfo(webView.getContext().getPackageName(), 0);
				versionName = info.versionName;
				callbackContext.success(versionName);
				return true;
			} catch (NameNotFoundException e) {
				Log.e(TAG, e.getMessage());
				callbackContext.error("fail");
			}
			callbackContext.success("success");
			return true;
		} else if (action.equals("set_tivi_channel")) {
			AppPreferences.INSTANCE.saveIsChannelNumber(true);
			callbackContext.success("success");
			return true;
		} else if (action.equals("cancel_tivi_channel")) {
			AppPreferences.INSTANCE.saveIsChannelNumber(false);
			callbackContext.success("success");
			return true;
		} else if (action.equals("gohomelauncher")) {

			Log.d(TAG, "--------------- gohomelauncher : ");

			Intent startMain = new Intent(cordova.getActivity(), Vp9Launcher.class);
			startMain.setAction("android.intent.action.MAIN");
			startMain.addCategory("android.intent.category.LAUNCHER");
			startMain.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);

			this.cordova.getActivity().startActivity(startMain);

			// Intent intent = cordova.getActivity().getIntent();
			// cordova.getActivity().finish();
			// cordova.getActivity().startActivity(intent);

			// Intent startMain = new Intent(Intent.ACTION_MAIN);
			// startMain.addCategory(Intent.CATEGORY_HOME);
			// startMain.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			// startMain.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
			// startMain.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
			//
			// this.cordova.getActivity().startActivity(startMain);

			// try{
			// ComponentName name=new
			// ComponentName("com.vp9.laucher.main.vp9launcher",
			// ".Vp9Launcher");
			// Intent i=new Intent(Intent.ACTION_MAIN);
			//
			// i.addCategory(Intent.CATEGORY_LAUNCHER);
			// i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			// i.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
			// i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
			// i.setComponent(name);
			//
			// this.cordova.getActivity().startActivity(i);
			// }catch(Exception e){
			// ComponentName name=new
			// ComponentName("com.vp9.laucher.main.vp9launcher",
			// "com.vp9.laucher.main.vp9launcher.Vp9Launcher");
			// Intent i=new Intent(Intent.ACTION_MAIN);
			//
			// i.addCategory(Intent.CATEGORY_LAUNCHER);
			// i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			// i.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
			// i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
			// i.setComponent(name);
			//
			// this.cordova.getActivity().startActivity(i);
			// }

			callbackContext.success("success");
			return true;
		} else if (action.equals("govp9launcher")) {
			this.cordova.getActivity().finish();
			callbackContext.success("success");
			return true;
		} else if (action.equals("enable_traffic")) {
			handleTraffic();
			callbackContext.success("success");
			return true;
		} else if (action.equals("disable_traffic")) {
			if (timerUpdateTraffic != null) {
				timerUpdateTraffic.cancel();
			}
			callbackContext.success("success");
			return true;
		} else if (action.equals("httprequest")) {
			JSONObject json = args.getJSONObject(0);
			String address = null;

			if (json == null || !json.has("url")) {
				callbackContext.error("fail");
				return false;
			}

			address = json.getString("url");
			if (address == null || address == "") {
				callbackContext.error("fail");
				return false;
			}

			new httpRequestAsyncTask(callbackContext).execute(address);
			// Toast.makeText(cordova.getActivity(), address,
			// Toast.LENGTH_SHORT).show();
			// try {
			// StringBuilder builder = new StringBuilder();
			// HttpClient client = new DefaultHttpClient();
			// HttpPost httpPost = new HttpPost(address);
			//
			// List nameValuePairs = new ArrayList();
			// // add an HTTP variable and value pair
			// if (code != null && code != "") {
			// nameValuePairs.add(new BasicNameValuePair("codeid", code));
			// httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs));
			// }
			//
			// HttpResponse response = client.execute(httpPost);
			// StatusLine statusLine = response.getStatusLine();
			// int statusCode = statusLine.getStatusCode();
			// if (statusCode == 200) {
			// HttpEntity entity = response.getEntity();
			// InputStream content = entity.getContent();
			// BufferedReader reader = new BufferedReader(
			// new InputStreamReader(content));
			//
			// String line;
			// while ((line = reader.readLine()) != null) {
			// builder.append(line + "\n");
			// }
			//
			// callbackContext.success(builder.toString());
			//
			// } else {
			// callbackContext.error("Unable to connect to the Internet");
			// }
			//
			// } catch (ClientProtocolException e) {
			// e.printStackTrace();
			// callbackContext.error("fail request to server");
			// } catch (IOException e) {
			// e.printStackTrace();
			// callbackContext.error("fail request to server");
			// }
			return true;
		} else if (action.equals("httpRequestGetService")) {

			JSONObject json = args.getJSONObject(0);
			String address = null;

			if (json == null || !json.has("url")) {
				callbackContext.error("fail");
				return false;
			}

			address = json.getString("url");
			if (address == null || address == "") {
				callbackContext.error("fail");
				return false;
			}

			// Toast.makeText(cordova.getActivity(), address,
			// Toast.LENGTH_SHORT).show();

			// try {

			new httpRequestGetServiceAsyncTask(callbackContext).execute(address);

			// StringBuilder builder = new StringBuilder();
			// HttpClient client = new DefaultHttpClient();
			// HttpPost httpPost = new HttpPost(address);
			// Log.d(TAG, "A3");
			// List nameValuePairs = new ArrayList();
			// // add an HTTP variable and value pair
			// if (code != null && code != "") {
			// nameValuePairs.add(new BasicNameValuePair("codeid", code));
			// httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs));
			// }
			// HttpResponse response = client.execute(httpPost);
			// StatusLine statusLine = response.getStatusLine();
			// int statusCode = statusLine.getStatusCode();
			// Log.d(TAG, "A4");
			// if (statusCode == 200) {
			// Log.d(TAG, "A5");
			// HttpEntity entity = response.getEntity();
			// InputStream content = entity.getContent();
			// BufferedReader reader = new BufferedReader(new
			// InputStreamReader(content));
			// Log.d(TAG, "A6");
			// String line;
			// while ((line = reader.readLine()) != null) {
			// builder.append(line.trim());
			// }
			//
			// Log.d(TAG, "A7");
			// callbackContext.success(builder.toString());
			//
			// } else {
			// Log.d(TAG, "A8");
			// callbackContext.error("Unable to connect to the Internet");
			// }

			// } catch (ClientProtocolException e) {
			// Log.d(TAG, "A9");
			// e.printStackTrace();
			// callbackContext.error("fail request to server");
			// } catch (IOException e) {
			// Log.d(TAG, "A10");
			// e.printStackTrace();
			// callbackContext.error("fail request to server");
			// }
			return true;

		}

		else if (action.equals("getChannelList")) {
			JSONObject json = args.getJSONObject(0);

			String address = null;
			if (json == null || !json.has("server_address")) {
				callbackContext.error("fail get Channel list");
				return false;
			}

			address = json.getString("server_address");
			if (address == null || address == "") {
				callbackContext.error("fail get Channel list");
				return false;
			}

			String serverId = json.getString("server_id");
			String serverName = json.getString("server_name");

			new HttpRequestGetChannelListAsyncTask(callbackContext).execute(new String[] { address, serverId, serverName });
			// StringBuilder builder = new StringBuilder();
			// HttpClient client = new DefaultHttpClient();
			// HttpGet httpGet = new HttpGet(address);
			// try {
			// HttpResponse response = client.execute(httpGet);
			// StatusLine statusLine = response.getStatusLine();
			// int statusCode = statusLine.getStatusCode();
			// if (statusCode == 200) {
			// HttpEntity entity = response.getEntity();
			// InputStream content = entity.getContent();
			// BufferedReader reader = new BufferedReader(
			// new InputStreamReader(content));
			//
			// String line;
			// while ((line = reader.readLine()) != null) {
			// builder.append(line.trim());
			// }
			//
			// JSONObject jsonObj = new JSONObject();
			// jsonObj.put("server_id", serverId);
			// jsonObj.put("server_name", serverName);
			// jsonObj.put("channel_list", builder.toString());
			//
			// callbackContext.success(jsonObj.toString());
			//
			// } else {
			// callbackContext.error("Unable to connect to the Internet");
			// return false;
			// }
			//
			// } catch (ClientProtocolException e) {
			// e.printStackTrace();
			// callbackContext.error("fail get Channel list");
			// return false;
			// } catch (IOException e) {
			// e.printStackTrace();
			// callbackContext.error("fail get Channel list");
			// return false;
			// }

			return true;
		} else if (action.equals("confirmbackbutton")) {
			SharedPreferences preference = MyPreference.getPreference(cordova.getActivity());
			MyPreference.setBoolean("confirm_backbutton", true);
			callbackContext.success("success");
			return true;
		} else if (action.equals("startserviceproxy")) {
			Intent i = new Intent("VpService");
			i.setComponent(new ComponentName("vp9.videoproxy", "vp9.videoproxy.MyService"));
			ComponentName c = cordova.getActivity().startService(i);
			if (c != null) {
				// Toast.makeText(this, "ok", Toast.LENGTH_SHORT).show();
				callbackContext.success("success");
			} else {
				// Toast.makeText(this, "fail", Toast.LENGTH_SHORT).show();
				callbackContext.error("fail");
			}
			return true;
		} else if (action.equals("startvideonativeapp")) {

			JSONObject json = args.getJSONObject(0);

			Toast.makeText(cordova.getActivity(), json.toString(), Toast.LENGTH_LONG).show();
			/**/

			try {
				ComponentName name = new ComponentName("com.vp9.player", ".Vp9Player");
				Intent i = new Intent(Intent.ACTION_MAIN);

				i.addCategory(Intent.CATEGORY_LAUNCHER);
				i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
				i.setComponent(name);

				Bundle b = new Bundle();
				b.putString("videoInfo", json.toString());
				i.putExtras(b);

				cordova.getActivity().startActivity(i);

				// cordova.getActivity().finish();

			} catch (Exception e) {
				e.printStackTrace();
				ComponentName name = new ComponentName("com.vp9.player", "com.vp9.player.Vp9Player");
				Intent i = new Intent(Intent.ACTION_MAIN);

				i.addCategory(Intent.CATEGORY_LAUNCHER);
				i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
				i.setComponent(name);

				Bundle b = new Bundle();
				b.putString("videoInfo", json.toString());
				i.putExtras(b);

				cordova.getActivity().startActivity(i);
			}

			callbackContext.success("success");
			return true;
		} else if (action.equals("isnativeappexist")) {

			Intent i = new Intent();
			i.setClassName("com.vp9.player", "com.vp9.player.Vp9Player");
			// ResolveInfo resolveActivity =
			// cordova.getActivity().getPackageManager().resolveActivity(i,
			// PackageManager.MATCH_DEFAULT_ONLY);
			List list = cordova.getActivity().getPackageManager().queryIntentActivities(i, PackageManager.MATCH_DEFAULT_ONLY);

			if (list.size() > 0) {
				callbackContext.success("success");
				return true;
			} else {
				callbackContext.error("fail");
				return false;
			}
		} else if (action.equals("getAndroidId")) {
			String android_id = Secure.getString(this.cordova.getActivity().getContentResolver(), Secure.ANDROID_ID);
			/*
			 * JSONObject json = new JSONObject(); json.put("androidId",
			 * android_id); callbackContext.success(json.toString());
			 */
			callbackContext.success(android_id);
		} else if (action.equals("visibleChannelNumber")) {

			this.cordova.getActivity().runOnUiThread(new Runnable() {
				@Override
				public void run() {

					JSONObject json;
					try {
						json = args.getJSONObject(0);

						String channelNumber = "";
						if (json != null) {
							channelNumber = json.getString("channelNumber");
						}
						Log.e(HandlerEventPlugin.class.getSimpleName(), "channelnumber: " + channelNumber);
						if (channelNumber != null) {
							Vp9Application vp9Application = (Vp9Application) HandlerEventPlugin.this.cordova.getActivity().getApplication();
							textViewChannelNum = vp9Application.getTextViewChannelNum();

							if (textViewChannelNum != null) {

								AppPreferences.INSTANCE.isChannelNumber();

								if (!AppPreferences.INSTANCE.isChannelNumber()) {
									textViewChannelNum.setVisibility(View.INVISIBLE);
									return;
								} else {
									textViewChannelNum.setVisibility(View.VISIBLE);
								}

								textViewChannelNum.setText(channelNumber);
								callbackContext.success("success");
							} else {
								callbackContext.error("fail");
							}
						} else {
							callbackContext.error("fail");
						}
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

				}
			});
			return true;
		} else if (action.equals("invisibleChannelNumber")) {
			this.cordova.getActivity().runOnUiThread(new Runnable() {

				@Override
				public void run() {
					Vp9Application vp9Application = (Vp9Application) HandlerEventPlugin.this.cordova.getActivity().getApplication();
					textViewChannelNum = vp9Application.getTextViewChannelNum();

					if (textViewChannelNum != null && textViewChannelNum.getVisibility() == View.VISIBLE) {
						Log.e(HandlerEventPlugin.class.getSimpleName(), "textViewChannelNum visible");
						textViewChannelNum.setVisibility(View.INVISIBLE);
						callbackContext.success("success");

					} else {
						Log.e(HandlerEventPlugin.class.getSimpleName(), "textViewChannelNum invisible");
						callbackContext.success("success");
					}
				}
			});
			return true;
		} else if (action.equals("checkCurrentActivityRunning")) {
			ActivityManager am = (ActivityManager) this.cordova.getActivity().getSystemService(Context.ACTIVITY_SERVICE);

			List<ActivityManager.RunningTaskInfo> alltasks = am.getRunningTasks(1);
			for (ActivityManager.RunningTaskInfo aTask : alltasks) {
				if (aTask.topActivity.getClassName().equals("com.vp9.tv.VpMainActivity") || aTask.topActivity.getClassName().equals("com.vp9.laucher.main.vp9launcher.Vp9Launcher")) {
					callbackContext.success("success");
					return true;
				}
			}
			callbackContext.error("fail");
			return false;
		}

		callbackContext.error("fail");
		return false;
	}

	private void handleInstallApp(JSONArray args, CallbackContext callbackContext) throws JSONException {
		if (args != null && args.length() > 0) {
			JSONObject obj = args.getJSONObject(0);
			if (obj != null && obj.getString("url") != null) {
				String downloadUrl = obj.getString("url");
				String[] strUrls = downloadUrl.split("/");
				if (strUrls != null && strUrls.length > 0 && strUrls[strUrls.length - 1] != null && strUrls[strUrls.length - 1].endsWith(".apk")) {
					String appName = strUrls[strUrls.length - 1];
					try {
						final DownloadFile downloadFile = new DownloadFile(downloadUrl, appName);
						downloadFile.execute();

						// while(!downloadFile.isFinish &&
						// !downloadFile.isCancelled()){
						// try {
						// Thread.sleep(100);
						// } catch (InterruptedException e) {
						// Log.e("Download install file", e.getMessage());
						// }
						// }
						//
						// if(!downloadFile.isInstall){
						// displayQuitDownloadDiaglog();
						// }

						// URL url = new URL(downloadUrl);
						// HttpURLConnection c = (HttpURLConnection)
						// url.openConnection();
						// c.setRequestMethod("GET");
						// c.setDoOutput(true);
						// c.connect();
						//
						// String PATH = "/mnt/sdcard/Download/";
						//
						// File file = new File(PATH);
						// file.mkdirs();
						// File outputFile = new File(file, appName);
						// if(outputFile.exists()){
						// outputFile.delete();
						// }
						// FileOutputStream fos = new
						// FileOutputStream(outputFile);
						//
						// InputStream is = c.getInputStream();
						//
						// byte[] buffer = new byte[1024];
						// int len1 = 0;
						// while ((len1 = is.read(buffer)) != -1) {
						// fos.write(buffer, 0, len1);
						// }
						// fos.close();
						// is.close();
						// dlg.dismiss();
						// Toast.makeText(webView.getContext(),
						// "Handle Install App 1: ", Toast.LENGTH_SHORT).show();
						// webView.sendJavascript("hiddenDialog(" + 0 + ")");
						// Toast.makeText(webView.getContext(),
						// "Handle Install App 2: ", Toast.LENGTH_SHORT).show();
						// Intent intent = new Intent(Intent.ACTION_VIEW);
						// intent.setDataAndType(Uri.fromFile(new
						// File("/mnt/sdcard/Download/" + appName)),
						// "application/vnd.android.package-archive");
						// intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK); //
						// without this flag android returned a intent error!
						// webView.getContext().startActivity(intent);

					} catch (Exception e) {
						Log.e("Download app", "Update error! " + e.getMessage());
					}
				}
			}

		}
	}

	protected void exitApp() {
		android.os.Process.killProcess(android.os.Process.myPid());
		super.onDestroy();
		System.exit(0);

	}

	private class DownloadFile extends AsyncTask<String, Integer, String> {

		ProgressDialog mProgressDialog;
		private String downloadUrl;
		private String appName;

		public boolean isInstall;

		// public boolean isFinish;

		public DownloadFile(String downloadUrl, String appName) {
			this.downloadUrl = downloadUrl;
			this.appName = appName;
			this.isInstall = true;
			// this.isFinish = false;
		}

		@Override
		protected void onPreExecute() {
			super.onPreExecute();
			// Create ProgressBar
			mProgressDialog = new ProgressDialog(webView.getContext());
			// Set your ProgressBar Title
			mProgressDialog.setTitle("Downloads");

			// Set your ProgressBar Message
			mProgressDialog.setMessage("Downloading app game for install, Please Wait!");
			mProgressDialog.setIndeterminate(false);
			mProgressDialog.setMax(100);
			mProgressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
			// Show ProgressBar
			mProgressDialog.setCancelable(false);
			// mProgressDialog.setCanceledOnTouchOutside(false);
			mProgressDialog.show();
		}

		@Override
		protected String doInBackground(String... sUrl) {
			try {

				URL url = new URL(downloadUrl);
				HttpURLConnection c = (HttpURLConnection) url.openConnection();
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
						publishProgress((int) (total * 100 / fileLength));
						fos.write(buffer, 0, count);
					}
					fos.close();
					is.close();
				}

			} catch (Exception e) {
				Log.e("Error", e.getMessage());
				e.printStackTrace();
			}
			return null;
		}

		@Override
		protected void onPostExecute(String result) {
			mProgressDialog.dismiss();
			if (isInstall) {
				Intent intent = new Intent(Intent.ACTION_VIEW);
				intent.setDataAndType(Uri.fromFile(new File("/mnt/sdcard/Download/" + appName)), "application/vnd.android.package-archive");
				intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK); // without this
																// flag android
																// returned a
																// intent error!
				webView.getContext().startActivity(intent);
			} else {
				displayQuitDownloadDiaglog();
			}

			// isFinish = true;
		}

		@Override
		protected void onProgressUpdate(Integer... progress) {
			super.onProgressUpdate(progress);
			// Update the ProgressBar
			mProgressDialog.setProgress(progress[0]);

		}

		public long getAvailableSpaceInBytes() {
			long availableSpace = -1L;
			// StatFs stat = new
			// StatFs(Environment.getExternalStorageDirectory().getPath());
			StatFs stat = new StatFs("/mnt/sdcard");
			availableSpace = (long) stat.getAvailableBlocks() * (long) stat.getBlockSize();

			return availableSpace;
		}

	}

	private class httpRequestAsyncTask extends AsyncTask<String, Void, Boolean> {
		CallbackContext callbackContext;

		public httpRequestAsyncTask(CallbackContext callback) {
			this.callbackContext = callback;
		}

		protected Boolean doInBackground(String... urls) {
			try {
				StringBuilder builder = new StringBuilder();
				URL url = new URL(urls[0]);
				HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
				try {
					InputStream in = new BufferedInputStream(urlConnection.getInputStream());
					BufferedReader reader = new BufferedReader(new InputStreamReader(in));
					String line;
					while ((line = reader.readLine()) != null) {
						builder.append(line + "\n");
					}
				} finally {
					urlConnection.disconnect();
				}

				this.callbackContext.success(builder.toString());
				return true;
			} catch (Exception e) {
				this.callbackContext.error("fail");
				return false;
			}
		}

		protected void onPostExecute(String feed) {
			// TODO: check this.exception
			// TODO: do something with the feed
		}
	}

	private class httpRequestGetServiceAsyncTask extends AsyncTask<String, Void, Boolean> {
		CallbackContext callbackContext;

		public httpRequestGetServiceAsyncTask(CallbackContext callback) {
			this.callbackContext = callback;

		}

		protected Boolean doInBackground(String... urls) {
			try {
				StringBuilder builder = new StringBuilder();
				URL url = new URL(urls[0]);
				HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
				try {
					InputStream in = new BufferedInputStream(urlConnection.getInputStream());
					BufferedReader reader = new BufferedReader(new InputStreamReader(in));
					String line;
					while ((line = reader.readLine()) != null) {
						builder.append(line.trim());
					}
				} finally {
					urlConnection.disconnect();
				}

				this.callbackContext.success(builder.toString());
				return true;
			} catch (Exception e) {
				this.callbackContext.error("fail");
				return false;
			}
		}

		protected void onPostExecute(String feed) {
			// TODO: check this.exception
			// TODO: do something with the feed
		}
	}

	private class HttpRequestGetChannelListAsyncTask extends AsyncTask<String, Void, Boolean> {
		CallbackContext callbackContext;

		public HttpRequestGetChannelListAsyncTask(CallbackContext callback) {
			this.callbackContext = callback;

		}

		protected Boolean doInBackground(String... urls) {
			try {

				StringBuilder builder = new StringBuilder();
				URL url = new URL(urls[0]);
				HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
				try {
					InputStream in = new BufferedInputStream(urlConnection.getInputStream());
					BufferedReader reader = new BufferedReader(new InputStreamReader(in));
					String line;
					while ((line = reader.readLine()) != null) {
						builder.append(line.trim());
					}
				} finally {
					urlConnection.disconnect();
				}

				JSONObject jsonObj = new JSONObject();
				jsonObj.put("server_id", urls[1]);
				jsonObj.put("server_name", urls[2]);
				jsonObj.put("channel_list", builder.toString());

				this.callbackContext.success(jsonObj.toString());
				return true;
			} catch (Exception e) {
				this.callbackContext.error("fail");
				return false;
			}
		}

		protected void onPostExecute(String feed) {
			// TODO: check this.exception
			// TODO: do something with the feed
		}
	}

	public void displayQuitDownloadDiaglog() {
		AlertDialog.Builder builder = new AlertDialog.Builder(webView.getContext());
		builder.setTitle("Install Fail");
		builder.setMessage("SDcard is not enough storage space, please remove some apps and files.");
		builder.setCancelable(true);

		builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface dialog, int id) {
				dialog.dismiss();
			}
		});

		AlertDialog _alert = builder.create();
		_alert.show();

	}

	private void handleTraffic() {
		String packageName = "com.vp9.tv";
		final PackageManager pm = cordova.getActivity().getPackageManager();
		try {
			ApplicationInfo applicationInfo = pm.getApplicationInfo(packageName, 0);
			uid = applicationInfo.uid;
		} catch (NameNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		BeforeTime = System.currentTimeMillis();
		// totalRxBefore = TrafficStats.getUidRxBytes(uid);
		// totalTxBefore = TrafficStats.getUidTxBytes(uid);

		totalRxBefore = TrafficStats.getTotalRxBytes();
		totalTxBefore = TrafficStats.getTotalTxBytes();

		timerUpdateTraffic = new Timer();
		timerUpdateTraffic.schedule(new TimerTask() {
			@Override
			public void run() {

				cordova.getActivity().runOnUiThread(new Runnable() {
					@Override
					public void run() {
						// long totalRxAfter = TrafficStats.getUidRxBytes(uid);
						// long totalTxAfter = TrafficStats.getUidTxBytes(uid);
						long totalRxAfter = TrafficStats.getTotalRxBytes();
						long totalTxAfter = TrafficStats.getTotalTxBytes();

						long AfterTime = System.currentTimeMillis();
						double TimeDifference = AfterTime - BeforeTime;
						double rxDiff = totalRxAfter - totalRxBefore;
						double txDiff = totalTxAfter - totalTxBefore;

						totalRxBefore = totalRxAfter;
						totalTxBefore = totalTxAfter;
						BeforeTime = AfterTime;

						if ((rxDiff >= 0) && (txDiff >= 0)) {
							double rxBPS = ((rxDiff) / (TimeDifference / 1000)); // total
																					// rx
																					// bytes
																					// per
																					// second.
							double txBPS = ((txDiff) / (TimeDifference / 1000)); // total
																					// tx
																					// bytes
																					// per
																					// second.

							/*
							 * RX.setText(String.valueOf(rxBPS) +
							 * "KBps. Total rx = " + rxDiff);
							 * TX.setText(String.valueOf(txBPS) +
							 * "KBps. Total tx = " + txDiff);
							 */

							index = (index + 1) % 5;
							len = len + 1 - (len / 5);

							arrayTraffic[index] = txBPS;
							double resultSpeed = 0;
							for (int i = 0; i < arrayTraffic.length; i++) {
								resultSpeed += arrayTraffic[i];
							}
							resultSpeed = resultSpeed / len / 1024;
							HandlerEventPlugin.this.webView.sendJavascript("handleTrafficClient('" + String.format("%.2f", rxBPS) + "', '" + String.format("%.0f", resultSpeed) + "KB/s')");

						} else {
							HandlerEventPlugin.this.webView.sendJavascript("handleTrafficClient(' No uploaded or downloaded bytes.' , 'No uploaded or downloaded bytes.')");
						}

					}
				});
			}
		}, 0, 1000);
	}

	private static boolean deleteDir(File dir) {
		if (dir != null && dir.isDirectory()) {
			String[] children = dir.list();
			for (int i = 0; i < children.length; i++) {
				boolean success = deleteDir(new File(dir, children[i]));
				if (!success) {
					return false;
				}
			}
			// dir.delete(); // delete the directory ITSELF. Grayed out, because
			// it cripples the app until the app is fully restarted
		} else if (dir != null && dir.isFile()) {
			dir.delete(); // delete the file INSIDE the directory
		}
		return true;
	}

}
