import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import dbPool from "./util/database.js";
import Post from "./models/post.js";
import Image from "./models/image.js";

try {
  const res = await axios.get("http://rss.cnn.com/rss/edition.rss");
  console.log("data fetched from the api");

  const parser = new XMLParser({ ignoreAttributes: false });
  let data = parser.parse(res.data);

  for (const [i, item] of data.rss.channel.item.entries()) {
    const { title, description, link, pubDate } = item;
    const post = { title, link };
    if (description) {
      post.description = description;
    }

    if (pubDate) {
      post.pubDate = pubDate;
    }

    let { insertId } = await Post.create(post);
    insertId = Number(insertId);

    if (item["media:group"]) {
      const images = item["media:group"]["media:content"]
        .filter((c) => c["@_medium"] === "image")
        .map((c) => c["@_url"]);

      for (const url of images) {
        await Image.create({ url, postId: insertId });
      }
    }
  }

  console.log("database setup done");
} catch (err) {
  console.error("error", err.message);
} finally {
  dbPool.end();
}
