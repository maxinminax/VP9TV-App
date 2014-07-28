package com.vp9.tv;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;

import com.vp9.laucher.main.vp9launcher.Vp9Launcher;
import com.vp9.player.Vp9Player;
import com.vp9.player.activity.Vp9PlayerInterface;
import com.vp9.player.h265.NewVp9Player;
import com.vp9.player.model.ChangeSubtitle;
import com.vp9.plugin.EventPlayerPlugin;

public class Vp9PlayerActivity extends Vp9Launcher implements Vp9PlayerInterface {
	private Vp9Player vp9Player;

	private boolean isShowEPG = false;

	private RelativeLayout vp9PlayerLayout;

	private NewVp9Player newVp9Player;

	private int videoType;

	public boolean startNativeVideo(final JSONObject jsonVideoInfo) {
		int type = 1;
		if (jsonVideoInfo.has("playType")) {
			try {
				type = jsonVideoInfo.getInt("playType");
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		if (type == 2) {
			isShowEPG = false;
			if (newVp9Player != null) {
				newVp9Player.destroy(1);
			}
			newVp9Player = new NewVp9Player(this);
			newVp9Player.setActivity(this);
			initViewIdForNewPlayer(newVp9Player);
			// newVp9Player.setMainLayout(this.vp9PlayerLayout);
			newVp9Player.init();
			setVisibility(appView, View.GONE);
			registerListenerForNewVp9Player(jsonVideoInfo);
			return this.newVp9Player.startNaviteVideo(jsonVideoInfo);
		}

		isShowEPG = false;
		if (vp9Player != null) {
			vp9Player.destroy(1);
		}

		vp9Player = new Vp9Player(this);
		vp9Player.setActivity(this);
		ArrayList<String> subtitles = com.vp9.util.AppPreferences.INSTANCE
				.getSubtitles();
		vp9Player.setSettingSubTypes(subtitles);
		initViewIdForPlayer(vp9Player);
		vp9Player.setMainLayout(this.vp9PlayerLayout);
		vp9Player.init();
		setVisibility(appView, View.GONE);
		registerListenerForVp9Player(jsonVideoInfo);
		return this.vp9Player.startNaviteVideo(jsonVideoInfo);
	}

	private void registerListenerForNewVp9Player(JSONObject jsonVideoInfo) {
		try {
			final int videoType = jsonVideoInfo.getInt("videoType");
			this.newVp9Player.btnSetting
					.setOnClickListener(new Button.OnClickListener() {
						@Override
						public void onClick(View v) {
							handleSettingButtonEventForNewPlayer(v);
						}
					});

			this.newVp9Player.btnBack
					.setOnClickListener(new Button.OnClickListener() {
						@Override
						public void onClick(View v) {
							handleBackButtonEventForNewPlayer(v, videoType);
						}
					});
		} catch (JSONException e) {
			e.printStackTrace();
		}

	}

	protected void handleBackButtonEventForNewPlayer(View v, int videoType) {
		this.newVp9Player.destroy(1);
		this.vp9PlayerLayout.setVisibility(View.GONE);
		setVisibility(appView, View.VISIBLE);
		JSONObject eventData = new JSONObject();
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager
				.getPlugin("EventPlayerPlugin");
		try {
			eventData.put("action", "backPlayer");
			eventData.put("videoType", videoType);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		bridge.reportEvent(eventData);
	}

	protected void handleSettingButtonEventForNewPlayer(View v) {
		if (!this.isShowEPG) {
			showEPGForNewPlayer();
		} else {
			closeEPGForNewPlayer();
		}

	}

	public void closeEPGForNewPlayer() {
		this.isShowEPG = false;
		newVp9Player.closeEPG();
		setVisibility(appView, View.GONE);
		JSONObject eventData = new JSONObject();
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager
				.getPlugin("EventPlayerPlugin");
		try {
			eventData.put("action", "closeEPG");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		bridge.reportEvent(eventData);

	}

	public void showEPGForNewPlayer() {
		this.isShowEPG = true;
		newVp9Player.showEPG();
		setVisibility(appView, View.VISIBLE);
		// appView.setVisibility(View.VISIBLE);
		JSONObject eventData = new JSONObject();
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager
				.getPlugin("EventPlayerPlugin");
		try {
			eventData.put("action", "showEPG");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		bridge.reportEvent(eventData);
	}

	public boolean handlerEnventShowEPGForNewPlayer() {
		if (this.newVp9Player != null) {
			return this.newVp9Player.showEPG();
		}

		return false;
	}

	public boolean handlerEnventCloseEPGForNewPlayer() {
		if (this.newVp9Player != null) {
			return this.newVp9Player.closeEPG();
		}

		return false;
	}

	private void setVisibility(final View appView, final int visibility) {
		runOnUiThread(new Runnable() {
			@Override
			public void run() {
				appView.setVisibility(visibility);
			}
		});

	}

	private void registerListenerForVp9Player(final JSONObject jsonVideoInfo) {
		try {
			this.videoType = jsonVideoInfo.getInt("videoType");
			this.vp9Player.btnSetting
					.setOnClickListener(new Button.OnClickListener() {
						@Override
						public void onClick(View v) {
							handleSettingButtonEvent(v);
						}
					});

			this.vp9Player.btnBack
					.setOnClickListener(new Button.OnClickListener() {
						@Override
						public void onClick(View v) {
							handleBackButtonEvent(v, videoType);
						}
					});
		} catch (JSONException e) {
			e.printStackTrace();
		}

	}

	protected void handleBackButtonEvent(View view, int videoType) {
		this.vp9Player.destroy(1);
		this.vp9PlayerLayout.setVisibility(View.GONE);
		setVisibility(appView, View.VISIBLE);
		// appView.setVisibility(View.VISIBLE);
		JSONObject eventData = new JSONObject();
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager
				.getPlugin("EventPlayerPlugin");
		try {
			eventData.put("action", "backPlayer");
			eventData.put("videoType", videoType);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		bridge.reportEvent(eventData);
	}

	private void initViewIdForNewPlayer(NewVp9Player vp9Player) {

		vp9Player.video_view_id = R.id.video_view;

		vp9Player.pdLoading_id = R.id.pdLoading;

		vp9Player.load_rate_id = R.id.load_rate;

		vp9Player.tvSub_id = R.id.tvSub;

		vp9Player.tvSubMargin_id = R.id.tvSubMargin;

		vp9Player.seekBar_id = R.id.seekBar;

		vp9Player.tvFrom_id = R.id.tvFrom;

		vp9Player.tvTo_id = R.id.tvTo;

		vp9Player.btnPlay_id = R.id.btnPlay;

		vp9Player.btnSub_id = R.id.btnSub;

		vp9Player.btnBack_id = R.id.btnBack;

		vp9Player.btnSetting_id = R.id.btnSetting;

		vp9Player.controller_id = R.id.controller;

		vp9Player.vp9_player_layout_id = R.id.vp9_player_layout;

		vp9Player.loading_layout_id = R.id.loading_layout;

		vp9Player.subtitles_layout_id = R.id.subtitles_layout;

		vp9Player.progess_id = R.id.progess;

		vp9Player.vp9_btn_play_id = R.drawable.vp9_btn_play;

		vp9Player.vp9_btn_pause_id = R.drawable.vp9_btn_pause;

		vp9Player.vp9_btn_sub_id = R.drawable.vp9_btn_sub;

		vp9Player.vp9_btn_sub_hide_id = R.drawable.vp9_btn_sub_hide;

		vp9Player.vp9ChannelImage_id = R.id.Vp9ChannelImage;

		vp9Player.video_title_layout_id = R.id.video_title_layout;

		vp9Player.logo_video_id = R.id.logo_video;

		vp9Player.video_title_id = R.id.video_title;

		vp9Player.logo_id = R.id.logo;

		vp9Player.logo_text_id = R.id.logo_text;

		vp9Player.logo_layout_id = R.id.logo_layout;

		vp9Player.btnChoose_id = R.id.btnChoose;

		vp9Player.btnPrev_id = R.id.btnPrev;

		vp9Player.btnNext_id = R.id.btnNext;

	}

	private void initViewIdForPlayer(Vp9Player vp9Player) {

		vp9Player.video_view_id = R.id.video_view;

		vp9Player.pdLoading_id = R.id.pdLoading;

		vp9Player.load_rate_id = R.id.load_rate;

		vp9Player.tvSub_id = R.id.tvSub;

		vp9Player.tvSubMargin_id = R.id.tvSubMargin;

		vp9Player.seekBar_id = R.id.seekBar;

		vp9Player.tvFrom_id = R.id.tvFrom;

		vp9Player.tvTo_id = R.id.tvTo;

		vp9Player.btnPlay_id = R.id.btnPlay;

		vp9Player.btnSub_id = R.id.btnSub;

		vp9Player.btnBack_id = R.id.btnBack;

		vp9Player.btnSetting_id = R.id.btnSetting;

		vp9Player.controller_id = R.id.controller;

		vp9Player.vp9_player_layout_id = R.id.vp9_player_layout;

		vp9Player.loading_layout_id = R.id.loading_layout;

		vp9Player.subtitles_layout_id = R.id.subtitles_layout;

		vp9Player.progess_id = R.id.progess;

		vp9Player.vp9_btn_play_id = R.drawable.vp9_btn_play;

		vp9Player.vp9_btn_pause_id = R.drawable.vp9_btn_pause;

		vp9Player.vp9_btn_sub_id = R.drawable.vp9_btn_sub;

		vp9Player.vp9_btn_sub_hide_id = R.drawable.vp9_btn_sub_hide;

		vp9Player.vp9ChannelImage_id = R.id.Vp9ChannelImage;

		vp9Player.video_title_layout_id = R.id.video_title_layout;

		vp9Player.logo_video_id = R.id.logo_video;

		vp9Player.video_title_id = R.id.video_title;

		vp9Player.logo_id = R.id.logo;

		vp9Player.logo_text_id = R.id.logo_text;

		vp9Player.logo_layout_id = R.id.logo_layout;

		vp9Player.btnChoose_id = R.id.btnChoose;

		vp9Player.btnPrev_id = R.id.btnPrev;

		vp9Player.btnNext_id = R.id.btnNext;
	}

	protected void handleSettingButtonEvent(View v) {
		if (!this.isShowEPG) {
			showEPG();
		} else {
			closeEPG();
		}

	}

	public void closeEPG() {
		this.isShowEPG = false;
		setVisibility(appView, View.GONE);
		vp9Player.closeEPG();
		JSONObject eventData = new JSONObject();
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager
				.getPlugin("EventPlayerPlugin");
		try {
			eventData.put("action", "closeEPG");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		bridge.reportEvent(eventData);

	}

	public void showEPG() {
		this.isShowEPG = true;
		vp9Player.showEPG();
		setVisibility(appView, View.VISIBLE);
		runOnUiThread(new Runnable() {

			@Override
			public void run() {
				appView.requestFocus();

			}
		});
		// appView.setVisibility(View.VISIBLE);
		JSONObject eventData = new JSONObject();
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager
				.getPlugin("EventPlayerPlugin");
		try {
			eventData.put("action", "showEPG");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		bridge.reportEvent(eventData);
	}

	public boolean handlerEnventShowEPG() {
		if (this.vp9Player != null) {
			return this.vp9Player.showEPG();
		}

		return false;
	}

	public boolean handlerEnventCloseEPG() {
		if (this.vp9Player != null) {
			return this.vp9Player.closeEPG();
		}

		return false;
	}

	public void playRemoteVideo() {
		if (this.vp9Player != null) {
			if (this.isShowEPG = true) {
				closeEPG();
			} else {
				this.vp9Player.startVideo();
			}
		}
	}

	public void pauseRemoteVideo() {
		if (this.vp9Player != null) {
			this.vp9Player.pause();
		}
	}

	public void stopRemoteVideo() {
		if (this.vp9Player != null) {
			this.vp9Player.destroy(1);
			setVisibility(this.vp9PlayerLayout, View.GONE);
			setVisibility(appView, View.VISIBLE);
			// JSONObject eventData = new JSONObject();
			// EventPlayerPlugin bridge = (EventPlayerPlugin)
			// appView.pluginManager.getPlugin("EventPlayerPlugin");
			// try {
			// eventData.put("action", "stopPlayer");
			// eventData.put("videoType", videoType);
			// } catch (JSONException e) {
			// e.printStackTrace();
			// }
			// bridge.reportEvent(eventData);
			if (this.vp9Player.isRemoteListener) {
				try {
					JSONObject jsonEvent = new JSONObject();
					jsonEvent.put("action", "stop");
					sendEvent(jsonEvent);
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}

		}
	}

	public void seekRemoteVideo(int timeSeek) {
		if (this.vp9Player != null) {
			this.vp9Player.seekTo(timeSeek);
		}
	}

	public void changeSubtitleRemoteVideo(
			ArrayList<ChangeSubtitle> changeSubtitles) {
		if (this.vp9Player != null) {
			JSONArray jsonArrSub = this.vp9Player
					.changeSubtitle(changeSubtitles);
			JSONObject eventData = new JSONObject();
			EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager
					.getPlugin("EventPlayerPlugin");
			try {
				eventData.put("action", "changeSubtitle");
				eventData.put("result", jsonArrSub);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			bridge.reportEvent(eventData);
		}
	}

	public void resendInfoRemoteVideo() {
		if (this.vp9Player != null) {
			JSONObject jsonInfCurVideo = this.vp9Player.getInfoCurrentVideo();
			JSONObject eventData = new JSONObject();
			EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager
					.getPlugin("EventPlayerPlugin");
			try {
				eventData.put("action", "resend_video_info");
				eventData.put("resend_information", jsonInfCurVideo);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			bridge.reportEvent(eventData);
		}
	}

	public void addListenerRemoteVideo() {
		if (this.vp9Player != null) {
			this.vp9Player.addListenerRemoteVideo();
		}
	}

	@Override
	public void sendEvent(JSONObject jsonEvent) {
		EventPlayerPlugin bridge = (EventPlayerPlugin) appView.pluginManager
				.getPlugin("EventPlayerPlugin");
		bridge.reportEvent(jsonEvent);
	}

	public void changeDisplayScreen(int intFullScreen) {
		if (this.vp9Player != null) {
			this.vp9Player.changeDisplayScreen(intFullScreen);
		}
	}

	public void changeScreenOrientation(String orientation) {
		if (this.vp9Player != null) {
			this.vp9Player.changeScreenOrientation(orientation);
		}
	}

	public void saveSubtiles(ArrayList<String> subTypes) {
		com.vp9.util.AppPreferences.INSTANCE.saveSubtitles(subTypes);
	}
}
