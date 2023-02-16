import dbPool from "../util/database.js";

export default class Image {
  static async create({ url, postId }) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return await conn.query("INSERT INTO Image (url , postId) VALUES (?, ?)", [url, postId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getByPostId(postId) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return await conn.query("SELECT * FROM Image WHERE postId = ?", [postId]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}
