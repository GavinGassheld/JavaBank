package com.example.demo.restservice;

import com.github.cliftonlabs.json_simple.JsonObject;

// import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.user.User;

@RestController
@CrossOrigin(origins = "*")
public class Controller {

	private Api api = new Api();

	@PostMapping("/getuser")
	public JsonObject getUser(@RequestBody JsonObject body) { 
		User user = api.getUser(Integer.valueOf((String) body.get("id")));
		if (user != null) {
			return user.getUserJson();
		}
		return null;
	}

	@PostMapping("/signin")
	public JsonObject signIn(@RequestBody JsonObject body) {
		String personalID = (String) body.get("personalID");
		String password = (String) body.get("password");
		User user = api.getUser(personalID);
		JsonObject userJson;
		if (user != null){
			if (user.getPassword().equals(password)) {
				userJson = user.getUserJson();
				userJson.put("success", true);
				return userJson;
			}
		}
		userJson = new JsonObject();
		userJson.put("success", false);
		return userJson;
	}

	@PostMapping("/createnewaccount")
	public JsonObject createNewAccount(@RequestBody JsonObject body) {
		String personalID = (String) body.get("personalID");
		String password = (String) body.get("password");
		String name = (String) body.get("name");
		User user = api.createUser(name, personalID, password);
		JsonObject userJson;
		if (user != null){
			userJson = user.getUserJson();
			userJson.put("success", true);
			return userJson;
		}
		userJson = new JsonObject();
		userJson.put("success", false);
		return userJson;
	}

	@PostMapping("/addmyaccount")
	public JsonObject addMyAccount(@RequestBody JsonObject body) {
		int id = (int) body.get("id");
		String accountName = (String) body.get("accountName");
		User user = api.getUser(id);
		JsonObject json;
		if (user != null) {
			if (!api.findMyAccounts(user.getMyAccounts(), accountName)) {
				String myAccounts = api.setMyAccounts(id, accountName, user.getMyAccounts());
				user.setMyAccounts(myAccounts);
				json = user.getUserJson();
				json.put("success", true);
				return json;
			}
		}
		json = new JsonObject();
		json.put("success", false);
		json.put("msg","account with that name already exists.");
		json.put("id", id);
		return json;
	}

	@PostMapping("/withdraw")
	public JsonObject withdraw(@RequestBody JsonObject body) {
		double amount = Double.valueOf((String) body.get("amount"));
		String datetime = (String) body.get("datetime");
		int accountNumber = Integer.valueOf((String) body.get("accountNumber"));
		int id = (int) body.get("id");
		User user = api.getUser(id);
		JsonObject json;
		if (user != null) {
			if (user.withdraw(amount, accountNumber)) {
				if(api.setMyAccounts(user.getMyAccounts(), id)) {
					String transaction_log = api.setTransaction(id, datetime, amount, accountNumber, 0, "withdraw");
					user.setTransactionLog(transaction_log);
					json = user.getUserJson();
					json.put("success", true);
					return json;
				}
			}
		}
		json = new JsonObject();
		json.put("success", false);
		json.put("id",id);
		return json;
	}
	
	@PostMapping("/deposit")
	public JsonObject deposit(@RequestBody JsonObject body) {
		double amount = Double.valueOf((String) body.get("amount"));
		String datetime = (String) body.get("datetime");
		int accountNumber = Integer.valueOf((String) body.get("accountNumber"));
		int id = (int) body.get("id");
		User user = api.getUser(id);
		JsonObject json;
		if (user != null) {
			if (user.deposit(amount, accountNumber)) {
				if(api.setMyAccounts(user.getMyAccounts(), id)) {
					String transaction_log = api.setTransaction(id, datetime, amount, 0, accountNumber, "deposit");
					user.setTransactionLog(transaction_log);
					json = user.getUserJson();
					json.put("success", true);
					return json;
				}
			}
		}
		json = new JsonObject();
		json.put("success", false);
		json.put("id", id);
		return json;
	}

	@PostMapping("/maketransfer")
	public JsonObject makeTransfer(@RequestBody JsonObject body){
		String datetime = (String) body.get("datetime");
		int fromId = Integer.valueOf((String) body.get("fromId"));
		int fromAccountId = Integer.valueOf((String) body.get("fromAccountId"));
		int toAccountId = Integer.valueOf((String) body.get("toAccountId"));
		String toName = (String) body.get("toName");
		double amount = Double.valueOf((String) body.get("amount"));
		User fromUser = api.getUser(fromId);
		User toUser = api.getUserByName(toName);
		JsonObject json;
		if (fromUser != null && toUser != null) {
			if (fromUser.withdraw(amount, fromAccountId)) {
				toUser.deposit(amount, toAccountId);
				if(api.setMyAccounts(fromUser.getMyAccounts(), fromId) && api.setMyAccounts(toUser.getMyAccounts(), toUser.getID())){
					String fromTransactionLog = api.setTransaction(fromId, datetime, amount, fromAccountId, toAccountId, "outgoing");
					String toTransactionLog = api.setTransaction(toUser.getID(), datetime, amount, fromAccountId, toAccountId, "incoming");
					fromUser.setTransactionLog(fromTransactionLog);
					toUser.setTransactionLog(toTransactionLog);
					json = fromUser.getUserJson();
					json.put("success", true);
					return json;
				}
			}
		}
		json = new JsonObject();
		json.put("success", false);
		json.put("id", fromId);
		return json;
	}

	@PostMapping("/maketransfermyaccounts")
	public JsonObject makeTransferMyAccounts(@RequestBody JsonObject body){
		String datetime = (String) body.get("datetime");
		int id = Integer.valueOf((String) body.get("id"));
		int fromAccountId = Integer.valueOf((String) body.get("fromAccountId"));
		int toAccountId = Integer.valueOf((String) body.get("toAccountId"));
		double amount = Double.valueOf((String) body.get("amount"));
		User user = api.getUser(id);
		JsonObject json;
		if (user != null) {
			if (user.withdraw(amount, fromAccountId)) {
				user.deposit(amount, toAccountId);
				if(api.setMyAccounts(user.getMyAccounts(), id) && api.setMyAccounts(user.getMyAccounts(), id)){
					String fromTransactionLog = api.setTransaction(id, datetime, amount, fromAccountId, toAccountId, "transfer");
					user.setTransactionLog(fromTransactionLog);
					json = user.getUserJson();
					json.put("success", true);
					return json;
				}
			}
		}
		json = new JsonObject();
		json.put("success", false);
		json.put("id", id);
		return json;
	}

	@PostMapping("/addaccount")
	public JsonObject addAccount(@RequestBody JsonObject body) {
		int id = (int) body.get("id");
		String name = (String) body.get("accountName");
		int accountId = Integer.valueOf((String) body.get("accountId"));
		User user = api.getUser(id);
		JsonObject json;
		if (user != null) {
			if (api.findAccount(user.getOtherAccounts(), name, accountId)) {
				String otherAccounts = api.setOtherAccounts(id, accountId, name);
				user.setOtherAccounts(otherAccounts);
				json = user.getUserJson();
				json.put("success", true);
				return json;
			}
		}
		json = new JsonObject();
		json.put("success", false);
		json.put("id", id);
		json.put("msg","account already in contacts");
		return json;
	}
}
