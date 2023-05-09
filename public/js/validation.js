function validateEmail() {
	const emailInput = document.getElementById("email").value;
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (emailRegex.test(emailInput)) {
		alert("Thank you for reaching out to us");
	} else {
		alert("Invalid email address! Please enter a valid email.");
	}
}