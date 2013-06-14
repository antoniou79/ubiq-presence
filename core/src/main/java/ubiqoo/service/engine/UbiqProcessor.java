package ubiqoo.service.engine;


import org.apache.log4j.Logger;

public class UbiqProcessor {


    private Logger log;
    private String logLevel = "info";
	private static UbiqProcessor _instance = null;
	
	private UbiqProcessor() {
        log = Logger.getLogger(this.getClass());
        log.info("Instantiating Engine!");
	}
	
	public static UbiqProcessor getUbiqProcessor() {
		if(_instance == null) {
			_instance = new UbiqProcessor();
		}
		return _instance;
	}

}