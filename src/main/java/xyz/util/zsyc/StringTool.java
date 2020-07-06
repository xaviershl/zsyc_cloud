package xyz.util.zsyc;

import java.math.BigDecimal;
import java.nio.charset.Charset;
import java.text.Collator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 字符串工具
 * @author 姚成成
 */
public final class StringTool {
	/*
	 * 计算字符串的匹配指数
	 */
	public static int matchString(String str1,String str2){
		if(str1==null || str2==null){
			return 0;
		}
		int count=0;
		char[] str1Array = str1.length()<str2.length()?str1.toCharArray():str2.toCharArray();
		char[] str2Array = str1.length()<str2.length()?str2.toCharArray():str1.toCharArray();
		for(int i=0;i<str1Array.length;i++){
			for(int j=0;j<str2Array.length;j++){
				if(str1Array[i]==str2Array[j]){
					count++;
					int mMax = (str1Array.length-i)<(str2Array.length-j)?(str1Array.length-i):(str2Array.length-j);
					for(int m=1;m<mMax;m++){
						if(str1Array[i+m]==str2Array[j+m]){
							count++;
						}else{
							break;
						}
					}
				}
			}
		}
		return count;
	}
	
	public static int matchStringForBig(String str1,String str2){
		if(str1==null || str2==null){
			return 0;
		}
		int count=0;
		char[] str1Array = str1.length()<str2.length()?str1.toCharArray():str2.toCharArray();
		char[] str2Array = str1.length()<str2.length()?str2.toCharArray():str1.toCharArray();
		for(int i=0;i<str1Array.length;i++){
			for(int j=0;j<str2Array.length;j++){
				if(str1Array[i]==str2Array[j]){
					count++;
					int mMax = (str1Array.length-i)<(str2Array.length-j)?(str1Array.length-i):(str2Array.length-j);
					for(int m=1;m<mMax;m++){
						if(str1Array[i+m]==str2Array[j+m]){
							count++;
						}else{
							break;
						}
					}
				}
			}
		}
		int count2 = 0;
		for(int i=0;i<str1Array.length+5;i++) {
			count2+=i;
		}
		return count*1000/(count2<1000?count2:1000);
	}
    
	/*
	 * list转成str用于sql中的in
	 */
	public static String listToSqlString(Collection<String> aa){
		if(aa == null) {
			return null;
		}
		StringBuffer tt = new StringBuffer();
		for(String str : aa){
			if(tt.length()>0){
				tt.append(",'");
			}else{
				tt.append("'");
			}
			tt.append(str);
			tt.append("'");
		}
		return tt.toString().equals("")?null:tt.toString();
	}
	
	/*
	 * 逗号分割的str转成str用于sql中的in
	 */
	public static String StrToSqlString(String aa){
		return ("'"+aa+"'").replaceAll(",", "','");
	}
	//字符串数组排序
	public static String[] StringSort(String[] arr){
		Comparator<Object> cmp = Collator.getInstance();
		Arrays.sort(arr, cmp); 
		return arr;
	}
	
	/**
	 * @param arr 数组
	 * @param fengefu 分隔符
	 */
	public static String arrToString(String[] arr,String fengefu){
		 StringBuffer tempString = new StringBuffer();
		 fengefu = fengefu==null||"".equals(fengefu)?",":fengefu;
		 for(String tt : arr){
			 if(tt==null || "".equals(tt)){
				 continue;
			 }
			 if(tempString.length()>0){
				 tempString.append(fengefu);
			 }
			 tempString.append(tt);
		 }
		 return tempString.toString(); 
	}
	
	/**
	 * @param arr 数组
	 * @param fengefu 分隔符
	 */
	public static String listToString(Collection<String> arr,String fengefu){
		 StringBuffer tempString = new StringBuffer();
		 fengefu = fengefu==null||"".equals(fengefu)?",":fengefu;
		 for(String tt : arr){
			 if(tt==null || "".equals(tt)){
				 continue;
			 }
			 if(tempString.length()>0){
				 tempString.append(fengefu);
			 }
			 tempString.append(tt);
		 }
		 return tempString.toString(); 
	}
	
	public static String objectToString(Object str) {
        return str==null?null:str.toString();
    }
	
	// 获取随机字符串
	public static String getRandomString(int length) { // length 字符串长度 
	    StringBuffer buffer = new StringBuffer("0123456789"); 
	    StringBuffer sb = new StringBuffer(); 
	    Random r = new Random(); 
	    int range = buffer.length(); 
	    for (int i = 0; i < length; i ++) { 
	        sb.append(buffer.charAt(r.nextInt(range))); 
	    } 
	    return sb.toString(); 
	}
	
	/**
	 * 在字符串数组中查找第一个匹配元素的所在下标
	 * @param array
	 * @param target 不允许为 null
	 * @return 不存在-1，下标位从0开始
	 */
	public static int findTargetInArray(String[] array, String target){
		if(target==null){
			return -1;
		}
		for(int i=0;i<array.length;i++){
			if(target.equals(array[i])){
				return i;
			}
		}
		return -1;
	}
	
	/**
	 * 从字符串数组中删除匹配字符并返回新数组
	 * @param array
	 * @param target 不允许为 null
	 * @return
	 */
	public static String[] removeTargetInArray(String[] array, String target){
		List<String> list = new ArrayList<String>();
		Collections.addAll(list, array);
		for(int i=0;i<list.size();i++){
			if(target.equals(list.get(i))){
				list.remove(i);
			}
		}
		return list.toArray(new String[0]);
	}
	
    public static String getStringByMap(Map<String, Object> map, String key){
    	if(map==null){
    		return "";
    	}
    	Object value = map.get(key);
    	return value==null?"":value.toString();
    }
		    
	@SuppressWarnings("unchecked")
	public static Map<String, Object> getMapByMap(Map<String, Object> map, String key){
    	Object value = map.get(key);
    	return value==null?new HashMap<String, Object>():(Map<String, Object>)value;
    }
	
	public static boolean isNotNull(String key){
    	if(key!=null && !"".equals(key)){
    		return true;
    	}else{
    		return false;
    	}
    }
	
	public static String StrToSqlDualTable(String a){
        if(a==null || "".equals(a)){
            return "SELECT 1 AS dualtemp FROM DUAL WHERE 1=0";
        }
        String[] aa = a.split(",");
        StringBuffer tt = new StringBuffer();
        for(String str : aa){
            if(tt.length()>0){
                tt.append(" union ALL SELECT '"+str+"'");
            }else{
                tt.append("SELECT '"+str+"' AS dualtemp");
            }
        }
        return tt.toString().equals("")?null:tt.toString();
    }
	public static String htmlEncode(String str) {
	    if (str ==null){
	    	return str;
	    }
	    if("".equals(str.trim())){
	    	return "";
	    }
	    str = str.replaceAll("<","&lt;");
        str = str.replaceAll( ">","&gt;");
        str = str.replaceAll( "'","&acute;");
        str = str.replaceAll( "--","&#45;&#45;");
        str = str.replaceAll( "\\\\","&bksh;");
	    return str;
	}
	public static String htmlDecode(String str) {
	    if(str==null || "".equals(str)){
	        return str;
        }
        str = str.replaceAll("&lt;", "<");
        str = str.replaceAll("&gt;", ">");
        str = str.replaceAll("&acute;", "'");
        str = str.replaceAll("&#45;&#45;", "--");
        str = str.replaceAll("&bksh;", "\\\\");
        str = str.replaceAll("\\\\n", "\n");
        return str;
    }
	
	/**
	 * 超强力去除字符串中所有空格、回车、换行符、制表符
	 * @param str
	 * @return
	 */
	public static String trimAll(String str){
		if(str == null){
			return "";
		}
		Pattern p = Pattern.compile("\\s*|\t|\r|\n");
		Matcher m = p.matcher(str);
		return m.replaceAll("");
	}
	
	/**
	 * char转换为unicode码字符串
	 * @param c
	 * @return
	 */
	public static String charToUnicode(char c){
		StringBuffer sb = new StringBuffer("\\u");
		
		int j = (c >>> 8); //取出高8位
		String tmp = Integer.toHexString(j);
		sb.append(tmp.length() == 1?"0":"");
		sb.append(tmp);
		j = (c & 0xFF); //取出低8位
		tmp = Integer.toHexString(j);
		sb.append(tmp.length() == 1?"0":"");
		sb.append(tmp);
		return sb.toString();
	}
	
	/**
	 * 将文字字符串转换为unicode码字符串
	 * @param str 文字字符串
	 * @param isAll 是否全部转换（false：只转换mysql utf8格式无法插入的特殊字符如：emoji表情和生僻字[𪛐𪛑𪛒𪛓𪛔𪛕𪛖]）
	 * @return
	 */
	public static String stringToUnicode(String str, boolean isAll) {
		str = (str == null ? "" : str);
		StringBuffer sb = new StringBuffer();
		boolean force = false;
		for (int i = 0; i < str.length(); i++){
			char c = str.charAt(i);
			if(!isAll){//是否要全部转换
				if(!force && (int)c==str.codePointAt(i)){
					sb.append(c);
					continue;
				}
				force = (int)c!=str.codePointAt(i);
			}
			sb.append(charToUnicode(c));
		}
		return (new String(sb));
	}
    
	/**
	 * 将unicode码字符串，转换为文字字符串
	 * @param str
	 * @return
	 */
    public static String unicodeToString(String str){
        Pattern pattern = Pattern.compile("(\\\\u(\\p{XDigit}{2,4}))");
        Matcher matcher = pattern.matcher(str);
        char ch;
        while (matcher.find()) {
            ch = (char) Integer.parseInt(matcher.group(2), 16);
            str = str.replace(matcher.group(1), ch + "");
        }
        return str;
    }
    
    /**
     * 将字节数组以UTF-8编码转换成字符串
     * @param content
     * @return
     */
    public static String byteToStringUTF8(byte[] content) {
    	if(content==null)
    		return null;
    	return new String(content, Charset.forName("UTF-8"));
    }
    
    /**
     * 将字符串以UTF-8编码转换成字节数组
     * @param content
     * @return
     */
    public static byte[] StringToByteUTF8(String content) {
    	if(content==null)
    		return null;
    	return content.getBytes(Charset.forName("UTF-8"));
    }
    
    /**
     * 笛卡尔积 算法
     * eg: descartes(list, result, 0, new ArrayList<String>());
     */
    public static void descartes(List<List<String>> dimvalue, List<List<String>> result, int layer, List<String> curList) {
        if (layer < dimvalue.size() - 1) {
            if (dimvalue.get(layer).size() == 0) {
                descartes(dimvalue, result, layer + 1, curList);
            } else {
                for (int i = 0; i < dimvalue.get(layer).size(); i++) {
                    List<String> list = new ArrayList<String>(curList);
                    list.add(dimvalue.get(layer).get(i));
                    descartes(dimvalue, result, layer + 1, list);
                }
            }
        } else if (layer == dimvalue.size() - 1) {
            if (dimvalue.get(layer).size() == 0) {
                result.add(curList);
            } else {
                for (int i = 0; i < dimvalue.get(layer).size(); i++) {
                    List<String> list = new ArrayList<String>(curList);
                    list.add(dimvalue.get(layer).get(i));
                    result.add(list);
                }
            }
        }
    }
    
    /**
     * 笛卡尔积 算法
     * @param sets
     * @return
     * eg: descartes( new String[]{"a", "b"}, new String[]{"0", "1", "2"}, new String[]{"0", "1", "2"}, new String[]{"0", "1", "2"}, new String[]{"0", "1", "2"}, new String[]{"0", "1", "2"}).toArray()));
     */
    @SuppressWarnings("unchecked")
	public <T> List<List<T>> descartes(T[]... sets) {
        if (sets == null || sets.length == 0) {
            return Collections.emptyList();
        }
        int total = 1;
        //声明进位指针cIndex
        int cIndex = sets.length - 1;
        //声明counterMap(角标 - counter)
        int[] counterMap = new int[sets.length];
        for (int i = 0; i < sets.length; i++) {
            counterMap[i] = 0;
            total *= (sets[i] == null || sets[i].length == 0 ? 1 : sets[i].length);
        }
        List<List<T>> rt = new ArrayList<List<T>>(total);
        //开始求笛卡尔积
        while (cIndex >= 0) {
            List<T> element = new ArrayList<T>(sets.length);
            for (int j = 0; j < sets.length; j++) {
                T[] set = sets[j];
                //忽略空集
                if (set != null && set.length > 0) {
                    element.add(set[counterMap[j]]);
                }
                //从末位触发指针进位
                if (j == sets.length - 1) {
                    if (set == null || ++counterMap[j] > set.length - 1) {
                        //重置指针
                        counterMap[j] = 0;
                        //进位
                        int cidx = j;
                        while (--cidx >= 0) {
                            //判断如果刚好前一位也要进位继续重置指针进位
                            if (sets[cidx] == null || ++counterMap[cidx] > sets[cidx].length - 1) {
                                counterMap[cidx] = 0;
                                continue;
                            }
                            break;
                        }
                        if (cidx < cIndex) {
                            //移动进位指针
                            cIndex = cidx;
                        }
                    }
                }
            }
            if (element.size() > 0) {
                rt.add(element);
            }
        }
        return rt;
    }
    
    public static boolean isInteger(BigDecimal value) {
    	BigDecimal con = new BigDecimal(value.intValue());
    	if(value.compareTo(con) != 0) {
    		return false;
    	}else {
    		return true;
    	}
    }
}
