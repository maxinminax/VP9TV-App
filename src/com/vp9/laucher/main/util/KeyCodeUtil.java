package com.vp9.laucher.main.util;

import android.view.KeyEvent;

import com.vp9.laucher.main.model.KeyCodeInfo;

public class KeyCodeUtil {
	public static KeyCodeInfo getKeyCodeInfo(int keyCode) {
		String msgValue = "";
		boolean isSuccess = false;
		switch (keyCode) {
		case KeyEvent.KEYCODE_BACK:
			// Log.v(TAG, "KEYCODE_BACK");
			msgValue = "key_back";
			isSuccess = true;
			break;

		// return true;
		case KeyEvent.KEYCODE_HOME:
			msgValue = "key_home";
			// Log.v(TAG, "KEYCODE_HOME");
			// int duration = Toast.LENGTH_SHORT;
			// Toast.makeText(getContext(), "KEY_CODE = " + keyCode,
			// duration).show();
			// exitApp();
			isSuccess = true;
			break;

		case KeyEvent.KEYCODE_BUTTON_SELECT:
			// Log.v(TAG, "KEYCODE_BUTTON_SELECT");
			msgValue = "key_select";
			isSuccess = true;
			break;

		case VpKeyEvent.KEYCODE_MENU:
			// Log.v(TAG, "KEYCODE_MENU");
			msgValue = "menu";
			isSuccess = true;
			break;

		case VpKeyEvent.KEYCODE_GAME:
			// Log.v(TAG, "KEYCODE_GAME");
			msgValue = "game";
			isSuccess = true;
			break;

		case VpKeyEvent.KEYCODE_FILM:
			// Log.v(TAG, "KEYCODE_FILM");
			msgValue = "film";
			isSuccess = true;
			break;

		case VpKeyEvent.KEYCODE_UP:
			// Log.v(TAG, "KEYCODE_UP");
			msgValue = "key_up";
			isSuccess = true;
			break;

		case VpKeyEvent.KEYCODE_DOWN:
			// Log.v(TAG, "KEYCODE_DOWN");
			msgValue = "key_down";
			isSuccess = true;
			break;

		case VpKeyEvent.KEYCODE_LEFT:
			// Log.v(TAG, "KEYCODE_DOWN");
			msgValue = "key_left";
			isSuccess = true;
			break;

		case VpKeyEvent.KEYCODE_RIGHT:
			// Log.v(TAG, "KEYCODE_RIGHT");
			msgValue = "key_right";
			isSuccess = true;
			break;

		case VpKeyEvent.KEYCODE_VOLUME_UP:
			// Log.v(TAG, "KEYCODE_VOLUME_UP");
			msgValue = "key_volume_up";
			isSuccess = true;
			break;

		case KeyEvent.KEYCODE_0:
			// Log.v(TAG, "KEYCODE_VOLUME_DOWN");
			msgValue = "0";
			isSuccess = true;
			break;

		case KeyEvent.KEYCODE_1:
			// Log.v(TAG, "KEYCODE_VOLUME_DOWN");
			msgValue = "1";
			isSuccess = true;
			break;

		case KeyEvent.KEYCODE_2:
			// Log.v(TAG, "KEYCODE_VOLUME_DOWN");
			msgValue = "2";
			isSuccess = true;
			break;

		case KeyEvent.KEYCODE_3:
			// Log.v(TAG, "KEYCODE_VOLUME_DOWN");
			msgValue = "3";
			isSuccess = true;
			break;

		case KeyEvent.KEYCODE_4:
			// Log.v(TAG, "KEYCODE_VOLUME_DOWN");
			msgValue = "4";
			isSuccess = true;
			break;

		case KeyEvent.KEYCODE_5:
			// Log.v(TAG, "KEYCODE_VOLUME_DOWN");
			msgValue = "5";
			isSuccess = true;
			break;

		case KeyEvent.KEYCODE_6:
			// Log.v(TAG, "KEYCODE_VOLUME_DOWN");
			msgValue = "6";
			isSuccess = true;
			break;

		case KeyEvent.KEYCODE_7:
			// Log.v(TAG, "KEYCODE_VOLUME_DOWN");
			msgValue = "7";
			isSuccess = true;
			break;

		case KeyEvent.KEYCODE_8:
			// Log.v(TAG, "KEYCODE_VOLUME_DOWN");
			msgValue = "8";
			isSuccess = true;
			break;

		case KeyEvent.KEYCODE_9:
			// Log.v(TAG, "KEYCODE_VOLUME_DOWN");
			msgValue = "9";
			isSuccess = true;
			break;

		default:
			msgValue = String.valueOf(keyCode);
			isSuccess = true;
			break;
		}

		KeyCodeInfo keyCodeInfo = new KeyCodeInfo();
		keyCodeInfo.setMsgValue(msgValue);
		keyCodeInfo.setSuccess(isSuccess);

		return keyCodeInfo;
	}

	public static boolean isNumberKey(int keyCode) {
		int[] numberKeys = { KeyEvent.KEYCODE_0, KeyEvent.KEYCODE_1,
				KeyEvent.KEYCODE_2, KeyEvent.KEYCODE_3, KeyEvent.KEYCODE_4,
				KeyEvent.KEYCODE_5, KeyEvent.KEYCODE_6, KeyEvent.KEYCODE_7,
				KeyEvent.KEYCODE_8, KeyEvent.KEYCODE_8, KeyEvent.KEYCODE_9 };

		for (int numberKey : numberKeys) {
			if (keyCode == numberKey) {
				return true;
			}
		}

		return false;
	}
}
