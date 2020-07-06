package xyz.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import xyz.constant.ConstantMsg;
import xyz.util.zsyc.JSON;
import xyz.util.zsyc.SecurityUtil;
import xyz.util.zsyc.StringTool;

/**
 * 此filter验证由config.properties文件配置信息提供验证基础
 * @author Ivan
 *
 */
public class MyAppFilter implements Filter{

    private static Logger log = LoggerFactory.getLogger(MyAppFilter.class);
    
    private static Set<String> NOT_CHECK_URL = new HashSet<String>();
    private static Set<String> SUFFIX_ONLYIP_CHECK = new HashSet<String>();
    private static Set<String> SUFFIX_LOGIN_CHECK = new HashSet<String>();
    private static Set<String> SUFFIX_POSITION_CHECK = new HashSet<String>();
    private static Set<String> SUFFIX_NOT_RMI = new HashSet<String>();
    private static final String COOKIE_APIKEY_NAME = "zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc";
    protected static final String COOKIE_I18N_NAME = "iiiiiiiiiiiiiiiiiiiiiiiiiiiiii";
//    private static final String COOKIE_CURRENT_APP_ID = "CURRENT_APP_ID"; //架构升级 不再传递 CURRENT_APP_ID 前端直接获取所有Function
    private static String I18N_PATH = "/update.i18n";
    
    
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		//添加默认URL
  		MyAppFilter.NOT_CHECK_URL.add("/InitWS/init_1239127awdasd_api");
		MyAppFilter.NOT_CHECK_URL.add("/LoginWS/login");
		MyAppFilter.NOT_CHECK_URL.add("/LoginWS/alterPassword");
		MyAppFilter.NOT_CHECK_URL.add("/LoginWS/loginByTaobao");
		MyAppFilter.NOT_CHECK_URL.add("/I18nWS/queryI18nLanguageByComboList");
		MyAppFilter.NOT_CHECK_URL.add("/MottoWS/getMottoImage");
		MyAppFilter.NOT_CHECK_URL.add("/UIExceptionInfoWS/addUIExceptionInfo"); //前端异常信息捕捉
		
		//微信扫码登录
		MyAppFilter.NOT_CHECK_URL.add("/SecurityUserWeChatWS/getWeChatLoginToken");//PC_获取Token
		MyAppFilter.NOT_CHECK_URL.add("/SecurityUserWeChatWS/getWeChatLoginApikey");//PC_轮询获取登录状态
		MyAppFilter.NOT_CHECK_URL.add("/SecurityUserWeChatWS/bindTokenOpenid");//WeChat_openid绑定token
		MyAppFilter.NOT_CHECK_URL.add("/SecurityUserWeChatWS/bindSecurityUserWeChatOpenid");//WeChat_openid绑定用户
		MyAppFilter.NOT_CHECK_URL.add("/SecurityUserWeChatWS/getRelationUserListByOpenid");//WeChat_获取傀儡用户
		MyAppFilter.NOT_CHECK_URL.add("/SecurityUserWeChatWS/securityUserWeChatLogin");//WeChat_正式登录
		
		String NOT_CHECK_URL = filterConfig.getInitParameter("NOT_CHECK_URL");
		String SUFFIX_ONLYIP_CHECK = filterConfig.getInitParameter("SUFFIX_ONLYIP_CHECK");
		String SUFFIX_LOGIN_CHECK = filterConfig.getInitParameter("SUFFIX_LOGIN_CHECK");
		String SUFFIX_POSITION_CHECK = filterConfig.getInitParameter("SUFFIX_POSITION_CHECK");
		String SUFFIX_NOT_RMI = filterConfig.getInitParameter("SUFFIX_NOT_RMI");
		String I18N_PATH = filterConfig.getInitParameter("I18N_PATH");
		
		if(NOT_CHECK_URL!=null && !"".equals(NOT_CHECK_URL)){
			for(String str : NOT_CHECK_URL.split(",")){
				MyAppFilter.NOT_CHECK_URL.add(StringTool.trimAll(str));
			}
		}
		if(SUFFIX_ONLYIP_CHECK!=null && !"".equals(SUFFIX_ONLYIP_CHECK)){
			for(String str : SUFFIX_ONLYIP_CHECK.split(",")){
				MyAppFilter.SUFFIX_ONLYIP_CHECK.add(StringTool.trimAll(str));
			}
		}
		if(SUFFIX_LOGIN_CHECK!=null && !"".equals(SUFFIX_LOGIN_CHECK)){
			for(String str : SUFFIX_LOGIN_CHECK.split(",")){
				MyAppFilter.SUFFIX_LOGIN_CHECK.add(StringTool.trimAll(str));
			}
		}
		if(SUFFIX_POSITION_CHECK!=null && !"".equals(SUFFIX_POSITION_CHECK)){
			for(String str : SUFFIX_POSITION_CHECK.split(",")){
				MyAppFilter.SUFFIX_POSITION_CHECK.add(StringTool.trimAll(str));
			}
		}
		if(SUFFIX_NOT_RMI!=null && !"".equals(SUFFIX_NOT_RMI)){
			for(String str : SUFFIX_NOT_RMI.split(",")){
				MyAppFilter.SUFFIX_NOT_RMI.add(StringTool.trimAll(str));
			}
		}
		if(I18N_PATH!=null && !"".equals(I18N_PATH)){
			MyAppFilter.I18N_PATH = I18N_PATH;
		}
		log.info("-----------"+SecurityUtil.PROJECT_NAME+"：MyAppFilter初始化信息------------");
		log.info(JSON.toJson(MyAppFilter.NOT_CHECK_URL));
		log.info(JSON.toJson(MyAppFilter.SUFFIX_ONLYIP_CHECK));
		log.info(JSON.toJson(MyAppFilter.SUFFIX_LOGIN_CHECK));
		log.info(JSON.toJson(MyAppFilter.SUFFIX_POSITION_CHECK));
		log.info(JSON.toJson(MyAppFilter.SUFFIX_NOT_RMI));
		log.info(MyAppFilter.I18N_PATH);
	}

	@Override
	public void doFilter(
			ServletRequest request1, 
			ServletResponse response1,
			FilterChain chain)
					throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest)request1;
		HttpServletResponse response = (HttpServletResponse)response1;
		String servletPath = request.getServletPath();
		String domain = SecurityUtil.getDomain(request);
		String apikey = request.getParameter("apikey");//传参的apikey优先于cookie中的
//		String currentAppId = request.getParameter(COOKIE_CURRENT_APP_ID);//获取当前应用ID，传参的CURRENT_APP_ID优先于cookie中的
		String currentLang = "zh";
		
		/**
		 * 从cookie中提取apikey和i18n lang
		 */
		Cookie[] ttt = request.getCookies();
		if(ttt!=null){
			for(Cookie cookie : ttt){
				if(MyAppFilter.COOKIE_APIKEY_NAME.equals(cookie.getName()) && !StringTool.isNotNull(apikey)){
					apikey = cookie.getValue();
				}else if(MyAppFilter.COOKIE_I18N_NAME.equals(cookie.getName())){
					currentLang = cookie.getValue();
//				}else if(MyAppFilter.COOKIE_CURRENT_APP_ID.equals(cookie.getName())) {
//					currentAppId = cookie.getValue();
				}
			}
		}
//		if(!StringTool.isNotNull(currentAppId)) {
//			currentAppId = "xt_cloud";
//			log.info("没有从参数和cookie中得到CURRENT_APP_ID，赋默认值："+currentAppId);
//		}
		/**
		 * 确定当前应用
		 */
//		log.info("当前的AppId是："+currentAppId);
//		String appType = SecurityUtil.getAppInfo(currentAppId);
//		if(!StringTool.isNotNull(appType)){
//			log.info("不明确的应用访问来源："+currentAppId+";访问者IP："+SecurityUtil.getIp(request));
//			throw new MyExceptionForRole("不明确的应用访问来源："+currentAppId);
//		}
		//应用类型possessor和platform
//		String appType = appInfo.get("type");
		
		Map<String,String> securityLogin = null;
		try {
			securityLogin = SecurityUtil.getSecurityLogin(apikey);
		}catch(Exception e) {
			log.info("获取登录信息失败：apikey:"+apikey+"找不到登录信息!" + e.getMessage());
		}
		
		//应用类型possessor和platform
		//String userType = securityLogin==null?"":securityLogin.get("securityUserType");
		
		if("/rcache.xyz".equals(servletPath)){
			/**
			 * 手动刷新缓存
			 */
			SecurityUtil.initSync();
			outContent(response, "1");
			return ;
		}else if("/ping.xyz".equals(servletPath)){
			outContent(response, "1");
			return ;
		}
		
		String ip = SecurityUtil.getIp(request);
		Map<String, String> accessoryParam = new HashMap<String, String>();
		
		String[] temp = servletPath.split("\\.");
		servletPath = temp[0];
		String houzhui = temp.length>1?temp[1]:"";
		
		/**
		 * 不使用RMI代理访问的非接口文件请求等
		 */
		if(MyAppFilter.SUFFIX_NOT_RMI.contains(houzhui)){
			chain.doFilter(request1, response1);
			return ;
		}
		
		/**
		 * 检查Url是否已注册
		 */
		Map<String, String> securityApi = SecurityUtil.getSecurityApi(servletPath);
		if(!MyAppFilter.SUFFIX_NOT_RMI.contains(houzhui) && securityApi==null){
			throw new MyExceptionForRole("接口未在SecurityApi建档，请联系系统管理员！【"+servletPath+"】");
		}
		//接口类型
		//String apiType = securityApi.get("type");
		
		boolean flagNotCheckUrl = MyAppFilter.NOT_CHECK_URL.contains(servletPath);
		
		/**
		 * 登录验证
		 */
		if(MyAppFilter.SUFFIX_LOGIN_CHECK.contains(houzhui) && !flagNotCheckUrl){
			if(apikey==null){
				throw new MyExceptionForLogin("不存在有效登录信息,请重新登录！");
			}
			boolean isLogin = SecurityUtil.isLogin(securityLogin);
			if(!isLogin){
				log.info(apikey+"登录验证不通过");
				throw new MyExceptionForLogin("超过时限，请重新登录！");
			}
			
			accessoryParam.put("apikey", apikey);//向后传递（RmiUtil中就日志会用到，后续系统也会用到，统一使用accessoryParam传递为准，不再从request中取了）
			request1.setAttribute("apikey", apikey);
		}
		
		/**
		 * 接口类型与用户类型匹配验证
		 */
		/*
		if(SecurityType.OPEN.eq(apiType)) {//开放接口直接放行
			;
		}else if(SecurityType.POSSESSOR.eq(apiType)) {//机构接口只对机构用户放行
			if(!SecurityType.POSSESSOR.eq(userType)) {
				throw new MyExceptionForLogin("当前用户类型["+userType+"]不可访问机构接口！");
			}
		}else if(SecurityType.PLATFORM.eq(apiType)) {//运营平台接口只对平台用户放行
			if(!SecurityType.PLATFORM.eq(userType)) {
				throw new MyExceptionForLogin("当前用户类型["+userType+"]不可访问平台接口！");
			}
		}else {
			throw new MyExceptionForLogin("无效的API类型["+apiType+"]，或当前用户类型["+userType+"]无效！");
		}
		*/
		
		/**
		 * 权限验证
		 */
		if(MyAppFilter.SUFFIX_POSITION_CHECK.contains(houzhui)  && !flagNotCheckUrl){
			if(!SecurityUtil.isSecurity(apikey, securityApi, servletPath)){
				throw new MyExceptionForRole(ConstantMsg.auth_role_error);
			}
		}
		
		/**
		 * 特定开放的IP权限访问验证
		 */
		if(MyAppFilter.SUFFIX_ONLYIP_CHECK.contains(houzhui) && !SecurityUtil.validAppIp(ip)){
			throw new MyExceptionForRole("无法通过IP安全验证，请联系系统管理员！【"+servletPath+"."+houzhui+"】");
		}
		
		
		if("/LoginWS/decideLogin".equals(servletPath) || "/LoginWS/login".equals(servletPath) || "/LoginWS/loginByTaobao".equals(servletPath)){
//			accessoryParam.put("appId", currentAppId);//传递当前应用ID
			accessoryParam.put("lang", currentLang);//传递用户语言
			accessoryParam.put("domain", domain);//传递当前访问域名
		}
		if("/LoginWS/decideLogin".equals(servletPath)) {
			SecurityUtil.setSecurityLoginTtlExpire(apikey);
		}
		/*
		
		//尝试默认缓存
		boolean flagDefaultFastForQueryReal = false;
		@SuppressWarnings("unchecked")
		Map<String,String[]> parameters = request.getParameterMap();
		String parametersStr = JSON.toJson(parameters);
		
		boolean flagUseMaytekCache = parametersStr.contains("useMaytekCache");
		boolean flagDefaultFastForQueryYes = parametersStr.contains("flagDefaultFastForQueryYes");
		String flagDefaultFastForQueryKey = "";
		*/
		/*
		//登录信息的空判断.
		if(!(securityLogin==null || securityLogin.isEmpty() || securityLogin.get("apikey")==null)) {
			flagDefaultFastForQueryKey = securityLogin.get("position")+securityLogin.get("possessor")+securityLogin.get("authorityFine")+servletPath;
		}
		*/
		
        Object responseContent = SecurityUtil.rmi(servletPath,request,accessoryParam);
        
        /**
         * 当前用户语言不是中文，且 STATUS = 0 时，做翻译 
        
        if(!"zh".equals(currentLang) && responseContent instanceof Map){
        	@SuppressWarnings("unchecked")
			Map<String,Object> resultMap = (Map<String,Object>)responseContent;
        	if(ReturnUtil.is0(resultMap)){
        		String msg = ReturnUtil.getMsg(resultMap);
        		msg = I18NUtil.translate(currentLang, msg);
        		resultMap.put(ReturnUtil.MSG, msg);
        		responseContent = resultMap;
        	}
        }
         */
        String resultStr =  JSON.toJson(responseContent);
        
        /*
        //将查询结果缓存起来，供下次默认缓存使用
        if(SecurityUtil.isLogin(securityLogin)) { //2019年1月7日16:27:39 修改, 在登录以后才同步这个
        	if(flagUseMaytekCache && flagDefaultFastForQueryYes && StringTool.isNotNull(flagDefaultFastForQueryKey)) {
    			if(StringTool.isNotNull(resultStr)) {
    				MyCache.putCache(flagDefaultFastForQueryKey,resultStr,(long)(1000*60*60*24));//24小时缓存
    			}
    		}
        }
        */
		//if(flagDefaultFastForQueryReal==false) {
			outContent(response,resultStr);
		//}
	}
	
	@Override
	public void destroy() {
		;
	}
	
	private void outContent(HttpServletResponse response, String content){
		PrintWriter pw = null;
        try {
            if(response!=null){
                response.setCharacterEncoding("utf-8");
                response.setContentType("text/json;charset=utf-8");
                pw = response.getWriter();
                if(pw!=null){
                    pw.print(content);
                }
            }
        }catch (Exception e) {
            log.info(e.getMessage());
        }finally{
            if(pw!=null){
                pw.close();
            }
        }
	}
	
}
