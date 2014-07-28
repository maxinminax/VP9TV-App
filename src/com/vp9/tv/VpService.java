package com.vp9.tv;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

import com.vp9.laucher.main.vp9launcher.Vp9Launcher;

public class VpService extends Service
{
    private static final String TAG = "MyService";
    
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
    public void onDestroy() {
        //Toast.makeText(this, "My Service Stopped", Toast.LENGTH_LONG).show();
        Log.d(TAG, "onDestroy");
    }
    
    
    @Override
    public void onStart(Intent intent, int startid)
    {
    	Log.d("TAG", "-------------------------- Vp9Launcher");
		SharedPreferences prefs = this.getSharedPreferences(
			      "com.vp9.app", Context.MODE_PRIVATE); 
		boolean isRstart = prefs.getBoolean("isRstart", false);
    	if(isRstart){
            Editor editor = prefs.edit(); 
            editor.putBoolean("isRstart", false);
            editor.commit();
            Intent intents = new Intent(getBaseContext(),Vp9Launcher.class);
            intents.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intents);
            Toast.makeText(this, "My Service Started Vp9Launcher", Toast.LENGTH_LONG).show();
            Log.d(TAG, "onStart");
    	}

    }

//    @Override
//    public void onStart(Intent intent, int startid)
//    {
//    	Log.d("TAG", "-------------------------- VpService");
//		SharedPreferences prefs = this.getSharedPreferences(
//			      "com.vp9.app", Context.MODE_PRIVATE); 
//		boolean isRstart = prefs.getBoolean("isRstart", false);
//    	if(isRstart){
//            Editor editor = prefs.edit(); 
//            editor.putBoolean("isRstart", false);
//            editor.commit();
//            Intent intents = new Intent(getBaseContext(),MainActivity.class);
//            intents.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//            startActivity(intents);
//            //Toast.makeText(this, "My Service Started", Toast.LENGTH_LONG).show();
//            Log.d(TAG, "onStart");
//    	}
//
//    }
}