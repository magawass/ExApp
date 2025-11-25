const owner = "magawass";       // your GitHub username
const repo = "ExApp";           // your repo name
const token = "YOUR_TOKEN_HERE"; // replace with your GitHub token
const apiBase = "https://api.github.com/repos/" + owner + "/" + repo + "/contents/data/";

async function listFiles() {
  const res = await fetch(apiBase, {
    headers: { Authorization: `token ${token}` }
  });
  const files = await res.json();
  const list = document.getElementById("fileList");
  list.innerHTML = "";
  files.forEach(file => {
    const li = document.createElement("li");
    li.textContent = file.name;
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteFile(file.name, file.sha);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

async function uploadFile(file) {
  const content = await file.text();
  const url = apiBase + file.name;
  await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Upload " + file.name,
      content: btoa(content)
    })
  });
  listFiles();
}

async function deleteFile(name, sha) {
  const url = apiBase + name;
  await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Delete " + name,
      sha: sha
    })
  });
  listFiles();
}

document.getElementById("uploadForm").addEventListener("submit", e => {
  e.preventDefault();
  const file = document.getElementById("csvFile").files[0];
  if (file) uploadFile(file);
});

// Load files on page start
listFiles();