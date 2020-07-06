package xyz.constant;

import java.io.File;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import xyz.util.zsyc.RedisUtil;
import xyz.util.zsyc.SecurityUtil;
import xyz.util.zsyc.ZSYCENV;

public class MaytekListener implements ServletContextListener{

	public static ServletContext servletContext = null;
	
	@Override
	public void contextDestroyed(ServletContextEvent evt) {
	}

	@Override
	public void contextInitialized(ServletContextEvent evt) {
		//留下servletContext后面用它来获取spring上下文
		SpringBean.getInstance().setServletContext(evt.getServletContext());
		
		this.initLogHome();
		RedisUtil.initConfig();
		SecurityUtil.initConfig();
		
	}
	
	private void initLogHome() {
		/*
		String logProjectName = "undefined_project_name";
		try {
			logProjectName = (String)new InitialContext().lookup("java:comp/env/projectName");
		} catch (NamingException e) {
			e.printStackTrace();
		}
		*/
		String logHome = ZSYCENV.get("LOG_HOME");
		String osname = System.getProperty("os.name").toLowerCase();
		if(logHome==null || "".equals(logHome)) {
			if(osname.contains("windows")) {
				logHome = "C:"+File.separator+"mtk"+File.separator+"logs";
//				System.setProperty("LOG_HOME", "C:"+File.separator+"mtk"+File.separator+"log"+File.separator+logProjectName);
			}else {//Linux
				logHome = File.separator+"mtk"+File.separator+"logs";
//				System.setProperty("LOG_HOME", File.separator+"mtk"+File.separator+"log"+File.separator+logProjectName);
			}
		}
		
		/*
		if(logHome.endsWith("/") || logHome.endsWith(File.separator)) {
			logHome = logHome + logProjectName;
		}else {
			logHome = logHome + File.separator +logProjectName;
		}
		*/
		
		File logDir = new File(logHome);
		if(!logDir.exists()) {
			logDir.mkdirs();
		}
		
		System.setProperty(ZSYCENV.getProjectName() + "." + "LOG_HOME",logHome);
		
	}

}
