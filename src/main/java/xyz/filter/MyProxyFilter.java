package xyz.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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

import org.apache.commons.io.IOUtils;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import xyz.util.zsyc.SecurityUtil;
import xyz.util.zsyc.StringTool;
/**
 * 对需要到server端自行处理filter逻辑的请求，进行代理分发
 * @author Administrator
 */
public class MyProxyFilter implements Filter{
	private static Logger log = LoggerFactory.getLogger(MyProxyFilter.class);
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
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
		//拆分请求路径和后缀
		String apiPath = servletPath.split("\\.")[0];
		
		Map<String, String> securityApi = SecurityUtil.getProxyApi(apiPath);
		if(securityApi==null) {//不属于代理分发的就直接跳过
			chain.doFilter(request1, response1);
			return ;
		}
		String serverId = securityApi.get("serverId");
		if(!StringTool.isNotNull(serverId)){
			throw new MyExceptionForRole("未匹配到服务地址！["+apiPath+"]");
		}
		String url = SecurityUtil.getServerUrl(serverId)+servletPath;
		if(url==null || !url.startsWith("http")){
			throw new MyExceptionForRole("无效的请求地址！["+url+"]");
		}
		log.info("代理请求到："+url);
		
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpPost httpPost = new HttpPost(url);
		
		Cookie[] ttt = request.getCookies();
		Set<String> cookieList = new HashSet<String>();
		if(ttt!=null){
			for(Cookie cookie : ttt){
				String value = cookie.getValue();
				String name = cookie.getName();
				cookieList.add(name+"="+value);
			}
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
		
		if(parameterList.size()>0){
			HttpEntity httpEntity = new UrlEncodedFormEntity(parameterList,"utf8");
			httpPost.setEntity(httpEntity);
		}else{
			StringEntity httpEntity =  new StringEntity(IOUtils.toString(request.getInputStream(),"utf-8"), "utf-8");
			httpEntity.setContentType("text/plain;charset=utf-8");
			httpEntity.setContentEncoding("utf-8");
			httpPost.setEntity(httpEntity);
		}
		//控制超时
		RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(240000).setConnectTimeout(10000).build();
		httpPost.setConfig(requestConfig);
//		httpPost.setEntity(httpEntity);
		try {
			HttpResponse httpResponse = httpClient.execute(httpPost);
			for(Header h : httpResponse.getAllHeaders()) {
				String lowerHeader = h.getName().toLowerCase();
				if("content-type".equals(lowerHeader)) {//还原contentType给前端，其他的header都不要管了
					response.setHeader(h.getName(), h.getValue());
		        }
			}
			response.setStatus(httpResponse.getStatusLine().getStatusCode());
			HttpEntity httpEntity = httpResponse.getEntity();
			IOUtils.write(EntityUtils.toByteArray(httpEntity), response.getOutputStream());
		} catch (Exception e) {
			log.info("代理请求输出异常："+e.getMessage());
			e.printStackTrace();
		}
	}

	@Override
	public void destroy() {
	}
}
