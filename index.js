// index.js
const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");

const app = express();
app.use(cors()); // CORS issue এড়াতে

// Health check
app.get("/", (req, res) => {
  res.send("Server is running! Use /download?url=VIDEO_URL");
});

// /download?url=YouTube_URL
app.get("/download", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL || !ytdl.validateURL(videoURL)) {
    return res.status(400).send("Invalid or missing 'url' parameter");
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const format = ytdl.chooseFormat(info.formats, { quality: "highestvideo" });

    const title = info.videoDetails.title.replace(/[\\/:*?"<>|]/g, "_");
    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp4"`);
    res.setHeader("Content-Type", "video/mp4");

    ytdl(videoURL, {
      format: format,
      filter: "audioandvideo",
      quality: "highest"
    }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error downloading video");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
