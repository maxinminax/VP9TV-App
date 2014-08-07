package com.vp9.tv;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class MusicMainActivity extends Activity {
	public void onCreate(Bundle savedInstanceState) {
		
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);

        
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
		bundle.putString("type", "music");
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
