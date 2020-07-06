package xyz.util.zsyc;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.codehaus.jackson.map.SerializerProvider;
import org.codehaus.jackson.map.ser.CustomSerializerFactory;

public class MvcJson extends ObjectMapper {
	public MvcJson() {
		/*
		 * 说明：13合璧才能解决String[]的控制转化问题，1单独使用可以解决String的控制转化问题
		 */
		//反序列化日期格式
		//this.getDeserializationConfig().withDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
		this.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
		//空值设置为""
		this.getSerializerProvider().setNullValueSerializer(
			new JsonSerializer<Object>() {
				@Override
				public void serialize(Object value, JsonGenerator jg,
						SerializerProvider sp) throws IOException,
						JsonProcessingException {
					jg.writeString("");
				}
			}
		);
		CustomSerializerFactory factory = new CustomSerializerFactory();
		//日期格式化
		factory.addGenericMapping(Date.class, new JsonSerializer<Date>() {
			@Override
			public void serialize(Date value, JsonGenerator jsonGenerator,
					SerializerProvider provider) throws IOException,
					JsonProcessingException {
				SimpleDateFormat sdf = new SimpleDateFormat(
						"yyyy-MM-dd HH:mm:ss");
				jsonGenerator.writeString(sdf.format(value));
			}
		});
		//空值设置为""
		factory.addGenericMapping(String.class, new JsonSerializer<String>() {
			@Override
			public void serialize(String value, JsonGenerator jsonGenerator,
					SerializerProvider provider) throws IOException,
					JsonProcessingException {
				if(value!=null && value.matches("[\\w]+[\\(]{1}[\\{]{1}[\\S\\s]*[\\}]{1}[\\)]{1}")){
					jsonGenerator.writeRawValue(value);
				}else{
					jsonGenerator.writeString(value == null ? "" : value);
				}
			}
		});
		this.setSerializerFactory(factory);
	}
	
	@Override
	public String writeValueAsString(Object value) throws JsonGenerationException,JsonMappingException,IOException{
		try {
			return super.writeValueAsString(value);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
			throw e;
		} catch (JsonMappingException e) {
			e.printStackTrace();
			throw e;
		} catch (IOException e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	@Override
	public byte[] writeValueAsBytes(Object value) throws JsonGenerationException,JsonMappingException,IOException{
		try {
			return super.writeValueAsBytes(value);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
			throw e;
		} catch (JsonMappingException e) {
			e.printStackTrace();
			throw e;
		} catch (IOException e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	@Override
	public void writeValue(File resultFile,Object value) throws JsonGenerationException,JsonMappingException,IOException{
		try {
			super.writeValue(resultFile,value);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
			throw e;
		} catch (JsonMappingException e) {
			e.printStackTrace();
			throw e;
		} catch (IOException e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	@Override
	public void writeValue(JsonGenerator jgen,Object value) throws JsonGenerationException,JsonMappingException,IOException{
		try {
			super.writeValue(jgen,value);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
			throw e;
		} catch (JsonMappingException e) {
			e.printStackTrace();
			throw e;
		} catch (IOException e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	@Override
	public void writeValue(JsonGenerator jgen,Object value,SerializationConfig config) throws JsonGenerationException,JsonMappingException,IOException{
		try {
			super.writeValue(jgen,value,config);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public void writeValue(OutputStream out,Object value) throws JsonGenerationException,JsonMappingException,IOException{
		try {
			super.writeValue(out,value);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
			throw e;
		} catch (JsonMappingException e) {
			e.printStackTrace();
			throw e;
		} catch (IOException e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	@Override
	public void writeValue(Writer w,Object value) throws JsonGenerationException,JsonMappingException,IOException{
		try {
			super.writeValue(w,value);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
			throw e;
		} catch (JsonMappingException e) {
			e.printStackTrace();
			throw e;
		} catch (IOException e) {
			e.printStackTrace();
			throw e;
		}
	}
}
