package SRAASApp;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/InsertUserServlet")
public class InsertUserServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // Database credentials
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/sraasdb";
    private static final String JDBC_USER = "root";  // Change if needed
    private static final String JDBC_PASSWORD = "ahsin@3765";  // Change if needed

    public InsertUserServlet() {
        super();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter pw = response.getWriter();

        // Get form data
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        try {
            // Load MySQL driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Establish Connection
            Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);

            // SQL Insert Query
            String sql = "INSERT INTO users (username, password) VALUES (?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            stmt.setString(2, password);

            // Execute Insert
            int rowsInserted = stmt.executeUpdate();
            if (rowsInserted > 0) {
                pw.println("<h3>User Registered Successfully!</h3>");
                pw.println("<a href='insertUser.html'>Register Another User</a>");
            } else {
                pw.println("<h3>Failed to register user!</h3>");
            }

            // Close resources
            stmt.close();
            conn.close();

        } catch (Exception e) {
            pw.println("<p style='color:red;'>Error: " + e.getMessage() + "</p>");
            e.printStackTrace();
        }
    }
}
