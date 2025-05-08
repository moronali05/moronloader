const express = require("express");
const ytdl    = require("ytdl-core");
const path    = require("path");
const app     = express();


app.use(express.static(path.join(__dirname, "public")));


app.get("/download", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL || !ytdl.validateURL(videoURL)) {
    return res.status(400).send("Invalid or missing 'url' parameter");
  }
  try {
    const info  = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[\\/:*?"<>|]/g, "_");
    res.header(
      "Content-Disposition",
      `attachment; filename="${title}.mp4"`
    );
    ytdl(videoURL, { quality: "highest" }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error downloading video");
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
