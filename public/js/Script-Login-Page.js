function validateForm(form) {
			
				var at = document.getElementById("email").value;
				var pass =  document.getElementById("Password").value; 	
				submitOK = "true";
				
				// Email error
		
				if (at == "") {
						document.getElementById("emailError").textContent="Not e-mail entered!";
						//alert("Not a valid e-mail!");
						submitOK = "false";
					}
				else if(at.indexOf(".") == -1){
					document.getElementById("emailError").textContent="The Email address is invalid!";
						//alert("Not a valid e-mail!");
						submitOK = "false";
				}
				else if(at.indexOf("@") == -1){
					document.getElementById("emailError").textContent="The Email address is invalid!";
						//alert("Not a valid e-mail!");
						submitOK = "false";
				}
				else if(/[^a-zA-Z0-9.@_-]/.test(at) ){
					document.getElementById("emailError").textContent="The Email address is invalid!";
						//alert("Not a valid e-mail!");
						submitOK = "false";
				}
				else {
						document.getElementById("emailError").textContent="";
						//alert("The name may have no more than 10 characters");
						submitOK = "true";
					}
				//password error
				  if (pass == "") {
					document.getElementById("passError").textContent="No password entered!";
						//alert("Not a valid e-mail!");
						submitOK = "false";
				  }
				  else if (pass.length < 6){
				  document.getElementById("passError").textContent="Passwords must be at least 6 characters.";
						//alert("Not a valid e-mail!");
						submitOK = "false";
				  } 
				 else if (! /[a-z]/.test(pass) ||
						 ! /[A-Z]/.test(pass) ||
						! /[0-9]/.test(pass)){
						 document.getElementById("passError").textContent="Passwords require one each of a-z, A-Z and 0-9.";
						//alert("Not a valid e-mail!");
						submitOK = "false";
						}
				else {
						document.getElementById("passError").textContent="";
						//alert("The name may have no more than 10 characters");
						submitOK = "true";
					}
					
						 
				if (submitOK == "false") {
						return false;
					}
			}