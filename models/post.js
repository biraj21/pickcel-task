import dbPool from "../util/database.js";

export default class Post {
  static async create({ title, description = null, pubDate = null, link }) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return await conn.query("INSERT INTO Post (title, description, pubDate, link) VALUES (?, ?, ?, ?)", [
        title,
        description,
        pubDate,
        link,
      ]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getAll() {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return await conn.query("SELECT * FROM Post");
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  static async getById(id) {
    let conn;
    try {
      conn = await dbPool.getConnection();
      return (await conn.query("SELECT * FROM Post WHERE id = ?", [id]))[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}
