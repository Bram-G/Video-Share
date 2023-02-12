const signUpHandler = async (event) => {
    event.preventDefault();
    const name = document.getElementById('name-signup').value.trim();
    const email = document.getElementById('email-signup').value.trim();
    const password = document.getElementById('password-signup').value.trim();
    if(name && email && password) {
        console.log(name, email, password);

        const response = await fetch('/user', {
            method: 'POST',
            body:  JSON.stringify({name, email, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if(response.ok) {
            document.location.replace('/');
        } else {
            alert(`Error: ${JSON.stringify(response.statusText)}`);
        };
    } else {
        alert("Please enter a name, email, and password that is at least 8 characters long.")
    }
}

document.querySelector('.signup-form').addEventListener('submit', signUpHandler);