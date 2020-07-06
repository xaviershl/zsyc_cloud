package xyz.util.zsyc;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import okhttp3.Call;
import okhttp3.Response;
import xyz.filter.MyExceptionUtil;

/**
 * 美匣严谨日志存库工具
 * @author Ivan
 *
 */
public class LogUtil {
	private static Logger log = LoggerFactory.getLogger(LogUtil.class);
	/**
	 * 不记录日志的方法名（前匹配）
	 */
	private static final String[] UNLOG_METHOD_START = new String[]{"get","query"};
	/**
	 * 忽略前匹配，强制记录日志的方法名包含字符
	 */
	private static final String[] LOG_METHOD_CONTAINS = new String[]{"load","excel"};
	
	public static boolean isLog(String securityApi_url){
		if(securityApi_url==null
			|| "".equals(securityApi_url)
			|| "/LogWS/addLog".equals(securityApi_url)
			|| "/ExceptionInfoWS/addExceptionInfo".equals(securityApi_url)
			|| "/LogWS/addLogException".equals(securityApi_url)
			){
			
			return false;
		}
		
		//分解出请求方法名
		String[] strs = securityApi_url.split("/");
		String method = strs.length>=1 ? (strs[strs.length-1]) : "";
		method = method==null ? "" : method.toLowerCase();
		/**
		 * 日志：！（ get||query + ！（load || excel））
		 */
		boolean logFlag = true;
		for(String s : UNLOG_METHOD_START){
			if(method.startsWith(s)){
				logFlag = false;
				break;
			}
		}
		for(String c : LOG_METHOD_CONTAINS){
			if(method.contains(c)){
				logFlag = true;
				break;
			}
		}
		return logFlag;
	}
	
	/**
	 * 远程保存用户操作日志
	 * @param request httpServletRequest
	 * @param apikey 
	 * @param ipInfo 
	 * @param resultContent 接口返回数据
	 * @param countTime 接口执行花费的时间（毫秒）
	 */
	@SuppressWarnings("unchecked")
	public static void saveLog(HttpServletRequest request, String apikey, Object resultContent, long countTime){
		/****记录日志****/
		Map<String,Object> logDatacontent = new HashMap<String,Object>();
		Map<String,String[]> parameters = request.getParameterMap();
		//分析出request中的参数
		for(String p : parameters.keySet()){
			Object[] parameter = parameters.get(p);
			if(parameter!=null){
				for(Object para : parameter){
					logDatacontent.put(p, para.toString());
				}
			}
		}
		
		String ipInfo = "";
		String nameCn = "";
		String cookieStr = request.getHeader("Cookie");
		
		Cookie[] ttt = request.getCookies();
		if(ttt!=null){
			for(Cookie cookie : ttt){
				if("_ip".equals(cookie.getName())){
					ipInfo = cookie.getValue();
					break;
				}
			}
		}
		ipInfo = StringTool.isNotNull(ipInfo) ? (ipInfo+",") : ipInfo;
		ipInfo = ipInfo + SecurityUtil.getIp(request);
		
		String interfacePath = request.getServletPath();
		interfacePath = interfacePath.split("\\.")[0];
		Map<String, String> securityApi = SecurityUtil.getSecurityApi(interfacePath);
		if(securityApi!=null){
			nameCn = ""+securityApi.get("nameCn");
		}

		Map<String,String> logparams = new HashMap<String,String>();
		logparams.put("apikey", apikey);
		logparams.put("ipInfo", ipInfo);
		logparams.put("cookie", cookieStr);
		logparams.put("interfacePath", interfacePath);
		logparams.put("remark", nameCn);
		logparams.put("appName", SecurityUtil.PROJECT_NAME);
		if(resultContent instanceof Map){
			Integer flagResult = (Integer)((Map<String, Object>)resultContent).get(ReturnUtil.STATUS);
			if(flagResult!=null) {
				logparams.put("flagResult", ""+flagResult.intValue());
			}
			logparams.put("resultContent", JSON.toJson(resultContent));
		}
		logparams.put("countTime", ""+(countTime));
		logparams.put("dataContent", JSON.toJson(logDatacontent));
		logparams.put("userAgent", request.getHeader("User-Agent"));
		String logUrl = SecurityUtil.getServerUrl("zsyc_yangtaicai")+"/LogWS/addLog.server";
		OkHttpKit.postFromAsync(logUrl, logparams, new okhttp3.Callback(){

			@Override
			public void onFailure(Call call, IOException ioException) {
				log.error(SecurityUtil.PROJECT_NAME + "保存日志出错："+ioException.getMessage());
			}

			@Override
			public void onResponse(Call call, Response response)
					throws IOException {
				String result = response.body().string();
				try{
					if(StringTool.isNotNull(result) && ReturnUtil.is0(JSON.toObject(result, Map.class))){
						log.error(SecurityUtil.PROJECT_NAME + "保存日志失败："+ReturnUtil.getMsg(JSON.toObject(result, Map.class)));
					}
				}catch(Exception e){
					log.error("日志回调转换JSON异常");
					log.error(result);
					e.printStackTrace();
				}finally {
					if(response!=null && response.body()!=null) {
						response.body().close();
					}
					if(response!=null) {
						response.close();
					}
				}
			}
			
		});
	}
	
	/**
	 * 异步保存运行时异常/业务逻辑错误等日志
	 * @param keyInfo 关键信息（索引字段）可保存如：用户名、订单编号、产品编号、异常名称等
	 * @param tag 信息分类，如：订单业务、库存扣减、异常捕获等
	 * @param ex 异常对象
	 */
	public static void saveExceptionLog(String keyInfo, String tag, Exception ex) {
		saveExceptionLog(keyInfo, tag, null, ex);
	}
	
	/**
	 * 异步保存运行时异常/业务逻辑错误等日志
	 * @param keyInfo 关键信息（索引字段）可保存如：用户名、订单编号、产品编号、异常名称等
	 * @param tag 信息分类，如：订单业务、库存扣减、异常捕获等
	 * @param remark 异常信息备注
	 * @param ex 异常对象
	 */
	public static void saveExceptionLog(String keyInfo, String tag, String remark, Exception ex) {
		StringBuffer info = new StringBuffer("");
		info.append((remark==null?"":remark)+"\r\n");
		Throwable newEx = MyExceptionUtil.handleException(ex);
		Writer writer = new StringWriter();  
        PrintWriter printWriter = new PrintWriter(writer);  
        newEx.printStackTrace(printWriter);  
        Throwable cause = newEx.getCause();  
        while (cause != null) {
            cause.printStackTrace(printWriter);
            cause = cause.getCause();
        }
        printWriter.close();
        info.append(writer.toString());
        saveExceptionLog(keyInfo, tag, info.toString());
	}
	
	/**
	 * 异步保存运行时异常/业务逻辑错误等日志
	 * @param keyInfo 关键信息（索引字段）可保存如：用户名、订单编号、产品编号、异常名称等
	 * @param tag 信息分类，如：订单业务、库存扣减、异常捕获等
	 * @param content 内容，如：捕获的异常堆栈信息、业务错误信息等
	 */
	public static void saveExceptionLog(String keyInfo, String tag, String content) {
		Map<String,String> logparams = new HashMap<String,String>();
		logparams.put("keyInfo", keyInfo);
		logparams.put("tag", tag);
		logparams.put("content", content);
		logparams.put("project", SecurityUtil.PROJECT_NAME);
		String exceptionLogUrl = SecurityUtil.getServerUrl("zsyc_yangtaicai")+"/ExceptionInfoWS/addExceptionInfo.server";
		OkHttpKit.postFromAsync(exceptionLogUrl, logparams, new okhttp3.Callback(){

			@Override
			public void onFailure(Call call, IOException ioException) {
				log.error(SecurityUtil.PROJECT_NAME+"保存异常日志出错："+ioException.getMessage());
			}

			@SuppressWarnings("unchecked")
			@Override
			public void onResponse(Call call, Response response)
					throws IOException {
				String result = response.body().string();
				try{
					if(StringTool.isNotNull(result) && ReturnUtil.is0(JSON.toObject(result, Map.class))){
						String msg = "";
						if(result.startsWith("{") && result.endsWith("}")) {
							msg = ReturnUtil.getMsg(JSON.toObject(result, Map.class));
						}else {
							msg = result;
						}
						log.error(SecurityUtil.PROJECT_NAME + "保存异常日志失败："+msg);
					}
				}catch(Exception e){
					log.error("异常日志回调转换JSON异常");
					log.error(result);
					e.printStackTrace();
				}finally {
					if(response!=null && response.body()!=null) {
						response.body().close();
					}
					if(response!=null) {
						response.close();
					}
				}
			}
			
		});
	}
	
	/**
	 * 存储业务异常日志  (建议前端访问后台式业务调用)
	 * @param request 请求
	 * @param apikey 登录用户 apiKey 可不传, 不传将不记录 操作人 和机构
	 * @param title 接口标题
	 * @param msg 错误信息
	 * @param platform 平台(应该是超级连通器专用)
	 */
	public static void saveLogException(HttpServletRequest request, String apikey, String title, String msg ,String platform ,String groupCn){
		
		/****记录日志****/
		Map<String,Object> logDatacontent = new HashMap<String,Object>();
		@SuppressWarnings("unchecked")
		Map<String,String[]> parameters = request.getParameterMap();
		//分析出request中的参数
		for(String p : parameters.keySet()){
			Object[] parameter = parameters.get(p);
			if(parameter!=null){
				for(Object para : parameter){
					logDatacontent.put(p, para.toString());
				}
			}
		}
		
		String ipInfo = "";
		
		Cookie[] ttt = request.getCookies();
		if(ttt!=null){
			for(Cookie cookie : ttt){
				if("_ip".equals(cookie.getName())){
					ipInfo = cookie.getValue();
					break;
				}
			}
		}
		ipInfo = StringTool.isNotNull(ipInfo) ? (ipInfo+",") : ipInfo;
		ipInfo = ipInfo + SecurityUtil.getIp(request);
		
		String interfacePath = request.getServletPath();
		interfacePath = interfacePath.split("\\.")[0];
		
		/**
		 * 添加业务错误日志
		 * @param username 操作人
		 * @param possessor 机构
		 * @param appName 应用
		 * @param requestIp 请求ip
		 * @param targetInterface 接口地址
		 * @param title 标明异常原因
		 * @param requestParams 请求参数
		 * @param exceptionMsg 错误信息
		 * @param requestTime 请求时间
		 * @param platform 平台(给超级连通器使用)
		 * @return
		 */
		Map<String,String> logparams = new HashMap<String,String>();

		String username = "";
		String possessor = "";
		if(StringUtils.isNotBlank(apikey)) {
			username = SecurityUtil.getUsername(apikey);
			possessor = SecurityUtil.getPossessor(apikey);
		}
		
		logparams.put("groupCn", groupCn);
		logparams.put("username", username);
		logparams.put("possessor", possessor);
		logparams.put("appName", SecurityUtil.PROJECT_NAME);
		logparams.put("requestIp", ipInfo);
		logparams.put("targetInterface", interfacePath);
		logparams.put("title", title);
		logparams.put("requestParams", JSON.toJson(logDatacontent));
		logparams.put("exceptionMsg", msg);
		logparams.put("requestTime", DateUtil.dateToString(new Date()));
		logparams.put("platform", platform);
		
		String logUrl = SecurityUtil.getServerUrl("zsyc_yangtaicai")+"/LogWS/addLogException.server";
		OkHttpKit.postFromAsync(logUrl, logparams, new okhttp3.Callback(){

			@Override
			public void onFailure(Call call, IOException ioException) {
				log.error(SecurityUtil.PROJECT_NAME + "保存日志出错："+ioException.getMessage());
			}

			@SuppressWarnings("unchecked")
			@Override
			public void onResponse(Call call, Response response) throws IOException {
				
				String result = response.body().string();
				try{
					if(StringTool.isNotNull(result) && ReturnUtil.is0(JSON.toObject(result, Map.class))){
						log.error(SecurityUtil.PROJECT_NAME + "保存日志失败："+ReturnUtil.getMsg(JSON.toObject(result, Map.class)));
					}
				}catch(Exception e){
					log.error("日志回调转换JSON异常");
					log.error(result);
					e.printStackTrace();
				}finally {
					if(response!=null && response.body()!=null) {
						response.body().close();
					}
					if(response!=null) {
						response.close();
					}
				}
			}
			
		});
	}
	
	/**
	 * 给后台接口调用或者计划任务 或者 MQ
	 * @param appName
	 * @param requestIp
	 * @param targetInterface
	 * @param title
	 * @param requestParams
	 * @param exceptionMsg
	 * @param platform
	 */
	public static void saveLogException(
			String groupCn,
			String appName,
			String requestIp,
			String targetInterface,
			String title,
			String requestParams,
			String exceptionMsg,
			String platform) {
		
		Map<String,String> logparams = new HashMap<String,String>();
		logparams.put("groupCn", groupCn);
		logparams.put("username", "system");
		logparams.put("possessor", "");
		logparams.put("appName", appName);
		logparams.put("requestIp", requestIp);
		logparams.put("targetInterface", targetInterface);
		logparams.put("title", title);
		logparams.put("requestParams", requestParams);
		logparams.put("exceptionMsg", exceptionMsg);
		logparams.put("requestTime", DateUtil.dateToString(new Date()));
		logparams.put("platform", platform);
		
		String logUrl = SecurityUtil.getServerUrl("zsyc_yangtaicai")+"/LogWS/addLogException.server";
		OkHttpKit.postFromAsync(logUrl, logparams, new okhttp3.Callback(){

			@Override
			public void onFailure(Call call, IOException ioException) {
				log.error(SecurityUtil.PROJECT_NAME + "保存日志出错："+ioException.getMessage());
			}

			@SuppressWarnings("unchecked")
			@Override
			public void onResponse(Call call, Response response) throws IOException {
				
				String result = response.body().string();
				try{
					if(StringTool.isNotNull(result) && ReturnUtil.is0(JSON.toObject(result, Map.class))){
						log.error(SecurityUtil.PROJECT_NAME + "保存日志失败："+ReturnUtil.getMsg(JSON.toObject(result, Map.class)));
					}
				}catch(Exception e){
					log.error("日志回调转换JSON异常");
					log.error(result);
					e.printStackTrace();
				}finally {
					if(response!=null && response.body()!=null) {
						response.body().close();
					}
					if(response!=null) {
						response.close();
					}
				}
			}
			
		});
	}
	
	
	/**
	 * 添加业务错误日志
	 * @param username 操作人
	 * @param possessor 机构
	 * @param appName 应用
	 * @param requestIp 请求ip
	 * @param targetInterface 接口地址
	 * @param title 标明异常原因
	 * @param requestParams 请求参数
	 * @param exceptionMsg 错误信息
	 * @param requestTime 请求时间
	 * @param platform 平台(给超级连通器使用)
	 * @return
	 */
	public static void saveLogException(
			String groupCn,
			String username,
			String possessor,
			String appName,
			String requestIp,
			String targetInterface,
			String title,
			String requestParams,
			String exceptionMsg,
			Date requestTime,
			String platform){
		
		Map<String,String> logparams = new HashMap<String,String>();
		logparams.put("groupCn", groupCn);
		logparams.put("username", username);
		logparams.put("possessor", possessor);
		logparams.put("appName", appName);
		logparams.put("requestIp", requestIp);
		logparams.put("targetInterface", targetInterface);
		logparams.put("title", title);
		logparams.put("requestParams", requestParams);
		logparams.put("exceptionMsg", exceptionMsg);
		logparams.put("requestTime", DateUtil.dateToString(requestTime));
		logparams.put("platform", platform);
		
		String logUrl = SecurityUtil.getServerUrl("zsyc_yangtaicai")+"/LogWS/addLogException.server";
		OkHttpKit.postFromAsync(logUrl, logparams, new okhttp3.Callback(){

			@Override
			public void onFailure(Call call, IOException ioException) {
				log.error(SecurityUtil.PROJECT_NAME + "保存日志出错："+ioException.getMessage());
			}

			@SuppressWarnings("unchecked")
			@Override
			public void onResponse(Call call, Response response) throws IOException {
				
				String result = response.body().string();
				try{
					if(StringTool.isNotNull(result) && ReturnUtil.is0(JSON.toObject(result, Map.class))){
						log.error(SecurityUtil.PROJECT_NAME + "保存日志失败："+ReturnUtil.getMsg(JSON.toObject(result, Map.class)));
					}
				}catch(Exception e){
					log.error("日志回调转换JSON异常");
					log.error(result);
					e.printStackTrace();
				}finally {
					if(response!=null && response.body()!=null) {
						response.body().close();
					}
					if(response!=null) {
						response.close();
					}
				}
			}
			
		});
	}
}
