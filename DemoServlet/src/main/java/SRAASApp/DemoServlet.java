package SRAASApp;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/DemoServlet")
public class DemoServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // Database credentials
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/sraasdb";
    private static final String JDBC_USER = "root";  // Change if needed
    private static final String JDBC_PASSWORD = "ahsin@3765";  // Change if needed

    public DemoServlet() {
        super();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter pw = response.getWriter();

        try {
            // Load MySQL driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Establish Connection
            Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);

            // Execute SQL query
            String sql = "SELECT * FROM users";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();

            // Display users in an HTML table
            pw.println("<html><head><title>Users List</title></head><body>");
            pw.println("<h2>Users List</h2>");
            pw.println("<table border='1'><tr><th>User ID</th><th>Username</th><th>Password</th></tr>");

            while (rs.next()) {
                pw.println("<tr><td>" + rs.getInt("userID") + "</td><td>" + rs.getString("username") + "</td><td>" + rs.getString("password") + "</td></tr>");
            }

            pw.println("</table>");
            pw.println("</body></html>");

            // Close resources
            rs.close();
            stmt.close();
            conn.close();

        } catch (Exception e) {
            pw.println("<p style='color:red;'>Error: " + e.getMessage() + "</p>");
            e.printStackTrace();
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }
}
