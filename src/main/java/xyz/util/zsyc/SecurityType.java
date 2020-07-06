package xyz.util.zsyc;

public enum SecurityType {

	/**
	 * 机构应用/机构接口
	 */
	POSSESSOR("possessor") ,
	/**
	 * 平台应用/平台接口
	 */
	PLATFORM("platform") ,
	/**
	 * 开放接口（仅限）
	 */
	OPEN("open") ,
	/**
	 * 直线代理
	 */
	PROXY("proxy");
	
	private String type;
	SecurityType(String type){
		this.type = type;
	}
	
	@Override
	public String toString() {
		return this.type;
	}
	
	public boolean eq(String type) {
		return this.type.equals(type);
	}
}
