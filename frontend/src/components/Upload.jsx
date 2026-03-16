import axios from "axios";

function Upload() {

  const handleUpload = async (event) => {

    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    await axios.post("http://localhost:5000/upload", formData);

    alert("Document uploaded successfully");
  };

  return (
    <div>
      <h3>Upload Document</h3>

      <input type="file" onChange={handleUpload} />
    </div>
  );
}

export default Upload;