package com.vp9.laucher.main.vp9launcher;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnKeyListener;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.WindowManager.LayoutParams;
import android.widget.TextView;
import android.widget.Toast;

import com.vp9.laucher.main.application.Vp9Application;
import com.vp9.laucher.main.model.KeyCodeInfo;
import com.vp9.laucher.main.util.Config;
import com.vp9.laucher.main.util.KeyCodeUtil;
import com.vp9.tv.R;
import com.vp9.tv.VpMainActivity;

public class Vp9Launcher extends Activity implements CordovaInterface {
	protected CordovaWebView launcherView;
	protected CordovaWebView appView;
	private CordovaPlugin activityResultCallback;
	private boolean activityResultKeepRunning;
	private boolean keepRunning;
	private final ExecutorService threadPool = Executors.newCachedThreadPool();

	private TextView tvChannel;
	private Timer time;
	private String channelNum = null;
	private Timer timer;
	private BroadcastReceiver packageReceiver;
	
	protected String TAG = Vp9Launcher.class.getSimpleName();
	
	private boolean isLauncherStart = false;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		org.apache.cordova.Config.init(this);
		
		super.onCreate(savedInstanceState);
		
		Log.d(TAG, "----------------------- oncreate");
		
		String launcherUrl = "file:///android_asset/www/dummy.html";
//		String launcherUrl = "http://10.10.10.159/launcher/dummy.html";
		
		setContentView(R.layout.launcher);
		launcherView = (CordovaWebView) findViewById(R.id.launcher);
		appView = (CordovaWebView) findViewById(R.id.app);

		appView.bindButton(true);
		appView.loadUrl("file:///android_asset/www/blank.html");
		launcherView.bindButton(true);
		
		// begin hungvv
		com.vp9.util.AppPreferences.INSTANCE.assignContext(this);
		
		this.tvChannel = new TextView(this);
		tvChannel.setPadding(50, 30, 30, 30);
		tvChannel.setTextSize(42);
		tvChannel.setTypeface(tvChannel.getTypeface(), Typeface.BOLD);
		tvChannel.setText("");
		tvChannel.setTextColor(Color.BLUE);
		tvChannel.bringToFront();
		this.tvChannel.setVisibility(View.INVISIBLE);
		LayoutParams params = new LayoutParams(200, 200);
		addContentView(tvChannel, params);

		File sdcard = Environment.getExternalStorageDirectory();
		File configFile = new File(sdcard, "/VP9Launcher/settings/config.txt");
		
		/**/
		this.packageReceiver = new BroadcastReceiver() {

			@Override
			public void onReceive(Context context, Intent intent) {

//				Toast.makeText(context, intent.getAction(), Toast.LENGTH_LONG).show();
				
				if (intent.getAction().equals(Intent.ACTION_PACKAGE_ADDED) && Vp9Launcher.this.launcherView != null) {
					// android.intent.action.PACKAGE_ADDED
					generateIcon(intent);
					
//					String result = generateIcon(intent);
//					if((result != null || result != "") && VP9Launcher.this.launcherView != null){
//						VP9Launcher.this.launcherView.sendJavascript("refreshView('addapp', '"
//							+ result + "')");
//					}
				} else if(intent.getAction().equals(Intent.ACTION_PACKAGE_REMOVED) && Vp9Launcher.this.launcherView != null){
					removeIcon(intent);
//					String result =  removeIcon(intent);
//					if((result != null || result != "") && VP9Launcher.this.launcherView != null){
//						VP9Launcher.this.launcherView.sendJavascript("refreshView('removeapp',  '" + result + "')");
//					}
				}
			}
		};


		IntentFilter intentFilter = new IntentFilter();
		intentFilter.addAction(Intent.ACTION_PACKAGE_ADDED);
		intentFilter.addAction(Intent.ACTION_PACKAGE_REMOVED);
		intentFilter.addAction(Intent.ACTION_PACKAGE_CHANGED);
		intentFilter.addAction(Intent.ACTION_PACKAGE_REPLACED);

		intentFilter.addDataScheme("package");
		this.getActivity().registerReceiver(this.packageReceiver, intentFilter);

		// end hungvv
		
		if (launcherView != null) {
			Vp9Application vp9Application = (Vp9Application) getApplicationContext();
			vp9Application.setAppView(launcherView);
			vp9Application.setTextViewChannelNum(tvChannel);
			if (appView != null) {
				vp9Application.setRunView(appView);
			}
			
//			Toast.makeText(VP9Launcher.this.getActivity(), "launcherView not null", Toast.LENGTH_LONG).show();
		}else{
//			Toast.makeText(VP9Launcher.this.getActivity(), "launcherView null", Toast.LENGTH_LONG).show();
		}

		if (configFile.exists()) {
			try {
				FileInputStream is = new FileInputStream(configFile);
				int size = is.available();
				byte[] buffer = new byte[size];
				is.read(buffer);
				is.close();
				String text = new String(buffer);
				JSONObject jsnobject = null;
				try {
					jsnobject = new JSONObject(text);
				} catch (JSONException e) {
					e.printStackTrace();
				}
				
				if (jsnobject != null) {
					String activeTheme = "";
					if (jsnobject.has("active")) {
						activeTheme = jsnobject.getString("active");
					}
					
					String fullscreen = "";
					if (jsnobject.has("fullscreen")) {
						fullscreen = jsnobject.getString("fullscreen");
					}
					
					String orientation = "";
					if (jsnobject.has("orientation")) {
						orientation = jsnobject.getString("orientation");
					}
					
					File themeLocation = null;
					if (activeTheme != "" ) {
						themeLocation = new File(sdcard, "/VP9Launcher/VP9ods/"
								+ activeTheme + "/index.html");
					}

					if (themeLocation != null && themeLocation.exists()) {
						launcherView.loadUrl("file:///" + themeLocation.getAbsolutePath());
						if (orientation.equals("landscape")) {
							super.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
						}
						if (orientation.equals("portrait")) {
							super.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
						}
						if (fullscreen.equals("true")) {
							getWindow()
									.setFlags(
											WindowManager.LayoutParams.FLAG_FULLSCREEN,
											WindowManager.LayoutParams.FLAG_FULLSCREEN
													| WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
						}
					} else {
						launcherView.loadUrl(launcherUrl);
					}
				}else{
					launcherView.loadUrl(launcherUrl);
				}
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else {
			File appDir = new File(sdcard + "/VP9Launcher");
			if (sdcard.exists()) {
				if (!appDir.exists()) {
					File vp9ods = new File(sdcard + "/VP9Launcher/VP9ods");
					File settings = new File(sdcard + "/VP9Launcher/settings");
					File icons = new File(sdcard
							+ "/VP9Launcher/settings/icons");
					appDir.mkdirs();
					settings.mkdirs();
					vp9ods.mkdirs();
					icons.mkdirs();

					try {
						JSONObject json = new JSONObject();
						json.put("active", "null").put("fullscreen", "true")
								.put("orientation", "portrait")
								.put("city", "Fargo,ND").put("screen", "false");
						String results = json.toString();

						File myFile = new File(sdcard,
								"/VP9Launcher/settings/config.txt");
						myFile.createNewFile();
						FileOutputStream fOut = new FileOutputStream(myFile);

						OutputStreamWriter myOutWriter = new OutputStreamWriter(
								fOut);
						myOutWriter.write(results);
						myOutWriter.close();
						fOut.close();

					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

				}
			}
			launcherView.loadUrl(launcherUrl);

		}
		//setListener();
		// hungvv
	}

	@Override
	protected void onResume() {
		// TODO Auto-generated method stub
		/*super.onResume();
		if (isLauncherStart) {
			launcherView.sendJavascript("handlerHomeButton('true')");
		}else{
			launcherView.sendJavascript("handlerHomeButton('false')");
		}
		Log.d("TAG", "----------------------- onResume");
		isLauncherStart = false;*/
		super.onResume();

		if (isLauncherStart) {
			Log.d(TAG, isLauncherStart + "");
			appView.loadUrl("file:///android_asset/wwww/blank.html");
			appView.setVisibility(View.GONE);

			ViewGroup parent = (ViewGroup) launcherView.getParent();
			parent.removeView(launcherView);
			parent.addView(launcherView);

			launcherView.setVisibility(View.VISIBLE);
			// dang o app khac
			// launcherView.sendJavascript("handlerHomeButton('true')");
		} else {
			appView.loadUrl("file:///android_asset/wwww/blank.html");
			hideApp();
			launcherView.sendJavascript("handlerHomeButton('false')");
		}

		Log.d(TAG, "----------------------- onResume");
		isLauncherStart = false;
		
//		if (addAppList != null && addAppList.size() > 0) {
//			for (int i = 0; i < addAppList.size(); i++) {
//				Intent intent = addAppList.get(i);
//				String result = generateIcon(intent);
//				
//			}
//		}
	}
	
	@Override
	protected void onRestart() {
		// TODO Auto-generated method stub
		super.onRestart();
		Log.d("TAG", "----------------------- onRestart");
	}
	
	@Override
	protected void onStart() {
		// TODO Auto-generated method stub
		super.onStart();
		isLauncherStart = true;
		Log.d("TAG", "----------------------- onStart");
	}
	
	@Override
	protected void onPause() {
		// TODO Auto-generated method stub
		super.onPause();
		Log.d(TAG, "----------------------- onPause");
	}
	
	@Override
	protected void onStop() {
		super.onStop();
		Log.d(TAG, "----------------------- onStop");
	}
	
	@Override
	public void onDestroy() {
		// TODO Auto-generated method stub
		super.onDestroy();
		launcherView.handleDestroy();
		appView.handleDestroy();
		unregisterReceiver(packageReceiver);
		Log.d(TAG, "----------------------- onDestroy");
	}

	public CordovaWebView getView() {
		if (launcherView.getVisibility() == View.VISIBLE) {
			return launcherView;
		} else if (appView.getVisibility() == View.VISIBLE) {
			return appView;
		}
		return null;
	}

	@Override
	public boolean dispatchKeyEvent(KeyEvent event) {
		if (launcherView.getVisibility() == View.VISIBLE) {
			handleLauncherViewKeyEvent(event.getKeyCode(), event);
		} else if (appView.getVisibility() == View.VISIBLE) {
			handleAppViewKeyEvent(event.getKeyCode(), event);
		}
		if (event.getKeyCode() == KeyEvent.KEYCODE_BACK) {
			return true;
		}
		return super.dispatchKeyEvent(event);
	}

	private boolean handleLauncherViewKeyEvent(int keyCode, KeyEvent event) {
		boolean isSuccess = false;
		String msgValue = null;
		// if(event.getAction() == KeyEvent.ACTION_UP){
		if (event.getAction() == KeyEvent.ACTION_DOWN) {
			KeyCodeInfo keyCodeInfo;

			keyCodeInfo = KeyCodeUtil.getKeyCodeInfo(keyCode);
			msgValue = keyCodeInfo.getMsgValue();

			/*
			 * int duration = Toast.LENGTH_SHORT; Toast.makeText(
			 * Vp9Launcher.this.getApplicationContext(),
			 * "KEY_CODE LAUNCHERVIEW = " + keyCode + " ==> " +
			 * keyCodeInfo.getMsgValue(), duration).show();
			 */

			if (KeyCodeUtil.isNumberKey(keyCode)) {
				handleChannelNumber(keyCodeInfo);
			}

			if (keyCode == KeyEvent.KEYCODE_DEL) {
				handleDelChannelNumber(keyCodeInfo);

			}
		}

		if (msgValue != null) {

			try {
				JSONObject message = new JSONObject();
				message.put("action", "keyEvent");
				message.put("key", msgValue);
				launcherView.sendJavascript("handlerCordovaMsg('"
						+ message.toString() + "')");
			} catch (JSONException e) {
				Log.e(TAG, "JSONException: " + e.getMessage());
			}

		}

		if (event.getAction() == KeyEvent.ACTION_DOWN) {
			return launcherView.onKeyDown(event.getKeyCode(), event);
		} else if (event.getAction() == KeyEvent.ACTION_UP) {
			return launcherView.onKeyUp(event.getKeyCode(), event);
		}
		return true;
	}

	private boolean handleAppViewKeyEvent(int keyCode, KeyEvent event) {
		boolean isSuccess = false;
		String msgValue = null;
		if (event.getAction() == KeyEvent.ACTION_UP) {
			// if (event.getAction() == KeyEvent.ACTION_DOWN) {
			KeyCodeInfo keyCodeInfo;

			keyCodeInfo = KeyCodeUtil.getKeyCodeInfo(keyCode);
			msgValue = keyCodeInfo.getMsgValue();

			/*
			 * int duration = Toast.LENGTH_SHORT; Toast.makeText(
			 * Vp9Launcher.this.getApplicationContext(), "KEY_CODE APPVIEW = " +
			 * keyCode + " ==> " + keyCodeInfo.getMsgValue(), duration) .show();
			 */

			if (KeyCodeUtil.isNumberKey(keyCode)) {
				handleChannelNumber(keyCodeInfo);
			}

			if (keyCode == KeyEvent.KEYCODE_DEL) {
				handleDelChannelNumber(keyCodeInfo);

			}
		}

		if (msgValue != null) {

			try {
				JSONObject message = new JSONObject();
				message.put("action", "keyEvent");
				message.put("key", msgValue);
				appView.sendJavascript("handlerCordovaMsg('"
						+ message.toString() + "')");
			} catch (JSONException e) {
				Log.e(TAG, "JSONException: " + e.getMessage());
			}

		}

		if (event.getAction() == KeyEvent.ACTION_DOWN) {
			return appView.onKeyDown(event.getKeyCode(), event);
		} else if (event.getAction() == KeyEvent.ACTION_UP) {
			return appView.onKeyUp(event.getKeyCode(), event);
		}
		return true;
	}
	/*private void setListener() {
		if (launcherView == null) {
			return;
		}
		launcherView.setOnKeyListener(new OnKeyListener() {

			public boolean onKey(View v, int keyCode, KeyEvent event) {
				boolean isSuccess = false;
				String msgValue = null;
				// if(event.getAction() == KeyEvent.ACTION_UP){
				if (event.getAction() == KeyEvent.ACTION_DOWN) {
					KeyCodeInfo keyCodeInfo;
					
					switch (keyCode) {
					case KeyEvent.KEYCODE_MENU:
	                	msgValue = "menu";
	                	isSuccess = true;
	                	keyCodeInfo = new KeyCodeInfo();
	                	keyCodeInfo.setMsgValue(msgValue);
	                	keyCodeInfo.setSuccess(isSuccess);
	                	break;
					case KeyEvent.KEYCODE_F1:
	                	msgValue = "key_f1";
	                	isSuccess = true;
	                	keyCodeInfo = new KeyCodeInfo();
	                	keyCodeInfo.setMsgValue(msgValue);
	                	keyCodeInfo.setSuccess(isSuccess);
	                	break;
					case KeyEvent.KEYCODE_F2:
	                	msgValue = "key_f2";
	                	isSuccess = true;
	                	keyCodeInfo = new KeyCodeInfo();
	                	keyCodeInfo.setMsgValue(msgValue);
	                	keyCodeInfo.setSuccess(isSuccess);
	                	break;
					case KeyEvent.KEYCODE_F3:
	                	msgValue = "key_f3";
	                	isSuccess = true;
	                	keyCodeInfo = new KeyCodeInfo();
	                	keyCodeInfo.setMsgValue(msgValue);
	                	keyCodeInfo.setSuccess(isSuccess);
	                	break;
					case KeyEvent.KEYCODE_F4:
	                	msgValue = "key_f4";
	                	isSuccess = true;
	                	keyCodeInfo = new KeyCodeInfo();
	                	keyCodeInfo.setMsgValue(msgValue);
	                	keyCodeInfo.setSuccess(isSuccess);
	                	break;
					case KeyEvent.KEYCODE_F9:
	                	msgValue = "key_f9";
	                	isSuccess = true;
	                	keyCodeInfo = new KeyCodeInfo();
	                	keyCodeInfo.setMsgValue(msgValue);
	                	keyCodeInfo.setSuccess(isSuccess);
	                	break;
					case KeyEvent.KEYCODE_F10:
	                	msgValue = "key_f10";
	                	isSuccess = true;
	                	keyCodeInfo = new KeyCodeInfo();
	                	keyCodeInfo.setMsgValue(msgValue);
	                	keyCodeInfo.setSuccess(isSuccess);
	                	break;
					case KeyEvent.KEYCODE_F11:
	                	msgValue = "key_f12";
	                	isSuccess = true;
	                	keyCodeInfo = new KeyCodeInfo();
	                	keyCodeInfo.setMsgValue(msgValue);
	                	keyCodeInfo.setSuccess(isSuccess);
	                	break;
					case KeyEvent.KEYCODE_F12:
	                	msgValue = "key_f12";
	                	isSuccess = true;
	                	keyCodeInfo = new KeyCodeInfo();
	                	keyCodeInfo.setMsgValue(msgValue);
	                	keyCodeInfo.setSuccess(isSuccess);
	                	break;
					case KeyEvent.KEYCODE_MOVE_HOME:
	                	msgValue = "key_menu_virtual";
	                	isSuccess = true;
	                	keyCodeInfo = new KeyCodeInfo();
	                	keyCodeInfo.setMsgValue(msgValue);
	                	keyCodeInfo.setSuccess(isSuccess);
	                	break;
	                	

					default:
						keyCodeInfo = KeyCodeUtil.getKeyCodeInfo(keyCode);
						msgValue = keyCodeInfo.getMsgValue();
						break;
					}
					

					

					int duration = Toast.LENGTH_SHORT;
					Toast.makeText(
							getContext(),
							"KEY_CODE = " + keyCode + " ==> "
									+ keyCodeInfo.getMsgValue(), duration)
							.show();

					if (KeyCodeUtil.isNumberKey(keyCode)) {
						handleChannelNumber(keyCodeInfo);
					}
					
					if(keyCode == KeyEvent.KEYCODE_DEL){
			        	 handleDelChannelNumber(keyCodeInfo);
			        	 
			        }
					
					if (keyCode == KeyEvent.KEYCODE_UNKNOWN) {
                        handleHomeWSharkKeyboard();
                    }
				}
				
				if(launcherView != null && msgValue != null){
		        	 
		        	 try {
		        		JSONObject message = new JSONObject();
						message.put("action", "keyEvent");
						message.put("key", msgValue);
						launcherView.sendJavascript("handlerCordovaMsg('" + message.toString() + "')");
					} catch (JSONException e) {
						Log.e(TAG, "JSONException: " +e.getMessage());
					}
		        	 
		         }

				return onKeyDown(keyCode, event);
				// return isSuccess;
			}
		});
	}*/
	
	 private void handleHomeWSharkKeyboard() {
        launcherView.sendJavascript("handlerHomeButton('false')");
    }
	 
	private void handleDelChannelNumber(KeyCodeInfo keyCodeInfo) {
		Log.d(VpMainActivity.class.getSimpleName(), "---------------handleDelChannelNumber: " + keyCodeInfo.getMsgValue() + "AppPreferences.INSTANCE.isChannelNumber(): " + com.vp9.util.AppPreferences.INSTANCE.isChannelNumber());
		if(!com.vp9.util.AppPreferences.INSTANCE.isChannelNumber()){
//			com.vp9.util.AppPreferences.INSTANCE.saveIsChannelNumber(true);
			Log.d(VpMainActivity.class.getSimpleName(), "---------------handleDelChannelNumber: " + keyCodeInfo.getMsgValue() + "AppPreferences.INSTANCE.isChannelNumber(): " + com.vp9.util.AppPreferences.INSTANCE.isChannelNumber());
			tvChannel.setVisibility( View.INVISIBLE);
			return;
		}else{
			tvChannel.setVisibility( View.VISIBLE);
		}
		
		runOnUiThread(new Runnable(){
			@Override
			public void run() {
				
				if(time != null){
					time.cancel();
					if(timer != null){
						timer.cancel();
					}
				}
				
				CharSequence text = tvChannel.getText();
				if(text != null){
					String channelNum = text.toString();
					if(channelNum != null && channelNum.trim().length() < 1){
						
						if(time != null){
							time.cancel();
							if(timer != null){
								timer.cancel();
							}
						}
						
						channelNum = "-";
						tvChannel.setText(channelNum);
						
					}else if(channelNum != null){
						if(time != null){
                            time.cancel();
                            if(timer != null){
                                timer.cancel();
                            }
                        }
						
						if (channelNum.endsWith("-")) {
							channelNum = "-";
							tvChannel.setText(channelNum);

						}else{
							channelNum = channelNum.trim().substring(0, channelNum.trim().length() - 1);
							channelNum += "-";
							tvChannel.setText(channelNum);
						}
					}
				}
				
				time = new Timer();
				time.schedule(new TimerTask() {
					public void run() {
						intVisibilityTextChannel();
					}
				}, 3000);
				
			}
		});
		
		
		
	}

	protected synchronized void handleChannelNumber(final KeyCodeInfo keyCodeInfo) {
		if (!com.vp9.util.AppPreferences.INSTANCE.isChannelNumber()) {
			tvChannel.setVisibility(View.INVISIBLE);
			return;
		} else {
			tvChannel.setVisibility(View.VISIBLE);
		}
		runOnUiThread(new Runnable() {
			@Override
			public void run() {
				CharSequence text = tvChannel.getText();
				if (text != null) {
					String channelNum = text.toString();
//					Log.e("TAG " + VP9Launcher.class.getSimpleName(),
//							"channelNum: " + channelNum);
//					Toast.makeText(getContext(), "channelNum: " + channelNum,
//							Toast.LENGTH_LONG).show();

					if (channelNum != null) {
						if (channelNum.endsWith("-") && channelNum.length() < 3) {
							if (time != null) {
								time.cancel();
							}
							channelNum = channelNum.replace("-",
									keyCodeInfo.getMsgValue());
							tvChannel.setVisibility(View.VISIBLE);

							if (channelNum.length() < 2) {
								tvChannel.setText(channelNum + "-");
							} else {
								tvChannel.setText(channelNum);
//								launcherView.sendJavascript("handlerTiviChannel('"
//										+ channelNum + "')");
//								launchingApp(channelNum, Config.PACKAGE_TVAPP,
//										Config.ACTIVITY_TVAPP);
//								launcherView.sendJavascript("playTiviChannel('" + channelNum + "')");
							}

						} else if (channelNum.length() < 2) {
							if (time != null) {
								time.cancel();
							}
							tvChannel.setVisibility(View.VISIBLE);
							tvChannel.setText(channelNum
									+ keyCodeInfo.getMsgValue() + "-");
						}
					}
				} else {
					if (time != null) {
						time.cancel();
					}
					tvChannel.setVisibility(View.VISIBLE);
					tvChannel.setText(keyCodeInfo.getMsgValue() + "-");
				}

				time = new Timer();
				time.schedule(new TimerTask() {
					public void run() {
						intVisibilityTextChannel();
					}
				}, 3000);

			}
		});
	}
	
	protected synchronized void intVisibilityTextChannel() {
		runOnUiThread(new Runnable() {
			@Override
			public void run() {
				CharSequence text = tvChannel.getText();
				
				if (timer != null) {
					timer.cancel();
	            }
				 
				if (text != null) {
					channelNum = text.toString();
					if (channelNum != null && channelNum.trim().endsWith("-")) {
						channelNum = channelNum.trim().substring(0, channelNum.trim().length() - 1);
						tvChannel.setText(channelNum);
					}
				}

				timer = new Timer();
				timer.schedule(new TimerTask() {
					public void run() {
						runOnUiThread(new Runnable() {
							@Override
							public void run() {
								tvChannel.setVisibility(View.INVISIBLE);
								tvChannel.setText("");

//								launcherView.sendJavascript("handlerTiviChannel('" + channelNum
//										+ "')");
								
//								launchingApp(channelNum, Config.PACKAGE_TVAPP,
//										Config.ACTIVITY_TVAPP);
								launcherView.sendJavascript("playTiviChannel('" + channelNum + "')");
								
							}
						});
					}
				}, 1000);
				
				
			}

		});

	}

	private void exitApp() {
		finish();
		// Intent intent = new Intent(Intent.ACTION_MAIN);
		// intent.addCategory(Intent.CATEGORY_HOME);
		// intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		// startActivity(intent);
		if (launcherView != null) {
			launcherView.handlePause(true);
		}
		android.os.Process.killProcess(android.os.Process.myPid());
		super.onDestroy();
		System.exit(0);
	}

	private void launchingApp(String channelNum, String _apppackage,
			String _appactivity) {
		try {
			String appPackage = _apppackage;
			String appActivity = _appactivity;
			Log.e(TAG,"---------------" + appPackage + "-" + appActivity);

			/*
			 * Intent intent = this.cordova.getActivity().getPackageManager().
			 * getLaunchIntentForPackage(appPackage);
			 * intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			 * this.cordova.getActivity().startActivity(intent);
			 */

			ComponentName name = new ComponentName(appPackage, appActivity);
			Intent i = new Intent(Intent.ACTION_MAIN);
			
			Bundle b = new Bundle();
			b.putString("type","tivi");
			b.putString("channelNum", channelNum);
			b.putString("url", Config.URL_TVAPP);
			i.putExtra("start", b);
		
			
			Log.e(TAG, "----------------- setBundle: " + channelNum + " url: " + Config.URL_TVAPP);

			i.addCategory(Intent.CATEGORY_LAUNCHER);
			i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK
					| Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
			i.setComponent(name);

			startActivity(i);
		} catch (Exception e) {
			Log.e(TAG, "----------------- Exception: " + e.getMessage());

			String appPackage = _apppackage;
			String appActivity = _appactivity;
			
			if (appActivity.substring(0, 1).indexOf(".") < 0) {
				appActivity = "." + appActivity;
			}
			
			ComponentName name = new ComponentName(appPackage, appPackage+appActivity);
			Intent i = new Intent(Intent.ACTION_MAIN);
			Bundle b = new Bundle();
			b.putString("type","tivi");
			b.putString("channelNum", channelNum);
			b.putString("url", Config.URL_TVAPP);
			i.putExtra("start", b);
			Log.e(TAG, "--------------setBundle: " + channelNum + " url: " + Config.URL_TVAPP);

			i.addCategory(Intent.CATEGORY_LAUNCHER);
			i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK
					| Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
			i.setComponent(name);

			startActivity(i);
		}
	}

	private void generateIcon(Intent _intent) {
		final Intent intent = _intent;
		Log.d(TAG, "---------------- VP9LAUNCHER: generateIcon");
		new Thread(new Runnable() {
			@Override
			public void run() {
				PackageManager pm = getPackageManager();
				ApplicationInfo ai;
				final String applicationName;
				String packageName = null;
				
				try {
					packageName = intent.getData().toString().split(":")[1];
					Log.d(TAG, packageName);
					ai = pm.getApplicationInfo(packageName, 0);
				} catch (final NameNotFoundException e) {
					ai = null;
				}
				applicationName = (String) (ai != null ? pm.getApplicationLabel(ai)
						: "(unknown)");
		
				Intent launchIntentForPackage = pm
						.getLaunchIntentForPackage(packageName);
				
				String[] appIntent;
				if (launchIntentForPackage != null) {
					appIntent = launchIntentForPackage.toString().split("/");
					final String activityName = appIntent[1].substring(0,
							appIntent[1].length() - 2);
			
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
					File file = new File(sdcard, "/VP9Launcher/settings/icons/" + filename
							+ ".png");
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
						json.put("name", applicationName)
								.put("activity", activityName)
								.put("package", packageName)
								.put("path",
										"file:///" + sdcard.getAbsolutePath()
												+ "/VP9Launcher/settings/icons/" + filename
												+ ".png");
						Log.d("TAG", "---------------- VP9LAUNCHER: addapp : " + json.toString());
						Vp9Launcher.this.launcherView.sendJavascript("refreshView('addapp', '" + json.toString() + "')");
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}	
			}
		}).start();
		
		

//		return json.toString();
	}

	private void removeIcon(Intent _intent) {
		final Intent intent = _intent;
		Log.d(TAG, "---------------- VP9LAUNCHER: removeIcon");
		new Thread(new Runnable() {
			@Override
			public void run() {
				String packageName = null;

				packageName = intent.getData().toString().split(":")[1];
				
				File sdcard = Environment.getExternalStorageDirectory();
				File file = new File(sdcard, "/VP9Launcher/settings/icons/" + packageName
						+ ".png");
				boolean result = file.delete();
				
				
				Log.d(TAG, "---------------- VP9LAUNCHER: removeIcon result: " + result );
				if (result) {
					Vp9Launcher.this.launcherView.sendJavascript("refreshView('removeapp',  '" + packageName + "')");
				}
			}
		}).start();
		
//		return result == true ? packageName : "";
	}
	
	private void startServiceProxy(){
		Intent i = new Intent("VpService");
		i.setComponent(new ComponentName("vp9.videoproxy", "vp9.videoproxy.MyService"));
		ComponentName c = startService(i);
		if (c != null) {
			Toast.makeText(this, "ok", Toast.LENGTH_SHORT).show();
		}else{
			Toast.makeText(this, "fail", Toast.LENGTH_SHORT).show();
		}
	}

	@Override
	public void startActivityForResult(CordovaPlugin command, Intent intent,
			int requestCode) {
		// TODO Auto-generated method stub
		this.activityResultCallback = command;
		this.activityResultKeepRunning = this.keepRunning;

		// If multitasking turned on, then disable it for activities that return
		// results
		if (command != null) {
			this.keepRunning = false;
		}

		// Start activity
		super.startActivityForResult(intent, requestCode);
	}

	@Override
	public void setActivityResultCallback(CordovaPlugin plugin) {
		// TODO Auto-generated method stub
		this.activityResultCallback = plugin;
	}

	@Override
	public Activity getActivity() {
		// TODO Auto-generated method stub
		return this;
	}

	@Override
	public Object onMessage(String id, Object data) {
		// TODO Auto-generated method stubLOG.d(TAG, "onMessage(" + id + "," +
		// data + ")");
		if ("exit".equals(id)) {
			super.finish();
		}
		return null;
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode,
			Intent intent) {
		super.onActivityResult(requestCode, resultCode, intent);
		CordovaPlugin callback = this.activityResultCallback;
		if (callback != null) {
			callback.onActivityResult(requestCode, resultCode, intent);
		}
	}

	@Override
	public ExecutorService getThreadPool() {
		// TODO Auto-generated method stub
		return threadPool;
	}

	public boolean showApp() {
		if (appView == null) {
			return false;
		}
		launcherView.setVisibility(View.GONE);
		appView.setVisibility(View.VISIBLE);

		ViewGroup parent = (ViewGroup) launcherView.getParent();

		parent.removeView(launcherView);
		parent.addView(launcherView);

		return true;
	}

	public boolean hideApp() {
		if (appView == null) {
			return false;
		}
		appView.setVisibility(View.GONE);
		launcherView.setVisibility(View.VISIBLE);

		ViewGroup parent = (ViewGroup) appView.getParent();
		parent.removeView(appView);
		parent.addView(appView);

		return true;
	}

	public boolean loadApp(String url) {
		if (appView == null) {
			return false;
		}
		if (url == null) {
			appView.loadUrl("file:///android_asset/www/blank.html");
		}
		else {
			appView.loadUrl(url);
			launcherView.sendJavascript("onAppOpening('" + url + "')");
		}
		// appView.stopLoading();
		return true;
	}

	public boolean runApp(String js) {
		Log.d(TAG, js);
		if (appView == null) {
			return false;
		}
		appView.sendJavascript(js);
		return true;
	}
}
