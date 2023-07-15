const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const app = express();
app.use(express.json());
const databasePath = path.join(__dirname, "moviesData.db");
let db = null;

const initializeDatabase = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Running");
    });
  } catch (e) {
    console.log(`error ${e}`);
    process.exit(1);
  }
};
initializeDatabase();

app.get("/movies/", async (request, response) => {
  const sqlQuery = `
    SELECT
      * 
    FROM
    movie
    ORDER BY movie_id;`;
  const gigabyte = await db.all(sqlQuery);
  response.send(gigabyte);
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const query = `
    INSERT INTO
    movie(director_id,movie_name,lead_actor)
    VALUES
    (
       ${directorId},
        '${movieName}',
        '${leadActor}'
    );`;
  const postResponse = await db.run(query);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const movie_id = request.params;
  const getBookQuery = `
    SELECT
       *
    FROM
     movie
    WHERE
     movie_id = ${movie_id.movieId};`;
  const databaseFromGet = await db.get(getBookQuery);
  response.send(databaseFromGet);
});

app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const book_id = request.params;
  const query_for_updation = `
  UPDATE
   movie
  SET
   director_id=${directorId},
   movie_name='${movieName}',
   lead_actor='${leadActor}'
   WHERE
   movie_id = ${book_id.movieId};`;
  const database_for_updation = await db.run(query_for_updation);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query = `
  DELETE FROM
  movie
  WHERE 
  movie_id = ${movieId}`;
  const deleteKey = await db.run(query);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const sqlQuery = `
    SELECT
      * 
    FROM
    director;`;
  const gigabyte = await db.all(sqlQuery);
  response.send(gigabyte);
});

app.get("/directors/", async (request, response) => {
  const { directorId } = request.params;
  const sqlDirectorsFindingQuery = `
  SELECT
    movie_name
  FROM
  movie
  GROUP BY
  director_id;`;
  const d = await db.all(sqlDirectorsFindingQuery);
  response.send(d);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const sqlDirectorsFindingQuery = `
  SELECT
    movie_name
  FROM
  movie
  WHERE 
  director_id = ${directorId};`;
  const d = await db.all(sqlDirectorsFindingQuery);
  response.send(d);
});

module.exports = app();
