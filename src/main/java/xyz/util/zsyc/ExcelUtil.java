package xyz.util.zsyc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Row.MissingCellPolicy;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import xyz.filter.MyExceptionForRole;


/**
 * 一个非常强大的EXCEL工具
 * 支持读与写
 * @author Xavier Sun
 */
public class ExcelUtil {

	private static final String MERGE_COUNT_KEY = "_MERGE_";
	private static final String MERGE_KEY_START = "MERGE_ROW_";
	private static final String MERGE_KEY_MIDDLE = "_COL_";
	
	private ExcelUtil() {
		;
	}
	
	public static boolean exportExcel(String fileName, List<F_Title> titleList ,List<List<Object>> dataList ,String path) {
		int size = dataList.size();
		if (size >= 65536) {
			throw new MyExceptionForRole("数据量巨大，请缩减查询范围！");
		}
		
		Workbook wb;
		
		try {
			
			if(isXlsx(path)) {
				wb = new XSSFWorkbook();
//				wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);//Row.CREATE_NULL_AS_BLANK
				wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
			}else {
				wb = new HSSFWorkbook();
//				wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);
				wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			throw new MyExceptionForRole(e.getMessage());
		}
		
		// 设置字体
		Font font = wb.createFont();
		font.setFontHeightInPoints((short) 20); // 字体高度
		font.setColor(Font.COLOR_RED); // 字体颜色
		font.setFontName("黑体"); // 字体
//		font.setBoldweight(Font.BOLDWEIGHT_BOLD);// 粗体显示
		font.setBold(true);
		
		font.setItalic(true); // 是否使用斜体
		Sheet sheet = wb.createSheet();
		
		// 用于表头样式
		CellStyle titleStyle = wb.createCellStyle();
		// 左右居中
//		titleStyle.setAlignment(CellStyle.ALIGN_CENTER);
		
		// 上下对齐
//		titleStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		titleStyle.setAlignment(HorizontalAlignment.CENTER);
		titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		
		
		// 自动换行
		titleStyle.setWrapText(true);
		// 用于数据样式
		CellStyle style = wb.createCellStyle();
		// 左右居中
//		style.setAlignment(CellStyle.ALIGN_LEFT);
		// 上下对齐
//		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setAlignment(HorizontalAlignment.CENTER);
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		
		// 自动换行
		style.setWrapText(true);
		
		//数字类型数据展示格式
		CellStyle numberStyle = wb.createCellStyle();
		numberStyle.cloneStyleFrom(style);
		DataFormat dataFormat = wb.createDataFormat();
		numberStyle.setDataFormat(dataFormat.getFormat(ExcelCellStyle.data_format_double));
		
		boolean mergeNotRowSpan = true; //判断是否需要 合并列不跨行 来源需求:2019年6月11日16:46:25 郭强:如果所有列都是合并列并且合并类型都一样, 则合并完成以后 不跨行, 以一行来展示 数据
		mergeNotRowSpan = titleOper(titleList, 0,0 ,sheet ,titleStyle ,true);
		
		List<Merge> mergeList = getMergeList(titleList, dataList);
		
		int mergeNotRowSpanCount = 0;//该行之前 因为 合并不跨行 所减少的行数
		int mergeRowNotSpanEndIndex = -1; //合并不跨行 的结束位
		int rowIndex = 1; //每创建一行  +1   //因为多一级title, 所以要  + 1
		
		//用 r 代表行
		for (int rowShouldIndex = 1; rowShouldIndex <= dataList.size(); rowShouldIndex++) {
			
			boolean flagIsMergeRowNotSpanOper = false;
			
			if(rowShouldIndex <= mergeRowNotSpanEndIndex) {
				continue;
			}
			
			int maxRowCount = 1;
			
			// 动态创建行
			Row row = sheet.createRow(rowIndex);
			
			List<Object> rowData = dataList.get(rowShouldIndex - 1);
			
			int notShowColCount = 0; //在该行有多少列是不展示的, 仅用作合并的列
			
			boolean flagMergeRowSpan = checkMergeRowSpan(mergeList, rowShouldIndex);//该行是否需要 合并不跨行
			
			for(int colDataIndex = 0 ; colDataIndex < titleList.size(); colDataIndex++) {
				F_Title title = titleList.get(colDataIndex);
				
				if(title.getIsShow() == 0) {
					//不需要显示的列
					notShowColCount++;
				}else {
					int colIndex = colDataIndex - notShowColCount;
					// 用于比较列高大小
					Cell cell = row.createCell(colIndex);
					Object cellValue = rowData.get(colDataIndex)==null?"":rowData.get(colDataIndex);
					
					//格式化 要显示的数据
					if(title.getFormat() != null) {
						cellValue = title.getFormat().format(cellValue);
					}
					
					boolean inputValue = true;
					
					if(title.getIsMerge() == 1) {
						
						//从合并集合中获取到的 合并对象们
						Merge merge = getMergeByKey(mergeList, getMergeKey(rowShouldIndex, colDataIndex));
						
						if(merge != null) { //需要合并
							
							if(!mergeNotRowSpan) {//合并不跨行 标题合并级别满足条件
								//merge.mergeCell(sheet);
								
								int row_start = merge.row_start - mergeNotRowSpanCount;
								int row_end = merge.row_end - mergeNotRowSpanCount;
								int col_start = merge.col_start - notShowColCount;
								int col_end = merge.col_end - notShowColCount;
								
								//合并操作
								sheet.addMergedRegion(new CellRangeAddress(rowIndex, rowIndex + (row_end - row_start), col_start, col_end));
							}else {
								if(flagMergeRowSpan) {//合并不跨行
									
									//每行只操作一次
									if(!flagIsMergeRowNotSpanOper) {
										flagIsMergeRowNotSpanOper = true;
										//有合并但是不需要跨行
//										mergeNotRowSpanCount = merge.row_end - merge.row_start + 1;
										
										mergeRowNotSpanEndIndex = merge.row_end;
										mergeNotRowSpanCount = mergeNotRowSpanCount + (merge.row_end - merge.row_start);
										
									}
								}else {
									//merge.mergeCell(sheet);
									int row_start = merge.row_start - mergeNotRowSpanCount;
									int row_end = merge.row_end - mergeNotRowSpanCount;
									int col_start = merge.col_start - notShowColCount;
									int col_end = merge.col_end - notShowColCount;
									
									//合并操作
									sheet.addMergedRegion(new CellRangeAddress(rowIndex, rowIndex + (row_end - row_start), col_start, col_end));
								}
							}
							
						}else {
							
							//说明该单元格要合并且不止一行数据, 并且数据值 都不是合并开始行和开始列  这种情况 不再输出数据
							inputValue = inputValueForMergeCell(titleList ,dataList ,mergeList ,rowShouldIndex - 1,colDataIndex);
							
						}
					}
					
					cell.setCellStyle(style);
					
					// 是否需要在该单元格填值 (在合并的单元格中 只填一个值了. 否则 自动计算 总数和平均数 会出问题)
					if(inputValue) {
						
						//填值操作
						if(title.isRichText()) {
							if(sheet instanceof HSSFSheet) {
								cell.setCellValue(new HSSFRichTextString(cellValue.toString()));
							}else {
								cell.setCellValue(new XSSFRichTextString(cellValue.toString()));
							}
						}else {
							
							if(cellValue instanceof BigDecimal){
								
								Double doubleValue = Double.parseDouble(cellValue.toString());
								cell.setCellValue(doubleValue);
								cell.setCellStyle(numberStyle);
								
							}else if(cellValue instanceof Double){
								
								Double doubleValue = Double.parseDouble(cellValue.toString());
								cell.setCellValue(doubleValue);
								cell.setCellStyle(numberStyle);
								
							}else if(cellValue instanceof Integer
									|| cellValue instanceof BigInteger  //统计条数出来的数据 会是 BigInteger
									|| cellValue instanceof Long){
								
								Integer intValue = Integer.parseInt(cellValue.toString());
								cell.setCellValue(intValue);
								
							}else if(cellValue instanceof Number) {
								
								Double doubleValue = Double.parseDouble(cellValue.toString());
								cell.setCellValue(doubleValue);
								cell.setCellStyle(numberStyle);
								
							}else {
								
								cell.setCellValue((String)cellValue);
								
							}
							
						}
						
					}
					
					int thisCellRowCount = cellValue.toString().split("\r\n").length;
					maxRowCount = maxRowCount >= thisCellRowCount?maxRowCount:thisCellRowCount;
					
					row.setHeight((short) (maxRowCount * 300));
				}
			}
			
			rowIndex++;//每创建一行  +1
		}
		
		try {
			FileOutputStream fout = new FileOutputStream(path);// "D:\\test.xls"
			wb.write(fout);
			fout.close();
			
			if(wb != null) {
				wb.close();
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	/**
	 * 导出带有附加数据的excel
	 * @param fileName 文件名
	 * @param limitDataRow 排除几行不显示数据
	 * @param limitDataCol 排除几列不显示数据
	 * @param appendCellList 附加数据(主要是用于展示模板中的东西)
	 * @param titleList title们
	 * @param dataList 数据们
	 * @param path 导出路径
	 * @return 生成状态 true/false
	 */
	public static boolean exportExcel(String fileName,int limitDataRow ,int limitDataCol ,List<List<ExcelCell>> appendCellList, List<F_Title> titleList ,List<List<Object>> dataList ,String path) {
		
		int size = dataList.size();
		if (size >= 65536) {
			throw new MyExceptionForRole("数据量巨大，请缩减查询范围！");
		}
		
		//HSSFWorkbook wb = new HSSFWorkbook();
		Workbook wb = null;
		
		try {
			
			if(isXlsx(path)) {
				wb = new XSSFWorkbook();
//				wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);//Row.CREATE_NULL_AS_BLANK
				wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
			}else {
				wb = new HSSFWorkbook();
//				wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);
				wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			throw new MyExceptionForRole(e.getMessage());
		}
		
		Sheet sheet = wb.createSheet();
		
		// 设置字体
		Font font = wb.createFont();
//		font.setFontHeightInPoints((short) 20); // 字体高度
//		font.setColor(HSSFFont.COLOR_RED); // 字体颜色
		font.setFontName("黑体"); // 字体
//		font.setBoldweight(Font.BOLDWEIGHT_BOLD);// 粗体显示
		font.setBold(true);
//		font.setItalic(true); // 是否使用斜体
		
		// 用于表头样式
		CellStyle titleStyle = wb.createCellStyle();
		// 左右居中
//		titleStyle.setAlignment(CellStyle.ALIGN_CENTER);
		// 上下对齐
//		titleStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		titleStyle.setAlignment(HorizontalAlignment.CENTER);
		titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		// 自动换行
		titleStyle.setWrapText(true);
		//加粗
		titleStyle.setFont(font);//加粗
		
		//表格边框颜色
		//short blackColorIndex = 0;
		short blackColorIndex = IndexedColors.BLACK.getIndex();
		
		/*
		if(sheet instanceof HSSFSheet) {
//			blackColorIndex = HSSFColor.BLACK.index;
			blackColorIndex = HSSFColor.HSSFColorPredefined.BLACK.getIndex();
		}else {
			byte[] rgb = { (byte)0, (byte)0, (byte)0 };
			XSSFColor xssfColor = new XSSFColor();
//			xssfColor.setRgb(rgb);
			xssfColor.setRGB(rgb);
			blackColorIndex = xssfColor.getIndexed();
		}
		*/
		
		//表格边框颜色
		titleStyle.setTopBorderColor(blackColorIndex);
		titleStyle.setRightBorderColor(blackColorIndex);
		titleStyle.setBottomBorderColor(blackColorIndex);
		titleStyle.setLeftBorderColor(blackColorIndex);
		//设置表格边框大小
//		titleStyle.setBorderTop(CellStyle.BORDER_THIN);
//		titleStyle.setBorderRight(CellStyle.BORDER_THIN);
//		titleStyle.setBorderBottom(CellStyle.BORDER_THIN);
//		titleStyle.setBorderLeft(CellStyle.BORDER_THIN);
		titleStyle.setBorderBottom(BorderStyle.THIN);
		titleStyle.setBorderLeft(BorderStyle.THIN);
		titleStyle.setBorderTop(BorderStyle.THIN);
		titleStyle.setBorderRight(BorderStyle.THIN);
		
		// 用于数据样式
		CellStyle style = wb.createCellStyle();
		// 左右居中
//		style.setAlignment(CellStyle.ALIGN_LEFT);
		// 上下对齐
//		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setAlignment(HorizontalAlignment.LEFT);
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		// 自动换行
		style.setWrapText(true);
		
		style.setTopBorderColor(blackColorIndex);
		style.setRightBorderColor(blackColorIndex);
		style.setBottomBorderColor(blackColorIndex);
		style.setLeftBorderColor(blackColorIndex);
		//设置表格边框大小
//		style.setBorderTop(CellStyle.BORDER_THIN);
//		style.setBorderRight(CellStyle.BORDER_THIN);
//		style.setBorderBottom(CellStyle.BORDER_THIN);
//		style.setBorderLeft(CellStyle.BORDER_THIN);
		
		style.setBorderBottom(BorderStyle.THIN);
		style.setBorderLeft(BorderStyle.THIN);
		style.setBorderTop(BorderStyle.THIN);
		style.setBorderRight(BorderStyle.THIN);
		
		//数字类型数据展示格式
		CellStyle numberStyle = wb.createCellStyle();
		numberStyle.cloneStyleFrom(style);
		DataFormat dataFormat = wb.createDataFormat();
		numberStyle.setDataFormat(dataFormat.getFormat(ExcelCellStyle.data_format_double));
		
		//附件信息补充 开始
		if(appendCellList != null && !appendCellList.isEmpty()) {
			int appendRowIndex = 0;
			List<Merge> appendMergeList = new ArrayList<Merge>();
			for (List<ExcelCell> appendRowList : appendCellList) {
				Row appendRow = sheet.createRow(appendRowIndex);
				for (ExcelCell appendCell : appendRowList) {
					Cell cell = appendRow.createCell(appendCell.getColumnIndex());
					if(appendCell.getStyle() != null) {
						
						ExcelCellStyle excelCellStyle = appendCell.getStyle();
						
						cell.setCellStyle(excelCellStyle.toCellStyle(wb));
						
						if(excelCellStyle.getWidth() != null) {
							sheet.setColumnWidth(cell.getColumnIndex(), appendCell.getStyle().getWidth());
							
							//处理一下标题的列宽 防止出现 附加元素设置了列宽 然后标题又覆盖了列宽
							//该列在正式数据列 内
							if(cell.getColumnIndex() >= limitDataCol && cell.getColumnIndex() < titleList.size() + limitDataCol) {
								titleList.get(cell.getColumnIndex() - limitDataCol).setWidth(excelCellStyle.getWidth());
							}
							
						}
						if(excelCellStyle.getHeight() != null) {
							appendRow.setHeight(appendCell.getStyle().getHeight());
						}
					}
					
					String cellValue = "";
					if(appendCell.getValue() != null) {
						cellValue = appendCell.getValue().toString();
					}
					
					if(sheet instanceof HSSFSheet) {
						cell.setCellValue(new HSSFRichTextString(cellValue));
					}else {
						cell.setCellValue(new XSSFRichTextString(cellValue));
					}
					
					if(appendCell.getMerge() != null) {
						appendMergeList.add(appendCell.getMerge());
					}
				}
				appendRowIndex++;
			}
			
			for (Merge merge : appendMergeList) {
				
				if(!isMerged(sheet, merge.getRow_start(), merge.getRow_end(), merge.getCol_start(), merge.getCol_end())) {
					merge.mergeCell(sheet);
				}
			}
		}
		//附件信息补充 结束
		
		boolean mergeNotRowSpan = true; //判断是否需要 合并列不跨行 来源需求:2019年6月11日16:46:25 郭强:如果所有列都是合并列并且合并类型都一样, 则合并完成以后 不跨行, 以一行来展示 数据
		
		mergeNotRowSpan = titleOper(titleList, limitDataRow ,limitDataCol ,sheet ,titleStyle ,true);
		
		List<Merge> mergeList = getMergeList(titleList, dataList);
		
		// 用于比较列高大小
		Cell cell = null;
		
		int mergeNotRowSpanCount = 0;//该行之前 因为 合并不跨行 所减少的行数
		int mergeRowNotSpanEndIndex = -1; //合并不跨行 的结束位
		int rowIndex =  1 + limitDataRow; //每创建一行  +1   //因为多一级title, 所以要  + 1
		
		//用 r 代表行
		for (int rowShouldIndex = 1; rowShouldIndex <= dataList.size(); rowShouldIndex++) {
			
			boolean flagIsMergeRowNotSpanOper = false;
			
			if(rowShouldIndex <= mergeRowNotSpanEndIndex) {
				continue;
			}
			
			int maxRowCount = 1;
			
			// 动态创建行
			Row row = sheet.createRow(rowIndex);
			
			List<Object> rowData = dataList.get(rowShouldIndex - 1);
			
			int notShowColCount = 0; //在该行有多少列是不展示的, 仅用作合并的列
			
			boolean flagMergeRowSpan = checkMergeRowSpan(mergeList, rowShouldIndex);//该行是否需要 合并不跨行
			
			for(int colDataIndex = 0 ; colDataIndex < titleList.size(); colDataIndex++) {
				F_Title title = titleList.get(colDataIndex);
				
				if(title.getIsShow() == 0) {
					//不需要显示的行
					notShowColCount++;
				}else {
					int colIndex = colDataIndex - notShowColCount + limitDataCol;
					cell = row.createCell(colIndex);
					Object cellValue = rowData.get(colDataIndex)==null?"":rowData.get(colDataIndex);

					//格式化 要显示的数据
					if(title.getFormat() != null) {
						cellValue = title.getFormat().format(cellValue);
					}

					boolean inputValue = true;
					
					if(title.getIsMerge() == 1) {
						
						Merge merge = getMergeByKey(mergeList, getMergeKey(rowShouldIndex, colDataIndex));
						
						if(merge != null) { //需要合并
							
							if(!mergeNotRowSpan) {//合并不跨行 标题合并级别满足条件
								//merge.mergeCell(sheet);
								
								int row_start = merge.row_start - mergeNotRowSpanCount + limitDataRow;
								int row_end = merge.row_end - mergeNotRowSpanCount + limitDataRow;
								int col_start = merge.col_start - notShowColCount + limitDataCol;
								int col_end = merge.col_end - notShowColCount + limitDataCol;
								
								//合并操作
								sheet.addMergedRegion(new CellRangeAddress(rowIndex, rowIndex + (row_end - row_start), col_start, col_end));
							}else {
								if(flagMergeRowSpan) {//合并不跨行
									
									//每行只操作一次
									if(!flagIsMergeRowNotSpanOper) {
										flagIsMergeRowNotSpanOper = true;
										//有合并但是不需要跨行
//										mergeNotRowSpanCount = merge.row_end - merge.row_start + 1;
										
										mergeRowNotSpanEndIndex = merge.row_end;
										mergeNotRowSpanCount = mergeNotRowSpanCount + (merge.row_end - merge.row_start);
										
									}
								}else {
									//merge.mergeCell(sheet);
									
									int row_start = merge.row_start - mergeNotRowSpanCount + limitDataRow;
									int row_end = merge.row_end - mergeNotRowSpanCount + limitDataRow;
									int col_start = merge.col_start - notShowColCount + limitDataCol;
									int col_end = merge.col_end - notShowColCount + limitDataCol;
									
									//合并操作
									sheet.addMergedRegion(new CellRangeAddress(rowIndex, rowIndex + (row_end - row_start), col_start, col_end));
								}
							}
						}else {
							
							//说明该单元格要合并且不止一行数据, 并且数据值 都不是合并开始行和开始列  这种情况 不再输出数据
							inputValue = inputValueForMergeCell(titleList ,dataList ,mergeList ,rowShouldIndex - 1,colDataIndex);
							
						}
					}
					
					cell.setCellStyle(style);
					
					if(inputValue) {

						if(title.isRichText()) {
							if(sheet instanceof HSSFSheet) {
								cell.setCellValue(new HSSFRichTextString(cellValue.toString()));
							}else {
								cell.setCellValue(new XSSFRichTextString(cellValue.toString()));
							}
						}else {
							
							if(cellValue instanceof BigDecimal){
								
								Double doubleValue = Double.parseDouble(cellValue.toString());
								cell.setCellValue(doubleValue);
								cell.setCellStyle(numberStyle);
								
							}else if(cellValue instanceof Double){
								
								Double doubleValue = Double.parseDouble(cellValue.toString());
								cell.setCellValue(doubleValue);
								cell.setCellStyle(numberStyle);
								
							}else if(cellValue instanceof Integer
									|| cellValue instanceof BigInteger  //统计条数出来的数据 会是 BigInteger
									|| cellValue instanceof Long){
								
								Integer intValue = Integer.parseInt(cellValue.toString());
								cell.setCellValue(intValue);
								
							}else if(cellValue instanceof Number) {
								
								Double doubleValue = Double.parseDouble(cellValue.toString());
								cell.setCellValue(doubleValue);
								cell.setCellStyle(numberStyle);
								
							}else {
								
								cell.setCellValue((String)cellValue);
								
							}
							
						}

					}
					
					int thisCellRowCount = cellValue.toString().split("\r\n").length;
					maxRowCount = maxRowCount >= thisCellRowCount?maxRowCount:thisCellRowCount;
					
					row.setHeight((short) (maxRowCount * 300));
				}
			}
			
			rowIndex++;//每创建一行  +1
		}
		
		try {
			FileOutputStream fout = new FileOutputStream(path);// "D:\\test.xls"
			wb.write(fout);
			fout.close();
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	/**
	 * 根据已有文件导出EXCEL
	 * @param sourceExcel 源文件
	 * @param fileName 文件名
	 * @param limitDataRow 数据排除行
	 * @param limitDataCol 数据排除列
	 * @param titleList 标题
	 * @param dataList 数据
	 * @param path 路径
	 * @return
	 */
	public static boolean exportExcel(String sourceExcel ,String fileName,int limitDataRow ,int limitDataCol ,List<F_Title> titleList ,List<List<Object>> dataList ,String path) {
		
		if(isXlsx(sourceExcel) != isXlsx(path)) {
			throw new MyExceptionForRole("模板和导出文件EXCEL版本不一致!");
		}
		
		int size = dataList.size();
		if (size >= 65536) {
			throw new MyExceptionForRole("数据量巨大，请缩减查询范围！");
		}
		
		Workbook wb = null;
		
		try {

			File sourceFile = new File(path);
			if(isHttpUrl(sourceExcel)) {
				URL url = new URL(sourceExcel); //远程路径
				
				FileUtils.copyURLToFile(url, sourceFile);
			}else {
				FileUtils.copyFile(new File(sourceExcel), sourceFile);
			}
			
			InputStream inputSteam = new FileInputStream(sourceFile);
			
			if(isXlsx(path)) {
				wb = new XSSFWorkbook(inputSteam);
//				wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);//Row.CREATE_NULL_AS_BLANK
				wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
			}else {
				wb = new HSSFWorkbook(inputSteam);
//				wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);
				wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			throw new MyExceptionForRole(e.getMessage());
		}
		
		Sheet sheet = wb.getSheetAt(0);
		
		// 设置字体
		Font font = wb.createFont();
//		font.setFontHeightInPoints((short) 20); // 字体高度
//		font.setColor(HSSFFont.COLOR_RED); // 字体颜色
		font.setFontName("黑体"); // 字体
//		font.setBoldweight(Font.BOLDWEIGHT_BOLD);// 粗体显示
		font.setBold(true);
//		font.setItalic(true); // 是否使用斜体
		
		// 用于表头样式
		CellStyle titleStyle = wb.createCellStyle();
		// 左右居中
//		titleStyle.setAlignment(CellStyle.ALIGN_CENTER);
		// 上下对齐
//		titleStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		titleStyle.setAlignment(HorizontalAlignment.CENTER);
		titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		// 自动换行
		titleStyle.setWrapText(true);
		//加粗
		titleStyle.setFont(font);//加粗
		//表格边框颜色
		//short blackColorIndex = 0;
		short blackColorIndex = IndexedColors.BLACK.getIndex();
		
		/*
		if(sheet instanceof HSSFSheet) {
//			blackColorIndex = HSSFColor.BLACK.index;
			blackColorIndex = HSSFColor.HSSFColorPredefined.BLACK.getIndex();
		}else {
			byte[] rgb = { (byte)0, (byte)0, (byte)0 };
			XSSFColor xssfColor = new XSSFColor();
//			xssfColor.setRgb(rgb);
			xssfColor.setRGB(rgb);
			blackColorIndex = xssfColor.getIndexed();
		}
		*/
		
		titleStyle.setTopBorderColor(blackColorIndex);
		titleStyle.setRightBorderColor(blackColorIndex);
		titleStyle.setBottomBorderColor(blackColorIndex);
		titleStyle.setLeftBorderColor(blackColorIndex);
		//设置表格边框大小
//		titleStyle.setBorderTop(CellStyle.BORDER_THIN);
//		titleStyle.setBorderRight(CellStyle.BORDER_THIN);
//		titleStyle.setBorderBottom(CellStyle.BORDER_THIN);
//		titleStyle.setBorderLeft(CellStyle.BORDER_THIN);
		titleStyle.setBorderBottom(BorderStyle.THIN);
		titleStyle.setBorderLeft(BorderStyle.THIN);
		titleStyle.setBorderTop(BorderStyle.THIN);
		titleStyle.setBorderRight(BorderStyle.THIN);
		
		// 用于数据样式
		CellStyle style = wb.createCellStyle();
		// 左右居中
//		style.setAlignment(CellStyle.ALIGN_LEFT);
		// 上下对齐
//		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setAlignment(HorizontalAlignment.LEFT);
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		// 自动换行
		style.setWrapText(true);
		
		//表格边框颜色
		style.setTopBorderColor(blackColorIndex);
		style.setRightBorderColor(blackColorIndex);
		style.setBottomBorderColor(blackColorIndex);
		style.setLeftBorderColor(blackColorIndex);
		//设置表格边框大小
//		style.setBorderTop(CellStyle.BORDER_THIN);
//		style.setBorderRight(CellStyle.BORDER_THIN);
//		style.setBorderBottom(CellStyle.BORDER_THIN);
//		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setBorderBottom(BorderStyle.THIN);
		style.setBorderLeft(BorderStyle.THIN);
		style.setBorderTop(BorderStyle.THIN);
		style.setBorderRight(BorderStyle.THIN);
		
		//数字类型数据展示格式
		CellStyle numberStyle = wb.createCellStyle();
		numberStyle.cloneStyleFrom(style);
		DataFormat dataFormat = wb.createDataFormat();
		numberStyle.setDataFormat(dataFormat.getFormat(ExcelCellStyle.data_format_double));
		
		boolean mergeNotRowSpan = true; //判断是否需要 合并列不跨行 来源需求:2019年6月11日16:46:25 郭强:如果所有列都是合并列并且合并类型都一样, 则合并完成以后 不跨行, 以一行来展示 数据
		
		mergeNotRowSpan = titleOper(titleList, limitDataRow ,limitDataCol ,sheet ,titleStyle ,true);
		
		List<Merge> mergeList = getMergeList(titleList, dataList);
		
		// 用于比较列高大小
		Cell cell = null;
		
		int mergeNotRowSpanCount = 0;//该行之前 因为 合并不跨行 所减少的行数
		int mergeRowNotSpanEndIndex = -1; //合并不跨行 的结束位
		int rowIndex =  1 + limitDataRow; //每创建一行  +1   //因为多一级title, 所以要  + 1
		
		//用 r 代表行
		for (int rowShouldIndex = 1; rowShouldIndex <= dataList.size(); rowShouldIndex++) {
			
			boolean flagIsMergeRowNotSpanOper = false;
			
			if(rowShouldIndex <= mergeRowNotSpanEndIndex) {
				continue;
			}
			
			int maxRowCount = 1;
			
			// 动态创建行
			Row row = sheet.createRow(rowIndex);
			
			List<Object> rowData = dataList.get(rowShouldIndex - 1);
			
			int notShowColCount = 0; //在该行有多少列是不展示的, 仅用作合并的列
			
			boolean flagMergeRowSpan = checkMergeRowSpan(mergeList, rowShouldIndex);//该行是否需要 合并不跨行
			
			for(int colDataIndex = 0 ; colDataIndex < titleList.size(); colDataIndex++) {
				F_Title title = titleList.get(colDataIndex);
				
				if(title.getIsShow() == 0) {
					//不需要显示的行
					notShowColCount++;
				}else {
					int colIndex = colDataIndex - notShowColCount + limitDataCol;
					cell = row.createCell(colIndex);
					Object cellValue = rowData.get(colDataIndex)==null?"":rowData.get(colDataIndex);

					//格式化 要显示的数据
					if(title.getFormat() != null) {
						cellValue = title.getFormat().format(cellValue);
					}
					
					boolean inputValue = true;
					
					if(title.getIsMerge() == 1) {
						
						Merge merge = getMergeByKey(mergeList, getMergeKey(rowShouldIndex, colDataIndex));
						
						if(merge != null) { //需要合并
							
							if(!mergeNotRowSpan) {//合并不跨行 标题合并级别满足条件
								//merge.mergeCell(sheet);
								
								int row_start = merge.row_start - mergeNotRowSpanCount + limitDataRow;
								int row_end = merge.row_end - mergeNotRowSpanCount + limitDataRow;
								int col_start = merge.col_start - notShowColCount + limitDataCol;
								int col_end = merge.col_end - notShowColCount + limitDataCol;
								
								//合并操作
								sheet.addMergedRegion(new CellRangeAddress(rowIndex, rowIndex + (row_end - row_start), col_start, col_end));
							}else {
								if(flagMergeRowSpan) {//合并不跨行
									
									//每行只操作一次
									if(!flagIsMergeRowNotSpanOper) {
										flagIsMergeRowNotSpanOper = true;
										//有合并但是不需要跨行
//										mergeNotRowSpanCount = merge.row_end - merge.row_start + 1;
										
										mergeRowNotSpanEndIndex = merge.row_end;
										mergeNotRowSpanCount = mergeNotRowSpanCount + (merge.row_end - merge.row_start);
										
									}
								}else {
									//merge.mergeCell(sheet);
									
									int row_start = merge.row_start - mergeNotRowSpanCount + limitDataRow;
									int row_end = merge.row_end - mergeNotRowSpanCount + limitDataRow;
									int col_start = merge.col_start - notShowColCount + limitDataCol;
									int col_end = merge.col_end - notShowColCount + limitDataCol;
									
									//合并操作
									sheet.addMergedRegion(new CellRangeAddress(rowIndex, rowIndex + (row_end - row_start), col_start, col_end));
								}
							}
						}else {
							
							//说明该单元格要合并且不止一行数据, 并且数据值 都不是合并开始行和开始列  这种情况 不再输出数据
							inputValue = inputValueForMergeCell(titleList ,dataList ,mergeList ,rowShouldIndex - 1,colDataIndex);
							
						}
					}
					
					cell.setCellStyle(style);

					if(inputValue) {

						if(title.isRichText()) {
							if(sheet instanceof HSSFSheet) {
								cell.setCellValue(new HSSFRichTextString(cellValue.toString()));
							}else {
								cell.setCellValue(new XSSFRichTextString(cellValue.toString()));
							}
						}else {
							
							if(cellValue instanceof BigDecimal){
								
								Double doubleValue = Double.parseDouble(cellValue.toString());
								cell.setCellValue(doubleValue);
								cell.setCellStyle(numberStyle);
								
							}else if(cellValue instanceof Double){
								
								Double doubleValue = Double.parseDouble(cellValue.toString());
								cell.setCellValue(doubleValue);
								cell.setCellStyle(numberStyle);
								
							}else if(cellValue instanceof Integer
									|| cellValue instanceof BigInteger  //统计条数出来的数据 会是 BigInteger
									|| cellValue instanceof Long){
								
								Integer intValue = Integer.parseInt(cellValue.toString());
								cell.setCellValue(intValue);
								
							}else if(cellValue instanceof Number) {
								
								Double doubleValue = Double.parseDouble(cellValue.toString());
								cell.setCellValue(doubleValue);
								cell.setCellStyle(numberStyle);
								
							}else {
								
								cell.setCellValue((String)cellValue);
								
							}
							
						}

					}
					
					int thisCellRowCount = cellValue.toString().split("\r\n").length;
					maxRowCount = maxRowCount >= thisCellRowCount?maxRowCount:thisCellRowCount;
					
					row.setHeight((short) (maxRowCount * 300));
				}
			}
			
			rowIndex++;//每创建一行  +1
		}
		
		try {
			FileOutputStream fout = new FileOutputStream(path);// "D:\\test.xls"
			wb.write(fout);
			fout.close();
			
			if(wb != null) {
				wb.close();
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	/**
	 * 根据已有文件导出EXCEL
	 * @param sourceExcel 源文件
	 * @param fileName 文件名
	 * @param limitDataRow 数据排除行
	 * @param limitDataCol 数据排除列
	 * @param titleList 标题
	 * @param dataList 数据
	 * @param path 路径
	 * @return
	 */
	public static boolean exportExcelNotShowTitle(String sourceExcel ,String fileName,int limitDataRow ,int limitDataCol ,List<F_Title> titleList ,List<List<Object>> dataList ,String path) {

		if(isXlsx(sourceExcel) != isXlsx(path)) {
			throw new MyExceptionForRole("模板和导出文件EXCEL版本不一致!");
		}
		
		int size = dataList.size();
		if (size >= 65536) {
			throw new MyExceptionForRole("数据量巨大，请缩减查询范围！");
		}
		
		Workbook wb = null;
		
		try {

			File sourceFile = new File(path);
			if(isHttpUrl(sourceExcel)) {
				URL url = new URL(sourceExcel); //远程路径
				url.openConnection();
				FileUtils.copyURLToFile(url, sourceFile);
			}else {
				FileUtils.copyFile(new File(sourceExcel), sourceFile);
			}
			
			InputStream inputSteam = new FileInputStream(sourceFile);

			if(isXlsx(path)) {
				wb = new XSSFWorkbook(inputSteam);
//				wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);//Row.CREATE_NULL_AS_BLANK
				wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
			}else {
				wb = new HSSFWorkbook(inputSteam);
//				wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);
				wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		Sheet sheet = wb.getSheetAt(0);
		wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);//将 null 返回成 blank
		
		// 设置字体
		Font font = wb.createFont();
//		font.setFontHeightInPoints((short) 20); // 字体高度
//		font.setColor(HSSFFont.COLOR_RED); // 字体颜色
		font.setFontName("黑体"); // 字体
//		font.setBoldweight(Font.BOLDWEIGHT_BOLD);// 粗体显示
		font.setBold(true);
//		font.setItalic(true); // 是否使用斜体
		
		// 用于表头样式
		CellStyle titleStyle = wb.createCellStyle();
		// 左右居中
//		titleStyle.setAlignment(CellStyle.ALIGN_CENTER);
		// 上下对齐
//		titleStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		titleStyle.setAlignment(HorizontalAlignment.CENTER);
		titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		// 自动换行
		titleStyle.setWrapText(true);
		//加粗
		titleStyle.setFont(font);//加粗
		//表格边框颜色
		//short blackColorIndex = 0;
		short blackColorIndex = IndexedColors.BLACK.getIndex();
		/*
		if(sheet instanceof HSSFSheet) {
//			blackColorIndex = HSSFColor.BLACK.index;
			blackColorIndex = HSSFColor.HSSFColorPredefined.BLACK.getIndex();
		}else {
			byte[] rgb = { (byte)0, (byte)0, (byte)0 };
			XSSFColor xssfColor = new XSSFColor();
//			xssfColor.setRgb(rgb);
			xssfColor.setRGB(rgb);
			blackColorIndex = xssfColor.getIndexed();
		}
		*/
		
		titleStyle.setTopBorderColor(blackColorIndex);
		titleStyle.setRightBorderColor(blackColorIndex);
		titleStyle.setBottomBorderColor(blackColorIndex);
		titleStyle.setLeftBorderColor(blackColorIndex);
		//设置表格边框大小
//		titleStyle.setBorderTop(CellStyle.BORDER_THIN);
//		titleStyle.setBorderRight(CellStyle.BORDER_THIN);
//		titleStyle.setBorderBottom(CellStyle.BORDER_THIN);
//		titleStyle.setBorderLeft(CellStyle.BORDER_THIN);
		titleStyle.setBorderBottom(BorderStyle.THIN);
		titleStyle.setBorderLeft(BorderStyle.THIN);
		titleStyle.setBorderTop(BorderStyle.THIN);
		titleStyle.setBorderRight(BorderStyle.THIN);
		
		// 用于数据样式
		CellStyle style = wb.createCellStyle();
		// 左右居中
//		style.setAlignment(CellStyle.ALIGN_LEFT);
		// 上下对齐
//		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setAlignment(HorizontalAlignment.CENTER);
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		// 自动换行
		style.setWrapText(true);
		
		//表格边框颜色
		style.setTopBorderColor(blackColorIndex);
		style.setRightBorderColor(blackColorIndex);
		style.setBottomBorderColor(blackColorIndex);
		style.setLeftBorderColor(blackColorIndex);
		//设置表格边框大小
//		style.setBorderTop(CellStyle.BORDER_THIN);
//		style.setBorderRight(CellStyle.BORDER_THIN);
//		style.setBorderBottom(CellStyle.BORDER_THIN);
//		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setBorderBottom(BorderStyle.THIN);
		style.setBorderLeft(BorderStyle.THIN);
		style.setBorderTop(BorderStyle.THIN);
		style.setBorderRight(BorderStyle.THIN);
		
		//数字类型数据展示格式
		CellStyle numberStyle = wb.createCellStyle();
		numberStyle.cloneStyleFrom(style);
		DataFormat dataFormat = wb.createDataFormat();
		numberStyle.setDataFormat(dataFormat.getFormat(ExcelCellStyle.data_format_double));
		
		boolean mergeNotRowSpan = true; //判断是否需要 合并列不跨行 来源需求:2019年6月11日16:46:25 郭强:如果所有列都是合并列并且合并类型都一样, 则合并完成以后 不跨行, 以一行来展示 数据
		
		mergeNotRowSpan = titleOper(titleList, limitDataRow ,limitDataCol ,sheet ,titleStyle ,false);
		
		List<Merge> mergeList = getMergeList(titleList, dataList);
		
		// 用于比较列高大小
		Cell cell = null;
		
		int mergeNotRowSpanCount = 0;//该行之前 因为 合并不跨行 所减少的行数
		int mergeRowNotSpanEndIndex = -1; //合并不跨行 的结束位
		int rowIndex =  0 + limitDataRow; //每创建一行  +1   //因为没有title, 所以不要  + 1
		
		//用 r 代表行
		for (int rowShouldIndex = 1; rowShouldIndex <= dataList.size(); rowShouldIndex++) {
			
			boolean flagIsMergeRowNotSpanOper = false;
			
			if(rowShouldIndex <= mergeRowNotSpanEndIndex) {
				continue;
			}
			
			int maxRowCount = 1;
			
			// 动态创建行
			// 如果以前该行已经存在, 则手动删除一下, 按照 poi底层逻辑 我们 createRow 他会去一个一个删除 单元格 然后重新创建 遇到一个 莫名其妙 包空指针的错误! 所以手动删除一下 行!
			if(sheet.getRow(rowIndex) != null) {
				sheet.removeRow(sheet.getRow(rowIndex));
			}
			Row row = sheet.createRow(rowIndex);
			
			List<Object> rowData = dataList.get(rowShouldIndex - 1);
			
			int notShowColCount = 0; //在该行有多少列是不展示的, 仅用作合并的列
			
			boolean flagMergeRowSpan = checkMergeRowSpan(mergeList, rowShouldIndex);//该行是否需要 合并不跨行
			
			for(int colDataIndex = 0 ; colDataIndex < titleList.size(); colDataIndex++) {
				F_Title title = titleList.get(colDataIndex);
				
				if(title.getIsShow() == 0) {
					//不需要显示的行
					notShowColCount++;
				}else {
					int colIndex = colDataIndex - notShowColCount + limitDataCol;
					cell = row.createCell(colIndex);
					
					Object cellValue = rowData.get(colDataIndex)==null?"":rowData.get(colDataIndex);
					
					//String text = rowData.get(colDataIndex)==null?"":JSON.toJson(rowData.get(colDataIndex));

					//格式化 要显示的数据
					if(title.getFormat() != null) {
						cellValue = title.getFormat().format(cellValue);
					}
					
					boolean inputValue = true;
					
					if(title.getIsMerge() == 1) {
						
						Merge merge = getMergeByKey(mergeList, getMergeKey(rowShouldIndex, colDataIndex));
						
						if(merge != null) { //需要合并
							
							if(!mergeNotRowSpan) {//合并不跨行 标题合并级别满足条件
								//merge.mergeCell(sheet);
								
								int row_start = merge.row_start - mergeNotRowSpanCount + limitDataRow;
								int row_end = merge.row_end - mergeNotRowSpanCount + limitDataRow;
								int col_start = merge.col_start - notShowColCount + limitDataCol;
								int col_end = merge.col_end - notShowColCount + limitDataCol;
								
								//合并操作
								sheet.addMergedRegion(new CellRangeAddress(rowIndex, rowIndex + (row_end - row_start), col_start, col_end));
							}else {
								if(flagMergeRowSpan) {//合并不跨行
									
									//每行只操作一次
									if(!flagIsMergeRowNotSpanOper) {
										flagIsMergeRowNotSpanOper = true;
										//有合并但是不需要跨行
//										mergeNotRowSpanCount = merge.row_end - merge.row_start + 1;
										
										mergeRowNotSpanEndIndex = merge.row_end;
										mergeNotRowSpanCount = mergeNotRowSpanCount + (merge.row_end - merge.row_start);
										
									}
								}else {
									//merge.mergeCell(sheet);
									
									int row_start = merge.row_start - mergeNotRowSpanCount + limitDataRow;
									int row_end = merge.row_end - mergeNotRowSpanCount + limitDataRow;
									int col_start = merge.col_start - notShowColCount + limitDataCol;
									int col_end = merge.col_end - notShowColCount + limitDataCol;
									
									//合并操作
									sheet.addMergedRegion(new CellRangeAddress(rowIndex, rowIndex + (row_end - row_start), col_start, col_end));
								}
							}
						}else {
							
							//说明该单元格要合并且不止一行数据, 并且数据值 都不是合并开始行和开始列  这种情况 不再输出数据
							inputValue = inputValueForMergeCell(titleList ,dataList ,mergeList ,rowShouldIndex - 1,colDataIndex);
							
						}
					}
					
					cell.setCellStyle(style);

					if(inputValue) {

						if(title.isRichText()) {
							if(sheet instanceof HSSFSheet) {
								cell.setCellValue(new HSSFRichTextString(cellValue.toString()));
							}else {
								cell.setCellValue(new XSSFRichTextString(cellValue.toString()));
							}
						}else {
							
							if(cellValue instanceof BigDecimal){
								
								Double doubleValue = Double.parseDouble(cellValue.toString());
								cell.setCellValue(doubleValue);
								cell.setCellStyle(numberStyle);
								
							}else if(cellValue instanceof Double){
								
								Double doubleValue = Double.parseDouble(cellValue.toString());
								cell.setCellValue(doubleValue);
								cell.setCellStyle(numberStyle);
								
							}else if(cellValue instanceof Integer
									|| cellValue instanceof BigInteger  //统计条数出来的数据 会是 BigInteger
									|| cellValue instanceof Long){
								
								Integer intValue = Integer.parseInt(cellValue.toString());
								cell.setCellValue(intValue);
								
							}else if(cellValue instanceof Number) {
								
								Double doubleValue = Double.parseDouble(cellValue.toString());
								cell.setCellValue(doubleValue);
								cell.setCellStyle(numberStyle);
								
							}else {
								
								cell.setCellValue((String)cellValue);
								
							}
							
						}

					}
					
					int thisCellRowCount = cellValue.toString().split("\r\n").length;
					maxRowCount = maxRowCount >= thisCellRowCount?maxRowCount:thisCellRowCount;
					
					row.setHeight((short) (maxRowCount * 300));
				}
			}
			
			rowIndex++;//每创建一行  +1
		}
		
		try {
			FileOutputStream fout = new FileOutputStream(path);// "D:\\test.xls"
			wb.write(fout);
			fout.close();
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	private static boolean titleOper(List<F_Title> titleList ,int limitDataRow ,int limitDataCol ,Sheet sheet ,CellStyle style ,boolean showTitle) {
		
		int notShowCellInThisTitleCellBefore = 0; //在该title列之前有多少列是不展示的, 仅用作合并的列
		Row row = null;
		if(showTitle) {
			row = sheet.createRow(0 + limitDataRow);
		}
		
		boolean mergeNotRowSpan = true;
		// 设置Excel行标
		Cell cell = null;
		
		String tempMergeType = ""; //判断合并类型是否一致
		for (int i = 0; i < titleList.size(); i++) {
			F_Title title = titleList.get(i);
			if(title.getIsShow() == 0) {
				notShowCellInThisTitleCellBefore++;
				continue;
			}
			
			if(showTitle) {
				int cellIndex = i - notShowCellInThisTitleCellBefore + limitDataCol;
				
				String text = title.getAlias();
				
				int linWidth = title.getWidth();
				
				cell = row.createCell(cellIndex);
				if(sheet instanceof HSSFSheet) {
					cell.setCellValue(new HSSFRichTextString(text));
				}else{
					cell.setCellValue(new XSSFRichTextString(text));
				}
				// 设置列宽
				sheet.setColumnWidth(cellIndex, (short)linWidth);
				cell.setCellStyle(style);
			}
			
			if(title.getIsMerge() == 1) {
				//判断是否满足合并列不跨行的条件
				if(StringUtils.isNotBlank(tempMergeType)) {
					if(!tempMergeType.equals(title.getMergeType())) {
						mergeNotRowSpan = false;//不满足条件
					}
				}else {
					tempMergeType = title.getMergeType();
				}
			}else {
				mergeNotRowSpan = false;
			}
		}
		
		return mergeNotRowSpan;
	}

	private static List<Merge> getMergeList(List<F_Title> titleList ,List<List<Object>> dataList) {
		
		List<Merge> mergeList = new ArrayList<Merge>();
		
		Map<String ,Integer> mergeCountMap = new HashMap<String ,Integer>();
		
		for (int rowDataIndex = 0; rowDataIndex < dataList.size(); rowDataIndex++) {
			
			List<Object> rowData = dataList.get(rowDataIndex);
			
			for(int titleDataIndex = 0 ; titleDataIndex < titleList.size(); titleDataIndex++) {
				F_Title title = titleList.get(titleDataIndex);
				if(title.getIsShow() == 0) {
					continue;
				}
				
				if(title.getIsMerge() == 1) {

					String mergeCountKey = getMergeCountKey(title.getMergeType() ,title.getAlias()); //title.getMergeType() + "_merge_" + title.getAlias();
					
					int mergeTitleIndex = getInListIndexForTitle(title.getMergeType(), titleList); //合并参考列 位于 title 中的下标
					if(mergeTitleIndex != -1 && rowDataIndex != 0) { //判断下标是否有效 
						
						Object currentMerge = rowData.get(mergeTitleIndex); //根据合并参考列下标获取到该位置的值
						Object currentMergeValue = currentMerge==null?"":currentMerge;
						
						Object currentCell = rowData.get(titleDataIndex);
						Object currentCellValue = currentCell==null?"":currentCell;
						
						Object tempMerge = dataList.get(rowDataIndex - 1).get(mergeTitleIndex);
						Object tempMergeValue = tempMerge==null?"":tempMerge;
						
						Object tempCell = dataList.get(rowDataIndex - 1).get(titleDataIndex);
						Object tempCellValue = tempCell==null?"":tempCell;
						
						boolean flagMerge = tempMergeValue.equals(currentMergeValue) && currentCellValue.equals(tempCellValue);
						if(!flagMerge) {
							Integer mergeCount = mergeCountMap.get(mergeCountKey);
							mergeCount = mergeCount==null?1:mergeCount;
							if(mergeCount > 1) {
								int startRow = rowDataIndex + 1 - mergeCount;
								int endRow = rowDataIndex;
								if(startRow > endRow) {
									endRow = startRow;
								}
								/* 因为最后统一处理了最后一行, 所以此处不需要单独处理!
								if(rowDataIndex == dataList.size() - 1) {
									endRow = endRow + 1;
								}
								*/
								int startCol = titleDataIndex;//titleDataIndex - notShowColCount;
								
								mergeList.add(new Merge(startRow, endRow, startCol, startCol));
								mergeCountMap.remove(mergeCountKey);
							}
						}else {

							Integer mergeCount = mergeCountMap.get(mergeCountKey);
							mergeCount = mergeCount==null?1:mergeCount;
							mergeCount++;
							
							mergeCountMap.put(mergeCountKey, mergeCount);
						}
						
						//最后一行特殊处理
						boolean isLastDataRow = rowDataIndex == dataList.size() - 1;
						if(isLastDataRow) {
							Integer mergeCount = mergeCountMap.get(mergeCountKey);
							mergeCount = mergeCount==null?1:mergeCount;
							if(mergeCount > 1) {
								int endRow = rowDataIndex + 1;
								int startRow = endRow - mergeCount + 1;
								
								if(startRow > endRow) {
									endRow = startRow;
								}
								
								int startCol = titleDataIndex;//titleDataIndex - notShowColCount;
								
								mergeList.add(new Merge(startRow, endRow, startCol, startCol));
								mergeCountMap.remove(mergeCountKey);
							}
						}
					}
				}
			}
		}
		return mergeList;
	}
	
	public static int getInListIndexForTitle(String alias ,List<F_Title> titleList) {
		alias = StringUtils.isNotBlank(alias)?alias:"";
		for (int i = 0 ; i < titleList.size(); i++) {
			F_Title title = titleList.get(i);
			if(alias.equals(title.getAlias())) {
				return i;
			}
		}
		return -1;
	}
	
	/**
	 * 检测合并行是否需要 合并不跨行
	 * @param mergeList
	 * @param row
	 * @return true:需要,false:不需要
	 */
	private static boolean checkMergeRowSpan(List<Merge> mergeList ,int row) {
		
		int tempRowEnd = -1;
		
		for (Merge merge : mergeList) {
			
			//TODO 合并内部 如果存在合并不跨行 先不处理
			if(merge.row_start < row && merge.row_end > row) {
				return false;
			}
			
			if(merge.row_start == row) {
				if(tempRowEnd == -1) {
					tempRowEnd = merge.row_end;
				}
				if(tempRowEnd != merge.row_end) {
					return false;
				}
			}
		}
		
		return true;
	}
	
	/**
	 * 将数据序号列进行 index 序列化操作
	 * @return
	 */
	public static void dataIndexOper(List<Object[]> dataList ,int index ,int indexBasisIndex){
		
		int indexStr = 0;
		Object checkBasisValue = null;
		
		for (Object[] objs : dataList) {
			
			if(indexBasisIndex >= 0) { //indexBasisIndex != -1
				Object basisValue = objs[indexBasisIndex];
				
				if(checkBasisValue == null
					|| !checkBasisValue.equals(basisValue)) {
					
					indexStr++;
					checkBasisValue = basisValue;
				}
				
			}else {
				indexStr++;
			}
			
			objs[index] =  indexStr + "";
		}
	}
	
	public static F_Title getF_Title() {
		F_Title f_title = new F_Title();
		return f_title;
	}

	public static F_Title getF_Title(String alias, int width ,int isShow ,int isMerge ,String mergeType ,int isIndex ,String indexBasis ,boolean isRichText ,Format format ,String fixedValue) {
		
		F_Title f_title = new F_Title();
		
		f_title.setAlias(alias);
    	f_title.setIsMerge(isMerge);
    	f_title.setIsShow(isShow);
    	f_title.setMergeType(mergeType);
    	f_title.setIsIndex(isIndex);
    	f_title.setIndexBasis(indexBasis);
    	f_title.setWidth(width);
    	f_title.setRichText(isRichText);
    	f_title.setFormat(format);
    	f_title.setFixedValue(fixedValue);
    	
		return f_title;
	}
	
	public static class F_Title {
		
		private String alias;
		
		private int width;
		
		private int isShow;
		
		private int isMerge;
		
		private String mergeType;

		private int isIndex;
		
		private String indexBasis;//序号基准
		
		private boolean isRichText = false;//单元格文字是否为富文本
		
		private Format format;//格式化
		
		private String fixedValue; //固定值
	
		public String getAlias() {
			return alias;
		}
	
		public void setAlias(String alias) {
			this.alias = alias;
		}
	
		public int getWidth() {
			return width;
		}
	
		public void setWidth(int width) {
			this.width = width;
		}
	
		public int getIsShow() {
			return isShow;
		}
	
		public void setIsShow(int isShow) {
			this.isShow = isShow;
		}
	
		public int getIsMerge() {
			return isMerge;
		}
	
		public void setIsMerge(int isMerge) {
			this.isMerge = isMerge;
		}
		
		public String getMergeType() {
			return mergeType;
		}
	
		/**
		 * 合并参考
		 * 与其他列的别名(alias)保持一致
		 * @param mergeType
		 */
		public void setMergeType(String mergeType) {
			this.mergeType = mergeType;
		}
		
		public int getIsIndex() {
			return isIndex;
		}

		public void setIsIndex(int isIndex) {
			this.isIndex = isIndex;
		}

		public String getIndexBasis() {
			return indexBasis;
		}

		public void setIndexBasis(String indexBasis) {
			this.indexBasis = indexBasis;
		}

		public Format getFormat() {
			return format;
		}

		public void setFormat(Format format) {
			this.format = format;
		}

		public String getFixedValue() {
			return fixedValue;
		}

		public void setFixedValue(String fixedValue) {
			this.fixedValue = fixedValue;
		}

		public boolean isRichText() {
			return isRichText;
		}

		public void setRichText(boolean isRichText) {
			this.isRichText = isRichText;
		}
		
	}

	/**
	 * EXCEL单元格格式化
	 * @author sunha
	 *
	 */
	public abstract static class Format {
		
		/**
		 * 格式化模式 标记
		 */
		private Object format;
		
		public Format() {
			;
		}
		
		public Format(Object format) {
			this.setFormat(format);
		}
		
		public Object getFormat() {
			return format;
		}
		
		public void setFormat(Object format) {
			this.format = format;
		}

		/**
		 * 执行格式化
		 * @param source
		 * @return
		 */
		public abstract Object format(Object source);
	}
	
	private static Merge getMergeByKey(List<Merge> mergeList ,String key) {
		for (Merge merge : mergeList) {
			if(merge.key.equals(key)) {
				return merge;
			}
		}
		return null;
	}
	
	private static String getMergeCountKey(String mergeType ,String alias) {
		return mergeType + MERGE_COUNT_KEY + alias;
	}

	private static String getMergeKey(int row ,int col) {
		return MERGE_KEY_START + row + MERGE_KEY_MIDDLE + col;
	}
	
	private static String getMergeKey(int row_start ,int row_end ,int col_start ,int col_end) {
		return MERGE_KEY_START + row_start + "_" + row_end + MERGE_KEY_MIDDLE + col_start + "_" + col_end;
	}
	
	public static class Merge {
		
		private String key = "";
		private int row_start;
		private int row_end;
		private int col_start;
		private int col_end;
		
		public Merge() {
			
		}
		
		public Merge(int row_start ,int row_end ,int col_start ,int col_end) {
			this.setKey(getMergeKey(row_start ,col_start));//MERGE_KEY_START + row_start + MERGE_KEY_MIDDLE + col_start;
			this.setRow_start(row_start);
			this.setRow_end(row_end);
			this.setCol_start(col_start);
			this.setCol_end(col_end);
		}

		public Merge(String key ,int row_start ,int row_end ,int col_start ,int col_end) {
			this.setKey(key);
			this.setRow_start(row_start);
			this.setRow_end(row_end);
			this.setCol_start(col_start);
			this.setCol_end(col_end);
		}
		
		public void mergeCell(Sheet sheet) {
			
			sheet.addMergedRegion(new CellRangeAddress(this.row_start, this.row_end, this.col_start, this.col_end));
		}
		
		public String getKey() {
			return key;
		}

		public void setKey(String key) {
			this.key = key;
		}

		public int getRow_start() {
			return row_start;
		}

		public void setRow_start(int row_start) {
			this.row_start = row_start;
		}

		public int getRow_end() {
			return row_end;
		}

		public void setRow_end(int row_end) {
			this.row_end = row_end;
		}

		public int getCol_start() {
			return col_start;
		}

		public void setCol_start(int col_start) {
			this.col_start = col_start;
		}

		public int getCol_end() {
			return col_end;
		}

		public void setCol_end(int col_end) {
			this.col_end = col_end;
		}

	}

	/**
	 * 解析excel数据
	 * @param excelPath
	 * @param excelTitles
	 * @return
	 */
	public static Map<String ,Object> readExcel(String excelPath , String[] excelTitles){
		Map<String,Object> map = new HashMap<String,Object>();

		if(excelPath == null || "".equals(excelPath)){
			map.put("status", 0);
			map.put("msg", "没有上传Excel文件!");
			return map;
		}

		if(excelTitles == null){
			map.put("status", 0);
			map.put("msg", "解析EXCEL所需的XML配置有问题！请及时联系管理员处理");
			return map;
		}
		int totalRows = 0;  //总行数
		int totalCells = 0; //总列数
		//保存EXCEL数据
		List<String[]> dataLst = new ArrayList<String[]>();
		//保存EXCEL需要提取的title的下标位置
		List<Integer> titleIndex = new ArrayList<Integer>();
		InputStream is = null;
		try {
			URL url = new URL(excelPath); //远程路径
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.connect();
			is = con.getInputStream();
		} catch (IOException ioExceprion) {
			ioExceprion.printStackTrace();
			throw new RuntimeException("IO异常！");
		}
		/** 根据版本选择创建Workbook的方式 */

		Workbook wb = null;
		
		try {
			
			if(excelPath.matches("^.+\\.(?i)(xls)$")){//用2003处理
				
				wb = new HSSFWorkbook(is);
//				wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);
				wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
				
				is.close();
				
			}else if(excelPath.matches("^.+\\.(?i)(xlsx)$")){//用2007处理
				
				wb = new XSSFWorkbook(is);
//				wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);
				wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
				is.close();
				
			}else{
				map.put("status", 0);
				map.put("msg", "你上传的不是标准的微软Office Excel文件！无法解析！请重新上传标准的微软Office Excel文件！");
				return map;
			}
			
		} catch (Exception e) {
			try {
				if(wb != null) {
					wb.close();
				}
			} catch (Exception ee) {
				ee.printStackTrace();
			}
			e.printStackTrace();
			map.put("status", 0);
			map.put("msg", "Excel解析出错!" + e.getMessage());
			return map;
		}

		/** 得到第一个shell */
		Sheet sheet = wb.getSheetAt(0);
		/** 得到Excel的行数 */
		totalRows = sheet.getPhysicalNumberOfRows();
		/** 得到Excel的列数 */
		if (totalRows >= 1 && sheet.getRow(0) != null) {
			totalCells = sheet.getRow(0).getPhysicalNumberOfCells();
		}

		//      //取得title行（即第0行）
		Row titleRow = sheet.getRow(0);

		//确定需提取的单元格列下标，排除重复单元格，排除缺失的需提取列
		for(int et = 0; et < excelTitles.length; et++){
			int flag = 0;//排查excel中是否存在title或是否有重复title的标识
			int index = -1;
			for(int nc = 0; nc < totalCells; nc++){
				Cell titleCell = titleRow.getCell(nc);
				if(titleCell == null){
					continue;//查找下一个单元格
				}
				String titleCellVal = titleCell.getStringCellValue();
				if(excelTitles[et].trim().equals(titleCellVal.trim())){
					flag++;//找到一个匹配的title则flag+1
					index = nc;
				}
			}
			//没有找到需要提取的title
			if(flag <= 0){
				
				try {
					if(wb != null) {
						wb.close();
					}
				} catch (Exception ee) {
					ee.printStackTrace();
				}
				
				map.put("status", 0);
				map.put("msg", "excel格式有误，可遵照第一步下载模板!");
				return map;
			}
			titleIndex.add(index);//保存需提取列的下标
		}

		SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd");

		/** 循环Excel的行 ;从第1行开始循环totalRows*/
		for (int r = 1; r < totalRows; r++) {
			Row row = sheet.getRow(r);
			if (row == null) {
				continue;
			}
			Cell cell1 = row.getCell(titleIndex.get(1));
			if(cell1 == null) {
				continue;
			}
			String[] rowLst = new String[titleIndex.size()];
			/** 循环Excel中我们需要的列 */
			boolean flag=true;
			String operation="";

			for(int c =0 ; c<titleIndex.size()&&flag; c++){

				Cell cell = row.getCell(titleIndex.get(c));
				String cellValue="";

				if (cell!=null) {
					operation="update";
				}else {
					rowLst[c]=cellValue.trim();
					continue ;
				}
				
				switch (cell.getCellType()) {
//				case XSSFCell.CELL_TYPE_NUMERIC: // 数字/日期
				case NUMERIC:

					if("yyyy/mm;@".equals(cell.getCellStyle().getDataFormatString()) || "m/d/yy".equals(cell.getCellStyle().getDataFormatString())
							|| "yy/m/d".equals(cell.getCellStyle().getDataFormatString()) || "mm/dd/yy".equals(cell.getCellStyle().getDataFormatString())
							|| "dd-mmm-yy".equals(cell.getCellStyle().getDataFormatString())|| "yyyy/m/d".equals(cell.getCellStyle().getDataFormatString())){
						cellValue = simpleDateFormat.format(cell.getDateCellValue());
					}else{
						cellValue = cell.getNumericCellValue()+"";
					}
					break;
//				case XSSFCell.CELL_TYPE_STRING: // 字符串
				case STRING:
					
					cellValue = cell.getStringCellValue();
					
					break;
//				case XSSFCell.CELL_TYPE_BOOLEAN: // Boolean
				case BOOLEAN:
					cellValue = cell.getBooleanCellValue() + "";
					break;
//				case XSSFCell.CELL_TYPE_FORMULA: // 公式
				case FORMULA:
					try{
						cellValue = String.valueOf(cell.getNumericCellValue());
					} catch(IllegalStateException e){
					}
					cellValue += "";
					break;
//				case XSSFCell.CELL_TYPE_BLANK: // 空值
				case BLANK:
					cellValue = "";
					break;
//				case XSSFCell.CELL_TYPE_ERROR: // 故障
				case ERROR:
					map.put("status", 0);
					map.put("msg", "【"+(r+1)+"】行：【"+(titleIndex.get(c)+1)+"】列无法解析！请处理后上传正确的EXCEL");
					return map;
				default:
					//cellValue = "未知类型";
					map.put("status", 0);
					map.put("msg", "【"+(r+1)+"】行：【"+(titleIndex.get(c)+1)+"】列无法解析！请处理后上传正确的EXCEL");
					return map;
				}
				if(cellValue==null) {
					cellValue="";
				}
				
				rowLst[c]=cellValue.trim();
			}
			if(flag && !"".equals(operation)){
				dataLst.add(rowLst);
			}
		}
		
		try {
			if(wb != null) {
				wb.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		map.put("content", dataLst);
		map.put("status", 1);

		return map;
	}
	
	/**
	 * 解析excel数据
	 * @param excelPath
	 * @param excelTitles
	 * @return
	 */
	public static List<List<ExcelCell>> readExcel(String excelUrl){

		if(excelUrl == null || "".equals(excelUrl)){
			throw new MyExceptionForRole("找不到文件! " + excelUrl);
		}
		
		try {
			URL url = new URL(excelUrl); //远程路径
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.connect();
			InputStream is = con.getInputStream();
			
			Workbook wb = null;
			if(excelUrl.matches("^.+\\.(?i)(xls)$")){//用2003处理
				try {
					wb = new HSSFWorkbook(is);
//					wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);
					wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
				} catch (Exception e) {
					throw new MyExceptionForRole("EXCEL格式有误！ERROR : excel 2003 analysis failed!");
				}finally{
					if(is!=null){
						is.close();
					}
				}
			}else if(excelUrl.matches("^.+\\.(?i)(xlsx)$")){//用2007处理
				try {
					wb = new XSSFWorkbook(is);
//					wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);//Row.CREATE_NULL_AS_BLANK
					wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
				} catch (Exception e) {
					throw new MyExceptionForRole("EXCEL格式有误！ERROR : excel 2007 analysis failed!");
				}finally{
					is.close();
				}
			}else{
				throw new MyExceptionForRole("你上传的不是标准的微软Office Excel文件！无法解析！请重新上传标准的微软Office Excel文件！");
			}
			
			/** 得到第一个shell */
			Sheet sheet = wb.sheetIterator().next();
			if(sheet == null) {
				if(wb != null) {
					wb.close();
				}
				throw new MyExceptionForRole("你上传的EXCEL文件有误!");
			}
			
			/** 得到Excel的行数 */
			int totalRows = sheet.getPhysicalNumberOfRows();
			
			/** 得到Excel的列数 
			if (totalRows >= 1 && sheet.getRow(0) != null) {
				totalCells = sheet.getRow(0).getPhysicalNumberOfCells();
			}
			*/
			
			List<List<ExcelCell>> dataList = new ArrayList<List<ExcelCell>>();
			
			for (int rowIndex = 0; rowIndex < totalRows; rowIndex++) {
				
				List<ExcelCell> rowDataList = new ArrayList<ExcelCell>();
				
				Row row = sheet.getRow(rowIndex);
				if(row == null) {
					continue;
				}
				
				int totalCells = row.getLastCellNum();
				
				for(int cellIndex = 0; cellIndex < totalCells; cellIndex++) {
					
					Cell cell = row.getCell(cellIndex);
					
					Object cellValue = getCellValue(cell);
					
					Merge merge = isMergedRegion(sheet, rowIndex, cellIndex);

					CellStyle cellStyle = getCellStyle(wb, cell);
					ExcelCellStyle excelCellStyle = ExcelCellStyle.toExcelCellStyle(cellStyle);
					
					//单元格的高和宽处理
					int width = sheet.getColumnWidth(cellIndex);
					short height = row.getHeight();
					
					excelCellStyle.setWidth(width);
					excelCellStyle.setHeight(height);
					
					ExcelCell ec = new ExcelCell();
					ec.setRowIndex(rowIndex);
					ec.setColumnIndex(cellIndex);
					ec.setMerge(merge);
					ec.setStyle(excelCellStyle);
					ec.setValue(cellValue);
					
					rowDataList.add(ec);
				}
				dataList.add(rowDataList);
			}
			
			if(wb != null) {
				wb.close();
			}
			
			return dataList;
			
		}catch (Exception e) {
			e.printStackTrace();
			throw new MyExceptionForRole("EXCEl解析失败!" + e.getMessage());
		}
	}

	/**
	 * 解析excel数据
	 * @param excelPath
	 * @param excelTitles
	 * @return
	 */
	public static List<Map<String ,Object>> readExcelToMapList(String excelUrl , String[] titles){
		
		if(excelUrl == null || "".equals(excelUrl)){
			throw new MyExceptionForRole("没有上传Excel文件!");
		}

		if(titles == null){
			throw new MyExceptionForRole("解析EXCEL标题出错! titles cann't to be null");
		}
		int totalRows = 0;  //总行数
		int totalCells = 0; //总列数
		//保存EXCEL数据
		List<Map<String ,Object>> dataLst = new ArrayList<Map<String ,Object>>();
		//保存EXCEL需要提取的title的下标位置
		List<Integer> titleIndex = new ArrayList<Integer>();
		InputStream is = null;
		try {
			URL url = new URL(excelUrl); //远程路径
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.connect();
			is = con.getInputStream();
		} catch (IOException ioExceprion) {
			ioExceprion.printStackTrace();
			throw new RuntimeException("IO异常！");
		}
		/** 根据版本选择创建Workbook的方式 */

		Workbook wb = null;
		
		try {
			
			if(excelUrl.matches("^.+\\.(?i)(xls)$")){//用2003处理
				
				wb = new HSSFWorkbook(is);
//				wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);
				wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
				
				is.close();
				
			}else if(excelUrl.matches("^.+\\.(?i)(xlsx)$")){//用2007处理
				
				wb = new XSSFWorkbook(is);
//				wb.setMissingCellPolicy(Row.RETURN_BLANK_AS_NULL);
				wb.setMissingCellPolicy(MissingCellPolicy.RETURN_BLANK_AS_NULL);
				is.close();
				
			}else{
				throw new MyExceptionForRole("你上传的不是标准的微软Office Excel文件！无法解析！请重新上传标准的微软Office Excel文件！");
			}
			
		} catch (Exception e) {
			try {
				if(wb != null) {
					wb.close();
				}
			} catch (Exception ee) {
				ee.printStackTrace();
			}
			e.printStackTrace();
			throw new MyExceptionForRole("Excel解析出错!" + e.getMessage());
		}

		/** 得到第一个shell */
		Sheet sheet = wb.getSheetAt(0);
		/** 得到Excel的行数 */
		totalRows = sheet.getPhysicalNumberOfRows();
		/** 得到Excel的列数 */
		if (totalRows >= 1 && sheet.getRow(0) != null) {
			totalCells = sheet.getRow(0).getPhysicalNumberOfCells();
		}

		//      //取得title行（即第0行）
		Row titleRow = sheet.getRow(0);

		//确定需提取的单元格列下标，排除重复单元格，排除缺失的需提取列
		for(int et = 0; et < titles.length; et++){
			int flag = 0;//排查excel中是否存在title或是否有重复title的标识
			int index = -1;
			for(int nc = 0; nc < totalCells; nc++){
				Cell titleCell = titleRow.getCell(nc);
				if(titleCell == null){
					continue;//查找下一个单元格
				}
				String titleCellVal = titleCell.getStringCellValue();
				if(titles[et].trim().equals(titleCellVal.trim())){
					flag++;//找到一个匹配的title则flag+1
					index = nc;
					break;
				}
			}
			//没有找到需要提取的title
			if(flag <= 0){
				
				try {
					if(wb != null) {
						wb.close();
					}
				} catch (Exception ee) {
					ee.printStackTrace();
				}
				throw new MyExceptionForRole("title '"+titles[et].trim()+"' not found in excel!");
			}
			titleIndex.add(index);//保存需提取列的下标
		}

		SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd");
		NumberFormat numberFormat = NumberFormat.getInstance();
		numberFormat.setGroupingUsed(false);

		/** 循环Excel的行 ;从第1行开始循环totalRows*/
		for (int r = 1; r < totalRows; r++) {
			
			Row row = sheet.getRow(r);
			
			if (row == null) {
				continue;
			}
			
			Cell cell1 = row.getCell(titleIndex.get(1));
			if(cell1 == null) {
				continue;
			}
			
			Map<String ,Object> rowMap = new HashMap<String ,Object>();

			for(int c = 0 ; c < titleIndex.size(); c++){
				
				Cell cell = row.getCell(titleIndex.get(c));//nullException
				
				if(cell == null) {
					rowMap.put(titles[c], null);
					continue;
				}
				
				String cellValue = "";
				
				switch (cell.getCellType()) {
	//				case XSSFCell.CELL_TYPE_NUMERIC: // 数字/日期
					case NUMERIC:
	
						if("yyyy/mm;@".equals(cell.getCellStyle().getDataFormatString()) || "m/d/yy".equals(cell.getCellStyle().getDataFormatString())
								|| "yy/m/d".equals(cell.getCellStyle().getDataFormatString()) || "mm/dd/yy".equals(cell.getCellStyle().getDataFormatString())
								|| "dd-mmm-yy".equals(cell.getCellStyle().getDataFormatString())|| "yyyy/m/d".equals(cell.getCellStyle().getDataFormatString())){
							cellValue = simpleDateFormat.format(cell.getDateCellValue());
						}else{
							double d = cell.getNumericCellValue();
							cellValue = numberFormat.format(d);
						}
						break;
	//				case XSSFCell.CELL_TYPE_STRING: // 字符串
					case STRING:
						
						cellValue = cell.getStringCellValue();
						
						break;
	//				case XSSFCell.CELL_TYPE_BOOLEAN: // Boolean
					case BOOLEAN:
						cellValue = cell.getBooleanCellValue() + "";
						break;
	//				case XSSFCell.CELL_TYPE_FORMULA: // 公式
					case FORMULA:
						try{
							cellValue = String.valueOf(cell.getNumericCellValue());
						} catch(IllegalStateException e){
						}
						cellValue += "";
						break;
	//				case XSSFCell.CELL_TYPE_BLANK: // 空值
					case BLANK:
						cellValue = "";
						break;
	//				case XSSFCell.CELL_TYPE_ERROR: // 故障
					case ERROR:
						throw new MyExceptionForRole("【"+(r+1)+"】行：【"+(titleIndex.get(c)+1)+"】列无法解析！请处理后上传正确的EXCEL");
					default:
						//cellValue = "未知类型";
						throw new MyExceptionForRole("【"+(r+1)+"】行：【"+(titleIndex.get(c)+1)+"】列无法解析！请处理后上传正确的EXCEL");
				}
				
				if(cellValue == null) {
					cellValue = "";
				}
				
				rowMap.put(titles[c], cellValue.trim());
			}
			dataLst.add(rowMap);
		}
		
		try {
			if(wb != null) {
				wb.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return dataLst;
	}
	/**
	 * 判断合并了行
	 * 
	 * @param sheet
	 * @param row
	 * @param column
	 * @return
	 */
	public static Merge isMergedRow(Sheet sheet, int row, int column) {
		
		int sheetMergeCount = sheet.getNumMergedRegions();
		for (int i = 0; i < sheetMergeCount; i++) {
			CellRangeAddress range = sheet.getMergedRegion(i);
			int col_start = range.getFirstColumn();
			int col_end = range.getLastColumn();
			int row_start = range.getFirstRow();
			int row_end = range.getLastRow();
			if (row == row_start && row == row_end) {
				if (column >= col_start && column <= col_end) {
					String mergeKey = getMergeKey(row_start, row_end, col_start, col_end);
					return new Merge(mergeKey, row_start, row_end, col_start, col_end);
				}
			}
		}
		return null;
	}

	/**
	 * 判断指定的单元格是否是合并单元格
	 * @param sheet
	 * @param row 行下标
	 * @param column 列下标
	 * @return
	 */
	public static Merge isMergedRegion(Sheet sheet, int row, int column) {

		int sheetMergeCount = sheet.getNumMergedRegions();
		for (int i = 0; i < sheetMergeCount; i++) {

			CellRangeAddress range = sheet.getMergedRegion(i);
			int col_start = range.getFirstColumn();
			int col_end = range.getLastColumn();
			int row_start = range.getFirstRow();
			int row_end = range.getLastRow();
			if (row >= row_start && row <= row_end) {
				if (column >= col_start && column <= col_end) {
					String mergeKey = getMergeKey(row_start, row_end, col_start, col_end);
					return new Merge(mergeKey, row_start, row_end, col_start, col_end);
				}
			}
		}
		return null;
	}
	
	/**
	 * 判断指定的单元格是否已经合并
	 * @param sheet
	 * @param row 行下标
	 * @param column 列下标
	 * @return
	 */
	public static boolean isMerged(Sheet sheet, int row_start ,int row_end, int col_start, int col_end) {
		
		int sheetMergeCount = sheet.getNumMergedRegions();
		for (int i = 0; i < sheetMergeCount; i++) {

			CellRangeAddress range = sheet.getMergedRegion(i);
			int colStart = range.getFirstColumn();
			int colEnd = range.getLastColumn();
			int rowStart = range.getFirstRow();
			int rowEnd = range.getLastRow();
			if (row_start >= rowStart && row_end <= rowEnd) {
				if (col_start >= colStart && col_end <= colEnd) {
					return true;
				}
			}
		}
		
		return false;
	}

	/**
	 * 获取单元格的值
	 * 
	 * @param cell
	 * @return
	 */
	public static Object getCellValue(Cell cell) {
		Object cellValue = "";
		
		if(cell == null) {
			return "";
		}
		
//		if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC) {// 数字/日期
		if (cell.getCellType() == CellType.NUMERIC) {// 数字/日期

			if("yyyy/mm;@".equals(cell.getCellStyle().getDataFormatString())
				|| "m/d/yy".equals(cell.getCellStyle().getDataFormatString())
				|| "yy/m/d".equals(cell.getCellStyle().getDataFormatString())
				|| "mm/dd/yy".equals(cell.getCellStyle().getDataFormatString())
				|| "dd-mmm-yy".equals(cell.getCellStyle().getDataFormatString())
				|| "yyyy/m/d".equals(cell.getCellStyle().getDataFormatString())){
				
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
				cellValue = simpleDateFormat.format(cell.getDateCellValue());
				
			}else{
				cellValue = cell.getNumericCellValue();
			}

//		} else if (cell.getCellType() == Cell.CELL_TYPE_STRING) { // 字符串
		} else if (cell.getCellType() == CellType.STRING) { // 字符串

			cellValue = cell.getStringCellValue();

//		} else if (cell.getCellType() == Cell.CELL_TYPE_BOOLEAN) { // Boolean
		} else if (cell.getCellType() == CellType.BOOLEAN) { // Boolean

			cellValue = cell.getBooleanCellValue();

//		} else if (cell.getCellType() == Cell.CELL_TYPE_FORMULA) {// 公式
		} else if (cell.getCellType() == CellType.FORMULA) {// 公式

			try{
				cellValue = String.valueOf(cell.getNumericCellValue());
			} catch(IllegalStateException e){
				
			}
			cellValue += "";

//		} else if (cell.getCellType() == Cell.CELL_TYPE_BLANK) {//空值
		} else if (cell.getCellType() == CellType.BLANK) {//空值

			cellValue = "";

//		} else if (cell.getCellType() == Cell.CELL_TYPE_FORMULA) {
		} else if (cell.getCellType() == CellType.FORMULA) {

			cellValue = cell.getCellFormula();

//		} else if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC) {
		} else if (cell.getCellType() == CellType.NUMERIC) {	

			cellValue = String.valueOf(cell.getNumericCellValue());

//		} else if (cell.getCellType() == Cell.CELL_TYPE_ERROR) {// 故障
			} else if (cell.getCellType() == CellType.ERROR) {// 故障

			throw new MyExceptionForRole("EXCEL【"+(cell.getRowIndex() + 1)+"】行：【"+(cell.getColumnIndex() + 1)+"】列无法解析！请处理后上传正确的EXCEL!");

		} else {
			//cellValue = "未知类型";
			throw new MyExceptionForRole("EXCEL【"+(cell.getRowIndex() + 1)+"】行：【"+(cell.getColumnIndex() + 1)+"】列无法解析！请处理后上传正确的EXCEL!");
		}
		
		return cellValue;
	}
	
	public static CellStyle getCellStyle(Workbook wb ,Cell cell) {
		
		CellStyle cs = null;
		if(cell == null) {
			cs = wb.createCellStyle();
			return cs;
		}
		
		if(cell instanceof HSSFCell) {
			
			cs = cell.getCellStyle();
			
		}else if(cell instanceof XSSFCell) {
			try {
				cs = cell.getCellStyle();
			}catch(Exception e) {
				cs = wb.createCellStyle();
			}
			
			/*
			XSSFCell xCell = (XSSFCell) cell;
			
			XSSFCellStyle xCellStyle = xCell.getCellStyle();
			
			cs.setVerticalAlignment(xCellStyle.getVerticalAlignment());
			cs.setAlignment(xCellStyle.getAlignment());
			cs.setWrapText(xCellStyle.getWrapText());
			cs.setFillForegroundColor(xCellStyle.getFillForegroundColor());//xCellStyle.getFillForegroundXSSFColor()
			cs.setLeftBorderColor(xCellStyle.getLeftBorderColor());//xCellStyle.getLeftBorderXSSFColor()
			cs.setBottomBorderColor(xCellStyle.getBottomBorderColor());
			cs.setRightBorderColor(xCellStyle.getRightBorderColor());
			cs.setTopBorderColor(xCellStyle.getTopBorderColor());
			cs.setFillBackgroundColor(xCellStyle.getFillBackgroundColor());
			cs.setDataFormat(xCellStyle.getDataFormat());
			cs.setHidden(xCellStyle.getHidden());
			cs.setRotation(xCellStyle.getRotation());
			cs.setLocked(xCellStyle.getLocked());
			cs.setIndention(xCellStyle.getIndention());
			cs.setBorderLeft(xCellStyle.getBorderLeft());
			cs.setBorderBottom(xCellStyle.getBorderBottom());
			cs.setFillPattern(xCellStyle.getFillPattern());
			cs.setBorderTop(xCellStyle.getBorderTop());
			cs.setBorderRight(xCellStyle.getBorderRight());
			*/
		}
		
		return cs;
	}
	
	/**
	 * 获取合并单元格的值
	 * @param sheet
	 * @param row
	 * @param column
	 * @return
	 */
	public static Object getMergedRegionValue(Sheet sheet, int row, int column) {

		int sheetMergeCount = sheet.getNumMergedRegions();

		for (int i = 0; i < sheetMergeCount; i++) {
			CellRangeAddress ca = sheet.getMergedRegion(i);
			int firstColumn = ca.getFirstColumn();
			int lastColumn = ca.getLastColumn();
			int firstRow = ca.getFirstRow();
			int lastRow = ca.getLastRow();

			if (row >= firstRow && row <= lastRow) {

				if (column >= firstColumn && column <= lastColumn) {
					Row fRow = sheet.getRow(firstRow);
					Cell fCell = fRow.getCell(firstColumn);
					return getCellValue(fCell);
				}
			}
		}

		return null;
	}
	
	public static class ExcelCell{
		
		private int rowIndex;
		
		private int columnIndex;
		
		private Object value;
		
		private ExcelCellStyle style;
		
		private Merge merge;

		public int getRowIndex() {
			return rowIndex;
		}

		public void setRowIndex(int rowIndex) {
			this.rowIndex = rowIndex;
		}

		public int getColumnIndex() {
			return columnIndex;
		}

		public void setColumnIndex(int columnIndex) {
			this.columnIndex = columnIndex;
		}

		public Object getValue() {
			return value;
		}

		public void setValue(Object value) {
			this.value = value;
		}

		public ExcelCellStyle getStyle() {
			return style;
		}

		public void setStyle(ExcelCellStyle style) {
			this.style = style;
		}

		public Merge getMerge() {
			return merge;
		}

		public void setMerge(Merge merge) {
			this.merge = merge;
		}
	}
	
	public static class ExcelCellStyle {
		
		public static final String data_format_money = ",###.00";//钱的默认显示格式
		public static final String data_format_integer = "#";//整数
		public static final String data_format_double = "0.00";//保留两位小数
		
//		private short verticalAlignment;
		private VerticalAlignment verticalAlignment;
//		private short index;
//		private short alignment;
		private HorizontalAlignment alignment;
		private boolean wrapText;
//		private String dataFormatString;
		private short fillForegroundColor;
		private short leftBorderColor;
		private short bottomBorderColor;
		private short rightBorderColor;
//		private Map<String ,Object> fillForegroundColorColor;  //{"index":22,"hexString":"C0C0:C0C0:C0C0","triplet":[192,192,192]}
		private short topBorderColor;
		private short fillBackgroundColor;
//		private Map<String ,Object> fillBackgroundColorColor;  //{"index":64,"hexString":"0:0:0","triplet":[0,0,0]}
		private short dataFormat;
//		private short fontIndex;
		private boolean hidden;
		private short rotation;
		private boolean locked;
		private short indention;
//		private short borderLeft;
//		private short borderBottom;
//		private short fillPattern;
//		private short borderTop;
//		private short borderRight;
		private BorderStyle borderLeft;
		private BorderStyle borderBottom;
		private FillPatternType fillPattern;
		private BorderStyle borderTop;
		private BorderStyle borderRight;
//		private String userStyleName;
//		private String parentStyle;
		
		//单元格高和宽
		private Integer width;
		private Short height;

		public ExcelCellStyle() {
			
		}
		
		public CellStyle toCellStyle(Workbook wb) {
			
			CellStyle cs = wb.createCellStyle();
			
			cs.setVerticalAlignment(this.verticalAlignment);
			cs.setAlignment(this.alignment);
			cs.setWrapText(this.wrapText);
			cs.setFillForegroundColor(this.fillForegroundColor);
			cs.setLeftBorderColor(this.leftBorderColor);
			cs.setBottomBorderColor(this.bottomBorderColor);
			cs.setRightBorderColor(this.rightBorderColor);
			cs.setTopBorderColor(this.topBorderColor);
			cs.setFillBackgroundColor(this.fillBackgroundColor);
			cs.setDataFormat(this.dataFormat);
			cs.setHidden(this.hidden);
			cs.setRotation(this.rotation);
			cs.setLocked(this.locked);
			cs.setIndention(this.indention);
			cs.setBorderLeft(this.borderLeft);
			cs.setBorderBottom(this.borderBottom);
			cs.setFillPattern(this.fillPattern);
			cs.setBorderTop(this.borderTop);
			cs.setBorderRight(this.borderRight);
			
			return cs;
		}

		public static ExcelCellStyle toExcelCellStyle(CellStyle cellStyle) {
			
			ExcelCellStyle ecs = new ExcelCellStyle();
			
			ecs.setVerticalAlignment(cellStyle.getVerticalAlignment());
			ecs.setAlignment(cellStyle.getAlignment());
			ecs.setWrapText(cellStyle.getWrapText());
			ecs.setFillForegroundColor(cellStyle.getFillForegroundColor());
			ecs.setLeftBorderColor(cellStyle.getLeftBorderColor());
			ecs.setBottomBorderColor(cellStyle.getBottomBorderColor());
			ecs.setRightBorderColor(cellStyle.getRightBorderColor());
			ecs.setTopBorderColor(cellStyle.getTopBorderColor());
			ecs.setFillBackgroundColor(cellStyle.getFillBackgroundColor());
			ecs.setDataFormat(cellStyle.getDataFormat());
			ecs.setHidden(cellStyle.getHidden());
			ecs.setRotation(cellStyle.getRotation());
			ecs.setLocked(cellStyle.getLocked());
			ecs.setIndention(cellStyle.getIndention());
			ecs.setBorderLeft(cellStyle.getBorderLeft());
			ecs.setBorderBottom(cellStyle.getBorderBottom());
			ecs.setFillPattern(cellStyle.getFillPattern());
			ecs.setBorderTop(cellStyle.getBorderTop());
			ecs.setBorderRight(cellStyle.getBorderRight());
			
			return ecs;
		}


		public boolean isWrapText() {
			return wrapText;
		}

		public void setWrapText(boolean wrapText) {
			this.wrapText = wrapText;
		}

		public short getFillForegroundColor() {
			return fillForegroundColor;
		}

		public void setFillForegroundColor(short fillForegroundColor) {
			this.fillForegroundColor = fillForegroundColor;
		}

		public short getLeftBorderColor() {
			return leftBorderColor;
		}

		public void setLeftBorderColor(short leftBorderColor) {
			this.leftBorderColor = leftBorderColor;
		}

		public short getBottomBorderColor() {
			return bottomBorderColor;
		}

		public void setBottomBorderColor(short bottomBorderColor) {
			this.bottomBorderColor = bottomBorderColor;
		}

		public short getRightBorderColor() {
			return rightBorderColor;
		}

		public void setRightBorderColor(short rightBorderColor) {
			this.rightBorderColor = rightBorderColor;
		}

		public short getTopBorderColor() {
			return topBorderColor;
		}

		public void setTopBorderColor(short topBorderColor) {
			this.topBorderColor = topBorderColor;
		}

		public short getFillBackgroundColor() {
			return fillBackgroundColor;
		}

		public void setFillBackgroundColor(short fillBackgroundColor) {
			this.fillBackgroundColor = fillBackgroundColor;
		}

		public short getDataFormat() {
			return dataFormat;
		}

		public void setDataFormat(short dataFormat) {
			this.dataFormat = dataFormat;
		}

		public boolean isHidden() {
			return hidden;
		}

		public void setHidden(boolean hidden) {
			this.hidden = hidden;
		}

		public short getRotation() {
			return rotation;
		}

		public void setRotation(short rotation) {
			this.rotation = rotation;
		}

		public boolean isLocked() {
			return locked;
		}

		public void setLocked(boolean locked) {
			this.locked = locked;
		}

		public short getIndention() {
			return indention;
		}

		public void setIndention(short indention) {
			this.indention = indention;
		}

		public VerticalAlignment getVerticalAlignment() {
			return verticalAlignment;
		}

		public void setVerticalAlignment(VerticalAlignment verticalAlignment) {
			this.verticalAlignment = verticalAlignment;
		}

		public HorizontalAlignment getAlignment() {
			return alignment;
		}

		public void setAlignment(HorizontalAlignment alignment) {
			this.alignment = alignment;
		}


		public BorderStyle getBorderLeft() {
			return borderLeft;
		}

		public void setBorderLeft(BorderStyle borderLeft) {
			this.borderLeft = borderLeft;
		}

		public BorderStyle getBorderBottom() {
			return borderBottom;
		}

		public void setBorderBottom(BorderStyle borderBottom) {
			this.borderBottom = borderBottom;
		}

		public FillPatternType getFillPattern() {
			return fillPattern;
		}

		public void setFillPattern(FillPatternType fillPattern) {
			this.fillPattern = fillPattern;
		}

		public BorderStyle getBorderTop() {
			return borderTop;
		}

		public void setBorderTop(BorderStyle borderTop) {
			this.borderTop = borderTop;
		}

		public BorderStyle getBorderRight() {
			return borderRight;
		}

		public void setBorderRight(BorderStyle borderRight) {
			this.borderRight = borderRight;
		}

		public Integer getWidth() {
			return width;
		}

		public void setWidth(Integer width) {
			this.width = width;
		}

		public Short getHeight() {
			return height;
		}

		public void setHeight(Short height) {
			this.height = height;
		}
	}

	/**
	 * 检测合并列是否需要填充数据
	 * @param titleList
	 * @param dataList
	 * @param mergeList
	 * @param rowShouldIndex
	 * @param colDataIndex
	 * @return
	 */
	private static boolean inputValueForMergeCell(List<F_Title> titleList ,List<List<Object>> dataList ,List<Merge> mergeList ,int rowDataIndex ,int colDataIndex) {
		
		F_Title title = titleList.get(colDataIndex);
		
		//不显示数据
		if(title.getIsShow() == 0) {
			return false;
		}
		
		//不合并
		if(title.getIsMerge() == 0) {
			return true;
		}

		int mergeTitleIndex = getInListIndexForTitle(title.getMergeType(), titleList); //合并参考列 位于 title 中的下标
		
		if(mergeTitleIndex != -1 && rowDataIndex > 0) { //判断下标是否有效 
			
			List<Object> rowData = dataList.get(rowDataIndex);
			
			Object currentMerge = rowData.get(mergeTitleIndex); //根据合并参考列下标获取到该位置的值
			Object currentMergeValue = currentMerge==null?"":currentMerge;
			
			Object currentCell = rowData.get(colDataIndex);
			Object currentCellValue = currentCell==null?"":currentCell;
			
			Object tempMerge = dataList.get(rowDataIndex - 1).get(mergeTitleIndex);
			Object tempMergeValue = tempMerge==null?"":tempMerge;
			
			Object tempCell = dataList.get(rowDataIndex - 1).get(colDataIndex);
			Object tempCellValue = tempCell==null?"":tempCell;
			
			boolean flagMerge = tempMergeValue.equals(currentMergeValue) && currentCellValue.equals(tempCellValue);
			if(flagMerge) {
				return false;
			}else {
				return true;
			}
		}
		
		return true;
	}
	
	private static boolean isHttpUrl(String path) {
		
		if(path.startsWith("http")) {
			return true;
		}
        
        return false;
	}
	
	public static boolean isXlsx(String path) {
		if(path.matches("^.+\\.(?i)(xlsx)$")){//2007版excel
			return true;
		}
		return false;
	}
	
	public static void main(String[] args) {
		
		//测试读取excel
//		String url = "https://file.maytek.cn/workOrder/20190911/f_size67072/Fr_SHjuuDhWHRcJVQEpLYO0BwxTl.xls";
		
		//String url = "https://file.maytek.cn/workOrder/20190925/f_size16133/Fil-HDzbX5lWbHsovcQjFQhJ17yE.xlsx";
		
		//List<List<ExcelCell>> appendCellList = readExcel(url);
		
		String fileName = "test.xls";
		int limitDataRow = 7;
		int limitDataCol = 2;
		
		List<F_Title> titleList = new ArrayList<F_Title>();
		
		for (int i = 0; i < 7; i++) {
			F_Title ft = new F_Title();
			ft.setAlias("标题_" + i);
			ft.setIsMerge(1);
			ft.setIsShow(1);
			ft.setMergeType(i==1||i==0?"标题_1":"");
			ft.setWidth(20 * 1 * 256);
			if(i % 2 == 0) {
				ft.setRichText(true);
			}else{
				ft.setRichText(false);
			}
			
			titleList.add(ft);
		}
		
		List<List<Object>> dataList = new ArrayList<List<Object>>();
		for (double i = 0; i < 10; i++) {
			List<Object> data = new ArrayList<Object>();
			for (int j = 0; j < 7; j++) {
				double k = i;
				if(j <= 1) {
					k = i%2!=0?i-1:i;
				}
				
				if(i == 4 && j != 0) {
					data.add(k / j);
				}else {
					data.add("行" + k +"列" + j);
				}
			}
			dataList.add(data);
		}
		
		String path = "E:\\Temp\\JAVA_TEST\\excel\\test.xlsx";
		
		//boolean flag = exportExcel(fileName, limitDataRow, limitDataCol, appendCellList, titleList, dataList, path);
		//boolean flag = exportExcel(fileName, titleList, dataList, path);
		String sourceExcel = "E:\\Temp\\JAVA_TEST\\excel\\川航_机票名单.xlsx";
		//String sourceExcel = "https://file.maytek.cn/default/2043/A665A8806E8F5B2495D9BA89C2C50B2D/(PJ-191013-A)胜安最出票模板.xls";
		
		boolean flag = exportExcelNotShowTitle(sourceExcel, fileName, limitDataRow, limitDataCol, titleList, dataList, path);
		
		System.out.println(flag);
	}
}

