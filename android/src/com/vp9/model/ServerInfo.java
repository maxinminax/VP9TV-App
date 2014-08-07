package com.vp9.model;

public class ServerInfo {
	
	private String url;
	
	private String serverName;
	
	public ServerInfo(String serverName, String url){
		this.serverName = serverName;
		this.url = url;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getServerName() {
		return serverName;
	}

	public void setServerName(String serverName) {
		this.serverName = serverName;
	}
	
	public String getDescription(){
		StringBuffer strBf = new StringBuffer();
		if(serverName != null && !"".equals(serverName.trim())){
//			strBf.append(serverName).append(" (").append(url).append(")");
			strBf.append(serverName);
		}else{
//			strBf.append(url);
		}
		return strBf.toString();
		
	}


}
