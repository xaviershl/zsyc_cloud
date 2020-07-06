package xyz.util.zsyc;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.Dispatcher;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * okHtpp管理
 * @author Administrator
 *
 */
public class OkHttpKit {
	public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
	public static final MediaType FROM = MediaType.parse("application/x-www-form-urlencoded; charset=utf-8");
	
	public static final String UTF8 = "utf-8";
	
	private static OkHttpClient client = new OkHttpClient();
	private static OkHttpClient sslClient = null;
	
	public static OkHttpClient getClient(){
		return client;
	}
	
	public static Dispatcher getDefualtDispatcher(){
		return getClient().dispatcher();
	}
	
	public static OkHttpClient getClientSSL(){
		if(sslClient==null){
			sslClient = new OkHttpClient();
			sslClient = sslClient.newBuilder()
					.sslSocketFactory(createSSLSocketFactory(), new TrustAllManager())
					.hostnameVerifier(new TrustAllHostnameVerifier())
					.build();
		}
		return sslClient;
	}
	
	/**
	 * 发送POST请求，并提交json字符串数据
	 * @param url
	 * @param headers
	 * @param json
	 * @return
	 */
	public static String postJson(String url, Map<String, String> headers, String json){
		RequestBody body = RequestBody.create(JSON, json);
		okhttp3.Request.Builder builder = new Request.Builder();
        if(headers != null){
        	for (Map.Entry<String, String> e : headers.entrySet()) {
            	builder.addHeader(e.getKey(), e.getValue());
            }
        }
        builder.url(url);
        builder.post(body);
        Response response = null;
        try {
			response = url.startsWith("https://") ? 
					OkHttpKit.getClientSSL().newCall(builder.build()).execute() 
					: OkHttpKit.getClient().newCall(builder.build()).execute();
			if(response.isSuccessful()){
		        return response.body().string();
		    }
		} catch (IOException e1) {
			e1.printStackTrace();
			return "";
		}finally{
			if(response!=null && response.body()!=null)
				response.body().close();
			if(response!=null)
				response.close();
		}
		return "";
	}
	
	public static String postFrom(String url,  Map<String, String> params){
		return postFrom(url, params, null, 0);
	}
	
	public static String postFrom(String url,  Map<String, String> params, int timeout){
		return postFrom(url, params, null, timeout);
	}
	
	public static String postFrom(String url,  Map<String, String> params, Map<String, String> headers, int timeout){

		StringBuffer fromBody = new StringBuffer();
		if(params!=null){
			for (Map.Entry<String, String> e : params.entrySet()) {
				String key = e.getKey();
				String value = e.getValue();
				if(!StringTool.isNotNull(key)){
					continue;
				}
				value = StringTool.isNotNull(value)?value:"";
				try {
					fromBody.append(key.trim()).append("=")
					.append(URLEncoder.encode(value.toString(), UTF8)).append("&");
				} catch (UnsupportedEncodingException e1) {
					e1.printStackTrace();
				}
			}
		}
		
		RequestBody body = RequestBody.create(FROM, fromBody.toString());
		
		//构建request
		okhttp3.Request.Builder request = new Request.Builder();
		if(headers!=null){
			for (Map.Entry<String, String> e : headers.entrySet()) {
				request.header(e.getKey().trim(), e.getValue());
	        }
		}
		
		request.url(url);
		request.post(body);
		
		return postFrom(url, request.build(), timeout);
	}
	
	private static String postFrom(String url, okhttp3.Request request, int timeout){
		Response response = null;
		Map<String, Object> map = new HashMap<String, Object>();
		OkHttpClient okClient = url.startsWith("https://") ? 
				OkHttpKit.getClientSSL()
				: OkHttpKit.getClient();
		if(timeout>0){
			okClient = getClient().newBuilder().readTimeout(timeout, TimeUnit.MILLISECONDS).connectTimeout(1000, TimeUnit.MILLISECONDS).build();
		}
		try {
			response = okClient.newCall(request).execute();
			return response.body().string();
		} catch (IOException e) {
			map.put("status", 0);
			map.put("msg", "[link]请求失败");
			e.printStackTrace();
		}finally{
			if(response!=null && response.body()!=null)
				response.body().close();
			if(response!=null)
				response.close();
		}
		
		return xyz.util.zsyc.JSON.toJson(map);
	}
	
	public static void postFromAsync(String url,  Map<String, String> params,okhttp3.Callback callback){
		postFromAsync(url, params, null, 0, callback);
	}
	
	public static void postFromAsync(String url,  Map<String, String> params, Dispatcher dispatcher, okhttp3.Callback callback){
		postFromAsync(url, params, null, 0, dispatcher, callback);
	}
	
	public static void postFromAsync(String url,  Map<String, String> params, int timeout, okhttp3.Callback callback){
		postFromAsync(url, params, null, timeout, callback);
	}
	
	public static void postFromAsync(String url,  Map<String, String> params, int timeout, Dispatcher dispatcher, okhttp3.Callback callback){
		postFromAsync(url, params, null, timeout, dispatcher, callback);
	}
	
	public static void postFromAsync(String url,  Map<String, String> params, Map<String, String> headers, int timeout, okhttp3.Callback callback){
		postFromAsync(url, params, headers, timeout, getDefualtDispatcher(), callback);
	}
	
	public static void postFromAsync(String url,  Map<String, String> params, Map<String, String> headers, int timeout, Dispatcher dispatcher, okhttp3.Callback callback){
		//构建表单
		StringBuffer fromBody = new StringBuffer();
		if(params!=null){
			for (Map.Entry<String, String> e : params.entrySet()) {
				String key = e.getKey();
				String value = e.getValue();
				if(!StringTool.isNotNull(key)){
					continue;
				}
				value = StringTool.isNotNull(value)?value:"";
				try {
					fromBody.append(key.trim()).append("=")
					.append(URLEncoder.encode(value.toString(), UTF8)).append("&");
				} catch (UnsupportedEncodingException e1) {
					e1.printStackTrace();
				}
			}
		}
		
		RequestBody body = RequestBody.create(FROM, fromBody.toString());
		//构建request
		okhttp3.Request.Builder request = new Request.Builder();
		if(headers!=null){
			for (Map.Entry<String, String> e : headers.entrySet()) {
				request.header(e.getKey(), e.getValue()==null?"":e.getValue());
	        }
		}
		
		request.url(url);
		request.post(body);
		
		OkHttpClient okClient = getClient();
		if(timeout>0){
			okClient = getClient().newBuilder()
					.dispatcher(dispatcher)
					.readTimeout(timeout, TimeUnit.MILLISECONDS)
					.connectTimeout(30*1000, TimeUnit.MILLISECONDS)
					.build();
			/*
			 * 设置最大并发请求数时，采用此方法
			Dispatcher dispatcher = getClient().dispatcher();
			dispatcher.setMaxRequests(100);
			dispatcher.setMaxRequestsPerHost(100);
			okClient = getClient().newBuilder().dispatcher(dispatcher).readTimeout(timeout, TimeUnit.MILLISECONDS).connectTimeout(1000, TimeUnit.MILLISECONDS).build();
			*/
		}else{
			okClient = getClient().newBuilder()
					.dispatcher(dispatcher)
					.connectTimeout(30*1000, TimeUnit.MILLISECONDS)
					.build();
		}
		okClient.newCall(request.build()).enqueue(callback);
	}
	
	/**
	 * 获取一个远程文件
	 * （注意：由于该方法会一次性将远程文件读入内存，所以不适用于500M以上的大文件读取）
	 * @param fileUrl
	 * @return
	 */
	public static byte[] getFile(String fileUrl){
		Request request = new Request.Builder()
        	.url(fileUrl)
        	.build();
	    Response response = null;
		try {
			response = OkHttpKit.getClient().newCall(request).execute();
		} catch (IOException e) {
			e.printStackTrace();
		}
	    if (response.isSuccessful()){
	        InputStream inputStream= response.body().byteStream();
	        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
	        byte[] buffer = new byte[1024];
	        byte[] bmp_buffer = null;
	        int len = 0;
	        try{
	         while( (len=inputStream.read(buffer)) != -1){
	        	 outStream.write(buffer, 0, len);
	         }
	         bmp_buffer=outStream.toByteArray();
	        }catch(Exception e){
	        	e.printStackTrace();
	        }finally{
	        	try {
	        		if(outStream!=null)
	        			outStream.close();
	        		if(inputStream!=null)
	        			inputStream.close();
	        		if(response!=null && response.body()!=null)
	        			response.body().close();
	        		if(response!=null)
	        			response.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
	        }
	    	return bmp_buffer;
	    }
	    return null;
	}
	
	
	public static String postFile(String url, Map<String,Object> params){
		return postFile(url, params, null, 0);
	}
	
	public static String postFile(String url, Map<String,Object> params, long timeout){
		return postFile(url, params, null, timeout);
	}
	
	public static String postFile(String url, Map<String,Object> params, Map<String,String> headers){
		return postFile(url, params, headers, 0);
	}
	
	public static String postFile(String url, Map<String,Object> params, Map<String,String> headers, long timeout){
		MultipartBody.Builder builder = new MultipartBody.Builder();
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            if (entry.getValue() instanceof File) {
                File file = (File) entry.getValue();
                builder.addFormDataPart(entry.getKey(), file.getName(), RequestBody.create(MediaType.parse("application/octet-stream"), file));
            } else {
                builder.addFormDataPart(entry.getKey(), entry.getValue() == null ? "" : entry.getValue().toString());
            }
        }
		RequestBody body = builder.build();
		
		//构建request
		okhttp3.Request.Builder request = new Request.Builder();
		if(headers!=null){
			for (Map.Entry<String, String> e : headers.entrySet()) {
				request.header(e.getKey(), e.getValue()==null?"":e.getValue());
	        }
		}
		
		request.url(url);
		request.post(body);
		
		Response response = null;
		Map<String, Object> map = new HashMap<String, Object>();
		OkHttpClient okClient = url.startsWith("https://") ? 
				OkHttpKit.getClientSSL()
				: OkHttpKit.getClient();
		if(timeout>0){
			okClient = getClient().newBuilder().readTimeout(timeout, TimeUnit.MILLISECONDS).connectTimeout(1000, TimeUnit.MILLISECONDS).build();
		}
		try {
			response = okClient.newCall(request.build()).execute();
			return response.body().string();
		} catch (IOException e) {
			map.put("status", 0);
			map.put("msg", "[link]请求失败");
			e.printStackTrace();
		}finally{
			if(response!=null && response.body()!=null)
				response.body().close();
			if(response!=null)
				response.close();
		}
		
		return xyz.util.zsyc.JSON.toJson(map);
	}
	
	
	/**
	 * 默认信任所有的证书
	 * TODO 最好加上证书认证，主流App都有自己的证书
	 *
	 * @return
	 */
	private static javax.net.ssl.SSLSocketFactory createSSLSocketFactory() {

		javax.net.ssl.SSLSocketFactory sSLSocketFactory = null;

	    try {
	        SSLContext sc = SSLContext.getInstance("TLS");
	        sc.init(null, new TrustManager[]{new TrustAllManager()},
	                new SecureRandom());
	        sSLSocketFactory = sc.getSocketFactory();
	    } catch (Exception e) {
	    }

	    return sSLSocketFactory;
	}

	private static class TrustAllManager implements X509TrustManager {
	    @Override
	    public void checkClientTrusted(X509Certificate[] chain, String authType)
	            throws CertificateException {
	    }
	    @Override
	    public void checkServerTrusted(X509Certificate[] chain, String authType)

	            throws CertificateException {
	    }
	    @Override
	    public X509Certificate[] getAcceptedIssuers() {
	        return new X509Certificate[0];
	    }
	}

	private static class TrustAllHostnameVerifier implements HostnameVerifier {
	    @Override
	    public boolean verify(String hostname, SSLSession session) {
	        return true;
	    }
	}

}
