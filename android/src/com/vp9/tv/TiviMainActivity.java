package com.vp9.tv;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

public class TiviMainActivity extends Activity {

	String channelNum = null;
	String url = null;
	public void onCreate(Bundle savedInstanceState) {
		
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);

		Intent intent = getIntent();
		Bundle extras = intent.getExtras();
		if (extras != null) {
			channelNum = extras.getString("channelNum");
			url = extras.getString("url");
		}
		Log.e("TAG: " + TiviMainActivity.class.getSimpleName(), "channelNum: " + channelNum);
		

		
//		Intent intent = new Intent(getBaseContext(),VpMainActivity.class);
//		intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
//		intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
//		intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//		Bundle bundle=new Bundle();
//		bundle.putString("url", "http://tv.vp9.tv");
//		intent.putExtra("ServerInfo", bundle);
//        startActivity(intent);
//        finish();
//        return;
	}
	
    @Override
    protected void onResume() {
        super.onResume();
        
        
		Intent intent = new Intent(getBaseContext(), MainActivity.class);
		intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
		intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
		intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		Bundle bundle=new Bundle();
		bundle.putString("type", "tivi");
		if (channelNum !=null) {
			Log.e("TAG: " + TiviMainActivity.class.getSimpleName(), "setChannelNum: " + channelNum);
			bundle.putString("channelNum", channelNum);
			bundle.putString("url", url);
		}
		intent.putExtra("start", bundle);
        startActivity(intent);
        finish();
    }

//    @Override
//    protected void onResume() {
//        super.onResume();
//        if(!checkOnlineState()){
//        	displayQuitAppDiaglog();
//        }
//    }	

	
	@Override
	public void onPause() {
		super.onPause();
	}
	
}
