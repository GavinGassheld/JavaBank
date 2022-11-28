package com.example.demo.restservice;
import java.sql.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.Random;

// import org.springframework.boot.autoconfigure.jsonb.JsonbAutoConfiguration;

import com.github.cliftonlabs.json_simple.JsonObject;
import com.example.demo.user.User;

public class Api {
    private Statement sqlSt = null;
    private ResultSet result = null;
    private Connection dbConnect;
    private Random rand = new Random();

    public Api() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String dbURL = "jdbc:mysql://localhost:3306/accounts";
            dbConnect = DriverManager.getConnection(dbURL, "root", "root");
        } catch (ClassNotFoundException e) {
            Logger.getLogger(Api.class.getName()).log(Level.SEVERE, null, e);
            System.out.println("Class not found.");
        } catch (SQLException e) {
            Logger.getLogger(Api.class.getName()).log(Level.SEVERE, null, e);
            System.out.println("error in SQL.");
        }
    }

    public User getUser(String personalID) {
        User user = null;
        try {
            sqlSt = dbConnect.createStatement();
            result = sqlSt.executeQuery("select * from accounts where personalID = " + personalID);
            if (result.next() != false) {
                user = new User(result.getInt("id"), result.getString("name"),result.getString("personalID"),result.getString("password"),result.getString("transaction_log"), result.getString("myAccounts"), result.getString("otherAccounts"));
            }
            sqlSt.close();
        } catch (SQLException e) {
            System.out.println("SQLException: " + e);
        }
        return user;
    }

    /* 
     * Bad function that will fail if there 
     * are multiple people in the database 
     * with the same name
     */
    public User getUserByName(String name) {
        User user = null;
        try {
            sqlSt = dbConnect.createStatement();
            result = sqlSt.executeQuery("select * from accounts where name = \"" + name + "\"");
            if (result.next() != false) {
                user = new User(result.getInt("id"), result.getString("name"),result.getString("personalID"),result.getString("password"),result.getString("transaction_log"), result.getString("myAccounts"), result.getString("otherAccounts"));
            }
            sqlSt.close();
        } catch (SQLException e) {
            System.out.println("getByUserName - SQLException: " + e);
        }
        return user;
    }

    public User getUser(int id) {
        User user = null;
        try {
            sqlSt = dbConnect.createStatement();
            result = sqlSt.executeQuery("select * from accounts where id = " + id);
            if (result.next() != false) {
                user = new User(result.getInt("id"), result.getString("name"),result.getString("personalID"),result.getString("password"), result.getString("transaction_log"), result.getString("myAccounts"), result.getString("otherAccounts"));
            }
            sqlSt.close();
        } catch (SQLException e) {
            System.out.println("getUser - SQLException: " + e);
        }
        return user;
    }

    public User createUser(String name, String personalID, String password) {
        User user = null;
        try {
            PreparedStatement statement = dbConnect.prepareStatement("insert into accounts (name, personalID, password, assets) values (?, ?, ?, 0)");
            statement.setString(1, name);
            statement.setString(2, personalID);
            statement.setString(3, password);
            statement.executeUpdate();
            user = getUser(personalID);
        } catch (SQLException e) {
            System.out.println("createUer - SQLException: " + e);
        }
        return user;
    }

    public boolean setAssets(double assets, int id) {
        try {
            sqlSt = dbConnect.createStatement();
            sqlSt.executeUpdate("update accounts set assets = " + assets + " where id = " + id);
            sqlSt.close();
        } catch (SQLException e) {
            System.out.println("setAssets - SQLException: " + e);
            return false;
        }
        return true;
    }

    public String setTransaction(int id, String date, double amount, int fromAccountId, int toAccountId, String note) {
        try {
            sqlSt = dbConnect.createStatement();
            result = sqlSt.executeQuery("select transaction_log from accounts where id = " + id);
            result.next();
            JsonObject transaction_log = new JsonObject();
            String transaction_log_string = result.getString("transaction_log");
            JsonObject json_value = new JsonObject();
            json_value.put("amount", amount);
            json_value.put("id", id);
            json_value.put("note", note);
            json_value.put("fromAccount", fromAccountId);
            json_value.put("toAccount", toAccountId);
            if (transaction_log_string != null) {
                transaction_log = formatJson(transaction_log, transaction_log_string);
            } 
            transaction_log.put(date, json_value);
            PreparedStatement statement = dbConnect.prepareStatement("update accounts set transaction_log = ? where id = " + id);
            String transaction_log_return = transaction_log.toJson();
            statement.setString(1, transaction_log_return);
            statement.executeUpdate();
            // sqlSt.executeUpdate(statement); 
            sqlSt.close();
            return transaction_log_return;
        } catch (SQLException e) {
            System.out.println("setTransaction - SQLException: " + e);
            return null;
        }
    }

    public boolean setMyAccounts(String myAccounts, int id) {
        try {
            PreparedStatement statement = dbConnect.prepareStatement("update accounts set myAccounts = ? where id = " + id);
            // JsonObject json = new JsonObject();
            // json = formatJson(json, myAccounts);
            statement.setString(1, myAccounts);
            statement.executeUpdate(); 
            return true;
        } catch (SQLException e) {
            System.out.println("setMyAccounts - SQLException: " + e);
            return false;
        }
    }

    public boolean findAccount(String otherAccounts, String name, int otherId) {
        User user = getUserByName(name);
        if (user != null) {
            if(user.getMyAccounts().contains(String.valueOf(otherId))) {
                // account present in database
                if (otherAccounts != null) {
                    JsonObject otherAccountsJson = new JsonObject();
                    otherAccountsJson = formatJson(otherAccountsJson, otherAccounts);
                    if (otherAccountsJson.get(String.valueOf(otherId)) != null){
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }

    public boolean findMyAccounts(String myAccounts, String accountName) {
        if (myAccounts == null) {
            return false;
        }
        return myAccounts.replace("\"","").contains("accountName:" + accountName);
    }

    public String setMyAccounts(int id, String accountName, String myAccounts) {
        try {
            JsonObject myAccountsJson = new JsonObject();
            JsonObject jsonValue = new JsonObject();
            int accountNumber = rand.nextInt(100000);
            jsonValue.put("accountNumber", accountNumber);
            jsonValue.put("accountName", accountName);
            jsonValue.put("assets", 0);
            if (myAccounts != null) {
                myAccountsJson = formatJson(myAccountsJson, myAccounts);
            } 
            myAccountsJson.put(String.valueOf(accountNumber), jsonValue);
            
            PreparedStatement statement = dbConnect.prepareStatement("update accounts set myAccounts = ? where id = " + id);
            String myAccounts_return = myAccountsJson.toJson();
            statement.setString(1, myAccounts_return);
            statement.executeUpdate();
            // sqlSt.executeUpdate(statement); 
            return myAccounts_return;
        } catch (SQLException e) {
            System.out.println("setTransaction - SQLException: " + e);
            return null;
        }
    }

    public String setOtherAccounts(int id, int accountId, String name) {
        try {
            sqlSt = dbConnect.createStatement();
            result = sqlSt.executeQuery("select otherAccounts from accounts where id = " + id);
            result.next();
            JsonObject otherAccounts = new JsonObject();
            String otherAccounts_string = result.getString("otherAccounts");
            JsonObject jsonValue = new JsonObject();
            jsonValue.put("id", accountId);
            jsonValue.put("name", name);
            if (otherAccounts_string != null) {
                otherAccounts = formatJson(otherAccounts, otherAccounts_string);
            } 
            otherAccounts.put(String.valueOf(accountId), jsonValue);
            
            PreparedStatement statement = dbConnect.prepareStatement("update accounts set otherAccounts = ? where id = " + id);
            String otherAccounts_return = otherAccounts.toJson();
            statement.setString(1, otherAccounts_return);
            statement.executeUpdate();
            sqlSt.close();
            return otherAccounts_return;
        } catch (SQLException e) {
            System.out.println("setTransaction - SQLException: " + e);
            return null;
        }
    }

    public JsonObject formatJson(JsonObject json, String string) {
        if (string != null) {
            string = string.replace(":{", "SPLIT").replace("},", "SPLIT").replace("}}", "").replace("\"", "").replace("{","");
            String[] string_split = string.split("SPLIT");
            for (int i = 0; i < string_split.length-1; i += 2){
                JsonObject jsonValue = new JsonObject();
                String[] jsonValues = string_split[i+1].split(",");
                for (int j = 0; j < jsonValues.length; j++){
                    String[] innerKeyValue = jsonValues[j].split(":");
                    jsonValue.put(innerKeyValue[0], innerKeyValue[1]);
                }
                json.put(string_split[i], jsonValue);
            }
        }
        return json;
    }
}