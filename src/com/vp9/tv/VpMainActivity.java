/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.vp9.tv;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.cordova.DroidGap;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.TrafficStats;
import android.os.Build;
import android.os.Bundle;
import android.os.StrictMode;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.webkit.WebSettings.PluginState;
import android.webkit.WebSettings.RenderPriority;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.vp9.laucher.main.util.MyPreference;
import com.vp9.laucher.main.vp9launcher.Vp9Launcher;
import com.vp9.model.KeyCodeInfo;
import com.vp9.player.Vp9Player;
import com.vp9.player.activity.Vp9PlayerInterface;
import com.vp9.player.h265.NewVp9Player;
import com.vp9.player.model.ChangeSubtitle;
import com.vp9.plugin.EventPlayerPlugin;
import com.vp9.util.AppPreferences;
import com.vp9.util.Config;
import com.vp9.util.KeyCodeUtil;

public class VpMainActivity extends Vp9Launcher implements Vp9PlayerInterface {
	// int MIN_FILE_SIZE = 100; // Byte
	int MIN_FILE_SIZE = -100; // Byte
	// String CONFIG_FILE_NAME = "config.txt";
	// String INDEX_FILE = "index.html";
	// private static final String TAG_SETTING = "settings";
	// private static final String TAG_URL = "url";

	// ArrayList<String> listUrl;

	public boolean isFinishLoad = false;

	AlertDialog _alert;
	private TextView tvChannel;
	private Timer time;

	private static int uid;
	private static long totalRxBefore;
	private static long totalTxBefore;
	private static long BeforeTime;

	// traffic

	private double[] arrayTraffic = new double[5];
	private static int index = -1;
	private int len = 0;
	// end traffic
	private Timer timer;
	private String channelNum = null;

	//
	// private float x1,y1,x2,y2;
	//

	private Vp9Player vp9Player;

	private boolean isShowEPG = false;

	private RelativeLayout vp9PlayerLayout;

	private NewVp9Player newVp9Player;

	private int videoType;
	public int playType;

	@SuppressLint("NewApi")
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
		StrictMode.setThreadPolicy(policy);

		Intent callerIntent = getIntent();

		if (!checkOnlineState()) {
			displayQuitAppDiaglog();
		}

		// Goi ham load URL
		// super.setIntegerProperty("splashscreen", R.drawable.ic_launcher);
		//super.setStringProperty("loadingDialog", "loading Dialog, Loading Data...");

		// new by mr.bigsky
		if (appView != null && savedInstanceState != null && !savedInstanceState.isEmpty()) {
			appView.restoreState(savedInstanceState);
			return;
		}

		Bundle serInfoCaller = callerIntent.getBundleExtra("ServerInfo");
		if (serInfoCaller == null || !serInfoCaller.containsKey("url")) {
			exitApp();
			return;
		}

		String url = serInfoCaller.getString("url");
		Log.e("TAG ", "---------------------" + VpMainActivity.class.getSimpleName() + " url: " + url);
		String type = serInfoCaller.getString("type");
		String channelNum = serInfoCaller.getString("channelNum");
		Log.e("TAG ", "---------------------" + VpMainActivity.class.getSimpleName() + "channelNum: " + channelNum);

		try {

			final String urlVideo = url;
			/*View vp9PlayerView = View.inflate(getContext(), R.layout.vp9_player, null);
			this.vp9PlayerLayout = (RelativeLayout) vp9PlayerView.findViewById(R.id.vp9_player_layout);
			this.vp9PlayerLayout.setVisibility(View.GONE);
			root.addView(vp9PlayerView, 0);*/

			View vp9Player = (RelativeLayout) findViewById(R.id.vp9_player_layout);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		// TODO Auto-generated method stub
		if (vp9Player != null) {
			if (vp9Player.handleMainKeyDown(null, keyCode, event)) {
				return super.onKeyDown(keyCode, event);
			}
		}
		return super.onKeyDown(keyCode, event);
	}

	@Override
	public void onDestroy() {
		super.onDestroy();

		SharedPreferences preference = MyPreference.getPreference(getBaseContext());
		MyPreference.setBoolean("confirm_backbutton", false);

		if (_alert != null) {
			_alert.dismiss();
		}

	}

	private void showDialogLoadUrl(final Intent intent) {
		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		builder.setTitle("Url not found");
		builder.setMessage("Error url not found or network is slowly.");
		builder.setCancelable(true);

		Bundle bundle = new Bundle();
		bundle.putBoolean("isUrl", false);
		intent.putExtra("urlStatus", bundle);

		builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface dialog, int id) {
				dialog.dismiss();
				// isFinishLoad = true;
				startActivity(intent);
				finish();
			}
		});

		builder.setNegativeButton("Quit", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface dialog, int id) {
				dialog.dismiss();
				exitApp();
			}
		});

		_alert = builder.create();
		_alert.show();

	}

	private void delay(int time) {
		try {
			Thread.sleep(time);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

	}

	public boolean checkOnlineState() {
		try {
			ConnectivityManager cManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
			NetworkInfo nInfo = cManager.getActiveNetworkInfo();

			Log.v(TAG, "Connection internet Info: " + nInfo);

			if (nInfo != null && nInfo.isConnected()) {
				Log.v(TAG, "Connection internet: " + nInfo.isConnected());
				return true;
			}
			Log.v(TAG, "Connection internet: " + false);
		} catch (Exception e) {
			Log.v(TAG, "Exception Connection internet: " + e.getMessage());
			return false;
		}

		return false;
	}

	private void displayQuitAppDiaglog() {
		PackageManager manager = getPackageManager();
		String versionName = "";

		try {
			PackageInfo info = manager.getPackageInfo(getPackageName(), 0);
			versionName = info.versionName;
		} catch (NameNotFoundException e) {
			Log.e(TAG, e.getMessage());
		}

		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		builder.setTitle("Disconnect Internet");
		builder.setMessage("Internet is not connect. Please, quit App Version " + versionName + "?");
		builder.setCancelable(true);

		builder.setPositiveButton("Try connect", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface dialog, int id) {
				dialog.dismiss();
				if (!checkOnlineState()) {
					displayQuitAppDiaglog();
				}
			}
		});

		builder.setNegativeButton("Quit", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface dialog, int id) {
				dialog.dismiss();
				exitApp();
			}
		});

		_alert = builder.create();
		_alert.show();

		// final Timer t = new Timer();
		// t.schedule(new TimerTask() {
		// public void run() {
		// dlg.dismiss();
		// t.cancel();
		// }
		// }, 15000);

	}

	// @Override
	// protected void onResume() {
	// super.onResume();
	// if(!checkOnlineState()){
	// displayQuitAppDiaglog();
	// }
	// }

	@Override
	protected void onSaveInstanceState(Bundle outState) {
		if (appView != null) {
			appView.saveState(outState);
		}

	}

	@Override
	protected void onRestoreInstanceState(Bundle state) {
		if (appView != null) {
			appView.restoreState(state);
		}
		super.onRestoreInstanceState(state);
	}

	@Override
	public boolean dispatchKeyEvent(KeyEvent event) {
		Log.d("VpMainActivity", "keyCode: " + event.getKeyCode());
		if (event.getAction() != KeyEvent.ACTION_DOWN) {
			return super.dispatchKeyEvent(event);
		}

		if (event.getKeyCode() == KeyEvent.KEYCODE_HOME) {
			Log.v(TAG, "dispatchKeyEvent-KEY_HOME_CODE: " + event.getKeyCode());
			// int duration = Toast.LENGTH_SHORT;
			// Toast.makeText(getContext(), "onKeyDown-KEY_HOME_CODE = " +
			// event.getKeyCode(), duration).show();
			exitApp();
			return true;
		} else {
			boolean isSuccess = false;
			String msgValue = null;
			int keyCode = -1;
			if (event.getAction() == KeyEvent.ACTION_DOWN) {
				KeyCodeInfo keyCodeInfo;
				keyCode = event.getKeyCode();
				switch (keyCode) {
				case KeyEvent.KEYCODE_BACK:
					// Log.v(TAG, "KEYCODE_BACK");
					msgValue = "key_back";
					isSuccess = true;
					keyCodeInfo = new KeyCodeInfo();
					keyCodeInfo.setMsgValue(msgValue);
					keyCodeInfo.setSuccess(isSuccess);

					SharedPreferences preference = MyPreference.getPreference(getBaseContext());
					boolean confirm = MyPreference.getBoolean("confirm_backbutton");
					Log.d(VpMainActivity.class.getSimpleName(), "-------------------- confirm: " + confirm);

					if (!confirm) {
						VpMainActivity.this.finish();
					}
					// }
					// }, 2000);

					break;

				case KeyEvent.KEYCODE_DEL:
					msgValue = "key_del";
					isSuccess = true;
					keyCodeInfo = new KeyCodeInfo();
					keyCodeInfo.setMsgValue(msgValue);
					keyCodeInfo.setSuccess(isSuccess);
					break;
				case KeyEvent.KEYCODE_MENU:
					msgValue = "menu";
					isSuccess = true;
					keyCodeInfo = new KeyCodeInfo();
					keyCodeInfo.setMsgValue(msgValue);
					keyCodeInfo.setSuccess(isSuccess);
					break;
				case KeyEvent.KEYCODE_F1:
					msgValue = "key_F1";
					isSuccess = true;
					keyCodeInfo = new KeyCodeInfo();
					keyCodeInfo.setMsgValue(msgValue);
					keyCodeInfo.setSuccess(isSuccess);
					break;
				case KeyEvent.KEYCODE_F2:
					msgValue = "key_F2";
					isSuccess = true;
					keyCodeInfo = new KeyCodeInfo();
					keyCodeInfo.setMsgValue(msgValue);
					keyCodeInfo.setSuccess(isSuccess);
					break;
				case KeyEvent.KEYCODE_F3:
					msgValue = "key_F3";
					isSuccess = true;
					keyCodeInfo = new KeyCodeInfo();
					keyCodeInfo.setMsgValue(msgValue);
					keyCodeInfo.setSuccess(isSuccess);
					break;
				case KeyEvent.KEYCODE_F4:
					msgValue = "key_F4";
					isSuccess = true;
					keyCodeInfo = new KeyCodeInfo();
					keyCodeInfo.setMsgValue(msgValue);
					keyCodeInfo.setSuccess(isSuccess);
					break;
				case KeyEvent.KEYCODE_F9:
					msgValue = "key_F9";
					isSuccess = true;
					keyCodeInfo = new KeyCodeInfo();
					keyCodeInfo.setMsgValue(msgValue);
					keyCodeInfo.setSuccess(isSuccess);
					break;
				case KeyEvent.KEYCODE_F10:
					msgValue = "key_F10";
					isSuccess = true;
					keyCodeInfo = new KeyCodeInfo();
					keyCodeInfo.setMsgValue(msgValue);
					keyCodeInfo.setSuccess(isSuccess);
					break;
				case KeyEvent.KEYCODE_F11:
					msgValue = "key_F11";
					isSuccess = true;
					keyCodeInfo = new KeyCodeInfo();
					keyCodeInfo.setMsgValue(msgValue);
					keyCodeInfo.setSuccess(isSuccess);
					break;
				case KeyEvent.KEYCODE_F12:
					msgValue = "key_F12";
					isSuccess = true;
					keyCodeInfo = new KeyCodeInfo();
					keyCodeInfo.setMsgValue(msgValue);
					keyCodeInfo.setSuccess(isSuccess);
					break;
				case KeyEvent.KEYCODE_UNKNOWN:
					msgValue = "key_unknow";
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
				// int duration = Toast.LENGTH_SHORT;
				// Toast.makeText(getContext(), "KEY_CODE = " + keyCode +
				// " ==> " + keyCodeInfo.getMsgValue(), duration).show();

				if (KeyCodeUtil.isNumberKey(keyCode)) {
					handleChannelNumber(keyCodeInfo);
				}

				if (keyCode == KeyEvent.KEYCODE_DEL) {
					handleDelChannelNumber(keyCodeInfo);
				}
			}

			if (appView != null && msgValue != null) {

				try {
					JSONObject message = new JSONObject();
					message.put("action", "keyEvent");
					message.put("key", msgValue);
					appView.sendJavascript("handlerCordovaMsg('" + message.toString() + "')");

				} catch (JSONException e) {
					Log.e(TAG, "JSONException: " + e.getMessage());
				}

			}

			if (keyCode == KeyEvent.KEYCODE_BACK && event.getAction() == KeyEvent.ACTION_DOWN) {
				return isSuccess;
			}
			return super.dispatchKeyEvent(event);
		}
	}

	// Override
	// public void onAttachedToWindow(){
	// this.getWindow().setType(WindowManager.LayoutParams.TYPE_KEYGUARD);
	// super.onAttachedToWindow();
	// }

	// @Override
	// public boolean onKeyDown(int keyCode, KeyEvent event) {
	// if (keyCode == KeyEvent.KEYCODE_HOME) {
	// Log.v(TAG, "onKeyDown-KEY_HOME_CODE: " + event.getKeyCode());
	// // int duration = Toast.LENGTH_SHORT;
	// // Toast.makeText(getContext(), "onKeyDown-KEY_HOME_CODE = " +
	// event.getKeyCode(), duration).show();
	// exitApp();
	// return true;
	// }
	// return super.onKeyDown(keyCode, event);
	// }

	private void setListener() {
		if (appView == null) {
			return;
		}
		// appView.setOnKeyListener(new OnKeyListener() {
		//
		// public boolean onKey(View v, int keyCode, KeyEvent event) {
		// return isFinishLoad;
		// boolean isSuccess = false;
		// String msgValue = null;
		// // if(event.getAction() == KeyEvent.ACTION_UP){
		// // Toast.makeText(getContext(), "KEY_CODE = " + keyCode + " ==> " +
		// keyCode, duration).show();
		//
		// if(event.getAction() == KeyEvent.ACTION_DOWN){
		// KeyCodeInfo keyCodeInfo;
		//
		// switch(keyCode){
		// // case KeyEvent.KEYCODE_BACK:
		// //// Log.v(TAG, "KEYCODE_BACK");
		// // msgValue = "key_back";
		// // isSuccess = true;
		// // keyCodeInfo = new KeyCodeInfo();
		// // keyCodeInfo.setMsgValue(msgValue);
		// // keyCodeInfo.setSuccess(isSuccess);
		// //
		// // if(vp9Player != null){
		// // vp9Player.destroy(1);
		// // vp9Player = null;
		// // }
		// //
		// //// timerBackButton.schedule(new TimerTask() {
		// //// @Override
		// //// public void run() {
		// //// SharedPreferences preference =
		// MyPreference.getPreference(getContext());
		// //// boolean confirm = MyPreference.getBoolean("confirm_backbutton");
		// //// Log.d(VpMainActivity.class.getSimpleName(),
		// "-------------------- confirm: " + confirm);
		// ////
		// //// if (!confirm) {
		// //// VpMainActivity.this.finish();
		// //// }
		// //
		// // SharedPreferences preference =
		// MyPreference.getPreference(getContext());
		// // boolean confirm = MyPreference.getBoolean("confirm_backbutton");
		// // Log.d(VpMainActivity.class.getSimpleName(),
		// "-------------------- confirm: " + confirm);
		// //
		// // if (!confirm) {
		// // VpMainActivity.this.finish();
		// // }
		// //
		// //// }
		// //// }, 2000);
		// //
		// //
		// // break;
		//
		// // return true;
		// case KeyEvent.KEYCODE_HOME:
		// msgValue = "key_home";
		// // Log.v(TAG, "KEYCODE_HOME");
		// // int duration = Toast.LENGTH_SHORT;
		// // Toast.makeText(getContext(), "KEY_CODE = " + keyCode,
		// duration).show();
		// // int duration = Toast.LENGTH_SHORT;
		// // Toast.makeText(getContext(), "KEYCODE_HOME-KEY_CODE = " + keyCode,
		// duration).show();
		// exitApp();
		// isSuccess = true;
		// keyCodeInfo = new KeyCodeInfo();
		// keyCodeInfo.setMsgValue(msgValue);
		// keyCodeInfo.setSuccess(isSuccess);
		// break;
		// case KeyEvent.KEYCODE_DEL:
		// msgValue = "key_del";
		// isSuccess = true;
		// keyCodeInfo = new KeyCodeInfo();
		// keyCodeInfo.setMsgValue(msgValue);
		// keyCodeInfo.setSuccess(isSuccess);
		// break;
		//
		// default:
		// keyCodeInfo = KeyCodeUtil.getKeyCodeInfo(keyCode);
		// msgValue = keyCodeInfo.getMsgValue();
		//
		// break;
		// }
		// // int duration = Toast.LENGTH_SHORT;
		// // Toast.makeText(getContext(), "KEY_CODE = " + keyCode + " ==> " +
		// keyCodeInfo.getMsgValue(), duration).show();
		//
		// if(KeyCodeUtil.isNumberKey(keyCode)){
		// handleChannelNumber(keyCodeInfo);
		// }
		//
		// if(keyCode == KeyEvent.KEYCODE_DEL){
		// handleDelChannelNumber(keyCodeInfo);
		//
		// }
		//
		//
		// }
		//
		// if(appView != null && msgValue != null){
		//
		// try {
		// JSONObject message = new JSONObject();
		// message.put("action", "keyEvent");
		// message.put("key", msgValue);
		// appView.sendJavascript("handlerCordovaMsg('" + message.toString() +
		// "')");
		// // if("key_back".equals(msgValue)){
		// // appView.backHistory();
		// // }
		// // if(checkOnlineState()){
		// // appView.sendJavascript("handlerCordovaMsg('" + message.toString()
		// + "')");
		// // if("key_back".equals(msgValue)){
		// // appView.backHistory();
		// // }
		// // }else{
		// // PackageManager manager = getContext().getPackageManager();
		// // String versionName = "";
		// // try {
		// // PackageInfo info =
		// manager.getPackageInfo(getContext().getPackageName(), 0);
		// // versionName = info.versionName;
		// // } catch (NameNotFoundException e) {
		// // Log.e(TAG, e.getMessage());
		// // }
		// // AlertDialog.Builder builder = new
		// AlertDialog.Builder(getActivity());
		// // builder.setTitle("Quit");
		// // builder.setMessage("Are you want to quit App Version " +
		// versionName + "?");
		// // builder.setCancelable(true);
		// //
		// // builder.setPositiveButton("Quit",
		// // new DialogInterface.OnClickListener() {
		// // public void onClick(DialogInterface dialog, int id) {
		// // dialog.dismiss();
		// // exitApp();
		// // }
		// // });
		// //
		// // builder.setNegativeButton("Cancel",
		// // new DialogInterface.OnClickListener() {
		// // public void onClick(DialogInterface dialog, int id) {
		// // dialog.dismiss();
		// // }
		// // });
		// //
		// // final AlertDialog dlg = builder.create();
		// // dlg.show();
		// ////
		// ////
		// //// final Timer t = new Timer();
		// //// t.schedule(new TimerTask() {
		// //// public void run() {
		// //// dlg.dismiss();
		// //// t.cancel();
		// //// }
		// //// }, 15000);
		// // }
		//
		// } catch (JSONException e) {
		// Log.e(TAG, "JSONException: " +e.getMessage());
		// }
		//
		// }
		//
		//
		//
		//
		// if(keyCode == KeyEvent.KEYCODE_BACK && event.getAction() ==
		// KeyEvent.ACTION_DOWN){
		// return isSuccess;
		// }
		// return onKeyDown(keyCode, event);
		// // return isSuccess;
		// }
		// });
	}

	private void handleDelChannelNumber(KeyCodeInfo keyCodeInfo) {
		Log.d(VpMainActivity.class.getSimpleName(),
				"---------------handleDelChannelNumber: " + keyCodeInfo.getMsgValue() + "AppPreferences.INSTANCE.isChannelNumber(): " + AppPreferences.INSTANCE.isChannelNumber());
		if (!AppPreferences.INSTANCE.isChannelNumber()) {
			AppPreferences.INSTANCE.saveIsChannelNumber(true);
			Log.d(VpMainActivity.class.getSimpleName(),
					"---------------handleDelChannelNumber: " + keyCodeInfo.getMsgValue() + "AppPreferences.INSTANCE.isChannelNumber(): " + AppPreferences.INSTANCE.isChannelNumber());
			tvChannel.setVisibility(View.INVISIBLE);
			return;
		} else {
			tvChannel.setVisibility(View.VISIBLE);
		}

		runOnUiThread(new Runnable() {
			@Override
			public void run() {

				if (time != null) {
					time.cancel();
					if (timer != null) {
						timer.cancel();
					}
				}

				CharSequence text = tvChannel.getText();
				if (text != null) {
					String channelNum = text.toString();
					if (channelNum != null && channelNum.trim().length() < 1) {
						if (channelNum.endsWith("-")) {

						} else {
							channelNum = "-";
							tvChannel.setText(channelNum);
						}
					} else if (channelNum != null) {
						if (channelNum.endsWith("-")) {
							channelNum = "-";
							tvChannel.setText(channelNum);

						} else {
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
		Log.d(VpMainActivity.class.getSimpleName(),
				"---------------handleChannelNumber: " + keyCodeInfo.getMsgValue() + "AppPreferences.INSTANCE.isChannelNumber(): " + AppPreferences.INSTANCE.isChannelNumber());
		if (!AppPreferences.INSTANCE.isChannelNumber()) {
			AppPreferences.INSTANCE.saveIsChannelNumber(true);
			Log.d(VpMainActivity.class.getSimpleName(),
					"---------------handleChannelNumber: " + keyCodeInfo.getMsgValue() + "AppPreferences.INSTANCE.isChannelNumber(): " + AppPreferences.INSTANCE.isChannelNumber());
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
					String channelNum = text.toString().trim();
					if (channelNum != null) {
						if (channelNum.endsWith("-") && channelNum.length() < 3) {
							if (time != null) {
								time.cancel();
							}
							channelNum = channelNum.replace("-", keyCodeInfo.getMsgValue());
							tvChannel.setVisibility(View.VISIBLE);
							if (channelNum.length() < 2) {
								tvChannel.setText(channelNum + "-");
							} else {
								tvChannel.setText(channelNum);
								// appView.sendJavascript("handlerTiviChannel('"
								// + channelNum + "')");

								time = new Timer();
								time.schedule(new TimerTask() {
									public void run() {
										intVisibilityTextChannel();
									}
								}, 0);

								return;
							}

						} else if (channelNum.length() < 1) {
							if (time != null) {
								time.cancel();
								if (timer != null) {
									timer.cancel();
								}
							}
							tvChannel.setVisibility(View.VISIBLE);
							tvChannel.setText(channelNum + keyCodeInfo.getMsgValue() + "-");
						} else if (channelNum.length() <= 2 && channelNum.length() >= 1) {
							if (time != null) {
								time.cancel();
								if (timer != null) {
									timer.cancel();
								}
							}
							tvChannel.setVisibility(View.VISIBLE);
							tvChannel.setText(keyCodeInfo.getMsgValue() + "-");
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

								// appView.sendJavascript("handlerTiviChannel('"
								// + channelNum
								// + "')");

								launchingApp(channelNum, Config.PACKAGE_TVAPP, Config.ACTIVITY_TVAPP);

							}
						});
					}
				}, 1000);

			}

		});

	}

	private void exitApp() {
		//phunn
		finish();
		if (launcherView != null) {
			launcherView.handlePause(true);
		}
		android.os.Process.killProcess(android.os.Process.myPid());
		super.onDestroy();
		System.exit(0);
	}

	@Override
	public void onPause() {
		// Always call the superclass method first

		// Release the Camera because we don't need it when paused
		// and other activities might need to use it.
		// if(_alert != null){
		// _alert.dismiss();
		// }
		super.onPause();

		// SharedPreferences prefs = this.getSharedPreferences("com.vp9.app",
		// Context.MODE_PRIVATE);
		// boolean isQuit = prefs.getBoolean("isQuit", true);
		boolean isQuit = AppPreferences.INSTANCE.isQuit();

		Log.d(VpMainActivity.class.getSimpleName(), "------------------------ isquit: " + isQuit);

		if (isQuit) {
			try {
				JSONObject message = new JSONObject();
				message.put("action", "keyEvent");
				message.put("key", "key_pause");
				if (appView != null) {
					appView.sendJavascript("handlerCordovaMsg('" + message.toString() + "')");
				}
			} catch (JSONException e) {
				Log.e(TAG, "JSONException: " + e.getMessage());
			}
			// exitApp();

		} else {
			// Editor editor = prefs.edit();
			// editor.putBoolean("isQuit", true);
			// editor.commit();
			AppPreferences.INSTANCE.saveQuit(true);
		}
	}

	@Override
	protected void onStop() {
		super.onStop();
		finish();
	}

	private boolean isWorkingUrl(String file_url) {
		URL url;
		try {
			url = new URL(file_url);
			URLConnection urlConnection = url.openConnection();
			urlConnection.connect();
			int file_size = urlConnection.getContentLength();
			Log.i("File Size", file_size + "");
			if (file_size > MIN_FILE_SIZE) {
				return true;
			} else {
				return false;
			}
		} catch (MalformedURLException e) {
			Log.e("ERROR", "MalformedURLException: " + e.getMessage());
			return false;
		} catch (IOException e) {
			Log.e("ERROR", "IOException: " + e.getMessage());
			return false;
		} catch (Exception e) {
			Log.e("ERROR", e.getMessage());
			return false;
		}
	}

	private void handleTraffic() {
		String packageName = "com.vp9.tv";
		final PackageManager pm = getPackageManager();
		try {
			ApplicationInfo applicationInfo = pm.getApplicationInfo(packageName, 0);
			uid = applicationInfo.uid;
		} catch (NameNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		BeforeTime = System.currentTimeMillis();
		totalRxBefore = TrafficStats.getUidRxBytes(uid);
		totalTxBefore = TrafficStats.getUidTxBytes(uid);

		Timer timerUpdateTraffic = new Timer();
		timerUpdateTraffic.schedule(new TimerTask() {
			@Override
			public void run() {

				runOnUiThread(new Runnable() {

					@Override
					public void run() {
						long totalRxAfter = TrafficStats.getUidRxBytes(uid);
						long totalTxAfter = TrafficStats.getUidTxBytes(uid);

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
							resultSpeed = resultSpeed / len;
							VpMainActivity.this.appView.sendJavascript("handleTrafficClient('" + String.format("%.2f", rxBPS) + "', '" + String.format("%.0f", resultSpeed) + "Kb/s')");

						} else {
							VpMainActivity.this.appView.sendJavascript("handleTrafficClient(' No uploaded or downloaded bytes.' , 'No uploaded or downloaded bytes.')");
						}

					}
				});
			}
		}, 0, 1000);

	}

	/*
	 * public boolean onTouchEvent(MotionEvent touchevent) { switch
	 * (touchevent.getAction()) { // when user first touches the screen we get x
	 * and y coordinate case MotionEvent.ACTION_DOWN: { x1 = touchevent.getX();
	 * y1 = touchevent.getY();
	 * 
	 * Log.d(VpMainActivity.class.getSimpleName(), "Tocuh: x1: " + x1 +
	 * " - y1: " + y1); break; } case MotionEvent.ACTION_UP: { x2 =
	 * touchevent.getX(); y2 = touchevent.getY();
	 * 
	 * //if left to right sweep event on screen if (x1 < x2) {
	 * Toast.makeText(this, "Left to Right Swap Performed",
	 * Toast.LENGTH_LONG).show(); }
	 * 
	 * // if right to left sweep event on screen if (x1 > x2) {
	 * Toast.makeText(this, "Right to Left Swap Performed",
	 * Toast.LENGTH_LONG).show(); }
	 * 
	 * // if UP to Down sweep event on screen if (y1 < y2) {
	 * Toast.makeText(this, "UP to Down Swap Performed",
	 * Toast.LENGTH_LONG).show(); }
	 * 
	 * //if Down to UP sweep event on screen if (y1 > y2) { Toast.makeText(this,
	 * "Down to UP Swap Performed", Toast.LENGTH_LONG).show(); }
	 * Log.d(VpMainActivity.class.getSimpleName(), "Tocuh: x2: " + x2 +
	 * " - y2: " + y2); break;
	 * 
	 * } } return false; }
	 */

	private void launchingApp(String channelNum, String _apppackage, String _appactivity) {
		try {
			String appPackage = _apppackage;
			String appActivity = _appactivity;
			Log.e("TAG " + this.getClass().getSimpleName(), "channelNum: " + channelNum);
			Log.e("TAG " + this.getClass().getSimpleName(), appPackage + "-" + appActivity);

			/*
			 * Intent intent = this.cordova.getActivity().getPackageManager().
			 * getLaunchIntentForPackage(appPackage);
			 * intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			 * this.cordova.getActivity().startActivity(intent);
			 */

			// ComponentName name = new ComponentName(appPackage, appActivity);
			// Intent i = new Intent(Intent.ACTION_MAIN);
			//
			// Bundle b = new Bundle();
			// b.putString("type","tivi");
			// b.putString("channelNum", channelNum);
			// b.putString("url", Config.URL_TVAPP);
			// i.putExtra("start", b);
			//
			// i.addCategory(Intent.CATEGORY_LAUNCHER);
			// i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK
			// | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
			// i.setComponent(name);
			//
			// startActivity(i);

			VpMainActivity.this.appView.sendJavascript("playtiviChannel('" + channelNum + "')");

		} catch (Exception e) {
			Log.e("TAG " + this.getClass().getSimpleName(), "Exception: " + e.getMessage());

			// String appPackage = _apppackage;
			// String appActivity = _appactivity;
			//
			// if (appActivity.substring(0, 1).indexOf(".") < 0) {
			// appActivity = "." + appActivity;
			// }
			//
			// ComponentName name = new ComponentName(appPackage,
			// appPackage+appActivity);
			// Intent i = new Intent(Intent.ACTION_MAIN);
			// Bundle b = new Bundle();
			// b.putString("type","tivi");
			// b.putString("channelNum", channelNum);
			// b.putString("url", Config.URL_TVAPP);
			// i.putExtra("start", b);
			//
			// i.addCategory(Intent.CATEGORY_LAUNCHER);
			// i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK
			// | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
			// i.setComponent(name);
			//
			// startActivity(i);
		}
	}

	public boolean startNativeVideo(final JSONObject jsonVideoInfo) {
		this.playType = 1;
		if (jsonVideoInfo.has("playType")) {
			try {
				playType = jsonVideoInfo.getInt("playType");
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		if (newVp9Player != null) {
			newVp9Player.destroy(1);
		}
		if (vp9Player != null) {
			vp9Player.destroy(1);
		}

		if (playType == 2) {
			isShowEPG = false;
			// if(newVp9Player != null){
			// newVp9Player.destroy(1);
			// }
			newVp9Player = new NewVp9Player(this);
			newVp9Player.setActivity(VpMainActivity.this);
			ArrayList<String> subtitles = com.vp9.util.AppPreferences.INSTANCE.getSubtitles();
			//newVp9Player.setSettingSubTypes(subtitles); //phunn warning
			initViewIdForNewPlayer(newVp9Player);
			// newVp9Player.setMainLayout(this.vp9PlayerLayout);
			newVp9Player.init();
			setVisibility(appView, View.GONE);
			registerListenerForNewVp9Player(jsonVideoInfo);
			return this.newVp9Player.startNaviteVideo(jsonVideoInfo);
		}

		isShowEPG = false;
		// if(vp9Player != null){
		// vp9Player.destroy(1);
		// }
		//
		vp9Player = new Vp9Player(this);
		vp9Player.setActivity(VpMainActivity.this);
		ArrayList<String> subtitles = com.vp9.util.AppPreferences.INSTANCE.getSubtitles();
		vp9Player.setSettingSubTypes(subtitles);
		initViewIdForPlayer(vp9Player);
		vp9Player.setMainLayout(this.vp9PlayerLayout);
		vp9Player.init();
		setVisibility(appView, View.GONE);
		registerListenerForVp9Player(jsonVideoInfo);
		return this.vp9Player.startNaviteVideo(jsonVideoInfo);
	}

	private void registerListenerForNewVp9Player(JSONObject jsonVideoInfo) {
		try {
			this.videoType = jsonVideoInfo.getInt("videoType");
			this.newVp9Player.btnSetting.setOnClickListener(new Button.OnClickListener() {
				@Override
				public void onClick(View v) {
					handleSettingButtonEventForNew(v);
				}
			});

			this.newVp9Player.btnBack.setOnClickListener(new Button.OnClickListener() {
				@Override
				public void onClick(View v) {
					handleBackButtonEventForNew(v, videoType);
				}
			});
		} catch (JSONException e) {
			e.printStackTrace();
		}

	}

	private void setVisibility(final View appView, final int visibility) {
		runOnUiThread(new Runnable() {
			@Override
			public void run() {
				appView.setVisibility(visibility);
			}
		});

	}

	private void registerListenerForVp9Player(final JSONObject jsonVideoInfo) {
		try {
			this.videoType = jsonVideoInfo.getInt("videoType");
			this.vp9Player.btnSetting.setOnClickListener(new Button.OnClickListener() {
				@Override
				public void onClick(View v) {
					handleSettingButtonEvent(v);
				}
			});

			this.vp9Player.btnBack.setOnClickListener(new Button.OnClickListener() {
				@Override
				public void onClick(View v) {
					handleBackButtonEvent(v, videoType);
				}
			});
		} catch (JSONException e) {
			e.printStackTrace();
		}

	}

	protected void handleBackButtonEvent(View view, int videoType) {
		this.vp9Player.destroy(1);
		this.vp9PlayerLayout.setVisibility(View.GONE);
		setVisibility(appView, View.VISIBLE);
		// appView.setVisibility(View.VISIBLE);
		JSONObject eventData = new JSONObject();
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager.getPlugin("EventPlayerPlugin");
		try {
			eventData.put("action", "backPlayer");
			eventData.put("videoType", videoType);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		bridge.reportEvent(eventData);
	}

	protected void handleBackButtonEventForNew(View view, int videoType) {
		this.newVp9Player.destroy(1);
		this.vp9PlayerLayout.setVisibility(View.GONE);
		setVisibility(appView, View.VISIBLE);
		// appView.setVisibility(View.VISIBLE);
		JSONObject eventData = new JSONObject();
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager.getPlugin("EventPlayerPlugin");
		try {
			eventData.put("action", "backPlayer");
			eventData.put("videoType", videoType);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		bridge.reportEvent(eventData);
	}

	private void initViewIdForNewPlayer(NewVp9Player vp9Player) {

		vp9Player.video_view_id = R.id.video_view;

		vp9Player.pdLoading_id = R.id.pdLoading;

		vp9Player.load_rate_id = R.id.load_rate;

		vp9Player.tvSub_id = R.id.tvSub;

		vp9Player.tvSubMargin_id = R.id.tvSubMargin;

		vp9Player.seekBar_id = R.id.seekBar;

		vp9Player.tvFrom_id = R.id.tvFrom;

		vp9Player.tvTo_id = R.id.tvTo;

		vp9Player.btnPlay_id = R.id.btnPlay;

		vp9Player.btnSub_id = R.id.btnSub;

		vp9Player.btnBack_id = R.id.btnBack;

		vp9Player.btnSetting_id = R.id.btnSetting;

		vp9Player.controller_id = R.id.controller;

		vp9Player.vp9_player_layout_id = R.id.vp9_player_layout;

		vp9Player.loading_layout_id = R.id.loading_layout;

		vp9Player.subtitles_layout_id = R.id.subtitles_layout;

		vp9Player.progess_id = R.id.progess;

		vp9Player.vp9_btn_play_id = R.drawable.vp9_btn_play;

		vp9Player.vp9_btn_pause_id = R.drawable.vp9_btn_pause;

		vp9Player.vp9_btn_sub_id = R.drawable.vp9_btn_sub;

		vp9Player.vp9_btn_sub_hide_id = R.drawable.vp9_btn_sub_hide;

		vp9Player.vp9ChannelImage_id = R.id.Vp9ChannelImage;

		vp9Player.video_title_layout_id = R.id.video_title_layout;

		vp9Player.logo_video_id = R.id.logo_video;

		vp9Player.video_title_id = R.id.video_title;

		vp9Player.logo_id = R.id.logo;

		vp9Player.logo_text_id = R.id.logo_text;

		vp9Player.logo_layout_id = R.id.logo_layout;

		vp9Player.btnChoose_id = R.id.btnChoose;

		vp9Player.btnPrev_id = R.id.btnPrev;

		vp9Player.btnNext_id = R.id.btnNext;

		//vp9Player.notify_id = R.id.notify;

	}

	private void initViewIdForPlayer(Vp9Player vp9Player) {

		vp9Player.video_view_id = R.id.video_view;

		vp9Player.pdLoading_id = R.id.pdLoading;

		vp9Player.load_rate_id = R.id.load_rate;

		vp9Player.tvSub_id = R.id.tvSub;

		vp9Player.tvSubMargin_id = R.id.tvSubMargin;

		vp9Player.seekBar_id = R.id.seekBar;

		vp9Player.tvFrom_id = R.id.tvFrom;

		vp9Player.tvTo_id = R.id.tvTo;

		vp9Player.btnPlay_id = R.id.btnPlay;

		vp9Player.btnSub_id = R.id.btnSub;

		vp9Player.btnBack_id = R.id.btnBack;

		vp9Player.btnSetting_id = R.id.btnSetting;

		vp9Player.controller_id = R.id.controller;

		vp9Player.vp9_player_layout_id = R.id.vp9_player_layout;

		vp9Player.loading_layout_id = R.id.loading_layout;

		vp9Player.subtitles_layout_id = R.id.subtitles_layout;

		vp9Player.progess_id = R.id.progess;

		vp9Player.vp9_btn_play_id = R.drawable.vp9_btn_play;

		vp9Player.vp9_btn_pause_id = R.drawable.vp9_btn_pause;

		vp9Player.vp9_btn_sub_id = R.drawable.vp9_btn_sub;

		vp9Player.vp9_btn_sub_hide_id = R.drawable.vp9_btn_sub_hide;

		vp9Player.vp9ChannelImage_id = R.id.Vp9ChannelImage;

		vp9Player.video_title_layout_id = R.id.video_title_layout;

		vp9Player.logo_video_id = R.id.logo_video;

		vp9Player.video_title_id = R.id.video_title;

		vp9Player.logo_id = R.id.logo;

		vp9Player.logo_text_id = R.id.logo_text;

		vp9Player.logo_layout_id = R.id.logo_layout;

		vp9Player.btnChoose_id = R.id.btnChoose;

		vp9Player.btnPrev_id = R.id.btnPrev;

		vp9Player.btnNext_id = R.id.btnNext;

		//vp9Player.notify_id = R.id.notify;
	}

	protected void handleSettingButtonEvent(View v) {
		if (!this.isShowEPG) {
			showEPG();
		} else {
			closeEPG();
		}

	}

	protected void handleSettingButtonEventForNew(View v) {
		if (!this.isShowEPG) {
			showEPGForNew();
		} else {
			closeEPGForNew();
		}

	}

	public void closeEPGForNew() {
		this.isShowEPG = false;
		setVisibility(appView, View.GONE);
		newVp9Player.closeEPG();
		JSONObject eventData = new JSONObject();
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager.getPlugin("EventPlayerPlugin");
		try {
			eventData.put("action", "closeEPG");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		bridge.reportEvent(eventData);

	}

	public void showEPGForNew() {
		this.isShowEPG = true;
		newVp9Player.showEPG();
		setVisibility(appView, View.VISIBLE);
		runOnUiThread(new Runnable() {

			@Override
			public void run() {
				appView.requestFocus();

			}
		});
		// appView.setVisibility(View.VISIBLE);
		JSONObject eventData = new JSONObject();
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager.getPlugin("EventPlayerPlugin");
		try {
			eventData.put("action", "showEPG");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		bridge.reportEvent(eventData);
	}

	public void closeEPG() {
		this.isShowEPG = false;
		setVisibility(appView, View.GONE);
		vp9Player.closeEPG();
		JSONObject eventData = new JSONObject();
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager.getPlugin("EventPlayerPlugin");
		try {
			eventData.put("action", "closeEPG");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		bridge.reportEvent(eventData);

	}

	public void showEPG() {
		this.isShowEPG = true;
		vp9Player.showEPG();
		setVisibility(appView, View.VISIBLE);
		runOnUiThread(new Runnable() {

			@Override
			public void run() {
				appView.requestFocus();

			}
		});
		// appView.setVisibility(View.VISIBLE);
		JSONObject eventData = new JSONObject();
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager.getPlugin("EventPlayerPlugin");
		try {
			eventData.put("action", "showEPG");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		bridge.reportEvent(eventData);
	}

	public boolean handlerEnventShowEPG() {
		if (this.vp9Player != null) {
			return this.vp9Player.showEPG();
		}

		return false;
	}

	public boolean handlerEnventCloseEPG() {
		if (this.vp9Player != null) {
			return this.vp9Player.closeEPG();
		}

		return false;
	}

	public void playRemoteVideo() {
		if (this.vp9Player != null) {

		}

		if (this.vp9Player != null && playType == 1) {
			if (this.isShowEPG = true) {
				closeEPG();
			} else {
				this.vp9Player.startVideo();
			}
		} else if (this.newVp9Player != null && playType == 2) {
			if (this.isShowEPG = true) {
				closeEPGForNew();
			} else {
				this.newVp9Player.startVideo();
			}
		}
	}

	public void pauseRemoteVideo() {
		if (this.vp9Player != null && playType == 1) {
			this.vp9Player.pause();
		} else if (this.newVp9Player != null && playType == 2) {
			this.newVp9Player.pause();
		}
	}

	public void stopRemoteVideo() {
		if (this.vp9Player != null && this.playType == 1) {
			this.vp9Player.destroy(1);
			setVisibility(this.vp9PlayerLayout, View.GONE);
			setVisibility(appView, View.VISIBLE);
			// JSONObject eventData = new JSONObject();
			// EventPlayerPlugin bridge = (EventPlayerPlugin)
			// appView.pluginManager.getPlugin("EventPlayerPlugin");
			// try {
			// eventData.put("action", "stopPlayer");
			// eventData.put("videoType", videoType);
			// } catch (JSONException e) {
			// e.printStackTrace();
			// }
			// bridge.reportEvent(eventData);
			if (this.vp9Player.isRemoteListener) {
				try {
					JSONObject jsonEvent = new JSONObject();
					jsonEvent.put("action", "stop");
					sendEvent(jsonEvent);
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}

		} else if (this.newVp9Player != null && this.playType == 2) {
			this.newVp9Player.destroy(1);
			setVisibility(this.vp9PlayerLayout, View.GONE);
			setVisibility(appView, View.VISIBLE);
			// JSONObject eventData = new JSONObject();
			// EventPlayerPlugin bridge = (EventPlayerPlugin)
			// appView.pluginManager.getPlugin("EventPlayerPlugin");
			// try {
			// eventData.put("action", "stopPlayer");
			// eventData.put("videoType", videoType);
			// } catch (JSONException e) {
			// e.printStackTrace();
			// }
			// bridge.reportEvent(eventData);
			if (this.newVp9Player.isRemoteListener) {
				try {
					JSONObject jsonEvent = new JSONObject();
					jsonEvent.put("action", "stop");
					sendEvent(jsonEvent);
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}

		}
	}

	public void seekRemoteVideo(int timeSeek) {
		if (this.vp9Player != null && this.playType == 1) {
			this.vp9Player.seekTo(timeSeek);
		}
		if (this.newVp9Player != null && this.playType == 2) {
			this.newVp9Player.seekTo(timeSeek);
		}
	}

	public void changeSubtitleRemoteVideo(ArrayList<ChangeSubtitle> changeSubtitles) {
		if (this.vp9Player != null && this.playType == 1) {
			JSONArray jsonArrSub = this.vp9Player.changeSubtitle(changeSubtitles);
			JSONObject eventData = new JSONObject();
			EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager.getPlugin("EventPlayerPlugin");
			try {
				eventData.put("action", "changeSubtitle");
				eventData.put("result", jsonArrSub);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			bridge.reportEvent(eventData);
		} else if (this.newVp9Player != null && this.playType == 2) {
			JSONArray jsonArrSub = this.newVp9Player.changeSubtitle(changeSubtitles);
			JSONObject eventData = new JSONObject();
			EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager.getPlugin("EventPlayerPlugin");
			try {
				eventData.put("action", "changeSubtitle");
				eventData.put("result", jsonArrSub);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			bridge.reportEvent(eventData);
		}
	}

	public void resendInfoRemoteVideo() {
		if (this.vp9Player != null && this.playType == 1) {
			JSONObject jsonInfCurVideo = this.vp9Player.getInfoCurrentVideo();
			JSONObject eventData = new JSONObject();
			EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager.getPlugin("EventPlayerPlugin");
			try {
				eventData.put("action", "resend_video_info");
				eventData.put("resend_information", jsonInfCurVideo);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			bridge.reportEvent(eventData);
		} else if (this.newVp9Player != null && this.playType == 2) {
			JSONObject jsonInfCurVideo = this.newVp9Player.getInfoCurrentVideo();
			JSONObject eventData = new JSONObject();
			EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager.getPlugin("EventPlayerPlugin");
			try {
				eventData.put("action", "resend_video_info");
				eventData.put("resend_information", jsonInfCurVideo);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			bridge.reportEvent(eventData);
		}
	}

	public void addListenerRemoteVideo() {
		if (this.vp9Player != null && this.playType == 1) {
			this.vp9Player.addListenerRemoteVideo();
		} else if (this.newVp9Player != null && this.playType == 2) {
			this.newVp9Player.addListenerRemoteVideo();
		}
	}

	@Override
	public void sendEvent(JSONObject jsonEvent) {
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager.getPlugin("EventPlayerPlugin");
		bridge.reportEvent(jsonEvent);
	}

	public void changeDisplayScreen(int intFullScreen) {
		if (this.vp9Player != null && this.playType == 1) {
			this.vp9Player.changeDisplayScreen(intFullScreen);
		} else if (this.newVp9Player != null && this.playType == 2) {
			//this.newVp9Player.changeDisplayScreen(intFullScreen);
		}
	}

	public void changeScreenOrientation(String orientation) {
		if (this.vp9Player != null && this.playType == 1) {
			this.vp9Player.changeScreenOrientation(orientation);
		} else if (this.newVp9Player != null && this.playType == 2) {
			//this.newVp9Player.changeScreenOrientation(orientation);
		}
	}

	public void saveSubtiles(ArrayList<String> subTypes) {
		com.vp9.util.AppPreferences.INSTANCE.saveSubtitles(subTypes);
	}

	public void setMessage(String msg) {
		if (this.vp9Player != null && this.playType == 1) {
			//this.vp9Player.setMessage(msg);
		} else if (this.newVp9Player != null && this.playType == 2) {
			//this.newVp9Player.setMessage(msg);
		}

	}


	public void playRelateVideo(JSONObject json) {
		if(this.vp9Player != null && this.playType == 1){
			//this.vp9Player.playRelateVideo(json);
		}else if(this.newVp9Player != null && this.playType == 2){
//			this.newVp9Player.playRelateVideo(json);
		}
		
	}
}
