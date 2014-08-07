package com.vp9.laucher.main.vp9launcher;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class PackageChange extends BroadcastReceiver {

	@Override
	public void onReceive(Context context, Intent intent) {
		if (intent.getAction().equals(Intent.ACTION_PACKAGE_ADDED)) {
			Log.d("TAG", "------------------ Package added");
		}else if(intent.getAction().equals(Intent.ACTION_PACKAGE_REMOVED)){
			Log.d("TAG", "------------------ Package Removed");
		}
	}

}
