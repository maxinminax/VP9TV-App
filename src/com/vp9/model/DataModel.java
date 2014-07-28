package com.vp9.model;

import android.os.Parcel;
import android.os.Parcelable;

public class DataModel implements Parcelable {
	
	private static DataModel dataModel;
	
	private boolean isQuit;
	
	private DataModel(){
		isQuit = true;
	}
	   
	 public synchronized static DataModel getInstance(){
		 if(dataModel == null){
			 dataModel  = new DataModel();
		 }
		 return dataModel;
	 }

	public boolean isQuit() {
		return isQuit;
	}

	public void setQuit(boolean isQuit) {
		this.isQuit = isQuit;
	}

	@Override
	public int describeContents() {
		return 0;
	}

	@Override
	public void writeToParcel(Parcel dest, int flags) {
		
	}

}
