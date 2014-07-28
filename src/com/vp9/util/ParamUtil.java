package com.vp9.util;

import java.math.BigInteger;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ParamUtil
{  
    
	public static int getJsonInt(JSONObject jsonRequest, String code,
			int defaultValue) {
		int value = defaultValue;
		try {
			if (jsonRequest != null && jsonRequest.has(code)) {
				value = jsonRequest.getInt(code);
			}
		} catch (JSONException e) {
			e.printStackTrace();
			return value;
		}
		return value;
	}
	
	public static float getJsonFloat(JSONObject jsonRequest, String code,
			float defaultValue) {
		float value = defaultValue;
		try {
			if (jsonRequest != null && jsonRequest.has(code)) {
				String strValue = jsonRequest.getString(code);
				value = Float.valueOf(strValue);
			}
		} catch (JSONException e) {
			e.printStackTrace();
			return value;
		}
		return value;
	}
	
	public static String getJsonString(JSONObject jsonRequest, String code, String defaultValue) {
		String value = defaultValue;
		try {
			if(jsonRequest != null && jsonRequest.has(code)){
				value =  jsonRequest.getString(code);
			}
		} catch (JSONException e) {
			e.printStackTrace();
			return value;
		}
		return value;
	}
	
	public static JSONObject getJson(String body) {
		JSONObject jsObj = null;
		try {
			jsObj = new JSONObject(body);
		} catch (JSONException e) {
			e.printStackTrace();
            return jsObj;
		}
		return jsObj;
	}

	public static JSONObject getJsonObject(JSONObject jsonRequest, String code) {
		JSONObject jsObj = null;
		try {
			if(jsonRequest != null && jsonRequest.has(code)){
				jsObj =  jsonRequest.getJSONObject(code);
			}
		} catch (JSONException e) {
			e.printStackTrace();
			return jsObj;
		}
		return jsObj;
	}

	public static JSONArray getJSONArray(JSONObject jsonRequest, String code) {
		JSONArray jsArray = null;
		try {
			if(jsonRequest != null && jsonRequest.has(code)){
				jsArray =  jsonRequest.getJSONArray(code);
			}
		} catch (JSONException e) {
			e.printStackTrace();
			return jsArray;
		}
		return jsArray;
	}

	public static boolean getJSONBoolean(JSONObject jsonRequest, String code,
			boolean defaultValue) {
		boolean value = defaultValue;
		try {
			if(jsonRequest != null && jsonRequest.has(code)){
				value =  jsonRequest.getBoolean(code);
			}
		} catch (JSONException e) {
			e.printStackTrace();
			return value;
		}
		return value;
	}
	
    public static int getValue(Object obj, int defaul)
    {
        int value = defaul;
        if(obj != null)
            if(obj instanceof String)
                try
                {
                    value = Integer.parseInt(obj.toString());
                }
                catch(Exception e)
                {
                    value = defaul;
                }
            else
            if(obj instanceof Integer)
                try
                {
                    value = ((Integer)obj).intValue();
                }
                catch(Exception e)
                {
                    value = defaul;
                }
            else
            if(obj instanceof Long)
                try
                {
                    value = ((Long)obj).intValue();
                }
                catch(Exception e)
                {
                    value = defaul;
                }
            else
            if(obj instanceof Double)
                try
                {
                    value = ((Double)obj).intValue();
                }
                catch(Exception e)
                {
                    value = defaul;
                }
            else
                if(obj instanceof BigInteger)
                    try
                    {
                        value = ((BigInteger)obj).intValue();
                    }
                    catch(Exception e)
                    {
                        value = defaul;
                    }
        return value;
    }
    
    
    public static float getValue(Object obj, float defaul)
    {
        float value = defaul;
        if(obj != null)
            if(obj instanceof String)
                try
                {
                    value = Float.parseFloat(obj.toString());
                }
                catch(Exception e)
                {
                    value = defaul;
                }
            else
            if(obj instanceof Integer)
                try
                {
                    value = ((Integer)obj).floatValue();
                }
                catch(Exception e)
                {
                    value = defaul;
                }
            else
            if(obj instanceof Long)
                try
                {
                    value = ((Long)obj).floatValue();
                }
                catch(Exception e)
                {
                    value = defaul;
                }
            else
            if(obj instanceof Double)
                try
                {
                    value = ((Double)obj).floatValue();
                }
                catch(Exception e)
                {
                    value = defaul;
                }
            else
                if(obj instanceof BigInteger)
                    try
                    {
                        value = ((BigInteger)obj).floatValue();
                    }
                    catch(Exception e)
                    {
                        value = defaul;
                    }
        return value;
    }

    public static long getValue(Object obj, long defaul)
    {
        long value = defaul;
        if(obj != null)
            if(obj instanceof String)
                try
                {
                    value = Long.parseLong(obj.toString());
                }
                catch(Exception e)
                {
                    value = defaul;
                }
            else
            if(obj instanceof Long)
                try
                {
                    value = ((Long)obj).longValue();
                }
                catch(Exception e)
                {
                    value = defaul;
                }
           else
           if(obj instanceof Integer)
            try
            {
                value = ((Integer)obj).longValue();
            }
            catch(Exception e)
            {
                value = defaul;
            }
           else
               if(obj instanceof BigInteger)
                   try
                   {
                       value = ((BigInteger)obj).longValue();
                   }
                   catch(Exception e)
                   {
                       value = defaul;
                   }
        return value;
    }

    public static boolean getValue(Object obj, boolean defaul)
    {
        boolean value = defaul;
        if(obj != null)
            if(obj instanceof Boolean)
                try
                {
                    value = ((Boolean)obj).booleanValue();
                }
                catch(Exception e)
                {
                    value = defaul;
                }
            else
            if(obj instanceof String)
                try
                {
                    value = Boolean.parseBoolean(obj.toString());
                }
                catch(Exception e)
                {
                    value = defaul;
                }
        return value;
    }

    public static String getValue(Object obj, String defaul)
    {
        String value = defaul;
        if(obj != null)
            if(obj instanceof String)
                value = ((String)obj).trim();
            else
                value = obj.toString().trim();
        return value;
    }

    public static int[] converIntArray(String cards, String strSplit)
    {
        if(cards != null)
        {
            ArrayList<Integer> intList = new ArrayList<Integer> ();
            String strList[] = cards.split(strSplit);
            if(strList != null)
            {
                String as[];
                int k = (as = strList).length;
                for(int j = 0; j < k; j++)
                {
                    String str = as[j];
                    try
                    {
                        if(str != null)
                        {
                            Integer cardCode = Integer.valueOf(str.trim());
                            intList.add(cardCode);
                        }
                    }
                    catch(Exception e)
                    {
                        return null;
                    }
                }

                int intArray[] = new int[intList.size()];
                for(int i = 0; i < intList.size(); i++)
                    intArray[i] = ((Integer)intList.get(i)).intValue();

                return intArray;
            } else
            {
                return null;
            }
        } else
        {
            return null;
        }
    }

    public static int[] converIntArray(String cards, String strSplit, int min, int max)
    {
        if(cards != null)
        {
            ArrayList<Integer> intList = new ArrayList<Integer> ();
            String strList[] = cards.split(strSplit);
            if(strList != null)
            {
                String as[];
                int k = (as = strList).length;
                for(int j = 0; j < k; j++)
                {
                    String str = as[j];
                    try
                    {
                        if(str != null)
                        {
                            Integer cardCode = Integer.valueOf(str.trim());
                            if(cardCode.intValue() >= 0 && cardCode.intValue() <= max)
                                intList.add(cardCode);
                        }
                    }
                    catch(Exception exception) { }
                }

                int intArray[] = new int[intList.size()];
                for(int i = 0; i < intList.size(); i++)
                    intArray[i] = ((Integer)intList.get(i)).intValue();

                return intArray;
            } else
            {
                return null;
            }
        } else
        {
            return null;
        }
    }

    public static Date getDate(String strDate)
    {
        Date date = null;
        try
        {
            if(strDate != null)
            {
                SimpleDateFormat formatter = new SimpleDateFormat("dd MM yyyy HH:mm:ss");
                date = formatter.parse(strDate);
            }
        }
        catch(ParseException e)
        {
            e.printStackTrace();
        }
        return date;
    }
    
    public static String getDate(Date date)
    {
    	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    	String strdate = dateFormat.format(date);
  
        return strdate;
    }

	public static int[] toIntArray(String videoid_list) {
		ArrayList<Integer> intArray = new ArrayList<Integer>();
		if(videoid_list != null){
			String[] strVideoIds = videoid_list.split(",");
			if(strVideoIds != null && strVideoIds.length > 0){
				for(int i = 0; i < strVideoIds.length; i++){
					intArray.add(ParamUtil.getValue(strVideoIds[i].trim(), -1));
				}
			}
			
		}
		int[] intValues = new int[intArray.size()];
		for(int i = 0; i < intArray.size(); i++){
			intValues[i] = intArray.get(i);
		}
		return intValues;
	}
}