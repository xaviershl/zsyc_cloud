package xyz.util.zsyc;

import java.util.UUID;
import java.util.regex.Pattern;


public class UUIDUtil {
    private static Pattern pattern32uuid =Pattern.compile("[0-9a-z]{8}[0-9a-z]{4}[0-9a-z]{4}[0-9a-z]{4}[0-9a-z]{12}");
    private static Pattern pattern36uuid =Pattern.compile("[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}");
	public static String getUUIDStringFor32(){
		return UUID.randomUUID().toString().replaceAll("\\-", "");
	}
	
	public static String getUUIDStringFor36(){
		return UUID.randomUUID().toString();
	}
	
	/**
     * 验证字符串是否符合32位UUID算法标准
     * @param uuid32
     * @return
     */
    public static boolean decideUUIDStringFor32(String uuid32){
        return uuid32==null?false:pattern32uuid.matcher(uuid32).matches();
    }
    
    /**
     * 验证字符串是否符合36位UUID算法标准
     * @param uuid36
     * @return
     */
    public static boolean decideUUIDStringFor36(String uuid36){
        return uuid36==null?false:pattern36uuid.matcher(uuid36).matches();
    }
    
    /**
     * 验证字符串是否符合UUID算法标准
     * @param uuid32or36
     * @return
     */
    public static boolean decideUUIDString(String uuid32or36){
        if(uuid32or36==null){
            return false;
        }
        if(uuid32or36.length()==32){
            return pattern32uuid.matcher(uuid32or36).matches();
        }else{
            return pattern36uuid.matcher(uuid32or36).matches();
        }
    }
}
