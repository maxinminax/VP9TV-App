package com.vp9.plugin;

import java.io.IOException;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.accounts.AccountManagerCallback;
import android.accounts.AccountManagerFuture;
import android.accounts.AuthenticatorException;
import android.accounts.OperationCanceledException;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings.Secure;
import android.util.Log;

import com.google.android.gms.auth.GoogleAuthException;
import com.google.android.gms.auth.GoogleAuthUtil;
import com.google.android.gms.auth.GooglePlayServicesAvailabilityException;
import com.google.android.gms.auth.UserRecoverableAuthException;
import com.vp9.tv.VpMainActivity;
import com.vp9.util.AppPreferences;

public class AccountInfoPlugin extends CordovaPlugin {

	private static final String KEY_USER_SKIPPED_ACCOUNT_SETUP = "setupSkipped";
	private static final String KEY_ACCOUNT_TYPE = "accountType";
	private static final String VALUE_ACCOUNT_TYPE = "com.google";
	private static final String KEY_ACCOUNT_NAME = "authAccount";

	private static final String LOG_TAG = "AccountInfoPlugin";
	private static final int OAUTH_PERMISSIONS_GRANT_INTENT = 7;
	private CallbackContext savedCallbackContext;
	public String mail = "";
	public String scope = "";

	@Override
	public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
		try {
			if (action.equals("getAccountInfos")) {
				handlerGetAccountInfos(callbackContext);
				return true;
			} else if (action.equals("account_gmail_access_token") && args != null && args.length() > 0) {
				handleAuthToken(args, callbackContext);
				return true;
			} else if (action.equals("add_device_account")) {
				Log.d("----------", "------------------------action: " + action);
				
				handleAddDeviceAccount(args, callbackContext);
				return true;
			}
		} catch (Exception e) {
			Log.e(LOG_TAG, e.getMessage());
		}

		callbackContext.error("error");
		return false;
	}

	private void handleAddDeviceAccount(JSONArray args, final CallbackContext callbackContext) {

		// //Account
		// Account account=new Account( , "com.google");
		// AccountManager am = AccountManager.get(webView.getContext());
		// if (am.addAccountExplicitly(account, , userdata))
		// {
		// Bundle result = new Bundle();
		// result.putString(AccountManager.KEY_ACCOUNT_NAME,
		// username.getText().toString());
		// result.putString(AccountManager.KEY_ACCOUNT_TYPE,"com.google");
		// this.cordova.setAccountAuthenticatorResult(result);
		// }
		// a
		
		
		AppPreferences.INSTANCE.saveQuit(false);
		AccountManager acm = AccountManager.get(this.cordova.getActivity());
		acm.addAccount(AccountInfoPlugin.VALUE_ACCOUNT_TYPE, null, null, null, this.cordova.getActivity(), new AccountManagerCallback<Bundle>() {

			@Override
			public void run(AccountManagerFuture<Bundle> arg0) {
				String key_action = "add_device_account";
				JSONObject value_action = new JSONObject();
				
				Bundle bundle;
				try {
					// set action mac dinh
					value_action.put("action", "skip");
					
					bundle = arg0.getResult();

					// Set<String> keySet = bundle.keySet();
					// Iterator<String> iterator =
					// keySet.iterator();
					// while (iterator.hasNext()) {
					// String key = (String) iterator.next();
					// Object objValue = bundle.get(key);
					// String value = objValue.toString();
					//
					// boolean containsKey =
					// bundle.containsKey(key);
					// Toast.makeText(MainActivity.this, "key: "
					// + key + " value: " + value +
					// " containsKey: " + containsKey,
					// Toast.LENGTH_LONG).show();
					// }

					if (bundle.containsKey(AccountInfoPlugin.KEY_USER_SKIPPED_ACCOUNT_SETUP)) {
						boolean isSkipped = bundle.getBoolean(AccountInfoPlugin.KEY_USER_SKIPPED_ACCOUNT_SETUP);

						if (isSkipped) {
							// goi den client: yeu cau gui thong
							// bao yeu cau nhap email
							value_action = new JSONObject();
							value_action.put("action", "skip");
						}
//						Toast.makeText(AccountInfoPlugin.this.cordova.getActivity(), "skipped: " + isSkipped, Toast.LENGTH_SHORT).show();
					} else if (bundle.containsKey(AccountInfoPlugin.KEY_ACCOUNT_TYPE)) {
						String accountType = bundle.get(AccountInfoPlugin.KEY_ACCOUNT_TYPE).toString();
						// neu accountType == "com.google"
						if (accountType.equals(AccountInfoPlugin.VALUE_ACCOUNT_TYPE)) {
							String accountName = bundle.getString(AccountInfoPlugin.KEY_ACCOUNT_NAME);
							// goi den client : yeu cau authentication email moi
							value_action = new JSONObject();
							value_action.put("action", "add").put("account_name", accountName);
						}
					}					
					
				} catch (OperationCanceledException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();

				} catch (AuthenticatorException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				
				try {
					callbackContext.success(new JSONObject().put(key_action, value_action));
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
			}
		}, null);

	}

	private void handlerGetAccountInfos(CallbackContext callbackContext) throws JSONException {
		JSONObject acountInfo = new JSONObject();
		String android_id = Secure.getString(webView.getContext().getContentResolver(), Secure.ANDROID_ID);
		acountInfo.put("DeviceID", android_id);

		JSONArray jsonAccounts = new JSONArray();
		AccountManager mAccountManager = AccountManager.get(webView.getContext());
		Account[] accounts = mAccountManager.getAccountsByType(GoogleAuthUtil.GOOGLE_ACCOUNT_TYPE);
		if (accounts != null) {
			String[] names = new String[accounts.length];
			for (int i = 0; i < names.length; i++) {

				names[i] = accounts[i].name;

				JSONObject jsonAccount = new JSONObject();

				jsonAccount.put("account", names[i]);

				jsonAccounts.put(jsonAccount);
			}
		}

		acountInfo.put("AccountInfos", jsonAccounts);

		callbackContext.success(acountInfo.toString());

	}

	private void handleAuthToken(final JSONArray args, final CallbackContext callbackContext) {
		this.cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					JSONObject obj = args.getJSONObject(0);
					if (obj.has("account")) {
						mail = obj.getString("account");
						scope = "oauth2:https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
						handleAuthTokenWithAccount(mail, scope, callbackContext);
					}
				} catch (JSONException e) {
					Log.e(LOG_TAG, e.getMessage());
				}
			}
		});

	}

	protected void handleAuthTokenWithAccount(String mail, String scope, CallbackContext callbackContext) {
		String token = "";
		Context context = null;
		boolean done = true;

		try {
			context = this.cordova.getActivity();
			// SharedPreferences prefs = context.getSharedPreferences(
			// "com.vp9.app", Context.MODE_PRIVATE);
			// Editor editor = prefs.edit();
			// editor.putBoolean("isQuit", false);
			// editor.commit();
			AppPreferences.INSTANCE.saveQuit(false);
			token = GoogleAuthUtil.getToken(context, mail, scope);
		} catch (GooglePlayServicesAvailabilityException playEx) {
			// Play is not available
			Log.e(LOG_TAG, "Google Play Services is not available", playEx);
		} catch (UserRecoverableAuthException recoverableException) {
			// OAuth Permissions for the app during first run
			this.savedCallbackContext = callbackContext;
			cordova.startActivityForResult(this, recoverableException.getIntent(), OAUTH_PERMISSIONS_GRANT_INTENT);
			Log.e(LOG_TAG, "Recoverable Error occured while getting token. No action was taken as interactive is set to false", recoverableException);
			done = false;
		} catch (Exception e) {
			Log.e(LOG_TAG, "Error occured while getting token", e);
		}

		if (done) {
			handleAuthTokenCallback(mail, token, callbackContext);
		}

	}

	@Override
	public void onActivityResult(final int requestCode, final int resultCode, final Intent intent) {
		// Enter only if we have requests waiting
		if (requestCode == OAUTH_PERMISSIONS_GRANT_INTENT) {
			cordova.getThreadPool().execute(new Runnable() {
				@Override
				public void run() {
					if (resultCode == Activity.RESULT_OK) {
						String token = null;
						if (intent.hasExtra("authtoken")) {
							token = intent.getStringExtra("authtoken");
						} else {
							try {
								token = GoogleAuthUtil.getToken(cordova.getActivity(), intent.getExtras().getString("authAccount"), intent.getExtras().getString("service"));
							} catch (UserRecoverableAuthException e) {
								e.printStackTrace();
								savedCallbackContext.error("Auth Error: " + e.getMessage());
								return;
							} catch (IOException e) {
								e.printStackTrace();
								savedCallbackContext.error("Auth Error: " + e.getMessage());
								return;
							} catch (GoogleAuthException e) {
								e.printStackTrace();
								savedCallbackContext.error("Auth Error: " + e.getMessage());
								return;
							}
						}
						if (token == null) {
							savedCallbackContext.error("Unknown auth error.");
						} else {
							handleAuthTokenCallback(mail, token, savedCallbackContext);
						}
					} else {
						savedCallbackContext.error("User did not approve oAuth permissions request");
					}

					savedCallbackContext = null;

				}
			});
		}
	}

	private void handleAuthTokenCallback(String mEmail, String token, CallbackContext callbackContext) {
		Log.i("Token", "Access Token retrieved:" + token);
		if(token == null){
			token = "";
		}
		
		AppPreferences.INSTANCE.saveQuit(true);
		JSONObject objToken = new JSONObject();
		try {
			objToken.put("mail", mEmail);
			objToken.put("token", token);
			//webView.sendJavascript("sendTokenInfo('" + objToken.toString() + "')");
			callbackContext.success(objToken.toString());
		} catch (JSONException e) {
			Log.e(LOG_TAG, e.getMessage());
			callbackContext.error("fail");
		}

	}

	private void handleAccessToken(final CallbackContext callbackContext, final String mEmail) {
		Runnable runnable = new Runnable() {
			public void run() {

				try {
					String token = GoogleAuthUtil.getToken(webView.getContext(), mEmail, "oauth2:https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile");
					if (token != null) {
						Log.i("Token", "Access Token retrieved:" + token);
						JSONObject objToken = new JSONObject();
						objToken.put("mail", mEmail);
						objToken.put("token", token);
						webView.sendJavascript("sendTokenInfo('" + objToken.toString() + "')");
					} else {
						Log.i("Token", "Access Token retrieved:" + token);
						JSONObject objToken = new JSONObject();
						objToken.put("mail", mEmail);
						objToken.put("token", "");
						webView.sendJavascript("sendTokenInfo('" + objToken.toString() + "')");
						callbackContext.success("true");
					}
				} catch (JSONException e) {
					Log.e("JSONException", e.getMessage());
				} catch (IOException transientEx) {
					// Network or server error, try later
					Log.e("IOException", transientEx.toString());
				} catch (UserRecoverableAuthException e) {
					// Recover (with e.getIntent())
					((VpMainActivity) cordova.getActivity()).startActivityForResult(e.getIntent(), 1001);

					Log.e("AuthException", e.toString());

				} catch (GoogleAuthException authEx) {
					// The call is not ever expected to succeed
					// assuming you have already verified that
					// Google Play services is installed.
					Log.e("GoogleAuthException", authEx.toString());
				}
			}

		};
		this.cordova.getActivity().runOnUiThread(runnable);
	}

	// class Authenticate extends AsyncTask<String, String, String> {
	// ProgressDialog pDialog;
	// String mEmail;
	// private CallbackContext callbackContext;
	// public Authenticate(String mail, CallbackContext callbackContext) {
	// this.mEmail = mail;
	// this.callbackContext = callbackContext;
	// }
	// @Override
	// protected void onPreExecute() {
	// super.onPreExecute();
	// pDialog = new ProgressDialog(cordova.getActivity());
	// pDialog.setMessage("Authenticating....");
	// pDialog.setIndeterminate(false);
	// pDialog.setCancelable(true);
	// pDialog.show();
	// }
	// @Override
	// protected void onPostExecute(String token) {
	// pDialog.dismiss();
	// try {
	// if(token != null){
	// Log.i("Token", "Access Token retrieved:" + token);
	// JSONObject objToken = new JSONObject();
	// objToken.put("mail", mEmail);
	// objToken.put("token", token);
	// webView.sendJavascript("sendTokenInfo('" + objToken.toString() + "')");
	// }else{
	// Log.i("Token", "Access Token retrieved:" + token);
	// JSONObject objToken = new JSONObject();
	// objToken.put("mail", mEmail);
	// objToken.put("token", "");
	// webView.sendJavascript("sendTokenInfo('" + objToken.toString() + "')");
	// callbackContext.success("true");
	// }
	// } catch (JSONException e) {
	// Log.v("AcountInfoPlugin", e.getMessage());
	// }
	//
	// }
	//
	// @Override
	// protected String doInBackground(String... arg0) {
	// // TODO Auto-generated method stub
	// String token = null;
	//
	// try {
	// token = GoogleAuthUtil.getToken(
	// cordova.getActivity(),
	// mEmail,
	// "oauth2:https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile");
	// } catch (IOException transientEx) {
	// // Network or server error, try later
	// Log.e("IOException", transientEx.toString());
	// } catch (UserRecoverableAuthException e) {
	// // Recover (with e.getIntent())
	// cordova.getActivity().startActivityForResult(e.getIntent(), 1001);
	//
	// Log.e("AuthException", e.toString());
	//
	// } catch (GoogleAuthException authEx) {
	// // The call is not ever expected to succeed
	// // assuming you have already verified that
	// // Google Play services is installed.
	// Log.e("GoogleAuthException", authEx.toString());
	// }
	//
	// return token;
	// }
	//
	// };
}
