async function sendData() {
    const inputValue = document.getElementById('myInput').value;
    const response = await fetch('/get_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input_value: inputValue })
    });
    const data = await response.json();
    document.getElementById('output').innerText = data.result;
}