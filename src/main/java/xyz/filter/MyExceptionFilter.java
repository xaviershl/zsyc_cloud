package xyz.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import xyz.util.zsyc.JSON;
import xyz.util.zsyc.LogUtil;
import xyz.util.zsyc.ReturnUtil;
import xyz.util.zsyc.SecurityUtil;

public class MyExceptionFilter implements Filter{
	
	private Logger log = LoggerFactory.getLogger(MyExceptionFilter.class);
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		;
	}

	@Override
	public void doFilter(
			ServletRequest request1, 
			ServletResponse response1,
			FilterChain chain) 
					throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest)request1;
		HttpServletResponse response = (HttpServletResponse)response1;
		try{
			chain.doFilter(request1, response1);
		}catch(Exception ex){
			log.info("目标"+request.getServletPath()+"IP"+SecurityUtil.getIp(request)+"参数"+JSON.toJson(request.getParameterMap()));
			log.error("过滤器异常", ex);
			Throwable newEx = MyExceptionUtil.handleException(ex);
			String exString = newEx.getClass().getSimpleName();
			Map<String, Object> map = new HashMap<String, Object>();
			if("MySQLIntegrityConstraintViolationException".equals(exString)){
				map.put(ReturnUtil.MSG, "操作失败：可能原因之一：数据重复。请您核查后再试。如果您无法核查，可将整个页面（注意，一定是整个页面）截图给系统运营商协助核查！");
			}else if("StaleObjectStateException".equals(exString)){
				map.put(ReturnUtil.MSG, "操作失败：可能因为有其他人同时操作，您看到的数据已被修改，请刷新后重试！");
			}else if("MySQLSyntaxErrorException".equals(exString)){
				map.put(ReturnUtil.MSG, "操作失败，可能您输入了特殊字符！如重试无法解决，请截整个屏幕发给系统运营方。");
			}else if("HttpMessageNotWritableException".equals(exString)){
				;
			}else if("CommunicationsException".equals(exString)){
				map.put(ReturnUtil.MSG, "服务器开了个小差，麻烦您重试一次！[M]");
			}else if(exString.contains("MyExceptionFor")){
				map.put(ReturnUtil.MSG, "操作失败："+newEx.getMessage()+"");
			}else if(exString.contains("SizeLimitExceededException")){
				map.put(ReturnUtil.MSG, "系统异常：文件尺寸超过限制！");
			}else{
				map.put(ReturnUtil.MSG, "系统异常：请将整个网页截图给系统管理员，我们一定会尽快为您处理，抱歉，感谢！【"+newEx.getMessage()+"】");
			}
			
			StringBuffer otherInfo = new StringBuffer();
			otherInfo.append("host:"+request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"\r\n");
			otherInfo.append("servletPath:"+request.getServletPath()+"\r\n");
			otherInfo.append("param:"+JSON.toJson(request.getParameterMap())+"\r\n");
			otherInfo.append("cookies:"+JSON.toJson(request.getCookies())+"\r\n");
			LogUtil.saveExceptionLog("MyExceptionFilter", "全局异常捕获", otherInfo.toString(), ex);
			
			boolean isAjax = false;
			String requestType =(String)request.getHeader("X-Requested-With");
			if(requestType != null && requestType.equals("XMLHttpRequest")){
				isAjax = true;
			}
			if(ServletFileUpload.isMultipartContent(request)){
				isAjax = true;
			}
			if (isAjax) {
				map.put(ReturnUtil.STATUS, 0);
				PrintWriter pw = null;
				try {
					if(response!=null){
						response.setCharacterEncoding("utf-8");
						response.setContentType("text/json;charset=utf-8");
						pw = response.getWriter();
						if(pw!=null){
							pw.print(JSON.toJson(map));
						}
					}
				} catch (Exception e) {
					log.info(e.getMessage());
				}finally{
					if(pw!=null){
						pw.close();
					}
				}
			}else{
				map.put(ReturnUtil.STATUS, 0);
				PrintWriter pw = null;
				try {
					if(response!=null){
						response.setCharacterEncoding("utf-8");
						response.setContentType("text/json;charset=utf-8");
						pw = response.getWriter();
						if(pw!=null){
							pw.print(JSON.toJson(map));
						}
					}
				} catch (Exception e) {
					log.info(e.getMessage());
				}finally{
					if(pw!=null){
						pw.close();
					}
				}
			}
		}
	}
	
	@Override
	public void destroy() {
		;
	}
}
