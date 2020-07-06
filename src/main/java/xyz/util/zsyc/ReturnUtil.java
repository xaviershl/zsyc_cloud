package xyz.util.zsyc;

import java.util.HashMap;
import java.util.Map;

import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.transaction.support.TransactionSynchronizationManager;


public class ReturnUtil {
	public static final String STATUS = "status";
	public static final String MSG = "msg";
	public static final String CONTENT = "content";
	
	
	private ReturnUtil(){}
	public static Map<String, Object> returnMap(int status,Object object){
		Map<String,Object> map = new HashMap<String, Object>();
		if(status==1){
			map.put(ReturnUtil.STATUS, 1);
			if(object!=null){
				map.put(ReturnUtil.CONTENT,object);
			}
			return map;
		}else{
			map.put(ReturnUtil.STATUS, 0);
			if(object!=null){
				map.put(ReturnUtil.MSG,object);
			}
			if(TransactionSynchronizationManager.getCurrentTransactionName()!=null){
				TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
			}
			return map;
		}
	}
	
	public static boolean is1(Map<String, Object> result){
		if(result==null || result.get(ReturnUtil.STATUS)==null){
			return false;
		}
		return Integer.parseInt(result.get(ReturnUtil.STATUS).toString())==1;
	}
	
	public static boolean is0(Map<String, Object> result){
		if(result==null || result.get(ReturnUtil.STATUS)==null){
			return true;
		}
		return Integer.parseInt(result.get(ReturnUtil.STATUS).toString())==0;
	}
	
	public static String getMsg(Map<String, Object> result){
		if(result==null || result.get(ReturnUtil.MSG)==null){
			return "返回结果是空的";
		}
		return result.get(ReturnUtil.MSG).toString();
	}
	
	/**
	 * @示例： List<String> list = ReturnUtil.getContent(result,List.class);
	 * @param result 符合returnMap数据结构的Map数据对象
	 * @param cla
	 * @return 指定数据类型结果
	 */
	@SuppressWarnings("unchecked")
	public static <T> T getContent(Map<String, Object> result, Class<T> cla){
		if(result==null || result.get(ReturnUtil.CONTENT)==null){
			return null;
		}
		return (T)result.get(ReturnUtil.CONTENT);
	}

}
