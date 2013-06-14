package presentation.webgui.appservlet;

import org.apache.log4j.Logger;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * The main Startup (?) Servlet for an application server port of the GUI.
 */
public class EngineStartup extends HttpServlet {
	
    private Logger LOG;
    private String logLevel = "info";
    private ServletContext context;

    /**
     * Constructor
     */
    public EngineStartup() {
    }


    /**
     * doGet method of the Servlet. Handles http GET requests
     */
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html");

        String nextJSP = "/main/main.jsp";
        RequestDispatcher dispatcher = getServletContext().getRequestDispatcher(nextJSP);
        dispatcher.forward(req,resp);

    }

    /**
     * The doPost method of the Servlet. Handles http POST requests. Internally is uses a call to the doGet method
     * so that both will have the same functionality.
     */
	 @Override
	 protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		doGet(request,response);
	}
	 
	 
    /**
     * The init method of the Servlet. Performs initialisation tasks. Here is were the UserPeer is instantiated
     */
    @Override
    public void init(ServletConfig servletConfig) throws ServletException {
        super.init(servletConfig);
        context = servletConfig.getServletContext();
		initLogger(logLevel);
		LOG.info("Startup");
        //Common.getCommon().setAppContext(context);
        // 
        //ConfigDetails.getConfigDetails(context.getRealPath("/"));
        long startupEpoch = System.currentTimeMillis() ; // /1000;
        // Store in the Context
        context.setAttribute("startupEpoch", startupEpoch);
    }


    /**
     * The destroy method of the Servlet. It is called to gracefully stop the servlet
     */
    @Override
    public void destroy() {
        LOG.info("Destroying Servlet");
    }

    private void initLogger(String ll) {
        LOG = Logger.getLogger(this.getClass());
    }

}

