package com.vp9.laucher.phonegap;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.vp9.laucher.main.application.Vp9Application;
import com.vp9.laucher.main.vp9launcher.Vp9Launcher;

public class Launcher extends CordovaPlugin {
	private CordovaWebView launcherView;
	private CordovaWebView appView;

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		// TODO Auto-generated method stub
		if (action.equals("open_app")) {
			handleOpen(args, callbackContext);
			return true;
		}

		if (action.equals("close_app")) {
			handleClose(args, callbackContext);
			return true;
		}

		if (action.equals("show_app")) {
			handleShow(args, callbackContext);
			return true;
		}

		if (action.equals("hide_app")) {
			handleHide(args, callbackContext);
			return true;
		}

		if (action.equals("load_app")) {
			handleLoad(args, callbackContext);;
			return true;
		}

		if (action.equals("run_app")) {
			handleRun(args, callbackContext);
			return true;
		}
		
		if (action.equals("opened_app")) {
			handleOpened(args, callbackContext);
			return true;
		}
		return false;
		// return super.execute(action, args, callbackContext);
	}

	private void handleOpened(JSONArray args, CallbackContext callbackContext) {
		Vp9Application vp9Application = (Vp9Application) cordova.getActivity().getApplication();
		launcherView = vp9Application.getAppView();
		appView = vp9Application.getRunView();
		cordova.getActivity().runOnUiThread(new Runnable() {
			@Override
			public void run() {
				Vp9Launcher activity = (Vp9Launcher) cordova.getActivity();
				activity.showApp();
				launcherView.sendJavascript("onAppOpened('" + appView.getUrl() + "')");
			}
		});
	}

	private void handleRun(final JSONArray args, final CallbackContext callbackContext) {
		cordova.getActivity().runOnUiThread(new Runnable() {
			@Override
			public void run() {
				try {
					JSONObject jsonObject = args.getJSONObject(0);
					String js = jsonObject.getString("js");
					if (js != null) {
						Vp9Launcher activity = (Vp9Launcher) cordova.getActivity();
						activity.runApp(js);
						callbackContext.success("success");
					}
					callbackContext.error("js null");
				} catch (JSONException e) {
					e.printStackTrace();
					callbackContext.error("JSON parse");
				}
			}
		});
	}

	private void handleHide(final JSONArray args, final CallbackContext callbackContext)
			throws JSONException {
		cordova.getActivity().runOnUiThread(new Runnable() {
			@Override
			public void run() {
				Vp9Launcher activity = (Vp9Launcher) cordova.getActivity();
				activity.hideApp();
				callbackContext.success("success");
			}
		});
	}

	private void handleShow(final JSONArray args, final CallbackContext callbackContext)
			throws JSONException {
		cordova.getActivity().runOnUiThread(new Runnable() {
			@Override
			public void run() {
				Vp9Launcher activity = (Vp9Launcher) cordova.getActivity();
				activity.showApp();
				callbackContext.success("success");
			}
		});
	}

	private void handleLoad(final JSONArray args, final CallbackContext callbackContext)
			throws JSONException {
		cordova.getActivity().runOnUiThread(new Runnable() {
			@Override
			public void run() {
				Vp9Launcher activity = (Vp9Launcher) cordova.getActivity();
				/*String url = "file:///android_asset/www/blank.html";*/
				String url = null;
				try {
					JSONObject jsonObject = args.getJSONObject(0);
					String jurl = jsonObject.getString("url");
					if (jurl != null) {
						url = jurl;
					}
				} catch (JSONException e) {
					e.printStackTrace();
				}
				activity.loadApp(url);
				callbackContext.success("success");
			}
		});
	}

	private void handleOpen(final JSONArray args,
			final CallbackContext callbackContext) throws JSONException {
		cordova.getActivity().runOnUiThread(new Runnable() {
			@Override
			public void run() {
				Vp9Launcher activity = (Vp9Launcher) cordova.getActivity();
				activity.showApp();
				try {
					JSONObject jsonObject = args.getJSONObject(0);
					String url = jsonObject.getString("url");
					if (url != null) {
						activity.loadApp(url);
						callbackContext.success("success");
					}
					else {
						callbackContext.error("URL null");
					}
				} catch (JSONException e) {
					e.printStackTrace();
					callbackContext.error("JSON parse");
				}
			}
		});
	}

	private void handleClose(final JSONArray args,
			final CallbackContext callbackContext) throws JSONException {
		cordova.getActivity().runOnUiThread(new Runnable() {

			@Override
			public void run() {
				Vp9Launcher activity = (Vp9Launcher) cordova.getActivity();
				activity.hideApp();
				/*String url = "file:///android_asset/www/blank.html";*/
				String url = null;
				try {
					JSONObject jsonObject = args.getJSONObject(0);
					String jurl = jsonObject.getString("url");
					if (url != null) {
						url = jurl;
					}
				} catch (JSONException e) {
					e.printStackTrace();
				}
				activity.loadApp(url);
				callbackContext.success("success");
			}
		});
	}
}