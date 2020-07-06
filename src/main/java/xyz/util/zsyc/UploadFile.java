package xyz.util.zsyc;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.Date;

import Decoder.BASE64Encoder;

import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.MultipartBody.Builder;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * java文件上传工具
 * @author Administrator
 *
 */
public class UploadFile {

	private static final String qiniuUrl = "https://up.qiniup.com";
	private static final String qiniuBase64Url = "https://up.qiniup.com/putb64/";
	private static final String qiniuTokenUrl = "https://toolapi.maytek.cn/qt2";
	private static final String defaultFoder = "default";
	private static final SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
	private static OkHttpClient client = null;
	private static OkHttpClient getClient(){
		if(client==null)
			client = new OkHttpClient();
		return client;
	}
	
	/**
	 * 
	 * @param file 要上传的文件对象
	 * @param fileName 上传后的文件名（包含后缀名），示例：abc.jpg
	 * @return json字符串，
	 * 成功：{"content":{"fileName":"IMG_20161119_192725.jpg","suffix":".jpg","url":"http://file.maytek.cn/20161212/FkT2EayQrf4ncSwGChF6qZ-7Dsmj.jpg"},"status":1} 
	 * 失败：{"status":0, "msg":"获取token失败"}
	 * @example
	 * String filePath = "C://Users//Administrator//Desktop//IMG_20161119_192725.jpg";
	 * File file = new File(filePath);
	 * String result = UploadFile.toQiniu(file, "customerFileName.jpg", );
	 * System.out.println(result);
	 */
	public static String toQiniu(File file, String fileName){
		return toQiniu(file, fileName, null, false, -1, -1, -1, null, null);
	}
	
	/**
	 * 上传base64文件字符串到七牛
	 * @param base64
	 * @return
	 */
	public static String toQiniuBase64(String base64){
		return toQiniuBase64(base64, null, null, -1, -1, -1, null, null);
	}
	
	/**
	 * 
	 * @param file 要上传的文件对象
	 * @param fileName 上传后的文件名（包含后缀名），示例：abc.jpg
	 * @param folder 上传到指定的文件夹
	 * @return json字符串，
	 * 成功：{"content":{"fileName":"IMG_20161119_192725.jpg","suffix":".jpg","url":"http://file.maytek.cn/20161212/FkT2EayQrf4ncSwGChF6qZ-7Dsmj.jpg"},"status":1} 
	 * 失败：{"status":0, "msg":"获取token失败"}
	 * @example
	 * String filePath = "C://Users//Administrator//Desktop//IMG_20161119_192725.jpg";
	 * File file = new File(filePath);
	 * String result = UploadFile.toQiniu(file, "customerFileName.jpg", null);
	 * System.out.println(result);
	 */
	public static String toQiniu(File file, String fileName, String folder){
		return toQiniu(file, fileName, folder, false, -1, -1, -1, null, null);
	}
	
	/**
	 * 
	 * @param file 要上传的文件对象
	 * @param fileName 上传后的文件名（包含后缀名），示例：abc.jpg
	 * @param useFileNameAsKey 是否使用文件名参数作为文件上传后的文件名
	 * @return json字符串，
	 * 成功：{"content":{"fileName":"IMG_20161119_192725.jpg","suffix":".jpg","url":"http://file.maytek.cn/20161212/FkT2EayQrf4ncSwGChF6qZ-7Dsmj.jpg"},"status":1} 
	 * 失败：{"status":0, "msg":"获取token失败"}
	 * @example
	 * String filePath = "C://Users//Administrator//Desktop//IMG_20161119_192725.jpg";
	 * File file = new File(filePath);
	 * String result = UploadFile.toQiniu(file, "订单数据2016年12月1日到2016年12月31日.jpg", true);
	 * System.out.println(result);
	 */
	public static String toQiniu(File file, String fileName, boolean useFileNameAsKey){
		return toQiniu(file, fileName, null, useFileNameAsKey, -1, -1, -1, null, null);
	}
	
	/**
	 * 上传base64文件字符串到七牛
	 * @param base64 内容
	 * @param fileName 自定义文件名（如：abc.png）
	 * @return
	 */
	public static String toQiniuBase64(String base64, String fileName){
		return toQiniuBase64(base64, fileName, null, -1, -1, -1, null, null);
	}
	
	/**
	 * 
	 * @param file 要上传的文件对象
	 * @param fileName 上传后的文件名（包含后缀名），示例：abc.jpg
	 * @param folder 上传到指定的文件夹
	 * @param useFileNameAsKey 是否使用文件名参数作为文件上传后的文件名
	 * @return json字符串，
	 * 成功：{"content":{"fileName":"IMG_20161119_192725.jpg","suffix":".jpg","url":"http://file.maytek.cn/20161212/FkT2EayQrf4ncSwGChF6qZ-7Dsmj.jpg"},"status":1} 
	 * 失败：{"status":0, "msg":"获取token失败"}
	 * @example
	 * String filePath = "C://Users//Administrator//Desktop//IMG_20161119_192725.jpg";
	 * File file = new File(filePath);
	 * String result = UploadFile.toQiniu(file, "customerFileName.jpg", null, false);
	 * System.out.println(result);
	 */
	public static String toQiniu(File file, String fileName, String folder, boolean useFileNameAsKey){
		return toQiniu(file, fileName, folder, useFileNameAsKey, -1, -1, -1, null, null);
	}
	
	/**
	 * 上传base64文件字符串到七牛
	 * @param base64 内容
	 * @param fileName 自定义文件名（如：abc.png）
	 * @param folder 自定义文件一级目录（如：mybase64）
	 * @return
	 */
	public static String toQiniuBase64(String base64, String fileName, String folder){
		return toQiniuBase64(base64, fileName, folder, -1, -1, -1, null, null);
	}
	
	/**
	 * 
	 * @param file 要上传的文件对象
	 * @param fileName 上传后的文件名（包含后缀名），示例：abc.jpg
	 * @param folder 上传到指定的文件夹
	 * @param useFileNameAsKey 是否使用文件名参数作为文件上传后的文件名
	 * @param deleteAfterDays 文件在多少天后被删除（例如文件在2015年1月1日上午10:00 CST上传，指定deleteAfterDays为3天，那么会在2015年1月5日00:00 CST之后当天内删除文件。）
	 * @return json字符串，
	 * 成功：{"content":{"fileName":"IMG_20161119_192725.jpg","suffix":".jpg","url":"http://file.maytek.cn/20161212/FkT2EayQrf4ncSwGChF6qZ-7Dsmj.jpg"},"status":1} 
	 * 失败：{"status":0, "msg":"获取token失败"}
	 * @example
	 * String filePath = "C://Users//Administrator//Desktop//IMG_20161119_192725.jpg";
	 * File file = new File(filePath);
	 * String result = UploadFile.toQiniu(file, "订单数据2016年12月1日到2016年12月31日.jpg", "excelTpsOrder", true, 2);
	 * System.out.println(result);
	 */
	public static String toQiniu(File file, String fileName, String folder, boolean useFileNameAsKey, int deleteAfterDays){
		return toQiniu(file, fileName, folder, useFileNameAsKey, deleteAfterDays, -1, -1, null, null);
	}
	
	/**
	 * 上传base64文件字符串到七牛
	 * @param base64 内容
	 * @param fileName 自定义文件名（如：abc.png）
	 * @param folder 自定义文件一级目录（如：mybase64）
	 * @param 文件在多少天后被删除（例如文件在2015年1月1日上午10:00 CST上传，指定deleteAfterDays为3天，那么会在2015年1月5日00:00 CST之后当天内删除文件。）
	 * @return
	 */
	public static String toQiniuBase64(String base64, String fileName, String folder, int deleteAfterDays){
		return toQiniuBase64(base64, fileName, folder, deleteAfterDays, -1, -1, null, null);
	}
	
	/**
	 * 
	 * @param file 要上传的文件对象
	 * @param fileName 上传后的文件名（包含后缀名），示例：abc.jpg
	 * @param folder 上传到指定的文件夹
	 * @param useFileNameAsKey 是否使用文件名参数作为文件上传后的文件名
	 * @param deleteAfterDays 文件在多少天后被删除（例如文件在2015年1月1日上午10:00 CST上传，指定deleteAfterDays为3天，那么会在2015年1月5日00:00 CST之后当天内删除文件。）
	 * @param fsizeMin 限定上传文件大小最小值，单位：KB
	 * @param fsizeLimit 限定上传文件大小最大值，单位：KB
	 * @param mimeLimit 限定用户上传的文件类型。
	 * 				指定本字段值，七牛服务器会侦测文件内容以判断MimeType，再用判断值跟指定值进行匹配，匹配成功则允许上传，匹配失败则返回403状态码。
	 * 				示例：
	 * 				● image/*表示只允许上传图片类型 
	 * 				● image/jpeg;image/png表示只允许上传jpg和png类型的图片 
	 * 				● !application/json;text/plain表示禁止上传json文本和纯文本。注意最前面的感叹号！
	 * @param bucket 上传到指定的bucket（不存在的bucket会导致上传失败）
	 * @return json字符串，
	 * 成功：{"content":{"fileName":"IMG_20161119_192725.jpg","suffix":".jpg","url":"http://file.maytek.cn/20161212/FkT2EayQrf4ncSwGChF6qZ-7Dsmj.jpg"},"status":1} 
	 * 失败：{"status":0, "msg":"获取token失败"}
	 * @example
	 * String filePath = "C://Users//Administrator//Desktop//IMG_20161119_192725.jpg";
	 * File file = new File(filePath);
	 * String result = UploadFile.toQiniu(file, "customerFileName.jpg", null, false, -1, -1, -1, null, null);
	 * System.out.println(result);
	 */
	public static String toQiniu(File file, String fileName, String folder, boolean useFileNameAsKey, int deleteAfterDays, int fsizeMin, int fsizeLimit, String mimeLimit, String bucket){
		String msg = "上传出错了";
		if(file==null){
			msg = "file不能为空";
			return fail(msg);
		}
		if(fileName==null || "".equals(fileName)){
			msg = "fileName不能为空";
			return fail(msg);
		}
		folder = (folder==null || "".equals(folder)) ? defaultFoder : folder;
		
		//构建上传表单
		RequestBody fileBody = RequestBody.create(MediaType.parse("application/octet-stream"), file);
		Builder builder = new MultipartBody.Builder();
		builder.setType(MultipartBody.FORM);
		builder.addFormDataPart("file", fileName, fileBody);
		builder.addFormDataPart("x:folder", folder);
		if(useFileNameAsKey){
			builder.addFormDataPart("key", folder+"/"+getFormatDate(new Date())+"/"+fileName);
		}
		
		try {
			//请求token
			String token = getToken(deleteAfterDays, fsizeMin, fsizeLimit, mimeLimit, bucket);
			if(token==null || token.indexOf("error")>-1){
				msg = "获取token失败";
				return fail(msg);
			}
			
			//向上传表单添加token
			builder.addFormDataPart("token", token);
			
			//开始上传
			RequestBody requestBody = builder.build();
			Request request = new Request.Builder()
					.url(qiniuUrl)
					.post(requestBody)
					.build();
			
			Response response = getClient().newCall(request).execute();
			String result = response.body().string();
			if(result!=null && result.indexOf("error")>-1){
				result = result.replaceAll("\"", "\'");
				return fail(result);
			}
			return result;
		} catch (IOException e) {
			e.printStackTrace();
			return fail(msg);
		}
	}
	
	/**
	 * 上传base64文件字符串到七牛
	 * @param base64 内容
	 * @param fileName 上传后的文件名（包含后缀名），示例：abc.jpg
	 * @param folder 上传到指定的文件夹
	 * @param deleteAfterDays 文件在多少天后被删除（例如文件在2015年1月1日上午10:00 CST上传，指定deleteAfterDays为3天，那么会在2015年1月5日00:00 CST之后当天内删除文件。）
	 * @param fsizeMin 限定上传文件大小最小值，单位：KB
	 * @param fsizeLimit 限定上传文件大小最大值，单位：KB
	 * @param mimeLimit 限定用户上传的文件类型。
	 * 				指定本字段值，七牛服务器会侦测文件内容以判断MimeType，再用判断值跟指定值进行匹配，匹配成功则允许上传，匹配失败则返回403状态码。
	 * 				示例：
	 * 				● image/*表示只允许上传图片类型 
	 * 				● image/jpeg;image/png表示只允许上传jpg和png类型的图片 
	 * 				● !application/json;text/plain表示禁止上传json文本和纯文本。注意最前面的感叹号！
	 * @param bucket 上传到指定的bucket（不存在的bucket会导致上传失败）
	 * @return json字符串，
	 * 成功：{"content":{"fileName":"IMG_20161119_192725.jpg","suffix":".jpg","url":"http://file.maytek.cn/20161212/FkT2EayQrf4ncSwGChF6qZ-7Dsmj.jpg"},"status":1} 
	 * 失败：{"status":0, "msg":"获取token失败"}
	 * @example
	 * String filePath = "C://Users//Administrator//Desktop//IMG_20161119_192725.jpg";
	 * File file = new File(filePath);
	 * String result = UploadFile.toQiniu(file, "customerFileName.jpg", null, false, -1, -1, -1, null, null);
	 * System.out.println(result);
	 */
	public static String toQiniuBase64(String base64, String fileName, String folder, int deleteAfterDays, int fsizeMin, int fsizeLimit, String mimeLimit, String bucket){
		String msg = "上传出错了";
		if(base64==null){
			msg = "base64不能为空";
			return fail(msg);
		}
		folder = (folder==null || "".equals(folder)) ? defaultFoder : folder;
		
		try {
			//请求token
			String token = getToken(deleteAfterDays, fsizeMin, fsizeLimit, mimeLimit, bucket);
			if(token==null || token.indexOf("error")>-1){
				msg = "获取token失败";
				return fail(msg);
			}
			int indexOf = base64.indexOf(",");
			if(indexOf>-1){
				base64 = base64.substring(indexOf+1, base64.length());
			}
			//构建文件名
			if(fileName==null || "".equals(fileName)){
				String suffix = "";
				if(base64.startsWith("/9j/")){
					suffix = ".jpg";
				}else if(base64.startsWith("iVBO")){
					suffix = ".png";
				}else if(base64.startsWith("R0lG")){
					suffix = ".gif";
				}
				fileName = folder+"/"+getFormatDate(new Date())+"/"+UUIDUtil.getUUIDStringFor32()+suffix;
			}else{
				fileName = folder+"/"+getFormatDate(new Date())+"/"+fileName;
			}
			String url = qiniuBase64Url+"-1/key/"+urlSafeBase64Encode(fileName);
			//构建上传表单
			RequestBody fileBody = RequestBody.create(null, base64);
			Request request = new Request.Builder()
					.url(url)
					.post(fileBody)
					.addHeader("Content-Type", "application/octet-stream")
					.addHeader("Authorization", "UpToken "+token)
					.build();
			
			Response response = getClient().newCall(request).execute();
			String result = response.body().string();
			if(result!=null && result.indexOf("error")>-1){
				result = result.replaceAll("\"", "\'");
				return fail(result);
			}
			return result;
		} catch (IOException e) {
			e.printStackTrace();
			return fail(msg);
		}
	}
	
	public static String getToken(int deleteAfterDays, int fsizeMin, int fsizeLimit, String mimeLimit, String bucket){
		mimeLimit = (mimeLimit==null || "".equals(mimeLimit)) ? null : mimeLimit;
		//构建获取token的表单
		okhttp3.FormBody.Builder tokenBuilder = new FormBody.Builder();
		if(bucket!=null && !"".equals(bucket)){
			tokenBuilder.add("bucket", bucket);
		}
		if(mimeLimit!=null && !"".equals(mimeLimit)){
			tokenBuilder.add("mimeLimit", mimeLimit);
		}
		if(deleteAfterDays>0){
			tokenBuilder.add("deleteAfterDays", Integer.toString(deleteAfterDays));
		}
		if(fsizeMin>0){
			tokenBuilder.add("fsizeMin", Integer.toString(fsizeMin*1024));//kb转换为b
		}
		if(fsizeLimit>0){
			tokenBuilder.add("fsizeLimit", Integer.toString(fsizeLimit*1024));
		}
		String result = "error";
		try{
			//请求token
			RequestBody formBody = tokenBuilder.build();
			Request request = new Request.Builder()
					.url(qiniuTokenUrl)
					.post(formBody)
					.build();
			
			Response response = getClient().newCall(request).execute();
			result = response.body().string();
		}catch(Exception e){
			e.printStackTrace();
		}
		return result;
	}
	
	
	private static String fail(String msg){
		return "{\"status\":0, \"msg\":\""+msg+"\"}";
	}
	
	private static String getFormatDate(Date date){
		if(date==null){
			date = new Date();
		}
		return format.format(date);
	}
	
	private static String urlSafeBase64Encode(String content){
		String encodeBase64 = new BASE64Encoder().encode(content.getBytes(Charset.forName("UTF-8")));
		String safeBase64Str = encodeBase64.replace('+', '-');
		safeBase64Str = safeBase64Str.replace('/', '_');
//		safeBase64Str = safeBase64Str.replaceAll("=", "");//标准规定需要清理=；但是七牛不能清理=
		return safeBase64Str;
	}
	
	public static void main(String[] args){
	}
}
