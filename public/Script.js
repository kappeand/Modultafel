const form = document.getElementById('fileUploadForm');
const sendFiles = async () => {
    const file = document.getElementById('formFile').files[0];
    const formData = new FormData();
    formData.append("fileupload", file);
    console.log(formData)
    const response = await fetch('http://localhost:8080/upload', {method: 'POST', body: formData});
    const json = await response.json();
    console.log(json);
}

form.addEventListener('submit', (e) =>{
    e.preventDefault()
    sendFiles()
})
