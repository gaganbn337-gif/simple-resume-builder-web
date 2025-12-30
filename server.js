const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "../frontend")));

const RESUME_FILE = path.join(__dirname, "resumes.json");

app.post("/save-resume", (req, res) => {
  fs.writeFileSync(RESUME_FILE, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

app.get("/download-resume", (req, res) => {
  if (!fs.existsSync(RESUME_FILE)) return res.send("No resume found");

  const r = JSON.parse(fs.readFileSync(RESUME_FILE));

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Resume</title>
<style>
body{font-family:Poppins;background:#f3f4f6;padding:40px;}
.resume{max-width:850px;margin:auto;background:white;padding:40px;border-radius:16px;}
.header{display:flex;align-items:center;gap:20px;}
img{width:120px;height:120px;border-radius:50%;object-fit:cover;}
h1{color:#4f46e5;}
.section{margin-top:25px;}
.section h2{border-bottom:2px solid #4f46e5;}
a{color:#4f46e5;text-decoration:none;}
</style>
</head>
<body>
<div class="resume">
<div class="header">
<img src="${r.photo}">
<div>
<h1>${r.name}</h1>
<p>${r.email} | ${r.phone}</p>
</div>
</div>

<div class="section">
<h2>Education</h2>
<p>${r.education}</p>
</div>

<div class="section">
<h2>Hobbies & Interests</h2>
<p>${r.hobbies}</p>
</div>

<div class="section">
<h2>Social Profiles</h2>
<p>
<a href="${r.linkedin}">LinkedIn</a> |
<a href="${r.github}">GitHub</a> |
<a href="${r.other}">Other</a>
</p>
</div>
</div>
</body>
</html>`;

  res.setHeader("Content-Disposition", "attachment; filename=resume.html");
  res.send(html);
});

app.listen(5000, () => console.log("Server running on 5000"));
