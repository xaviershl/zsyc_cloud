package xyz.util.zsyc;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import xyz.filter.MyExceptionForLogin;
import xyz.filter.MyExceptionForRole;

public class SecurityUtil {
	private static Logger log = LoggerFactory.getLogger(SecurityUtil.class);
	
	//开发环境IP白名单过滤特定FLAG
	public static final String DEV_IPWHITE_FLAG = "DEV_IPWHITE_FLAG";
	//美匣云security与redis缓存数据同步MQ通知特定的TAG
	public static final String MAYTEK_SECURITY_CACHE_SYNC_TAG = "MAYTEK_SECURITY_CACHE_SYNC_TAG";
	//美匣云security与其他项目通知 机构 初始创建爱你的特定TAG
	public static final String MAYTEK_POSSESSOR_CREATE_TAG = "MAYTEK_POSSESSOR_CREATE_TAG";

	//机构的外部用户 没有设置部门时 返回特殊字符串 使该用户无法看到任何数据
	public static final String OUT_AUTHORITY_FINE_NO_SOURCE = "OUT_AUTHORITY_FINE_NO_SOURCE";
	
	public static String PROJECT_NAME = "";
	public static final String PREFIX_SECURITY = "SECURITY";
	public static final String PREFIX_CONFIG = "CONFIG";
	public static final String PREFIX_LAST_ACTION = "LAST_ACTION";
	public static final String PREFIX_LAST_ACTION_USERNAME = "USERNAME";
	public static final String SECURITY_LOGIN_DECIDE_KEY_PREFIX = "_DECIDE_KEY_";
	private static long syncCount = 0;//同步计数
	
	private static Map<String, String> CACHE_APPINFO = new HashMap<String, String>();
	private static Map<String, String> CACHE_SERVERINFO = new HashMap<String, String>();
	private static Map<String, Map<String,String>> CACHE_API = new HashMap<String, Map<String,String>>();
	private static Map<String, Map<String,String>> CACHE_PROXY_API = new HashMap<String, Map<String,String>>();
	private static Map<String, String> SERVER_URL = new HashMap<String, String>();
	private static Set<String> APP_IP_WHITE_LIST = new HashSet<String>();
	private static Set<String> SERVER_IP_WHITE_LIST = new HashSet<String>();
	private static Set<String> MQ_TAGS_WHITE_LIST = new HashSet<String>();//MQ允许使用的标签白名单
	
	//利用内存缓存登录信息
	private static Map<String,Map<String, String>> CACHE_SECURITY_LOGIN = new HashMap<String,Map<String, String>>();
	
	private static boolean initConfigSuccess = false;
	
	public static void initConfig() {
		if(initConfigSuccess) {
			log.info("SecurityUtil已初始化，请勿重复初始化。");
			return ;
		}
		try {
			if(PROJECT_NAME==null || "".equals(PROJECT_NAME)) {
				PROJECT_NAME = ZSYCENV.getProjectName();//(String)new InitialContext().lookup("java:comp/env/projectName");
			}
			/*int delay = (int)(1000*Math.random());//避免造成密集峰值
			Executors.newScheduledThreadPool(10).scheduleAtFixedRate(new TimerTask(){
				@Override
				public void run() {
					initSync();
				}
			}, delay, 5*60*1000, TimeUnit.MILLISECONDS);*/
			initSync();//启动之后，自动同步一次
			initConfigSuccess = true;
			log.info("SecurityUtil初始化成功。");
			
		} catch (Exception e) {
			initConfigSuccess = false;
			log.info("SecurityUtil初始化出现异常："+e.getMessage());
		}
	}
	
	/**
	 * 同步数据（这些数据量相对于单次请求来说都略大，所以采用定时同步的方式）
	 */
	@SuppressWarnings("unchecked")
	public static void initSync(){
		
		//拉取IP白名单
		Map<String,String> IPWhiteList = RedisUtil.getHash(SecurityUtil.PREFIX_CONFIG, RedisUtil.KEY_CACHE_IP_WHITE_LIST);
		String appBaseIp = IPWhiteList.get("appBaseIp");
		String serverBaseIp = IPWhiteList.get("serverBaseIp");
		String appProjectIp = IPWhiteList.get("app_"+SecurityUtil.PROJECT_NAME);
		String serverProjectIp = IPWhiteList.get("server_"+SecurityUtil.PROJECT_NAME);
		
		Set<String> tempAppIp = new HashSet<String>();
		Set<String> tempServerIp = new HashSet<String>();
		if(StringTool.isNotNull(appBaseIp)){
			Set<String> tempBaseIpSet = JSON.toObject(appBaseIp, Set.class);
			if(tempBaseIpSet!=null && tempBaseIpSet.size()>0){
				tempAppIp.addAll(tempBaseIpSet);
			}
		}
		if(StringTool.isNotNull(serverBaseIp)){
			Set<String> tempServerBaseIpSet = JSON.toObject(serverBaseIp, Set.class);
			if(tempServerBaseIpSet!=null && tempServerBaseIpSet.size()>0){
				tempServerIp.addAll(tempServerBaseIpSet);
			}
		}
		if(StringTool.isNotNull(appProjectIp)){
			Set<String> tempAppProjectIpSet = JSON.toObject(appProjectIp, Set.class);
			if(tempAppProjectIpSet!=null && tempAppProjectIpSet.size()>0){
				tempAppIp.addAll(tempAppProjectIpSet);
			}
		}
		if(StringTool.isNotNull(serverProjectIp)){
			Set<String> tempServerProjectIpSet = JSON.toObject(serverProjectIp, Set.class);
			if(tempServerProjectIpSet!=null && tempServerProjectIpSet.size()>0){
				tempServerIp.addAll(tempServerProjectIpSet);
			}
		}
		setAPP_IP_WHITE_LIST(tempAppIp);
		setSERVER_IP_WHITE_LIST(tempServerIp);
		
		//拉取appInfo
		Map<String,String> appInfoRedis = RedisUtil.getHash(SecurityUtil.PREFIX_SECURITY, RedisUtil.KEY_CACHE_APPINFO);
		appInfoRedis = appInfoRedis==null ? new HashMap<String,String>() : appInfoRedis;
		setCACHE_APPINFO(appInfoRedis);
		
		//拉取serverInfo
		Map<String,String> serverInfoRedis = RedisUtil.getHash(SecurityUtil.PREFIX_SECURITY, RedisUtil.KEY_CACHE_SERVERINFO);
		serverInfoRedis = serverInfoRedis==null ? new HashMap<String,String>() : serverInfoRedis;
		setCACHE_SERVERINFO(serverInfoRedis);
		
		//拉取api
		Map<String,String> apiRedis = RedisUtil.getHash(SecurityUtil.PREFIX_SECURITY, RedisUtil.KEY_CACHE_API);
		apiRedis = apiRedis==null ? new HashMap<String,String>() : apiRedis;
		Map<String,Map<String,String>> apiTemp = new HashMap<String,Map<String,String>>();
		Map<String,Map<String,String>> apiProxyTemp = new HashMap<String,Map<String,String>>();
		for(String key : apiRedis.keySet()){
			Map<String,String> apiMap = JSON.toObject(apiRedis.get(key), Map.class);
			if(apiMap==null || !StringTool.isNotNull(apiMap.get("type"))) {
				continue ;
			}
			if(SecurityType.PROXY.eq(apiMap.get("type"))) {
				apiProxyTemp.put(key, apiMap);
			}else {
				apiTemp.put(key, apiMap);
			}
		}
		setCACHE_API(apiTemp);
		setCACHE_PROXY_API(apiProxyTemp);
		
		//拉取MQ TAG
		String tagsStr = RedisUtil.getString(SecurityUtil.PREFIX_SECURITY, RedisUtil.KEY_CACHE_MQ_TAG_LIST);
		Set<String> tags = new HashSet<String>();
		if(tagsStr!=null && !"".equals(tagsStr)) {
			tags = JSON.toObject(tagsStr, Set.class);
		}
		setCACHE_MQTAG(tags);
		
		if(syncCount<=3){
			StringBuffer logStr = new StringBuffer(PROJECT_NAME+"：SecurityUtil拉取缓存");
			logStr.append("APP_IP_WHITE_LIST【"+APP_IP_WHITE_LIST.size()+"】");
			logStr.append("SERVER_IP_WHITE_LIST【"+SERVER_IP_WHITE_LIST.size()+"】");
			logStr.append("CACHE_API【"+CACHE_API.size()+"】");
			logStr.append("CACHE_APPINFO【"+CACHE_APPINFO.size()+"】");
			logStr.append("CACHE_SERVERINFO【"+CACHE_SERVERINFO.size()+"】");
			logStr.append("CACHE_MQTAG【"+MQ_TAGS_WHITE_LIST.size()+"】");
			log.info(logStr.toString());
		}
		//尝试在serverInfo中提供的多个url中找到一个能连通的url
		for(String key : CACHE_SERVERINFO.keySet()){
			String url = setServerUrl(key);
			if(syncCount<=3){
				log.info(key+"服务使用："+url+"地址");
			}
		}
		syncCount++;
	}
	
	/**
	 * 用rmi请求美匣云体系内接口
	 * @param apiUrl （api.xml中注册的任何接口，不需要后缀，示例：/AdminUserWS/getAllPosition）
	 * @return
	 */
	public static <T> T rmi(String apiUrl){
		return SecurityUtil.rmi(apiUrl, null);
	}
	
	/**
	 * 用rmi请求美匣云体系内接口
	 * @param apiUrl （api.xml中注册的任何接口，不需要后缀，示例：/AdminUserWS/getAllPosition）
	 * @param params
	 * @return
	 */
	public static <T> T rmi(String apiUrl, Map<String,String> params){
		return SecurityUtil.rmi(apiUrl, null, params);
	}
	
	/**
	 * 用rmi请求美匣云体系内接口
	 * @param apiUrl（api.xml中注册的任何接口，不需要后缀，示例：/AdminUserWS/getAllPosition）
	 * @param request
	 * @param params
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static <T> T rmi(String apiUrl, HttpServletRequest request, Map<String,String> params){
		String url = getServerAccessUrl(apiUrl);
		if(url==null || !url.startsWith("http") || !url.endsWith(".server")){
			throw new MyExceptionForRole("无效的请求地址！["+url+"]");
		}
		log.info(url);
		Object result = RmiUtil.loadData(request,url, params);
		if(result==null){
			throw new MyExceptionForRole("请求结果无法解析[null无法转为有效对象]");
		}else if((result instanceof Map) || (result instanceof List) || (result instanceof String)) {
			return (T)result;
		}else {
			throw new MyExceptionForRole("请求结果无法解析["+result.getClass().getSimpleName()+"无法转为Map或List或String]");
		}
	}
	
	/**
	 * 用servletPath获取真实完整访问地址（不带访问后缀）
	 * @param pathUrl 特指servletPath去掉后缀
	 * @return
	 */
	public static String getAccessUrl(String pathUrl){
		Map<String,String> securityApi = getSecurityApi(pathUrl);
		if(securityApi==null || securityApi.get("serverId")==null){
			return "";
		}
		String serverId = securityApi.get("serverId");
		return getServerUrl(serverId)+pathUrl;
	}
	
	public static String getAccessUrlBySecurityApi(Map<String,String> securityApi){
		if(securityApi==null || securityApi.get("serverId")==null || securityApi.get("url")==null){
			return "";
		}
		String serverId = securityApi.get("serverId").toString();
		return getServerUrl(serverId)+securityApi.get("url").toString();
	}
	
	/**
	 * 用servletPath获取真实有效完整访问地址（带.server访问后缀）
	 * @param pathUrl 特指servletPath去掉后缀
	 * @return
	 */
	public static String getServerAccessUrl(String pathUrl){
		return getAccessUrl(pathUrl)+".server";
	}
	
	/**
	 * 获取一个接口应用服务器的基础访问地址
	 * @param serverId
	 * @return
	 */
	public static String getServerUrl(String serverId){
		String serverUrl = SERVER_URL.get(serverId);
		if(StringTool.isNotNull(serverUrl)){
			return serverUrl;
		}
		String url = setServerUrl(serverId);
		if(!StringTool.isNotNull(url)){
			throw new MyExceptionForRole(serverId+"服务地址无效！");
		}
		return url;
	}
	
	private static String setServerUrl(String serverId){
		String serverUrls = CACHE_SERVERINFO.get(serverId);
		if(!StringTool.isNotNull(serverUrls)){
			log.error(serverId+"服务没有注册url属性");
			return "";
		}
		String[] urls = serverUrls.split(",");
		if(urls.length==1 && urls[0]!=null){
			String urlTrim = urls[0].trim();
			if(!"".equals(urlTrim)){
				putSERVER_URL(serverId, urlTrim);
				return urlTrim;
			}else{
				return "";
			}
		}
		//尝试连接serverInfo中注册的所有url
		for(String s : urls){
			if(s!=null && RmiUtil.ping(s+"/ping.server")!=0){//认为返回状态码只要不是0都代表可以连通
				String urlTrim = s.trim();
				if(!"".equals(urlTrim)){
					putSERVER_URL(serverId, urlTrim);//回填到SERVER_URL堆中
					return urlTrim;
				}
			}
		}
		//如果一个都请求不通就默认选择最后一个地址
		if(urls.length>=1) {
			String lastUrl = urls[urls.length-1];
			putSERVER_URL(serverId, lastUrl);//回填到SERVER_URL堆中
			return lastUrl;
		}
		return "";
	}
	
	/**
	 * 根据一个servletPath路径获取完整SecurityApi信息（鉴权后分发：MyAppFilter）
	 * @param pathUrl
	 * @return
	 */
	public static Map<String,String> getSecurityApi(String pathUrl){
		Map<String,String> securityApi = CACHE_API.get(pathUrl);
		return securityApi;
	}
	
	/**
	 * 根据一个servletPath路径获取完整的SecurityApi信息（普通代理分发：MyProxyFilter）
	 * @param pathUrl
	 * @return
	 */
	public static Map<String,String> getProxyApi(String pathUrl){
		Map<String,String> securityApi = CACHE_PROXY_API.get(pathUrl);
		return securityApi;
	}
	
	/**
	 * 匹配domain与AppInfo中URL的一个元素
	 * @param domain
	 * @return
	 */
/*	public static Map<String,String> getAppInfoByDomain(String domain){
		if(!StringTool.isNotNull(domain)){
			return null;
		}
		Map<String,String> appInfo = CACHE_APPINFO.get(domain);
		if(appInfo==null && domain.startsWith("http:")) {
			//如果http协议的没有匹配到，尝试换成https去匹配
			String httpsDomain = domain.replaceFirst("http", "https");
			appInfo = CACHE_APPINFO.get(httpsDomain);
		}
		return appInfo;
	}*/
	
	/**
	 * 获取应用信息
	 * @param appId
	 * @return
	 */
	public static String getAppInfo(String appId){
		return CACHE_APPINFO.get(appId);
	}
	
	/**
	 * 获得应用的第一个url
	 * @param appInfo
	 * @return
	 */
	public static String getAppInfoFirstUrl(Map<String,String> appInfo){
		if(appInfo==null) {
			return "";
		}
		String url = appInfo.get("url");
		if(!StringTool.isNotNull(url)) {
			return "";
		}
		if(url.contains(",")) {
			return url.substring(0, url.indexOf(","));
		}
		return url;
	}
	
	/**
	 * 获取当前登录用户的apikey
	 * @return
	 */
	public static String getApikey(){
        HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
        return (String)request.getAttribute("apikey");
    }
	
	/**
	 * 获取当前登录用户的全部字段完整的securityLogin缓存内容
	 * @param apikey
	 * @return
	 */
	public static Map<String, String> getSecurityLogin(String apikey){
		Map<String,String> securityLogin = CACHE_SECURITY_LOGIN.get(apikey);
		
		if(securityLogin==null || securityLogin.isEmpty() || securityLogin.get("apikey")==null) {
			long start = System.currentTimeMillis();
			securityLogin = RedisUtil.getHash(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN);
			log.info("从redis耗时"+(System.currentTimeMillis()-start)+"ms读取securityLogin："+apikey);
			
			if(securityLogin==null || securityLogin.isEmpty() || securityLogin.get("apikey")==null) {
				securityLogin = null;
			}else {
				//CACHE_SECURITY_LOGIN.put(apikey, securityLogin);//存入内存
			}
		}
		if(securityLogin==null || securityLogin.isEmpty() || securityLogin.get("apikey")==null) {
			throw new MyExceptionForLogin();
		}
		return securityLogin;
	}
	
	/**
	 * 获取当前登录用户的securityLogin缓存中的指定字段内容
	 * @param apikey
	 * @param field
	 * @return
	 */
	public static String getSecurityLoginField(String apikey, String field){
		return RedisUtil.getHashFieldValue(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN,field);
	}
	
	/**
	 * 获取当前登录用户的用户名
	 * @param apikey
	 * @return
	 */
	public static String getUsername(String apikey){
		return RedisUtil.getHashFieldValue(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN,"username");
	}
	
	/**
	 * 获取当前登录用户的昵称
	 * @param apikey
	 * @return
	 */
	public static String getNickName(String apikey){
		return RedisUtil.getHashFieldValue(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN,"nickName");
	}
	
	/**
	 * 获取当前登录用户的岗位
	 * @param apikey
	 * @return
	 */
	public static String getPosition(String apikey){
		return RedisUtil.getHashFieldValue(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN,"position");
	}
	
	/**
	 * 获取当前登录用户的用户类型
	 * @param apikey
	 * @return
	 */
	public static String getSecurityUserType(String apikey){
		return RedisUtil.getHashFieldValue(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN,"securityUserType");
	}
	
	/**
	 * 获取当前登录用户的机构编号
	 * @param apikey
	 * @return
	 */
	public static String getPossessor(String apikey){
		return RedisUtil.getHashFieldValue(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN,"possessor");
	}

	/**
	 * 获取当前登录用户的部门编号
	 * @param apikey
	 * @return
	 */
	public static String getAuthorityFine(String apikey){
		return RedisUtil.getHashFieldValue(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN,"authorityFine");
	}
	
	/**
	 * 获取当前登录用户 针对机构来说是否外部用户
	 * @param apikey
	 * @return
	 */
	public static String getOut(String apikey){
		
		return RedisUtil.getHashFieldValue(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN,"out");
	}
	
	/**
	 * 获取当前登录用户的所有权限组受限信息
	 * @param apikey
	 * @return
	 */
	public static Map<String, String> getDecideAll(String apikey){
		Map<String,String> securityLogin = RedisUtil.getHash(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN);
		Map<String,String> decideAllMap = new HashMap<String,String>();
		for(String key : securityLogin.keySet()) {
			if(key.startsWith(SecurityUtil.SECURITY_LOGIN_DECIDE_KEY_PREFIX)) {
				decideAllMap.put(key.replace(SecurityUtil.SECURITY_LOGIN_DECIDE_KEY_PREFIX, ""), securityLogin.get(key));
			}
		}
		return decideAllMap;
	}
	
	/**
	 * 获取当前登录用户权限组指定受限
	 * @param apikey
	 * @param decideKey
	 * @return
	 */
	public static String getDecide(String apikey, String decideKey){
		return RedisUtil.getHashFieldValue(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN, SecurityUtil.SECURITY_LOGIN_DECIDE_KEY_PREFIX+decideKey);
	}
	
	/**
	 * 缓存SecurityLogin
	 * @param SecurityLogin
	 * @return
	 */
	public static boolean cacheSecurityLogin(Map<String,Object> securityLogin){
		if(securityLogin==null || securityLogin.get("apikey")==null){
			return false;
		}
		String apikey = securityLogin.get("apikey").toString();
		int seconds = 3*24*60*60;//缓存保存1天
		return RedisUtil.setHash(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN, securityLogin, seconds);
	}
	
	/**
	 * 缓存apiList
	 * @param apikey
	 * @param apiList
	 * @return
	 */
	public static boolean cacheApiList(String apikey, List<String> apiList){
		if(apikey==null || "".equals(apikey) || apiList==null){
			return false;
		}
		Map<String,Object> apiMap = new HashMap<String,Object>();
		for(String api : apiList){
			apiMap.put(api, 1);
		}
		int seconds = 3*24*60*60;//缓存保存1天
		return RedisUtil.setHash(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_API_LIST, apiMap, seconds);
	}

	/**
	 * 缓存buttonList
	 * @param apikey
	 * @param buttonList
	 * @return
	 */
	public static boolean cacheButtonList(String apikey, List<String> buttonList){
		if(apikey==null || "".equals(apikey) || buttonList==null){
			return false;
		}
		Map<String,Object> buttonMap = new HashMap<String,Object>();
		for(String button : buttonList){
			buttonMap.put(button, 1);
		}
		int seconds = 3*24*60*60;//缓存保存1天
		return RedisUtil.setHash(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_BUTTON_LIST, buttonMap, seconds);
	}
	
	/**
	 * 缓存权限组受限信息
	 * @param apikey
	 * @param decideMap
	 * @return
	 */
	public static boolean cacheDecide(String apikey, Map<String,Object> decideMap){
		if(apikey==null || "".equals(apikey) || decideMap==null){
			return false;
		}
		int seconds = 3*24*60*60;//缓存保存1天
		return RedisUtil.setHash(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_DECIDE, decideMap, seconds);
	}
	
	/**
	 * 延长登录信息在redis中的（ttl）过期时间一天
	 * @param apikey
	 */
	public static void setSecurityLoginTtlExpire(String apikey) {
		if(apikey==null || "".equals(apikey)){
			return ;
		}
		int seconds = 3*24*60*60;//缓存保存1天
		RedisUtil.setExpire(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_DECIDE, seconds);
		RedisUtil.setExpire(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_API_LIST, seconds);
		RedisUtil.setExpire(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN, seconds);
	}
	
	/**
	 * 清理缓存的登录信息
	 * @param apikeyPrefix
	 * @return
	 */
	public static boolean deleteLoginCache(String apikeyPrefix){
		if(apikeyPrefix==null) {
			return false;
		}
		Set<String> keys = RedisUtil.getKeyList(RedisUtil.PREFIX_APIKEY, apikeyPrefix+"*");
		int count = 0;
		for(String k : keys){
			String tempApikey = "";
			if(k.endsWith("_securityLogin") && k.startsWith("APIKEY_")) {
				tempApikey = k.replace("_securityLogin", "");
				tempApikey = tempApikey.replaceFirst("APIKEY_", "");
			}
			count = RedisUtil.delete(k) ? count+1 : count;
		}
		
		//清理内存中的登录信息
		deleteCacheLogin(apikeyPrefix);
		
		return count==keys.size();
	}
	
	public static void deleteCacheLogin(String apikeyPrefix) {
		
		Set<String> keySet = new HashSet<String>();
		for (String key : CACHE_SECURITY_LOGIN.keySet()) {
			if(key.startsWith(apikeyPrefix)) {
				keySet.add(key);
			}
		}
		
		for (String str : keySet) {
			CACHE_SECURITY_LOGIN.remove(str);
		}
	}
	
	/**
	 * 更新用户最后一次操作系统的时间戳（当前系统时间毫秒级）
	 * @param username
	 * @return
	 */
	public static boolean setUserLastAction(String username) {
		if(!StringTool.isNotNull(username)) {
			return false;
		}
		return RedisUtil.setHashField(PREFIX_LAST_ACTION, PREFIX_LAST_ACTION_USERNAME, username, Long.toString(System.currentTimeMillis()));
	}
	
	/**
	 * 延长过期时间
	 * @return
	 */
	private static boolean extendSecurityLoginExpireDate(String apikey) {
		if(apikey==null){
			return false;
		}
		Map<String, String> securityLogin = RedisUtil.getHash(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_SECURITY_LOGIN);
		String countMStr = securityLogin.get("countM");
		
		long st = System.currentTimeMillis();
		int countM = 60;
		try {
			countM = Integer.parseInt((countMStr==null||"".equals(countMStr))?"60":countMStr);
		}catch(Exception e) {
			log.info("isLogin："+e.getMessage()+";countMStr="+countMStr);
		}
		
		Date expireDate2 = new Date();
		expireDate2.setTime(System.currentTimeMillis()+countM*180*1000);
		//修改过期时间重新缓存到内存中
		securityLogin.put("countM", String.valueOf(countM));
		securityLogin.put("expireDate", DateUtil.dateToString(expireDate2));
		
		Map<String, Object> cloneSecurityLogin = new HashMap<String, Object>();
		for(String key : securityLogin.keySet()) {
			cloneSecurityLogin.put(key, securityLogin.get(key));
		}
		//重新缓存已延长有效时间的登录信息（整体）
		cacheSecurityLogin(cloneSecurityLogin);
		//CACHE_SECURITY_LOGIN.put(apikey, securityLogin);
		
		//延长登录信息相关缓存内容的redis ttl过期时间
		setSecurityLoginTtlExpire(apikey);
		log.info("延长登录有效期："+apikey+"（执行耗时"+(System.currentTimeMillis()-st)+"ms）");
		return true;
	}
	
	public static boolean isLogin(Map<String, String> securityLogin){
		if(securityLogin==null || securityLogin.get("expireDate")==null || securityLogin.get("countM")==null || securityLogin.get("username")==null){
			return false;
		}
		
		String expireDateStr = securityLogin.get("expireDate");
		String countMStr = securityLogin.get("countM");
		String username = securityLogin.get("username");
		
		if(!StringTool.isNotNull(expireDateStr) || !StringTool.isNotNull(username)){
			return false;
		}
		Date date = new Date();
		Date expireDate = DateUtil.stringToDate(expireDateStr);
		long temp = (expireDate==null ? 0 : expireDate.getTime()) - date.getTime();
		if(temp<=0){
			//通过对用户最后一次操作系统的时间比较，来验证是否符合自动延长过期时间，或者提示失效
			String lastActionTimeStr = RedisUtil.getHashFieldValue(PREFIX_LAST_ACTION, PREFIX_LAST_ACTION_USERNAME, username);
			long lastActionTime = 0;
			int countM = 60;
			try {
				lastActionTime = Long.parseLong((lastActionTimeStr==null||"".equals(lastActionTimeStr))?"0":lastActionTimeStr);
				countM = Integer.parseInt((countMStr==null||"".equals(countMStr))?"60":countMStr);
			}catch(Exception e) {
				log.info("isLogin："+e.getMessage()+";countMStr="+countMStr+";lastActionTimeStr="+lastActionTimeStr);
			}
			long expireTemp = lastActionTime+(countM*180*1000) - date.getTime();
			//已超出允许的自动延期时间
			if(expireTemp<0) {
				return false;
			}
			//执行自动延期操作
			extendSecurityLoginExpireDate(securityLogin.get("apikey"));
		}
		
		setUserLastAction(username);
		return true;
	}
	
	public static boolean isSecurity(String apikey, Map<String, String> securityApi, String servletPath){
		if(apikey==null || "".equals(apikey) || securityApi==null){
			return false;
		}
		String isPosition = securityApi.get("isPosition")==null?"0":securityApi.get("isPosition");//是否为必须要权限验证的接口
		/**
		 * 不再需要权限验证的接口中，就认为是登录即可访问
		 */
		String needPosition = RedisUtil.getHashFieldValue(SecurityUtil.PREFIX_SECURITY, RedisUtil.KEY_CACHE_POSITIONAPI, servletPath);
		if(!"1".equals(needPosition) && !"1".equals(isPosition)){
			return true;
		}
		/**
		 * 检查当前用户访问权限
		 */
		String securityOk = RedisUtil.getHashFieldValue(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_API_LIST, servletPath);
		return "1".equals(securityOk);
	}
	
	/**
	 * 验证应用的IP白名单
	 * @param ip
	 * @return
	 */
	public static boolean validAppIp(String ip){
		ip = StringTool.isNotNull(ip)?ip:"";
		if(!ip.contains(",")) {
			return APP_IP_WHITE_LIST.contains(ip);
		}
		
		String[] ips = ip.split(",");
		for(String iip : ips) {
			if(APP_IP_WHITE_LIST.contains(iip)) {
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * 验证服务的IP白名单
	 * @param ip
	 * @return
	 */
	public static boolean validServerIp(String ip){
		
		if(SERVER_IP_WHITE_LIST.contains(DEV_IPWHITE_FLAG)) {
			return true;
		}
		
		ip = StringTool.isNotNull(ip)?ip:"";
		if(!ip.contains(",")) {
			return SERVER_IP_WHITE_LIST.contains(ip);
		}
		
		String[] ips = ip.split(",");
		for(String iip : ips) {
			if(SERVER_IP_WHITE_LIST.contains(iip)) {
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * 验证tag是否可用
	 * @param tag
	 * @return
	 */
	public static boolean validMQTag(String tag) {
		if(MAYTEK_SECURITY_CACHE_SYNC_TAG.equals(tag)) {
			return true;
		}
		if(MAYTEK_POSSESSOR_CREATE_TAG.equals(tag)) {
			return true;
		}
		return MQ_TAGS_WHITE_LIST.contains(tag);
	}
	
	/**
	 * 验证用户是否有button权限
	 * @param button
	 * @return
	 */
	public static boolean xyzControlButton(String apikey, String buttonCode) {
		String securityOk = RedisUtil.getHashFieldValue(RedisUtil.PREFIX_APIKEY, apikey+"_"+RedisUtil.FIELD_CACHE_BUTTON_LIST, buttonCode);
		return "1".equals(securityOk);
	}
	
	/**
	 * 获取客户端IP
	 * @param request
	 * @return
	 */
	public static String getIp(HttpServletRequest request){
		//HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
		String ip = request.getHeader("X-Forwarded-For");   
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {   
			ip = request.getHeader("Proxy-Client-IP");   
		}  
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {   
			ip = request.getHeader("WL-Proxy-Client-IP");   
		}   
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {   
			ip = request.getHeader("HTTP_CLIENT_IP");
		}  
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {   
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");   
		} 
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {   
			ip = request.getRemoteAddr();   
		}   
		return ip;
	}
	
	/**
	 * 获取客户端IP（支持xt_cloud分发）
	 * @param request
	 * @return
	 */
	public static String getClientIp(HttpServletRequest request){
		String ip = request.getHeader(RmiUtil.HEADER_MAYTEK_RMI_CLIENT_IP);   
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = getIp(request);  
		}
		return ip;
	}
	
	private synchronized static void setAPP_IP_WHITE_LIST(Set<String> appIpWhiteList){
		if(appIpWhiteList!=null && appIpWhiteList.size()>0){
			APP_IP_WHITE_LIST = appIpWhiteList;
		}
	}
	
	private synchronized static void setSERVER_IP_WHITE_LIST(Set<String> serverIpWhiteList){
		if(serverIpWhiteList!=null && serverIpWhiteList.size()>0){
			SERVER_IP_WHITE_LIST = serverIpWhiteList;
		}
	}
	
	private synchronized static void putSERVER_URL(String serverId, String serverUrl){
		SERVER_URL.put(serverId, serverUrl);
	}
	
	private synchronized static void setCACHE_APPINFO(Map<String, String> cacheAppInfo){
		if(cacheAppInfo!=null && cacheAppInfo.size()>0){
			CACHE_APPINFO = cacheAppInfo;
		}
	}
	
	private synchronized static void setCACHE_SERVERINFO(Map<String, String> cacheServerInfo){
		if(cacheServerInfo!=null && cacheServerInfo.size()>0){
			CACHE_SERVERINFO = cacheServerInfo;
		}
	}
	
	private synchronized static void setCACHE_API(Map<String, Map<String,String>> cacheApi){
		if(cacheApi!=null && cacheApi.size()>0){
			CACHE_API = cacheApi;
		}
	}
	
	private synchronized static void setCACHE_PROXY_API(Map<String, Map<String,String>> cacheProxyApi){
		if(cacheProxyApi!=null && cacheProxyApi.size()>0){
			CACHE_PROXY_API = cacheProxyApi;
		}
	}
	
	private synchronized static void setCACHE_MQTAG(Set<String> cacheTags){
		if(cacheTags!=null && cacheTags.size()>0){
			MQ_TAGS_WHITE_LIST = cacheTags;
		}
	}
	
	public static String getDomain(HttpServletRequest request) {
		if(request==null) {
			return "";
		}
//		System.out.println("原始URL="+request.getHeader("x-maytek-usr-location"));
		//由nginx代理时构建的用户真实访问请求协议
		String usrScheme = request.getHeader("x-maytek-usr-scheme");//http或https
		StringBuffer url = request.getRequestURL();
		if("https".equals(usrScheme) && url.toString().startsWith("http:")) {
			url = new StringBuffer(url.toString().replaceFirst("http", "https"));
		}
		String domain = url.delete(url.length() - request.getRequestURI().length(), url.length())
				.append(request.getContextPath()).toString();
		return domain;
	}
}
