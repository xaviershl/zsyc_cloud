package xyz.util.zsyc;

import java.beans.PropertyEditorSupport;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.support.WebBindingInitializer;
import org.springframework.web.context.request.WebRequest;

import xyz.filter.MyExceptionForRole;

public class MyBindingInitializer implements WebBindingInitializer {
	public void initBinder(WebDataBinder binder,WebRequest request) {   
		binder.registerCustomEditor(Date.class, new PropertyEditorSupport() {   
			@Override
			public void setAsText(String text) throws IllegalArgumentException {   
				try {
					if(text==null){
						setValue(null);
					}else{
						text = text.trim();
						if("".equals(text)){
							setValue(null);
						}else{
							if(text.length()==10){
								final SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");
								Date date = sf.parse(text); 
								setValue(date);
							}else if(text.length()==19){
								final SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
								Date date = sf.parse(text);   
								setValue(date);
							}else{
								setValue(null);
							}
						}
					}
				}catch (ParseException e) {
					e.printStackTrace();
					throw new IllegalArgumentException(e);
				}
			}   
		});
		binder.registerCustomEditor(BigDecimal.class, new PropertyEditorSupport() {   
			@Override  
			public void setAsText(String text) throws IllegalArgumentException {
				try {
					if(text==null){
						setValue(null);
					}else{
						text = text.trim();
						if("".equals(text)){
							setValue(null);
						}else{
							setValue(new BigDecimal(text));
						}
					}
				}catch (Exception e) {
					e.printStackTrace();
					throw new IllegalArgumentException(e);
				}
			}   
		});
		binder.registerCustomEditor(String.class, new PropertyEditorSupport() {    
			@Override
			public void setAsText(String text) throws IllegalArgumentException {
				try{
					if(text==null){
						setValue(null);
					}else{
						text = text.trim();
						if("".equals(text)){
							setValue(null);
						}else if(text.startsWith("https://file.maytek.cn") || text.startsWith("http://file.maytek.cn")) {
							//针对七牛返回的url链接，不做htmlEncode处理，里面可能包含--字符串
							setValue(text);
						}else{
							setValue(StringTool.htmlEncode(text));
						}
					}
				}catch (Exception e) {
					e.printStackTrace();
					throw new IllegalArgumentException(e);
				}
			}   
		});
		binder.registerCustomEditor(int.class, new PropertyEditorSupport() { 
			@Override
			public void setAsText(String text) throws IllegalArgumentException {
				try{
					int t = Integer.parseInt(text);
					setValue(t);
				}catch(Exception e){
					e.printStackTrace();
					throw new MyExceptionForRole("请勿在数字框输入非数字！");
				}
			}
		});
	}
}
