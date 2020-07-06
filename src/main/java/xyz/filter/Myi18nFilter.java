package xyz.filter;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Myi18nFilter implements Filter {

	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest request1, ServletResponse response1,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) request1;
		HttpServletResponse response = (HttpServletResponse) response1;
		String currentLang = "zh";
		String servletPath = request.getServletPath();

		// 过滤请求只有html和js才需要翻译
		String[] paths = servletPath.split("\\.");
		String suffix = paths[paths.length - 1];
		if (!"html".equals(suffix) && !"js".equals(suffix)) {
			chain.doFilter(request1, response1);
			return;
		}

		Cookie[] ttt = request.getCookies();
		if (ttt != null) {
			for (Cookie cookie : ttt) {
				if (MyAppFilter.COOKIE_I18N_NAME.equals(cookie.getName())) {
					currentLang = cookie.getValue();
				}
			}
		}
		if ("zh".equals(currentLang)) {
			chain.doFilter(request1, response1);
			return;
		}
		
		//先不做 国际化
		chain.doFilter(request1, response1);
		return;
		/*
		// 如果出现通用配置文件
		if (servletPath.startsWith("/xyzCommonFrame/")){
			// 获取当前语言在redis里面的值
			String content = RedisUtil.getHashFieldValue(RedisUtil.KEYPREFIX_FILE, RedisUtil.KEY_CACHE_STATIC, "/" + currentLang + servletPath);
			
			// 如果当前语言对应的内容存在，则直接返redis里面的值
			if(StringTool.isNotNull(content)){
				outContent(response, content, suffix);
				return;
			}
			
			// 原文件内容，从redis中读取
			//String primayContent = RedisUtil.getHashFieldValue(RedisUtil.KEYPREFIX_FILE, RedisUtil.KEY_CACHE_STATIC, servletPath);
			String primayContent = I18nFileUtil.getInstance().getFileContent(servletPath);
			
			
			// 翻译后的内容
			String translateContent = I18NUtil.translateFileContent(primayContent, currentLang);
			
			// 重新存入redis中，存储方式  /语言/访问路径
			RedisUtil.setHashField(RedisUtil.KEYPREFIX_FILE, RedisUtil.KEY_CACHE_STATIC, "/" + currentLang + servletPath, translateContent);
			outContent(response, translateContent, suffix);
			return;
		}
		
		String content = I18NUtil.getContent(servletPath, currentLang);
		outContent(response, content, suffix);
		*/
	}

	@Override
	public void destroy() {
	}

	private void outContent(HttpServletResponse response, String content, String suffix) {
		PrintWriter pw = null;
		try {
			if (response != null) {
				response.setCharacterEncoding("utf-8");
				if("html".equals(suffix)){
					response.setContentType("text/html;charset=utf-8");
				} else if("js".equals(suffix)){
					response.setContentType("application/x-javascript;charset=utf-8");
				}
				
				pw = response.getWriter();
				if (pw != null) {
					pw.print(content);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (pw != null) {
				pw.close();
			}
		}
	}
}
