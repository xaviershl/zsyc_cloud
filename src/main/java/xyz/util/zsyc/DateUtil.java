package xyz.util.zsyc;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class DateUtil{
	private DateUtil(){}
	public static String dateToString(Date date){
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		return(sdf.format(date));
	}
	
	public static String dateToLongString(Date date){
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
		
		return(sdf.format(date));
	}
	
	public static String dateToShortString(Date date){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		return(sdf.format(date));
	}
	
	public static String dateToMonthAndDay(Date date){
		SimpleDateFormat sdf = new SimpleDateFormat("MM-dd");
		return(sdf.format(date));
	}
	
	public static String dateToYearAndMonth(Date date){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
		return(sdf.format(date));
	}
	
	public static String dateToYearAndWeek(Date date){
        Calendar calendar1 = Calendar.getInstance();
        calendar1.setMinimalDaysInFirstWeek(7);
        calendar1.setFirstDayOfWeek(2);
        calendar1.setTime(date);
        
        Calendar calendar2 = Calendar.getInstance();
        calendar2.setMinimalDaysInFirstWeek(7);
        calendar2.setFirstDayOfWeek(2);
        calendar2.setTime(DateUtil.addDay(date, 7));
        
        if(calendar1.get(Calendar.WEEK_OF_YEAR)>calendar2.get(Calendar.WEEK_OF_YEAR) &&
        calendar1.get(Calendar.YEAR)==calendar2.get(Calendar.YEAR)){
            return (calendar1.get(Calendar.YEAR)-1)+"-"+(calendar1.get(Calendar.WEEK_OF_YEAR) > 9?calendar1.get(Calendar.WEEK_OF_YEAR):"0" + calendar1.get(Calendar.WEEK_OF_YEAR));
        }else{
            return calendar1.get(Calendar.YEAR)+"-"+(calendar1.get(Calendar.WEEK_OF_YEAR) > 9?calendar1.get(Calendar.WEEK_OF_YEAR):"0" + calendar1.get(Calendar.WEEK_OF_YEAR));
        }
    }
	
	public static String dateToWeekDayCn(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int i = calendar.get(Calendar.DAY_OF_WEEK);
		switch (i){
			case 1 :
				return "日";	
			case 2 :
				return "一";
			case 3 :
				return "二";
			case 4 :
				return "三";
			case 5 :
				return "四";
			case 6 :
				return "五";
			case 7 :
				return "六";
			default :
				return "ERROR";
		}
	}
	
	public static int dateToWeekDay(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int i = calendar.get(Calendar.DAY_OF_WEEK);
		return i;
	}
	
	public static Date stringToDate(String pstrString){
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		Date toDate = null;
		try {
			toDate = sdf.parse(pstrString);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return toDate;
	}
	
	public static Date shortStringToDate(String pstrString){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date toDate = null;
		try {
			toDate = sdf.parse(pstrString);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return toDate;
	}
	
	public static Date miniStringToDate(String pstrString){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
		Date toDate = null;
		try {
			toDate = sdf.parse(pstrString);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return toDate;
	}
	
	public static Date customStringToDate(String pattern,String pstrString){
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		Date toDate = null;
		try {
			toDate = sdf.parse(pstrString);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return toDate;
	}
	
	public static int compareDateForOper(Date dateStart,Date dateEnd){
		dateStart = DateUtil.shortStringToDate(DateUtil.dateToShortString(dateStart));
		dateEnd = DateUtil.shortStringToDate(DateUtil.dateToShortString(dateEnd));
		
		int days = 0;
		Calendar c_start = Calendar.getInstance();
		Calendar c_end = Calendar.getInstance();
		c_start.setTime(dateStart);
		c_end.setTime(dateEnd);

		if(c_start.before(c_end)){
			while(c_start.before(c_end)){
				days++;
				c_start.add(Calendar.DAY_OF_YEAR,1);
			}
		}else{
			return 0;
		}
		return days;
	}
	
	public static int compareDateForQuery(Date dateStart,Date dateEnd){	
		dateStart = DateUtil.shortStringToDate(DateUtil.dateToShortString(dateStart));
		dateEnd = DateUtil.shortStringToDate(DateUtil.dateToShortString(dateEnd));
		
		int days = 0;
		Calendar c_start = Calendar.getInstance();
		Calendar c_end = Calendar.getInstance();
		c_start.setTime(dateStart);
		c_end.setTime(dateEnd);
	
		if(c_start.compareTo(c_end)<=0){
			while(c_start.compareTo(c_end)<=0){
				days++;
				c_start.add(Calendar.DAY_OF_YEAR,1);
			}
		}else{
			return 0;
		}
		return days;
	}
	
	/*public static int compareMonthForOper(Date dateStart,Date dateEnd){
		int n = 0;   	      
	    Calendar c_start = Calendar.getInstance();
	    Calendar c_end = Calendar.getInstance();
	    	    	    
	    c_start.setTime(dateStart);  
        c_end.setTime(dateEnd);
        
        if(c_start.before(c_end)){
			while(c_start.before(c_end)){
				n++;
				c_start.add(Calendar.MONTH,1);
			}
			return n;  
		}else{
			return 0;
		}
	}*/
	
	public static String trimDateToString(Date dateStart,Date dateEnd){
		SimpleDateFormat sdf = new SimpleDateFormat("MM-dd");
		return sdf.format(dateStart)+"/"+sdf.format(dateEnd);
	}
	
	public static String getDateEndForQuery(Date dateEnd){

    	Calendar calendar = Calendar.getInstance();
    	
    	calendar.setTime(dateEnd);
    	int hour = calendar.get(Calendar.HOUR_OF_DAY);
    	int min = calendar.get(Calendar.MINUTE);
    	int second = calendar.get(Calendar.SECOND);
    	
    	if(hour + min + second == 0) {
    		return dateToShortString(dateEnd) + " 23:59:59";
    	}else {
    		return dateToString(dateEnd);
    	}
		
    }
	
	public static Date getDateForLongAgo(){
        return shortStringToDate("2016-01-01");
    }
	
	public static Date addDay(Date date,int day){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_MONTH,day);
        return calendar.getTime();
    }
	
	public static Date addMonth(Date date,int month){
	      Calendar calendar = Calendar.getInstance();  
	      calendar.setTime(date);
	      calendar.add(Calendar.MONTH, month);  
	      return calendar.getTime(); 
    }
    public static List<Date> findDates(Date dBegin, Date dEnd) {  
        List<Date> lDate = new ArrayList<Date>();  
        lDate.add(dBegin);  
        Calendar calBegin = Calendar.getInstance();  
        while (dEnd.after(calBegin.getTime())) {  
            calBegin.add(Calendar.DAY_OF_MONTH, 1);  
            lDate.add(calBegin.getTime());  
        }  
        return lDate;  
    }
}
