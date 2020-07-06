package xyz.util.zsyc;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.map.JsonMappingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



public class JSON {
	private static Logger log = LoggerFactory.getLogger(JSON.class);
	
	private static MvcJson objMapper;
	
	static {
		objMapper = new MvcJson();
		objMapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
	}
	
	/**
	 *  解析JAVA对象为json对象字符串
	 * @param obj				对象
	 * @param attrs				属性数组
	 * @return
	 * @throws JsonGenerationException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public static String toJson(Object obj){
		if(obj instanceof String){
			return obj.toString();
		}
		try {
			return objMapper.writeValueAsString(obj);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch(Exception e){
			e.printStackTrace();
		}
		return "";
	}
	
	// 将Json字符串转换为相应的对象
	@SuppressWarnings("unchecked")
	public static <T> T toObject(String pstrJson, Class<T> cla){
		if(pstrJson==null){
			log.error("JSON.toObject无法转换null为"+cla.getSimpleName());
			return null;
		}
		if(String.class.equals(cla)){
			return (T)pstrJson;
		}
		try {
			return objMapper.readValue(pstrJson, cla);
		} catch (JsonParseException e) {
			log.error("JSON.toObject转换异常"+pstrJson+"无法转换为"+cla.getName());
			e.printStackTrace();
		} catch (JsonMappingException e) {
			log.error("JSON.toObject转换异常"+pstrJson+"无法转换为"+cla.getName());
			e.printStackTrace();
		} catch (IOException e) {
			log.error("JSON.toObject转换异常"+pstrJson+"无法转换为"+cla.getName());
			e.printStackTrace();
		}
		return null;
	}
}
