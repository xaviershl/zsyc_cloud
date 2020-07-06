package xyz.filter;


public class MyExceptionForRole extends RuntimeException{
	private static final long serialVersionUID = -6621687416265970915L;
	private String  message;
	public MyExceptionForRole(){
		this.message = "您没有相关权限！";
	}
	public MyExceptionForRole(String message){
		this.message = message;
	}
	public  String getMessage() {
		return  message;
	}
	public   void  setMessage(String message) {
		this.message = message;
	}
}
