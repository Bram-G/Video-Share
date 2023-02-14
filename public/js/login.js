const loginHandler = async (event) => {
    event.preventDefault();
  
    // Collect values from the login form
    const email = document.querySelector('#loginEmail').value.trim();
    const password = document.querySelector('#loginPassword').value.trim();
  
    if (email && password) {
      // Send a POST request to the API endpoint
      const response = await fetch('/user/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // If successful, redirect the browser to the home page
        document.location.replace('/'); 
      } else {
        alert(`Error: ${JSON.stringify(response.statusText)}`);
      };
    } else {
      alert('Please enter a username and password.')
    };
  };
  
  //listen for form submission
  document.querySelector('.login-form').addEventListener('submit', loginHandler);
  
  