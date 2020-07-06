package xyz.util.zsyc;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import xyz.filter.MyExceptionForLogin;
import xyz.filter.MyExceptionForRole;

/**
 * Redis使用工具
 * @author Ivan
 *
 */
public class RedisUtil {
	private static Logger log = LoggerFactory.getLogger(RedisUtil.class);
	
	public static final String PREFIX_APIKEY = "APIKEY";
	public static final String KEYPREFIX_FILE = "FILE";
	public static final String KEY_CACHE_APPINFO = "CACHE_APPINFO";
	public static final String KEY_CACHE_DOMAININFO_LIST = "CACHE_DOMAININFO_LIST";
	public static final String KEY_CACHE_SERVERINFO = "CACHE_SERVERINFO";
	public static final String KEY_CACHE_API = "CACHE_API";
	public static final String KEY_CACHE_APIKEY = "CACHE_APIKEY";
	public static final String KEY_CACHE_POSITIONAPI = "CACHE_POSITIONAPI";
	public static final String KEY_CACHE_I18N_RESOURCE = "CACHE_I18N_RESOURCE";
	public static final String KEY_CACHE_I18N_TEXT = "CACHE_I18N_TEXT";
	public static final String KEY_CACHE_STATIC = "CACHE_STATIC";
	public static final String KEY_CACHE_IP_WHITE_LIST = "CACHE_IP_WHITE_LIST";
	public static final String KEY_CACHE_MQ_TAG_LIST = "CACHE_MQ_TAG_LIST";
	public static final String KEY_CACHE_CHARGE_COIN_MAP = "CACHE_CHARGE_COIN_MAP";
	public static final String KEY_CACHE_DISABLE_ACCOUNT_MAP = "CACHE_DISABLE_ACCOUNT_MAP";
	public static final String KEY_CACHE_DB_LINK_MAP = "CACHE_DB_LINK_MAP";
	
	public static final String FIELD_CACHE_SECURITY_LOGIN = "securityLogin";//登录用户基础信息
	public static final String FIELD_CACHE_SECURITY_FUNCTION_LIST = "securityFunctionList";//登录用户function权限列表
	public static final String FIELD_CACHE_BUTTON_LIST = "buttonList";//登录用户权限buttonCode列表
	public static final String FIELD_CACHE_API_LIST = "apiList";//登录用户权限可用apiurl列表
	public static final String FIELD_CACHE_DECIDE = "decide";//用户权限组限制
	public static final String FIELD_CACHE_USER_OPER_LIST = "userOperList";//登录用户习惯列表
	
	public static final String ERR_NULL_KEY = "缺少关键字key[R]";
	public static final String ERR_NULL_KEY_PREFIX = "缺少关键字keyPrefix[R]";
	public static final String ERR_TYPE_NOT_MATCH = "不匹配的类型[R]";
	public static final String ERR_RETRY = "服务器开了个小差，麻烦您重试一次！[R]";
	
	public static final String NONE = "none";
	
	private static final int TIMEOUT = 1000 * 60 * 60;
	
	private static boolean redisInitSuccess = false;
	private static JedisPool jedisPool = null;// 资源池
	
	public static String R_CONFIG = "";
	
	//约定：用key到redis中找不到对应的键时抛出这个异常
	public static class NoneKey extends RuntimeException{
		private static final long serialVersionUID = 4017177738233445545L;
		private String message;
		public NoneKey() {
			this.message = "NoneKey";
		}
		public String getMessage() {
			return message;
		}
		public void setMessage(String message) {
			this.message = message;
		}
		
	}
	
/*	static{
		initConfig(null, 0, null);
    }*/

	/**
	 * 初始化Redis连接池
	 * @param redisUrl
	 * @param redisPort
	 * @param redisAuth
	 */
	 public static void initConfig() {
		 if(redisInitSuccess) {
			 log.info("Redis已初始化，请勿重复初始化。");
			 return ;
		 }
	     try {
			String host = "";
			int port = 0;
			String auth = "";
			
			if(R_CONFIG==null || "".equals(R_CONFIG)) {
				try {
					R_CONFIG = System.getProperty(ZSYCENV.getProjectName()+".redisAuth");//((String)new InitialContext().lookup("java:comp/env/redisAuth"));
				} catch (Exception e) {
					log.info("redis加载上下文配置异常："+e.getMessage());
					return ;
				}
			}
			
			final String redisAuth = R_CONFIG;
			if(redisAuth!=null) {
				String[] authInfo = redisAuth.split(",");
				if(authInfo.length>=2) {
					host = authInfo[0];
					String portStr = authInfo[1];
					try {
						port = Integer.parseInt(portStr);
					}catch(Exception e) {
						e.printStackTrace();
					}
				}
				if(authInfo.length==3) {
					auth = EncryptionUtil.AESDecrypt(authInfo[2], ZSYCENV.getCKEY());
				}
			}
			
			if(host==null || "".equals(host)) {
				log.info("redis初始化失败，缺少HOST配置参数。");
				 return ;
			}
			if(port<=0) {
				log.info("redis初始化失败，PORT配置参数异常。");
				 return ;
			}
			
			JedisPoolConfig config = new JedisPoolConfig();
			// 最大空闲连接数, 默认8个
			config.setMaxIdle(200);
			// 最大连接数, 默认8个
			config.setMaxTotal(1000);
			// 获取连接时的最大等待毫秒数(如果设置为阻塞时BlockWhenExhausted),如果超时就抛异常, 小于零:阻塞不确定的时间, 默认-1
			config.setMaxWaitMillis(-1);
			// 逐出连接的最小空闲时间 默认1800000毫秒(30分钟)
			config.setMinEvictableIdleTimeMillis(1800000);
			// 最小空闲连接数, 默认0
			config.setMinIdle(0);
			//在获取连接的时候检查有效性, 默认false
			config.setTestOnBorrow(true);
			//在空闲时检查有效性, 默认false
			config.setTestWhileIdle(true);
			
			if(auth!=null && !"".equals(auth)){
				jedisPool = new JedisPool(config, host, port, TIMEOUT, auth);
			}else{
				jedisPool = new JedisPool(config, host, port, TIMEOUT);
			}
			redisInitSuccess = true;
			log.info("Redis初始化成功。");
		} catch (Exception e) {
			redisInitSuccess = false;
		    log.error("Redis初始化异常："+e.getMessage());
		}
	 }
	 
    /**
    * 获取Jedis实例
    * @return
    */
    public synchronized static Jedis getJedis() {
    	Jedis j = null;
    	try {
    		if (jedisPool != null) {
    			j = jedisPool.getResource();
    			return j;
    		} else {
    			throw new MyExceptionForRole("缓存池丢失，请联系系统管理员！");
    		}
    	} catch (Exception e) {
    		log.error("getJedis："+e.getMessage());
    		if(j!=null){
    			j.close();//不关闭会导致连接池连接数耗尽而亡/jedis不会自动清理连接池
    		}
    		throw new MyExceptionForRole("缓存池异常，请联系系统管理员！");
    	}
    }
    
    /**
     * 添加一个永久缓存
     * @param key
     * @param value
     * @return
     */
    public synchronized static boolean set(String keyPrefix, String key, Object value){
    	return set(keyPrefix, key, value, 0);
    }
    
    /**
     * 添加一个指定过期时间的缓存
     * @param key
     * @param value
     * @param seconds 多少秒后过期
     * @return
     */
    public synchronized static boolean set(String keyPrefix, String key, Object value, int seconds){
    	if(keyPrefix==null || "".equals(keyPrefix)){
    		return false;
    	}
    	if(key==null || "".equals(key)){
    		return false;
    	}
    	if(value==null){
    		return false;
    	}
    	String content = "";
    	if(value instanceof String){
    		content = value.toString();
    	}else if(value instanceof Number){
    		content = value+"";
    	}
    	content = JSON.toJson(value);
    	if(seconds>0){
    		return setString(keyPrefix, key, content, seconds);
    	}else{
    		return setString(keyPrefix, key, content);
    	}
    }
    
    /**
     * 获取一个缓存
     * @param key
     * @param cla
     * @return
     */
    public synchronized static <T> T get(String keyPrefix, String key, Class<T> cla){
    	String content = getString(keyPrefix, key);
    	return content==null?null:JSON.toObject(content, cla);
    }
    
    /**
     * 缓存一个键值对
     * @param key 字符串
     * @param value 字符串
     * @return
     */
    public synchronized static boolean setString(String keyPrefix, String key, String value){
    	key = keyPrefix+"_"+key;
    	Jedis j = getJedis();
    	String result = "";
    	try{
    		result = j.set(key, value);
    	}catch(Exception e){
    		e.printStackTrace();
    		throw new MyExceptionForRole(ERR_RETRY);
    	}finally{
    		if(j!=null){
    			j.close();
    		}
    	}
    	return "OK".equals(result);
    }
    /**
     * 缓存一个指定秒后过期的键值对
     * @param key
     * @param value 字符串
     * @param seconds 过期时间（秒）
     * @return
     */
    public synchronized static boolean setString(String keyPrefix, String key, String value, int seconds){
    	Jedis j = getJedis();
    	try{
    		j.set(keyPrefix+"_"+key, value);
    	}catch(Exception e){
    		e.printStackTrace();
    		throw new MyExceptionForRole(ERR_RETRY);
    	}finally{
    		if(j!=null){
    			j.close();
    		}
    	}
    	return setExpire(keyPrefix, key, seconds);
    }
    
    /**
     * 存储list数据
     * @param key
     * @param list
     * @return
     */
/*    public static boolean setList(String key, List<String> list){
    	return setList(key, list, 0);
    }*/
    
    /**
     * 存储list数据
     * @param key
     * @param list
     * @param seconds 过期时间（秒）
     * @return
     */
/*    public static boolean setList(String key, List<String> list, int seconds){
    	Jedis j = getJedis();
    	String type = j.type(key);
    	if("list".equals(type) && 1!=j.del(key)){//已存在，并且删不掉原来的
    		return false;
    	}
    	if(!"nonelist".contains(type)){//避免key被其他类型的数据占用会导致异常
    		log.error("RedisUtil：key["+key+"]已被占用");
    		return false;
    	}
		Transaction transaction= j.multi();//批处理，避免多次交互浪费时间
		for(int i=0;i<list.size();i++){
			transaction.lpush(key, list.get(i));
		}
		List<Object> resList = transaction.exec();
		if(resList.isEmpty()){
			return false;
		}
		int size = 0;
		try{
			size = Integer.parseInt(resList.get(resList.size()-1).toString());
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
		if(size==list.size()){
			if(seconds>0){
				setExpire(key, seconds);
			}
			return true;
		}
		j.del(key);
    	return false;
    }
    */
    /**
     * 获取list数据
     * @param key
     * @return
     */
/*    public static List<String> getList(String key){
    	Jedis j = getJedis();
    	if(!"list".equals(j.type(key))){
    		return new ArrayList<String>();
    	}
    	List<String> list = j.lrange(key, 0, j.llen(key)-1);
    	Collections.reverse(list);
    	return list;
    }*/
    
    /**
     * 获取一个缓存的字符串
     * @param key
     * @return
     */
    public synchronized static String getString(String keyPrefix, String key){
    	key = keyPrefix+"_"+key;
    	Jedis j = getJedis();
    	try{
	    	String type = j.type(key);
	    	return "nonestring".contains(type)?j.get(key):null;
    	}catch(Exception e){
    		log.error("getString："+e.getMessage());
    		throw new MyExceptionForRole(ERR_RETRY);
    	}finally{
    		if(j!=null){
    			j.close();
    		}
    	}
    }
    
    /**
     * 存储一个Hash数据
     * @param key
     * @param value
     * @return
     */
    public synchronized static boolean setHash(String keyPrefix, String key, Map<String, Object> value){
    	return setHash(keyPrefix, key, value, 0);
    }
    
    /**
     * 存储一个指定过期时间的Hash数据
     * @param key
     * @param value
     * @param seconds 过期时间（秒）
     * @return
     */
    public synchronized static boolean setHash(String keyPrefix, String key, Map<String, Object> value, int seconds){
    	if(keyPrefix==null || "".equals(keyPrefix)){
    		return false;
    	}
    	if(key==null || value==null){
    		return false;
    	}
    	key = keyPrefix+"_"+key;
    	Jedis j = getJedis();
    	try{
	    	String type = j.type(key);
	    	if(!"none".equals(type) && j.del(key)!=1){
	    		return false;
	    	}
    	}catch(Exception e){
    		log.error("setHash1："+e.getMessage());
    		if(j!=null){
    			j.close();
    		}
    		throw new MyExceptionForRole(ERR_RETRY);
    	}
    	Map<String,String> content = new HashMap<String,String>();
    	for (Map.Entry<String, Object> e : value.entrySet()) {
    		if(e.getKey()==null){
    			continue;
    		}
    		String v = "";
    		if(e.getValue()==null){
    			;
    		}else if(e.getValue() instanceof Number || e.getValue() instanceof Boolean || e.getValue() instanceof String){
    			v = ""+e.getValue();
    		}else{
    			v = JSON.toJson(e.getValue());
    		}
    		content.put(e.getKey(), v);
    	}
    	if(content.isEmpty()){
    		return false;
    	}
    	try{
	    	String result = j.hmset(key, content);
	    	if(!"OK".equals(result)){
	    		return false;
	    	}
	    	if(seconds>0){
	    		return j.expire(key, seconds)==1;
	    	}
	    	return true;
    	}catch(Exception e){
    		log.error("setHash2："+e.getMessage());
    		throw new MyExceptionForRole(ERR_RETRY);
    	}finally{
    		if(j!=null){
    			j.close();
    		}
    	}
    }
    
    /**
     * 设置一个hash数据中具体键值对
     * @param key 索引
     * @param field 键
     * @param value 值
     * @return
     */
    public synchronized static boolean setHashField(String keyPrefix, String key, String field, String value){
    	if(keyPrefix==null || "".equals(keyPrefix)){
    		return false;
    	}
    	if(key==null || value==null){
    		return false;
    	}
    	key = keyPrefix+"_"+key;
    	Jedis j = getJedis();
    	try{
	    	if(!"nonehash".contains(j.type(key))){
	    		return false;
	    	}
	    	j.hset(key, field, value);
	    	return true;
    	}catch(Exception e){
    		log.error("setHashField："+e.getMessage());
    		throw new MyExceptionForRole(ERR_RETRY);
    	}finally{
    		if(j!=null){
    			j.close();
    		}
    	}
    }
    
    public synchronized static String getHashFieldValue(String keyPrefix, String key, String field){
    	if(keyPrefix==null || "".equals(keyPrefix)){
    		throw new MyExceptionForRole(ERR_NULL_KEY_PREFIX);
    	}
    	if(key==null || field==null){
    		throw new MyExceptionForRole(ERR_NULL_KEY);
    	}
    	key = keyPrefix+"_"+key;
    	Jedis j = getJedis();
    	try{
    		String jtype = j.type(key);
    		if(RedisUtil.NONE.equals(jtype)) {
    			throw new NoneKey();
    		}
	    	if(!"hash".equals(jtype)){
	    		throw new MyExceptionForRole(ERR_TYPE_NOT_MATCH);
	    	}
	    	return j.hget(key, field);
    	}catch(NoneKey noneKey) {
    		//强制约定APIKEY作为前缀的如果获取到none类型，要把登录失效提示出去
    		if(RedisUtil.PREFIX_APIKEY.equals(keyPrefix)) {
    			throw new MyExceptionForLogin("不存在有效登录信息,请重新登录！");
    		}else {
    			return null;
    		}
    	}catch(Exception e){
    		log.error("getHashFieldValue："+e.getMessage());
    		if(ERR_TYPE_NOT_MATCH.equals(e.getMessage())) {
    			throw new MyExceptionForRole(e.getMessage());
    		}else {
    			throw new MyExceptionForRole(ERR_RETRY);
    		}
    	}finally{
    		if(j!=null){
    			j.close();
    		}
    	}
    }
    
    public synchronized static Map<String, String> getHashFieldValue(String keyPrefix, String key, String... fields){
    	if(keyPrefix==null || "".equals(keyPrefix)){
    		throw new MyExceptionForRole(ERR_NULL_KEY_PREFIX);
    	}
    	if(key==null || fields==null || fields.length<=0){
    		throw new MyExceptionForRole(ERR_NULL_KEY);
    	}
    	key = keyPrefix+"_"+key;
    	Jedis j = getJedis();
    	try{
    		String jtype = j.type(key);
    		if(RedisUtil.NONE.equals(jtype)) {
    			throw new NoneKey();
    		}
	    	if(!"hash".equals(jtype)){
	    		throw new MyExceptionForRole(ERR_TYPE_NOT_MATCH);
	    	}
	    	List<String> mgetList = j.hmget(key, fields);
	    	Map<String, String> result = new HashMap<String, String>();
	    	for(int i=0;i<mgetList.size();i++) {
	    		if(i%2 == 0) {
	    			result.put(mgetList.get(i), mgetList.get(i+1));
	    		}
	    	}
	    	return result;
    	}catch(NoneKey noneKey) {
    		//强制约定APIKEY作为前缀的如果获取到none类型，要把登录失效提示出去
    		if(RedisUtil.PREFIX_APIKEY.equals(keyPrefix)) {
    			throw new MyExceptionForLogin("不存在有效登录信息,请重新登录！");
    		}else {
    			return null;
    		}
    	}catch(Exception e){
    		log.error("getHashFieldValue："+e.getMessage());
    		if(ERR_TYPE_NOT_MATCH.equals(e.getMessage())) {
    			throw new MyExceptionForRole(e.getMessage());
    		}else {
    			throw new MyExceptionForRole(ERR_RETRY);
    		}
    	}finally{
    		if(j!=null){
    			j.close();
    		}
    	}
    }
    
    /**
     * 获取一个hash的所有键值对
     * @param key
     * @return
     */
    public synchronized static Map<String, String> getHash(String keyPrefix, String key){
    	if(keyPrefix==null || "".equals(keyPrefix)){
    		throw new MyExceptionForRole(ERR_NULL_KEY_PREFIX);
    	}
    	if(key==null){
    		throw new MyExceptionForRole(ERR_NULL_KEY);
    	}
    	key = keyPrefix+"_"+key;
    	Jedis j = getJedis();
    	try{
    		String jtype = j.type(key);
    		if(RedisUtil.NONE.equals(jtype)) {
    			throw new NoneKey();
    		}
	    	if(!"hash".equals(jtype)){
	    		throw new MyExceptionForRole(ERR_TYPE_NOT_MATCH);
	    	}
	    	return j.hgetAll(key);    		
    	}catch(NoneKey noneKey) {
    		//强制约定APIKEY作为前缀的如果获取到none类型，要把登录失效提示出去
    		if(RedisUtil.PREFIX_APIKEY.equals(keyPrefix)) {
    			throw new MyExceptionForLogin("不存在有效登录信息,请重新登录！");
    		}else {
    			return null;
    		}
    	}catch(Exception e){
    		log.error("getHash："+e.getMessage());
    		if(ERR_TYPE_NOT_MATCH.equals(e.getMessage())) {
    			throw new MyExceptionForRole(e.getMessage());
    		}else {
    			throw new MyExceptionForRole(ERR_RETRY);
    		}
    	}finally{
    		if(j!=null){
    			j.close();
    		}
    	}
    }
    
    /**
     * 为指定key设置过期时间
     * @param key
     * @param seconds
     * @return
     */
    public synchronized static boolean setExpire(String keyPrefix, String key, int seconds){
    	key = keyPrefix+"_"+key;
    	Jedis j = getJedis();
    	try{
    		return j.expire(key, seconds)==1;
    	}catch(Exception e){
    		log.error("setExpire："+e.getMessage());
    		throw new MyExceptionForRole(ERR_RETRY);
    	}finally{
    		if(j!=null){
    			j.close();
    		}
    	}
    }
    
    public synchronized static boolean removeHashField(String keyPrefix, String key, String field) {
    	key = keyPrefix+"_"+key;
    	Jedis j = getJedis();
    	try{
    		return j.hdel(key, field)==1;
    	}catch(Exception e){
    		log.error("remove："+e.getMessage());
    		throw new MyExceptionForRole(ERR_RETRY);
    	}finally{
    		if(j!=null){
    			j.close();
    		}
    	}
    }
    
    /**
     * 立即删除指定key的数据
     * @param keyPrefix 指定key前缀
     * @param key
     * @return
     */
    public synchronized static boolean delete(String keyPrefix, String key){
    	key = keyPrefix+"_"+key;
    	return delete(key);
    }
    
    /**
     * 立即删除指定key的数据
     * @param key 完整key
     * @return
     */
    public synchronized static boolean delete(String key){
    	Jedis j = getJedis();
    	try{
    		return j.del(key)==1;
    	}catch(Exception e){
    		log.error("delete："+e.getMessage());
    		throw new MyExceptionForRole(ERR_RETRY);
    	}finally{
    		if(j!=null){
    			j.close();
    		}
    	}
    }
    
    /**
     * 获取匹配的key
     * @param keyPrefix 强行前缀
     * @param keyPattern 示例  ABC*
     * @return
     */
    public synchronized static Set<String> getKeyList(String keyPrefix, String keyPattern){
    	keyPattern = keyPrefix+"_"+keyPattern;
    	Jedis j = getJedis();
    	try{
    		return j.keys(keyPattern);
    	}catch(Exception e){
    		log.error("getKeyList："+e.getMessage());
    		throw new MyExceptionForRole(ERR_RETRY);
    	}finally{
    		if(j!=null){
    			j.close();
    		}
    	}
    }
    
    /**
     * 根据指定日期差值获得一个以秒为单位的过期时间
     * @param bigDate
     * @param smallDate
     * @return
     */
    public synchronized static int expireOf(Date bigDate, Date smallDate){
    	if(bigDate==null || smallDate==null){
    		return 0;
    	}
    	long b = bigDate.getTime();
    	long s = smallDate.getTime();
    	long ms = b-s;
    	if(ms<0){
    		return 0;
    	}
    	return new Long(ms/1000).intValue();
    }
    
    /**
     * 到指定的未来时间点过期
     * @param expireDate 未来时间
     * @return
     */
    public synchronized static int expireOf(Date expireDate){
    	return expireOf(expireDate, new Date());
    }
    
	
	
	public static void main(String[] args){
	}
}
