package com.vp9.view;

import java.util.ArrayList;

import android.R;
import android.app.ActivityManager;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;

import com.vp9.model.AppInfo;
import com.vp9.tv.MainActivity;

public class RemoveAppDialog extends DialogFragment {
	
	private static ArrayList<AppInfo> appInfoList;
	private ArrayList<Integer> mSelectedItems;
	private MainActivity mainActivity;



	public static RemoveAppDialog newInstance(ArrayList<AppInfo> appInfos, MainActivity mainActivity) {
		appInfoList = appInfos;
		RemoveAppDialog dialog  = new RemoveAppDialog();
		dialog.setActivity(mainActivity);
        return dialog;
    }

	
	private void setActivity(MainActivity mainActivity) {
		this.mainActivity = mainActivity;
		
	}


	@Override
	public Dialog onCreateDialog(Bundle savedInstanceState) {
	    AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
	    String[] items = new String[appInfoList.size()];
	    boolean[] selects = new boolean[appInfoList.size()];
    	for(int i = 0; i < appInfoList.size(); i++){
    		items[i] = appInfoList.get(i).name + " (" + appInfoList.get(i).packageName +")";
    		selects[i] = true;
    	}
    	mSelectedItems = new ArrayList<Integer>();
	    // Set the dialog title
	    builder.setTitle("Remove App Dialog")
//	    .setMessage("Remove some app to run VP9.TV app. Are you okie?")
	    // Specify the list array, the items to be selected by default (null for none),
	    // and the listener through which to receive callbacks when items are selected
	           .setMultiChoiceItems(items, selects,
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
	           })
	    // Set the action buttons
	           .setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
	               @Override
	               public void onClick(DialogInterface dialog, int id) {
	            	   dialog.dismiss();
	            	   killApp();
	               }
	           })
	           .setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
	               @Override
	               public void onClick(DialogInterface dialog, int id) {
	            	   dialog.dismiss();
	            	   quitApp();
	               }
	           }).setOnCancelListener(new DialogInterface.OnCancelListener(){

	   			@Override
	   			public void onCancel(DialogInterface arg0) {
	   				killApp();
	   			}
	   			
	   		});
	    AlertDialog dgl = builder.create();
	    dgl.show();
	    return dgl;
	}


	protected void quitApp() {
		android.os.Process.killProcess(android.os.Process.myPid());
		super.onDestroy();
		System.exit(0);
	}


	protected void killApp() {
		
		if(appInfoList != null){
			ActivityManager activityManager = (ActivityManager) getActivity().getSystemService(Context.ACTIVITY_SERVICE);
			for(AppInfo appInfo : appInfoList){
				activityManager.killBackgroundProcesses(appInfo.packageName);
			}
			appInfoList.clear();
		}
		mainActivity.handleUrl();
		
	}

}
