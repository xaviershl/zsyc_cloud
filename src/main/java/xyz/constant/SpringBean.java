package xyz.constant;

import javax.servlet.ServletContext;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class SpringBean {
	
	private ServletContext servletContext;
	private WebApplicationContext webApplicationContext;
	private static SpringBean me = new SpringBean();
	
	public SpringBean() {}
	
	public static SpringBean getInstance() {
		return me;
	}
	
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}
	
	private WebApplicationContext getWebApplicationContext() {
		if(this.webApplicationContext!=null) {
			return this.webApplicationContext;
		}
		if(this.servletContext==null) {
			return null;
		}
		this.webApplicationContext = WebApplicationContextUtils.getWebApplicationContext(this.servletContext);
		return this.webApplicationContext;
	}

	/**
	 * 获取spring环境上下文的bean实例
	 * @param requiredType
	 * @return
	 */
	public <T> T getBean(Class<T> requiredType){
		WebApplicationContext wac = this.getWebApplicationContext();
		if(wac==null) {
			return null;
		}
		return wac.getBean(requiredType);
	}
	
}
