package com.vp9.laucher.phonegap;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.StatFs;
import android.util.Log;

public class HandlerEvents extends CordovaPlugin {

    private String TAG = "HandlerEvents";

	@Override
	public boolean execute(String action, final JSONArray args,
			final CallbackContext callbackContext) throws JSONException {
		if(action.equals("install_app")){
			handleInstallApp(args, callbackContext);
		}else if(action.equals("set_tivi_channel")){
			com.vp9.util.AppPreferences.INSTANCE.saveIsChannelNumber(true);
		}else if(action.equals("cancel_tivi_channel")){
			com.vp9.util.AppPreferences.INSTANCE.saveIsChannelNumber(false);
		}

		callbackContext.success("success");	
		return true;
	}

	private void handleInstallApp(JSONArray args, CallbackContext callbackContext) throws JSONException {
		if(args != null && args.length() > 0){
			JSONObject obj = args.getJSONObject(0);
			if(obj != null && obj.getString("url") != null){
				String downloadUrl = obj.getString("url");
				String[] strUrls = downloadUrl.split("/");
				if(strUrls != null && strUrls.length > 0 && strUrls[strUrls.length - 1] != null && strUrls[strUrls.length - 1].endsWith(".apk")){
					String appName = strUrls[strUrls.length - 1];
			 		  try {
						  final DownloadFile downloadFile = new DownloadFile(downloadUrl, appName);
						  downloadFile.execute();
						  
//						  while(!downloadFile.isFinish && !downloadFile.isCancelled()){
//							  try {
//								Thread.sleep(100);
//							} catch (InterruptedException e) {
//								Log.e("Download install file", e.getMessage());
//							}
//						  }
//						  
//						  if(!downloadFile.isInstall){
//							  displayQuitDownloadDiaglog(); 
//						  } 

//				            URL url = new URL(downloadUrl);
//				            HttpURLConnection c = (HttpURLConnection) url.openConnection();
//				            c.setRequestMethod("GET");
//				            c.setDoOutput(true);
//				            c.connect();
//				  
//				            String PATH = "/mnt/sdcard/Download/";
//				            
//				            File file = new File(PATH);
//				            file.mkdirs();
//				            File outputFile = new File(file, appName);
//				            if(outputFile.exists()){
//				                outputFile.delete();
//				            }
//				            FileOutputStream fos = new FileOutputStream(outputFile);
//
//				            InputStream is = c.getInputStream();
//				            
//				            byte[] buffer = new byte[1024];
//				            int len1 = 0;
//				            while ((len1 = is.read(buffer)) != -1) {
//				                fos.write(buffer, 0, len1);
//				            }
//				            fos.close();
//				            is.close();
//				            dlg.dismiss();
//				            Toast.makeText(webView.getContext(), "Handle Install App 1: ", Toast.LENGTH_SHORT).show();
//				            webView.sendJavascript("hiddenDialog(" + 0 + ")");
//				            Toast.makeText(webView.getContext(), "Handle Install App 2: ", Toast.LENGTH_SHORT).show();
//				            Intent intent = new Intent(Intent.ACTION_VIEW);
//				            intent.setDataAndType(Uri.fromFile(new File("/mnt/sdcard/Download/" + appName)), "application/vnd.android.package-archive");
//				            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK); // without this flag android returned a intent error!
//				            webView.getContext().startActivity(intent);


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
		 
		    ProgressDialog  mProgressDialog;
		    private String downloadUrl;
			private String appName;
			
			public boolean isInstall;
//			public boolean isFinish;
		    
		    public DownloadFile(String downloadUrl, String appName){
		    	this.downloadUrl = downloadUrl;
		    	this.appName = appName;
		    	this.isInstall = true;
//		    	this.isFinish = false;
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
		      //  mProgressDialog.setCanceledOnTouchOutside(false);
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
		            if(outputFile.exists()){
		                outputFile.delete();
		            }
		            FileOutputStream fos = new FileOutputStream(outputFile);

		            InputStream is = c.getInputStream();
		            
		            int fileLength = c.getContentLength();
		            
		            long availableSpaceInBytes = getAvailableSpaceInBytes();
		           
		            if(fileLength >= availableSpaceInBytes){
//		            	displayQuitDownloadDiaglog();
		            	isInstall = false;
		            }else{
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
		            

		    }catch (Exception e) {
		            Log.e("Error", e.getMessage());
		            e.printStackTrace();
		        }
		        return null;
		 }

		    @Override
		    protected void onPostExecute(String result) {
		        mProgressDialog.dismiss();
		        if(isInstall){
		            Intent intent = new Intent(Intent.ACTION_VIEW);
		            intent.setDataAndType(Uri.fromFile(new File("/mnt/sdcard/Download/" + appName)), "application/vnd.android.package-archive");
		            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK); // without this flag android returned a intent error!
		            webView.getContext().startActivity(intent);
		        }else{
		        	displayQuitDownloadDiaglog();
		        }
		        
//		        isFinish = true;
		    }

		    @Override
		    protected void onProgressUpdate(Integer... progress) {
		        super.onProgressUpdate(progress);
		        // Update the ProgressBar
		        mProgressDialog.setProgress(progress[0]);

		    }


		    public long getAvailableSpaceInBytes() {
		        long availableSpace = -1L;
//		        StatFs stat = new StatFs(Environment.getExternalStorageDirectory().getPath());
		        StatFs stat = new StatFs("/mnt/sdcard");
		        availableSpace = (long) stat.getAvailableBlocks() * (long) stat.getBlockSize();

		        return availableSpace;
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

}
