package xyz.util.zsyc;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpHead;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RmiUtil{
	public static final String HEADER_MAYTEK_RMI_CLIENT_IP = "MAYTEK-RMI-CLIENT-IP";
	
	private static Logger log = LoggerFactory.getLogger(RmiUtil.class);
	private static Object loadData(
			HttpServletRequest request,
			String url,
			Map<String, String> accessoryParam,
			String data,
			int connectTimeout,
			int socketTimeout){
		if(request!=null && data!=null){
			Map<String, Object> map = new HashMap<String, Object>();
			map.put(ReturnUtil.STATUS, 0);
			map.put(ReturnUtil.MSG,"参数有误001");
			return map;
		}
		if(accessoryParam!=null && data!=null){
			Map<String, Object> map = new HashMap<String, Object>();
			map.put(ReturnUtil.STATUS, 0);
			map.put(ReturnUtil.MSG,"参数有误002");
			return map;
		}
		connectTimeout = connectTimeout==0?10000:connectTimeout;
		socketTimeout = socketTimeout==0?240000:socketTimeout;
		try{
			CloseableHttpClient httpClient = HttpClients.createDefault();
			HttpPost httpPost = new HttpPost(url);
			
			if(request!=null){
				String clientIp = SecurityUtil.getIp(request);
				//累加ip
				Cookie[] ttt = request.getCookies();
				Set<String> cookieList = new HashSet<String>();
				boolean ipFlag = false;
				if(ttt!=null){
					for(Cookie cookie : ttt){
						String value = cookie.getValue();
						String name = cookie.getName();
						if("_ip".equals(name)){
							ipFlag = true;
							value = value+","+clientIp;
						}
						cookieList.add(name+"="+value);
					}
				}
				if(!ipFlag && clientIp!=null && !"".equals(clientIp)){
					cookieList.add("_ip="+clientIp);
				}
				
				if(!ipFlag && clientIp!=null && !"".equals(clientIp)){
					httpPost.setHeader(RmiUtil.HEADER_MAYTEK_RMI_CLIENT_IP,clientIp);
				}
				httpPost.setHeader("Cookie", StringTool.listToString(cookieList, "; "));
				httpPost.setHeader("X-Requested-With",request.getHeader("X-Requested-With"));
				httpPost.setHeader("User-Agent", request.getHeader("User-Agent"));
				
				@SuppressWarnings("unchecked")
				Map<String,String[]> parameters = request.getParameterMap();
				List<NameValuePair> parameterList = new ArrayList<NameValuePair>();
				
				for(String p : parameters.keySet()){
					Object[] parameter = parameters.get(p);
					if(parameter!=null){
						for(Object para : parameter){
							parameterList.add(new BasicNameValuePair(p, para.toString()));
						}
					}
				}
				if(accessoryParam!=null){
					for(String key : accessoryParam.keySet()){
						parameterList.add(new BasicNameValuePair(key,accessoryParam.get(key)));
					}
				}
				
				if(parameterList.size()>0){
					HttpEntity httpEntity = new UrlEncodedFormEntity(parameterList,"utf8");
					httpPost.setEntity(httpEntity);
				}else{
					StringEntity httpEntity =  new StringEntity(IOUtils.toString(request.getInputStream(),"utf-8"), "utf-8");
					httpEntity.setContentType("text/plain;charset=utf-8");
					httpEntity.setContentEncoding("utf-8");
					httpPost.setEntity(httpEntity);
				}
			}else{
				httpPost.setHeader("X-Requested-With","XMLHttpRequest");
				
				if(accessoryParam!=null){
					List<NameValuePair> parameterList = new ArrayList<NameValuePair>();
					Map<String,String> tttt = (Map<String,String>)accessoryParam;
					for(String key : tttt.keySet()){
						parameterList.add(new BasicNameValuePair(key,tttt.get(key)));
					}
					HttpEntity httpEntity = new UrlEncodedFormEntity(parameterList,"utf8");
					httpPost.setEntity(httpEntity);
				}
				if(data!=null){
					StringEntity httpEntity =  new StringEntity(data, "utf-8");
					httpEntity.setContentType("text/plain;charset=utf-8");
					httpEntity.setContentEncoding("utf-8");
					httpPost.setEntity(httpEntity);
				}
			}
			
			RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(socketTimeout).setConnectTimeout(connectTimeout).build();
			httpPost.setConfig(requestConfig);
			HttpResponse httpResponse = httpClient.execute(httpPost);
			Object result = null;
			if(httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
				HttpEntity httpEntity2 = httpResponse.getEntity();
				byte[] bytes = EntityUtils.toByteArray(httpEntity2);
				String resultStr = new String(bytes,"utf-8");
				resultStr = resultStr.trim();
				if("".equals(resultStr)){
					result = "";
				}else if("[".equals(resultStr.substring(0, 1))){
					result = JSON.toObject(resultStr,List.class);
				}else if("{".equals(resultStr.substring(0, 1))){
					result = JSON.toObject(resultStr,Map.class);
				}else{
					result = resultStr;
				}
			}else{
				/**
				 * 详细记录出错原因
				 */
				errorLog(request,url, accessoryParam, data, httpResponse);
				
				if(httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_NOT_FOUND){
					Map<String, Object> map = new HashMap<String, Object>();
					map.put(ReturnUtil.STATUS, 0);
					map.put(ReturnUtil.MSG, "相关服务器正在升级中...");
					result = map;
				}else{
					Map<String, Object> map = new HashMap<String, Object>();
					map.put(ReturnUtil.STATUS, 0);
					map.put(ReturnUtil.MSG, "相关服务器正在升级中，请1分钟后再试！("+httpResponse.getStatusLine().getStatusCode()+")");
					result = map;
				}
			}
			httpClient.close();
			return result;
		}catch(UnsupportedEncodingException e) {
			e.printStackTrace();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put(ReturnUtil.STATUS, 0);
			map.put(ReturnUtil.MSG,"[UnsupportedEncodingException]"+e.getMessage());
			return map;
		}catch(IOException e) {
			e.printStackTrace();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put(ReturnUtil.STATUS, 0);
			map.put(ReturnUtil.MSG,"[IOException]"+e.getMessage());
			return map;
		}catch(Exception e){
			e.printStackTrace();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put(ReturnUtil.STATUS, 0);
			map.put(ReturnUtil.MSG,"[Exception]"+e.getMessage());
			return map;
		}
	}
	
	/**
	 * 测试一个url地址150毫秒内是否能连通
	 * @param url 
	 * @return HTTP状态码（特殊代码：0 表示执行异常和未连通）
	 */
	public static int ping(String url){
		try {
			CloseableHttpClient httpClient = HttpClients.createDefault();
			HttpHead httpHead = new HttpHead(url);
			RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(150).setConnectTimeout(150).build();
			httpHead.setConfig(requestConfig);
			HttpResponse httpResponse = httpClient.execute(httpHead);
			return httpResponse.getStatusLine().getStatusCode();
		} catch (ClientProtocolException e) {
			System.out.println("ping "+url+" 未连通或异常");
		} catch (IOException e) {
			System.out.println("ping "+url+" 未连通或异常");
		}
		return 0;
	}
	
	public static Object loadData(
			String url,
			Map<String,String> accessoryParam){
		return loadData(null,url,accessoryParam,null,0,0);
	}
	
	public static Object loadData(
			String url,
			String data){
		return loadData(null,url,null,data,0,0);
	}
	
	public static Object loadData(
			String url,
			Map<String,String> accessoryParam,
			int connectTimeout,
			int socketTimeout){
		return loadData(null,url,accessoryParam,null,connectTimeout,socketTimeout);
	}
	
	public static Object loadData(
			String url,
			String data,
			int connectTimeout,
			int socketTimeout){
		return loadData(null,url,null,data,connectTimeout,socketTimeout);
	}
	
	public static Object loadData(
			HttpServletRequest request,
			String url,
			Map<String,String> accessoryParam){
		return loadData(request,url,accessoryParam,null,0,0);
	}
	
	public static Object loadData(
			HttpServletRequest request,
			String url,
			Map<String,String> accessoryParam,
			int connectTimeout,
			int socketTimeout){
		return loadData(request,url,accessoryParam,null,connectTimeout,socketTimeout);
	}
	
	private static void errorLog(
			HttpServletRequest request,
			String url,
			Map<String, String> accessoryParam,
			String data,
			HttpResponse httpResponse) {
		log.error("-------------------------RMI ERROR INFO START-----------------------------");
		try {
			if(request!=null) {
				log.error("Has request");
			}
			if(accessoryParam!=null) {
				log.error("Has accessoryParam");
			}
			if(data!=null) {
				log.error("Has data");
			}
			log.error("TargetUrl:"+url);
			if(request!=null) {
				log.error("Apikey by request:"+request.getParameter("apikey"));
			}
			if(accessoryParam!=null) {
				log.error("Apikey by accessParam:"+accessoryParam.get("apikey"));
			}
			if(data!=null) {
				log.error("data:"+data);
			}
			int status = httpResponse.getStatusLine().getStatusCode();
			log.error("Status:"+status);
			String reason = httpResponse.getStatusLine().getReasonPhrase();
			log.error("Reason:"+reason);
			HttpEntity httpEntity3 = httpResponse.getEntity();
			if(httpEntity3!=null) {
				byte[] bytes = EntityUtils.toByteArray(httpEntity3);
				if(bytes!=null && bytes.length>0) {
					String resultStr = new String(bytes,"utf-8");
					log.error("Content:"+resultStr);
				}
			}
		}catch(Exception e) {
			log.error("RMI ERROR INFO EXCEPTION", e);
		}
		log.error("-------------------------RMI ERROR INFO END-----------------------------");
	}
}
