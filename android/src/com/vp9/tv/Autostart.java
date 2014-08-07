package com.vp9.tv;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.util.Log;
import android.widget.Toast;

public class Autostart extends BroadcastReceiver 
{
//    public void onReceive(Context arg0, Intent arg1) 
//    {
//        Intent intent = new Intent(arg0,VpService.class);
//        arg0.startService(intent);
//        Log.i("Autostart", "started");
//    }
	
	
    @Override
    public void onReceive(Context context, Intent intent) {
//    	System.out.println("CCCCCCCCCCCCCCCCCCCCCCCCC: " + intent.getAction());
		// in onCreate of activity
    	Toast.makeText(context, intent.getAction(), 30000).show();
        if ("android.intent.action.BOOT_COMPLETED".equals(intent.getAction())) {
 	       // Restore preferences
    		SharedPreferences prefs = context.getSharedPreferences(
    			      "com.vp9.app", Context.MODE_PRIVATE);
            Editor editor = prefs.edit();
            editor.putBoolean("isRstart", true);
            editor.commit();
        	Intent serviceIntent = new Intent(context,VpService.class);
        	context.startService(serviceIntent);
        	Log.i("Autostart", "started");
        }
    }
}