package xyz.util.zsyc;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aliyun.openservices.shade.org.apache.commons.lang3.StringUtils;


@SuppressWarnings("unchecked")
public class ZSYCENV {
	
	public static final String DEV = "DEV";
	public static final String YSF = "YSF";
	public static final String PRE = "PRE";
	public static final String ZSF = "ZSF";
	
	private static final String project_name_file = "project";
	
	private static String ENV_FILE_PATH = File.separator+"zsyc"+File.separator+"ZSYC_ENV";
	private static String projectName = null;

	private static Logger log = LoggerFactory.getLogger(ZSYCENV.class);

	private static Map<String, String> ZSYC_ENV_MAP = new HashMap<String, String>();
	
	static {
//		String path;
		try {
//			path = MAYTEKENV.class.getResource("/").toURI().getPath();
			String rootClassPath = getRootClassPath();
			File projectNameFile = new File(rootClassPath+File.separator+project_name_file);
			if(projectNameFile==null || !projectNameFile.exists()) {
				log.error("ERR : project File Not Found! on path : "+rootClassPath);
				System.exit(0);
			}
			String tempProjectName = FileUtils.readFileToString(projectNameFile, "UTF-8");
			projectName = tempProjectName != null ? tempProjectName.trim() : tempProjectName;
		} catch (Exception e) {
			e.printStackTrace();
		}
		if(projectName == null) {
			log.error("ERR : project is null, please check project File.");
			System.exit(0);
		}
		
		List<String> ENVs = Arrays.asList(new String[]{ZSYCENV.DEV,ZSYCENV.YSF,ZSYCENV.PRE,ZSYCENV.ZSF});
		
		if(isWindows()){
			ENV_FILE_PATH = "C:"+ENV_FILE_PATH;
		}
		File ENV_FILE = new File(ENV_FILE_PATH);
		if(!ENV_FILE.exists() || !ENV_FILE.isFile()){
			log.error("ERR : miss ZSYCENV file, please check file path : "+ENV_FILE_PATH);
			System.exit(0);
		}
		List<String> lines = null;
		try {
			lines = FileUtils.readLines(ENV_FILE, "UTF-8");
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		if(lines==null || lines.size()<=0){
			log.error("ERR : ZSYC_ENV file is empty, please check file path : "+ENV_FILE_PATH);
			System.exit(0);
		}
		
		for(String line : lines){
			line = line.trim();
			if(line.length()<=0){
				continue ;
			}
			if(line.startsWith("#")){
				continue ;
			}
			if(!line.contains("=")){
				log.error("ERR : Error parsing ZSYC_ENV file, this line is : "+line);
				continue ;
			}
			int index = line.indexOf("=");
			String key = line.substring(0, index);
			String value = index==line.length()?"":line.substring(index+1, line.length());
			ZSYCENV.ZSYC_ENV_MAP.put(key, value);
		}
		
		for(String k : ZSYCENV.ZSYC_ENV_MAP.keySet()){
			log.info(k+"="+ZSYCENV.ZSYC_ENV_MAP.get(k));
		}
		
		if(!ENVs.contains(ZSYCENV.getENV())){
			log.error("ERR : "+ZSYCENV.getENV()+" is Mismatch ZSYC_ENV value, please check file content by path : "+ENV_FILE_PATH);
			System.exit(0);
		}
		
		initProp();
	}
	
	public static String getOsName() {
		String OSNAME = System.getProperty("os.name").toLowerCase();
		return OSNAME;
	}
	
	public static boolean isWindows() {
		return getOsName().contains("windows");
	}
	
	public static String get(String key){
		return ZSYCENV.ZSYC_ENV_MAP.get(key);
	}
	
	public static String getENV(){
		return ZSYCENV.get("ENV");
	}
	
	public static String getENV_FILE_PATH() {
		return ENV_FILE_PATH;
	}
	
	public static String getProjectName() {
		return projectName;
	}
	
	public static boolean isDev(){
		if(DEV.equals(getENV())) {
			return true;
		}
		return false;
	}
	
	public static String getCKEY() {
		return ZSYCENV.CKEY;
	}
	
	private static String rootClassPath = null;
	private static String getRootClassPath() {
		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
		classLoader = classLoader != null ? classLoader : ZSYCENV.class.getClassLoader();
		if (rootClassPath == null) {
			try {
				String path = classLoader.getResource("").toURI().getPath();
				rootClassPath = new File(path).getAbsolutePath();
			}
			catch (Exception e) {
				try {
					String path = ZSYCENV.class.getProtectionDomain().getCodeSource().getLocation().getPath();
					path = java.net.URLDecoder.decode(path, "UTF-8");
					if (path.endsWith(File.separator)) {
						path = path.substring(0, path.length() - 1);
					}
					rootClassPath = path;
				} catch (UnsupportedEncodingException e1) {
					throw new RuntimeException(e1);
				}
			}
		}
		return rootClassPath;
	}
	
	
	private static final String CKEY = "ZSYCYT001ConnPAS";
	private static void initProp() {
		String propPath = "";
		if(ZSYCENV.isDev()) {
			propPath = ZSYCENV.getRootClassPath()+File.separator+"config"+File.separator+ZSYCENV.getProjectName()+".properties";
		}else {
			File envFilePath = new File(ZSYCENV.getENV_FILE_PATH());
			propPath = envFilePath.getParentFile().getAbsolutePath()+File.separator+"properties"+File.separator+ZSYCENV.getProjectName()+".properties";
		}
		
		log.info("INFO : projectName : "+getProjectName()+", try init properties file : "+propPath);
		
		File propFile = new File(propPath);
		if(propFile==null || !propFile.exists()) {
			log.error("ERR : initProp fail, please check properties file : "+propPath);
			System.exit(0);
		}
		
		List<String> propLines = new ArrayList<String>();
		try {
			propLines = (List<String>)FileUtils.readLines(propFile, "UTF-8");
		} catch (IOException e) {
			e.printStackTrace();
		}
		for(String line : propLines) {
			line = line.trim();
			if(line.length()<=0 || line.startsWith("#") || line.startsWith("//") || line.startsWith("=") || !line.contains("=")) {
				continue ;
			}
			int indexEqualSign = line.indexOf("=");
			String key = line.substring(0, indexEqualSign).trim();
			String val = line.substring(indexEqualSign+1, line.length()).trim();
			
			log.info(projectName+"."+key + "=" + val);
			
			if("jdbc.password".equals(key)) {
				val = EncryptionUtil.AESDecrypt(val, CKEY);
			}
			
			val = StringUtils.isBlank(val)?"":val;
			
			//注入到java系统变量中
			System.setProperty(projectName+"."+key, val);
		}
	}
}
