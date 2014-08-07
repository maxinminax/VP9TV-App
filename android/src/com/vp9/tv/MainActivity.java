package com.vp9.tv;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;
import android.app.AlertDialog;
import android.app.ListActivity;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.vp9.model.AppInfo;
import com.vp9.model.ServerInfo;
import com.vp9.util.AppPreferences;

public class MainActivity extends ListActivity  {
	String CONFIG_FILE_NAME = "config.txt";
	String CONFIG_SPECIAL_PACKAGE = "SpecialPackage.txt";
	String INDEX_FILE = "index.html";
	private ArrayList<ServerInfo> urlList;
	private static final String TAG_SETTING = "settings";
	private static final String  TAG_URL = "url";
	private static final String TAG_NAME = "name";
	
//	private String[] blackPkgNameList = {"com.vp9.game.tv", "com.vp9.film.tv", "com.android.chrome", "com.sungale.smarttv.activity", "com.aetn.aetv.watch", "com.appvn.mobi", "ginlemon.flowerfree"
//			                               ,"android.rockchip.update.service", "com.playmous.ttfdoodle1", "com.rockchip.mediacenter", "com.vng.inputmethod.labankey", "kynam.ime.gotiengviet"};
	
	private String[] blackPkgNameList ={};
	private String[] whitePkgNameList = {"com.vp9.tv"};
	
	private String TAG = "MainActivity";
	
	AlertDialog _alert;
	private String type = "";
	private String server = "";
	private Timer time;
	private String channelNum="";
	
	
	@SuppressWarnings("static-access")
	@SuppressLint("NewApi")
	@Override
	public void onCreate(Bundle savedInstanceState) {
		
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
		AppPreferences.INSTANCE.assignContext(this);
		AppPreferences.INSTANCE.saveQuit(true);
//		startFfmpegService();
		if(!checkOnlineState()){
			displayQuitAppDiaglog();
		}else{
			removeOtherApps();
		}
		
	}
	
	private void startFfmpegService() {
		
		Intent i = new Intent("VpService");
		i.setComponent(new ComponentName("vp9.videoproxy", "vp9.videoproxy.MyService"));
		ComponentName c = MainActivity.this.startService(i);
		
	}

	public void removeOtherApps(){
		
	    PackageManager pm = getPackageManager();
	    //get a list of installed apps.
	    List<ApplicationInfo> packages = pm.getInstalledApplications(0);

	    ActivityManager activityManager = (ActivityManager) getSystemService(ACTIVITY_SERVICE);
	    
	    ArrayList<AppInfo> appInfoList = new ArrayList<AppInfo>();
	    
	    List<RunningAppProcessInfo> processes = activityManager.getRunningAppProcesses();
	   
	    ArrayList<String> runningPkgNames = new ArrayList<String>();
	    
	    Object[] objs = getSpecialPackageNameInfo();
		ArrayList<String> whiteList = (ArrayList<String>) objs[0];
		ArrayList<String> blackList = (ArrayList<String>) objs[1];
		
		for(String specPkgName : blackPkgNameList){
			blackList.add(specPkgName);
		}
		
		for(String whiteName : whitePkgNameList){
			whiteList.add(whiteName);	
		}
		
	    if(processes != null){
		    for(RunningAppProcessInfo processe : processes){
//		    	boolean isSpec = false;
//		    	for(String specPkgName : blackList){
//		    		if(specPkgName.equals(processe.processName)){
//		    			activityManager.killBackgroundProcesses(processe.processName);
//		    			isSpec = true;
//		    			break;
//		    		}
//		    	}
//		    	if(isSpec){
//		    		continue;
//		    	}
		    	runningPkgNames.add(processe.processName);
		    	
		    }
		     
	    }
	    
		for (ApplicationInfo packageInfo : packages) {
			
//			if ((packageInfo.flags & ApplicationInfo.FLAG_SYSTEM) == 1 && 
//					(packageInfo.packageName.startsWith("com.android") || packageInfo.packageName.startsWith("com.google"))){
//				continue;
//			}
			
			if ((packageInfo.flags & ApplicationInfo.FLAG_SYSTEM) == 1){
				continue;
			}
			
			if (isWhitePackageName(whiteList, packageInfo.packageName)){
				continue;
			}
			
			CharSequence appName = pm.getApplicationLabel(packageInfo);
			if(runningPkgNames.contains(packageInfo.packageName)){
//				if(appName != null)  {
//					AppInfo appInfo = new AppInfo(appName.toString(), packageInfo.packageName);
//					appInfoList.add(appInfo);
//				}else{
//					activityManager.killBackgroundProcesses(packageInfo.packageName);
//				}
				
				if (appName != null && isBackPackageName(blackList, packageInfo.packageName)) {
					AppInfo appInfo = new AppInfo(appName.toString(), packageInfo.packageName);
					appInfoList.add(appInfo);
				} else {
					activityManager.killBackgroundProcesses(packageInfo.packageName);
				}
			}
		}
		
//		if(appInfoList.size() > 0){
//			showDialog(appInfoList);
//		}else{
//			handleUrl();
//		}
		
		killApp(appInfoList);
		handleUrl();
	}
	
	private boolean isBackPackageName(ArrayList<String> blackList,
			String packageName) {
		for(String blackName : blackList){
			if(packageName.startsWith(blackName)){
				return true;
			}
		}
		return false;
	}

	private boolean isWhitePackageName(ArrayList<String> whiteList, String packageName) {
		for(String whiteName : whiteList){
			if(packageName.startsWith(whiteName)){
				return true;
			}
		}
		return false;
	}

	public void handleUrl(){
		//new
		Intent callerIntent = getIntent();
		Bundle serInfoCaller = callerIntent.getBundleExtra("start");
		this.type = "";
//		String url_tvApp = "";
		if(serInfoCaller != null && (serInfoCaller.containsKey("type") || serInfoCaller.containsKey("server"))){
			
			type = serInfoCaller.getString("type");
			if (type.equalsIgnoreCase("tivi")) {
				String channelNum = serInfoCaller.getString("channelNum");
//				url_tvApp =  serInfoCaller.getString("url");
				
				if (channelNum != null) {
					this.channelNum = channelNum;
				}
			}
			
			server = serInfoCaller.getString("server");
			Log.e("TAG: ", "-----------------MainActivity - channelNum: " + this.channelNum + "- Type: " + type );
		}
		
		
		SharedPreferences prefs = this.getSharedPreferences("com.vp9.app", Context.MODE_PRIVATE); 
		String restoredUrl = prefs.getString("url", null);
		Log.e("TAG: ", "-----------------MainActivity - restoredUrl: " + restoredUrl );
		String url_use = server != "" ? server : restoredUrl;
		if(checkOnlineState() && url_use != null && checkStatusUrl()){
//		if(restoredUrl != null){
			Intent intent = new Intent(getBaseContext(), VpMainActivity.class);
			intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
			intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
			intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			Bundle bundle=new Bundle();
			
			bundle.putString("url", url_use);
			bundle.putString("type", type);
			if (this.channelNum != null) {
				bundle.putString("channelNum", this.channelNum);
				Log.e("TAG: " + MainActivity.class.getSimpleName(), "channelNum: " + channelNum + " url: " +  url_use);
				Log.e("TAG: ", "-----------------MainActivity - channelNum: " + channelNum + " url: " +  url_use  );
			}
			intent.putExtra("ServerInfo", bundle);
	        startActivity(intent);
	        finish();
	        return;
		}
		setTitle("Choice Server");
		TextView text = (TextView) findViewById(R.id.text);
		text.setText("Select Server:");
		text.setTextColor(Color.BLUE);
		text.setTextSize(36);
		this.urlList = getUrls();
		if(urlList.size() > 0){
			String[] presidents = new String[urlList.size()];
			for(int i = 0; i < urlList.size(); i++){
				ServerInfo usrInfo = urlList.get(i);
				presidents[i] = usrInfo.getDescription();
			}
			ListView listView = getListView();
			 ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,
						android.R.layout.simple_list_item_1, presidents){
			        @Override
			        public View getView(int position, View convertView,
			                ViewGroup parent) {
			            View view =super.getView(position, convertView, parent);

			            TextView textView=(TextView) view.findViewById(android.R.id.text1);

			            /*YOUR CHOICE OF COLOR*/
			            textView.setTextColor(Color.BLUE);

			            return view;
			        }
			    };
			    
			listView.setAdapter(adapter);
			
//			listView.setAdapter(new CustomListAdapter(this,
//					android.R.layout.simple_list_item_1, presidents));
		}
	}
	

    private boolean checkStatusUrl() {
		Intent callerIntent = getIntent();
		Bundle serInfoCaller = callerIntent.getBundleExtra("urlStatus");
		if(serInfoCaller != null && serInfoCaller.containsKey("isUrl")){
			return false;
		}else{
			return true;
		}
		
	}

	@Override
    protected void onResume() {
        super.onResume();
    }  
    
	private void showDialog(final ArrayList<AppInfo> appInfoList) {
//		RemoveAppDialog newFragment = RemoveAppDialog.newInstance(appInfoList, this);
//        newFragment.show(getFragmentManager(), "Remove App Dialog");
		
		    AlertDialog.Builder builder = new AlertDialog.Builder(this);
		    String[] items = new String[appInfoList.size()];
		    boolean[] selects = new boolean[appInfoList.size()];
	    	for(int i = 0; i < appInfoList.size(); i++){
	    		items[i] = appInfoList.get(i).name + " (" + appInfoList.get(i).packageName +")";
	    		selects[i] = true;
	    	}
	    	final ArrayList<Integer> mSelectedItems = new ArrayList<Integer>();
		    // Set the dialog title
//		    builder.setTitle("Remove App Dialog");
	    	builder.setTitle("Hủy các ứng dụng đang chạy ngầm");
//		    .setMessage("Remove some app to run VP9.TV app. Are you okie?")
		    // Specify the list array, the items to be selected by default (null for none),
		    // and the listener through which to receive callbacks when items are selected
		    builder.setMultiChoiceItems(items, selects,
		                      new DialogInterface.OnMultiChoiceClickListener() {
		               @Override
		               public void onClick(DialogInterface dialog, int which,
		                       boolean isChecked) {
		                   if (isChecked) {
		                       // If the user checked the item, add it to the selected items
		                       mSelectedItems.add(which);
		                   } else if (mSelectedItems.contains(which)) {
		                       // Else, if the item is already in the array, remove it 
		                       mSelectedItems.remove(Integer.valueOf(which));
		                   }
		               }
		           });
		    // Set the action buttons
		     builder.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
		               @Override
		               public void onClick(DialogInterface dialog, int id) {
		            	   dialog.dismiss();
		            	   killApp(appInfoList);
		               }
		           });
		     builder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
		               @Override
		               public void onClick(DialogInterface dialog, int id) {
		            	   dialog.dismiss();
							exitApp();
		               }
		           }).setOnCancelListener(new DialogInterface.OnCancelListener(){

		   			@Override
		   			public void onCancel(DialogInterface arg0) {
		   				killApp(appInfoList);
		   			}
		   			
		   		});
		     
		    final AlertDialog dgl = builder.create();
		    dgl.show();
		    
//		    final TextView textView = new TextView(getBaseContext());
//		    builder.setView(textView);
//		     Thread displayThread = new Thread(){
//		    	 public void run(){
//		    		 for(int i = 3; i >= 0; i--){
//		    			 delay(1000);
//		    			 textView.setText("Bạn cần hủy các ứng dụng đang chạy ngầm: " + i);
//		    		 }
//		    		 
//					 killApp(appInfoList);
//		    	 }
//		     };
//		     
//		     displayThread.start();
			this.time = new Timer();
			this.time.schedule(new TimerTask() {
				public void run() {
					dgl.cancel();
					dgl.dismiss();
//					killApp(appInfoList);
//					time.cancel();
				}
			}, 3000);
	}
	
	public void delay(int time){
		try {
			Thread.sleep(time);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	protected synchronized void killApp(ArrayList<AppInfo> appInfoList) {
		if(time != null){
			time.cancel();
		}
		if(appInfoList != null){
			ActivityManager activityManager = (ActivityManager)getSystemService(Context.ACTIVITY_SERVICE);
			for(AppInfo appInfo : appInfoList){
				activityManager.killBackgroundProcesses(appInfo.packageName);
			}
			appInfoList.clear();
		}
		handleUrl();
	}

	public void onListItemClick(ListView parent, View v, int position, long id) {
        Object obj = parent.getItemAtPosition(position);
        String strItem = obj.toString();
		Toast.makeText(this, "You have selected: " + strItem, Toast.LENGTH_SHORT).show();
		
		if(checkOnlineState()){
			Intent intent = new Intent(getBaseContext(),VpMainActivity.class);
			intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
			intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
			intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			
			ServerInfo usrInfo = urlList.get(position);
			Bundle bundle=new Bundle();
			bundle.putString("url", usrInfo.getUrl());
			bundle.putString("type", type);
			if(usrInfo.getServerName() != null){
				bundle.putString("name", usrInfo.getServerName());
			}
			intent.putExtra("ServerInfo", bundle);
		       // Restore preferences
			SharedPreferences prefs = this.getSharedPreferences(
				      "com.vp9.app", Context.MODE_PRIVATE);
	        Editor editor = prefs.edit();
	        editor.putString("url", usrInfo.getUrl());
//	        editor.putBoolean("isQuit", true);
	        editor.commit();
	        startActivity(intent);

	        finish();
		}else{
			
			displayQuitAppDiaglog();
			
		}

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
						if(!checkOnlineState()){
							displayQuitAppDiaglog();					
						}else{
							removeOtherApps();
//							SharedPreferences prefs = getSharedPreferences("com.vp9.app", Context.MODE_PRIVATE); 
//							String restoredUrl = prefs.getString("url", null);
//							if(restoredUrl != null){
//								Intent intent = new Intent(getBaseContext(), VpMainActivity.class);
//								intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
//								intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
//								intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//								Bundle bundle=new Bundle();
//								bundle.putString("url", restoredUrl);
//								intent.putExtra("ServerInfo", bundle);
//						        startActivity(intent);
//						        finish();
//						        return;
//							}
						}
					}
		});
		
		
		builder.setOnCancelListener(new DialogInterface.OnCancelListener(){

			@Override
			public void onCancel(DialogInterface arg0) {
				Toast.makeText(getBaseContext(), "Dang vao onCancel", Toast.LENGTH_SHORT).show();
				displayQuitAppDiaglog();
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

//		final Timer t = new Timer();
//		t.schedule(new TimerTask() {
//			public void run() {
//				dlg.dismiss();
//				t.cancel();
//			}
//		}, 15000);
	
		
	}

	protected void exitApp() {
//		finish();
		super.onDestroy();
//		android.os.Process.killProcess(android.os.Process.myPid());
//		System.exit(0);
	}

	public boolean checkOnlineState() {
		try {
			
		    ConnectivityManager cManager =  (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
		    
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
	
	private Object[] getSpecialPackageNameInfo() {
		File dir = Environment.getExternalStorageDirectory();
		File file = new File(dir, CONFIG_SPECIAL_PACKAGE);
		ArrayList<String> whiteList = new ArrayList<String>();
		ArrayList<String> blackList = new ArrayList<String>();
		if (file.exists()) {
			try {
				BufferedReader br = new BufferedReader(new FileReader(file));
				String line;
				while ((line = br.readLine()) != null) {
					if(!line.startsWith("#")){
						String[] strs = line.split("=");
						if(strs[0] != null && strs[1] != null && strs[0].equals("enable")){
							whiteList.add(strs[1]);
						}else if(strs[0] != null && strs[1] != null  && strs[0].equals("disable")){
							blackList.add(strs[1]);
						}
					}
				}
				br.close();
			}catch (IOException e) {
				Log.v(TAG, e.getMessage());
			}
		}
		Object[] objs = new Object[2];
		objs[0] = whiteList;
		objs[1] = blackList;
		return objs;
		
	}
	
	private ArrayList<ServerInfo> getUrls() {
		ArrayList<ServerInfo> listUrl = new ArrayList<ServerInfo>();
		File dir = Environment.getExternalStorageDirectory();
//		String baseDir = Environment.getExternalStorageDirectory().getAbsolutePath();
//		Log.e("File", "file: " + baseDir);
		File file = new File(dir, CONFIG_FILE_NAME);
		
		
		if (file.exists()) {
			try {
				BufferedReader br = new BufferedReader(new FileReader(file));
				String line;
				String jsonString = "";
				while ((line = br.readLine()) != null) {
					jsonString += line;
				}
				br.close();
				JSONObject jsonServerInfos = new JSONObject(jsonString);
				JSONArray settings = jsonServerInfos.getJSONArray(TAG_SETTING);
				if(settings != null){
					for(int i = 0; i < settings.length(); i++){
				        JSONObject setting = settings.getJSONObject(i);
				        if(setting == null){
				        	continue;
				        }
				        // Storing each json item in variable
				        String url = null;
				        if(setting.has(TAG_URL)){
				        	url = setting.getString(TAG_URL);
				        }
				        String name = null;
				        if(setting.has(TAG_NAME)){
				        	name = setting.getString(TAG_NAME);
				        }
				        
				        if(url != null){
				        	ServerInfo serverInfo = new ServerInfo(name, url);
				        	listUrl.add(serverInfo);
				        }
				    }
				}

			} catch (IOException e) {
				Context context = getApplicationContext();
				CharSequence text = "Trouble to open " + CONFIG_FILE_NAME;
				int duration = Toast.LENGTH_SHORT;
				Toast.makeText(context, text, duration).show();
			} catch (JSONException e) {
				Context context = getApplicationContext();
				CharSequence text = "Trouble with format of " + CONFIG_FILE_NAME;
				int duration = Toast.LENGTH_SHORT;
				Toast.makeText(context, text, duration).show();
				e.printStackTrace();
			}
		} else {
			
			 try {
				    file.createNewFile();
		            FileOutputStream fOut = new FileOutputStream(file);
		            OutputStreamWriter myOutWriter = 
		                                    new OutputStreamWriter(fOut);
		            JSONObject jsonSetting = new JSONObject();
		            JSONArray jsonArr = new JSONArray();
		            JSONObject jsonUrl = new JSONObject();
		            jsonUrl.put("url", "http://tv.vp9.tv");
		            jsonUrl.put("name", "VP9.TV Server");
		            jsonUrl.put("contry", "UK");

		            jsonArr.put(jsonUrl);
		            jsonSetting.put("settings", jsonArr);
		            myOutWriter.append(jsonSetting.toString());
		            
		            myOutWriter.close();
		            fOut.close();
		        	ServerInfo serverInfo = new ServerInfo("VP9.TV Server", "http://tv.vp9.tv");
		        	listUrl.add(serverInfo);
		            Toast.makeText(getBaseContext(),
		                    "Done writing SD 'config.txt'",
		                    Toast.LENGTH_SHORT).show();
		        } catch (Exception e) {
		            Toast.makeText(getBaseContext(), e.getMessage(),
		                    Toast.LENGTH_SHORT).show();
		        }
			Context context = getApplicationContext();
			CharSequence text = CONFIG_FILE_NAME + " file not found!";
			Toast.makeText(context, text, Toast.LENGTH_SHORT).show();
		} 
		return listUrl;
	}
	
	@Override
	public boolean dispatchKeyEvent(KeyEvent event) {

		
		int keyCode = event.getKeyCode();
		if (event.getAction() == KeyEvent.ACTION_UP) {
			switch (keyCode) {
			case KeyEvent.KEYCODE_BACK:
				if (!checkOnlineState()) {
					exitApp();
				}
				break;
			}
		}

		return super.dispatchKeyEvent(event);
	}

	
	@Override
	public void onPause() {
		super.onPause();
//		if(_alert != null){
//			_alert.dismiss();
//		}
//		if(!checkOnlineState()){
//			boolean isQuit = AppPreferences.INSTANCE.isQuit();
//			if(isQuit){
//				exitApp();
//			}
//			else{
//				AppPreferences.INSTANCE.saveQuit(true);
//			}
//			
//		}

	}
}
