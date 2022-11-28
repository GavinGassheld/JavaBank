package com.example.demo.user;

import com.github.cliftonlabs.json_simple.JsonObject;

public class User {
    private String name;
    private int id;
    private String personalID;
    // private double assets;
    private String password;
    private String transaction_log;
    private String myAccounts;
    private String otherAccounts;

    public User(int id, String name, String personalID, String password, String transaction_log, String myAccounts, String otherAccounts){
        this.id = id;
        this.name = name;
        this.personalID = personalID;
        this.password = password;
        // this.assets = assets;
        this.transaction_log = transaction_log;
        this.myAccounts = myAccounts;
        this.otherAccounts = otherAccounts;
    }

    public int getID() {
        return id;
    }
    public String getName() {
        return name;
    }
    public String getPersonalID() {
        return personalID;
    }
    public String getPassword() {
        return password;
    }
    public double getAssets() {
        double assetCounter = 0;
        JsonObject accountsJson = new JsonObject();
        accountsJson = formatJson(accountsJson, myAccounts);
        for (Object account : accountsJson.values()) {
            // JsonObject accountJson = new JsonObject();
            JsonObject accountJson = (JsonObject) account;
            // accountJson = formatSimpleJson(accountJson, (String) account);
            assetCounter += Double.valueOf((String) accountJson.get("assets"));
        }
        return assetCounter;
    }

    public boolean withdraw(double amount, int accountId) {
        // double accountAssets = Integer.valueOf(myAccounts.split(String.valueOf(accountId))[1].split("asset")[1].replaceFirst("\":", "").split("\"")[0]);
        JsonObject accountsJson = new JsonObject();
        accountsJson = formatJson(accountsJson, myAccounts);
        JsonObject accountJson = (JsonObject) accountsJson.get(String.valueOf(accountId));
        // JsonObject accountJson = new JsonObject();
        // accountJson = formatSimpleJson(accountJson, account);
        double accountAssets = Double.valueOf((String) accountJson.get("assets"));

        if (accountAssets - amount >= 0) {
            accountJson.replace("assets", accountAssets-amount);
            // accountsJson.replace(String.valueOf(accountId), accountJson.toJson());
            accountsJson.remove(String.valueOf(accountId));
            accountsJson.put(String.valueOf(accountId), accountJson);
            setMyAccounts(accountsJson.toJson());
            return true;
        }
        return false;
    }

    public boolean deposit(double amount, int accountId) {
        JsonObject accountsJson = new JsonObject();
        accountsJson = formatJson(accountsJson, myAccounts);
        JsonObject accountJson = (JsonObject) accountsJson.get(String.valueOf(accountId));
        // JsonObject accountJson = new JsonObject();
        // accountJson = formatSimpleJson(accountJson, account);
        double accountAssets = Double.valueOf((String) accountJson.get("assets"));
        accountJson.replace("assets", accountAssets+amount);
        // accountsJson.replace(String.valueOf(accountId), accountJson.toJson());
        accountsJson.remove(String.valueOf(accountId));
        accountsJson.put(String.valueOf(accountId), accountJson);
        setMyAccounts(accountsJson.toJson());
        return true;
    }

    public String getTransactionLog() {
        return transaction_log;
    }

    public void setTransactionLog(String transaction_log) {
        this.transaction_log = transaction_log;
    }

    public String getMyAccounts(){
        return myAccounts;
    }

    public void setMyAccounts(String myAccounts) {
        this.myAccounts = myAccounts;
    }

    public String getOtherAccounts() {
        return otherAccounts;
    }

    public void setOtherAccounts(String otherAccounts) {
        this.otherAccounts = otherAccounts;
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

    public JsonObject formatSimpleJson(JsonObject json, String string) {
        if (string != null) {
            String[] split = string.replace("{", "").replace("}", "").replace("\"","").split(",");
            for (int i = 0; i < split.length; i++) {
                String[] split2 = split[i].split(":");
                json.put(split2[0], split2[1]);
            }
        }
        return json;
    }

    public JsonObject getUserJson() {
        JsonObject json = new JsonObject();
        json.put("id", id);
        json.put("name", name);
        json.put("personalID", personalID);
        json.put("assets", getAssets());
        JsonObject transactionLogJson = new JsonObject();
        if (transaction_log != null) {
            transactionLogJson = formatJson(transactionLogJson, transaction_log);
        }
        json.put("transaction_log", transactionLogJson);
        JsonObject otherAccountsJson = new JsonObject();
        if (otherAccounts != null) {
            otherAccountsJson = formatJson(otherAccountsJson, otherAccounts);
        }
        json.put("otherAccounts", otherAccountsJson);
        JsonObject myAccountsJson = new JsonObject();
        if (myAccounts != null) {
            myAccountsJson = formatJson(myAccountsJson, myAccounts);
        }
        json.put("myAccounts", myAccountsJson);
        return json;
    }
}
