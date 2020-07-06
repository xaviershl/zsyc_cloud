package xyz.filter;


public class MyExceptionUtil{
	public static Throwable handleException(Exception ex){
		Throwable newEx = ex;
		//找出最根本的异常
		while(true){
			System.out.println("当前异常的名称是："+newEx.getClass().getSimpleName());
			if(newEx.getCause()!=null){
				newEx = newEx.getCause();
			}else{
				break;
			}
		}
		newEx.printStackTrace();
		return newEx;
	}
}
