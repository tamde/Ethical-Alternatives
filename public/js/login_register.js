// Function to confirm if user wants to register user or not
function confirm_register() {
  
  let username = document.getElementById('reg_username').value;
  let nickname = document.getElementById('reg_nickname').value;
  let prompt = "Are you sure you want to register username: " + username;
  
  if (nickname) {
    prompt += " (" + nickname + ")";
  }

  // If user clicks "Yes" in prompt proceed, else return
  if (confirm(prompt)) {
    
    // Check if password & confirm_password fields match
    let reg_password = document.getElementById('reg_password');
    let confirm_password = document.getElementById('confirm_password');
    
    // If password strings don't match, show alert about password mismathc 
    if (reg_password.value != confirm_password.value) {
      alert('!!! Please make sure "Password" & "Confirm Password" match.');
    }
    // If password strings match submit form
    else {
      document.getElementById("register_form").submit();
    }
  }
}
