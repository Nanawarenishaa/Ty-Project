package jdbcPractice;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class day3 {
    public static void main(String[] args) {
        try {
            
            Class.forName("com.mysql.cj.jdbc.Driver");

            
            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/jdbcPracticeDB", "root", "ahsin@317");
            String sql = "{call getEmpDetails(?,?,?)}";  

           
            CallableStatement cst = con.prepareCall(sql);

            int empId = 1; 
            double incrementAmt = 500.00; 

            cst.setInt(1, empId);  
            cst.setDouble(2, incrementAmt); 

           
            cst.registerOutParameter(3, java.sql.Types.DOUBLE);


            cst.execute();

            double updatedSalary = cst.getDouble(3);

           
            System.out.println("Update salary successfully!");
            System.out.println("Updated Salary after increment: " + updatedSalary);

           
            Statement stmt = con.createStatement();
            String query = "SELECT emp_id, emp_Name, empSalary FROM employees WHERE emp_id = " + empId;
            ResultSet rs = stmt.executeQuery(query);

          
            System.out.println("\nEmployee Details:");
            System.out.printf("%-10s %-20s %-15s\n", "Employee ID", "Employee Name", "Employee Salary");
            System.out.println("----------------------------------------------------------");

           
            while (rs.next()) {
                int id = rs.getInt("emp_id");
                String name = rs.getString("emp_Name");
                double salary = rs.getDouble("empSalary");

            
                System.out.printf("%-10d %-20s %-15.2f\n", id, name, salary);
            }

            rs.close();
            stmt.close();
            cst.close();
            con.close();

        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
