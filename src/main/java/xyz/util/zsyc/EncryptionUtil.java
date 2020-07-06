package xyz.util.zsyc;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class EncryptionUtil{
	
	private static final Base64.Decoder base64Decoder = Base64.getDecoder();
	private static final Base64.Encoder base64Encoder = Base64.getEncoder();
	
	public static String base64Encode(String content) {
		content = content==null?"":content;
		try {
			byte[] result = base64Encoder.encode(content.getBytes("UTF-8"));
			return new String(result, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return "";
	}
	
	public static String base64Decode(String base64Content) {
		base64Content = base64Content==null?"":base64Content;
		try {
			byte[] result = base64Decoder.decode(base64Content.getBytes("UTF-8"));
			return new String(result, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return "";
	}
	
	/**
	 * @param inputText
	 * @return 32位字符串
	 */
	public static String md5(String inputText){
		return encrypt(inputText, "md5");
	}
	
	/**
	 * @param inputText
	 * @return 40位字符串
	 */
	public static String sha(String inputText){
		return encrypt(inputText, "sha-1");
	}

	private static String encrypt(String inputText, String algorithmName){
		if ((inputText == null) || ("".equals(inputText.trim()))) {
			throw new IllegalArgumentException("请输入要加密的内容");
		}

		if ((algorithmName == null) || ("".equals(algorithmName.trim()))) {
			algorithmName = "md5";
		}

		String encryptText = null;
		try {
			MessageDigest m = MessageDigest.getInstance(algorithmName);
			m.update(inputText.getBytes("UTF8"));
			byte[] s = m.digest();
			return hex(s);
		}catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return encryptText;
	}

	private static String hex(byte[] arr){
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < arr.length; ++i)
			sb.append(Integer.toHexString(arr[i] & 0xFF | 0x100).substring(1, 3));
		return sb.toString();
	}
	
	/**
	 * AES加密算法
	 * @param sSrc 需要加密的文本内容
	 * @param sKey 自己定义一个16位长度的秘钥（解密时也要用到）
	 * 
	 * 处理顺序：AES > BASE64 > URLEncode
	 * 
	 * @return
	 */
    public static String AESEncrypt(String sSrc, String sKey){
        if (sSrc==null || sKey == null) {
            return null;
        }
        //秘钥需要满足16位
        if (sKey.length() != 16) {
            return null;
        }
        try {
	        byte[] raw = sKey.getBytes("UTF-8");
	        SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
	        //算法/模式/补码方式
	        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
	        cipher.init(Cipher.ENCRYPT_MODE, skeySpec);
	        byte[] encrypted = cipher.doFinal(sSrc.getBytes("UTF-8"));
	        //使用BASE64转为字符串
	        String b64str = base64Encoder.encodeToString(encrypted);
	        String ucode = URLEncoder.encode(b64str, "UTF-8");
	        return ucode;
        } catch (Exception e) {
			e.printStackTrace();
		}
        return null;
    }

    /**
     * AES解密算法
     * @param sSrc 已加密的密文字符串
     * @param sKey 自己定义的16位长度秘钥（与加密时使用的同一个）
     * 
     * 处理顺序：URLDecode > BASE64 > AES 
     * 
     * @return
     */
    public static String AESDecrypt(String sSrc, String sKey) {
        // 判断Key是否正确
        if (sSrc==null || sKey == null) {
            return null;
        }
        //秘钥需要满足16位
        
        if (sKey.length() != 16) {
            return null;
        }
        
        try {
	        byte[] raw = sKey.getBytes("UTF-8");
	        SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
	        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
	        cipher.init(Cipher.DECRYPT_MODE, skeySpec);
	        
	        String deucode = URLDecoder.decode(sSrc, "UTF-8");
	        //base64解码
	        byte[] deb64 = base64Decoder.decode(deucode);
            byte[] original = cipher.doFinal(deb64);
            String originalString = new String(original,"UTF-8");
            return originalString;
        } catch (Exception e) {
        	e.printStackTrace();
            return null;
        }
    }

	/**
	 * 商城那边用的一个什么金额的加密算法
	 * 它想到处用 所以先放到这里.
	 * @param bh
	 *            订单编号
	 * @param addtime
	 *            添加时间
	 * @param money
	 *            金额
	 * @param money1
	 *            金额1 非必传
	 * @param money2
	 *            金额2 非必传
	 * @param money3
	 *            金额3 非必传
	 * @return
	 */
	public static String getVerification(
			String bh,
			String possessor,
			Date addtime,
			Double money,
			Double money1,
			Double money2,
			Double money3) {

		if (!StringTool.isNotNull(bh) || addtime == null || money == null) {
			return null;
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		sdf.format(addtime);
		String inputStr = "mall" + bh + possessor + sdf.format(addtime) + money.toString();
		if (money1 != null) {
			inputStr += money1.toString();
		}
		if (money2 != null) {
			inputStr += money2.toString();
		}
		if (money3 != null) {
			inputStr += money3.toString();
		}
		BigInteger sha = null;
		// System.out.println("=======加密前的数据:"+inputStr);
		byte[] inputData = inputStr.getBytes();
		try {
			MessageDigest messageDigest = MessageDigest.getInstance("SHA1");
			messageDigest.update(inputData);
			sha = new BigInteger(messageDigest.digest());
			// System.out.println("SHA加密后:" + sha.toString(32));
		} catch (Exception e) {
			e.printStackTrace();
		}

		return sha.toString(32);
	}

    
    public static void main(String[] args) {
    	
    	System.out.println(AESEncrypt("123456", "ZSYCYT001ConnPAS"));
    	
    }
	
}
