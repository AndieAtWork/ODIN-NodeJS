const pool = require("../database");

exports.frontGet = (req, res) => {
  res.render("front");
};

exports.gamesGet = (req, res) => {
    res.render("games");
};

exports.gameGet = async (req, res) => {
    const idGame = req.params.gameId;
    if (!Number.isInteger(Number(idGame)) || idGame <= 0 || idGame > 6) {
        return res.status(400).json({
            message: "Bad Request"
        });
    }

    var { rows } = await pool.query("SELECT * FROM waldo_game WHERE game_number = $1", [idGame]);
    var game = rows[0];
    var x = game.waldo_x;
    var y = game.waldo_y;

    console.log("GAME CHOSEN " + String(idGame));
    res.render("game", { idGame, x, y });
};

exports.scoreGet = (req, res) => {
    console.log("scoreGet");
    res.render("scores");
};

exports.scoreGameGet = async (req, res) => {
    console.log("scoreGetGame", req.params);
    const { gameId, playerId } = req.params;

    var { rows } = await pool.query("SELECT * FROM player WHERE game_id = $1 ORDER BY time_score, date ASC", 
      [gameId])

    var { rows: playerData } = await pool.query("SELECT * FROM player WHERE game_id = $1 and player_id = $2", 
      [gameId, playerId])

    return res.status(200).json({
      data: rows, // Success
      playerData: playerData
    });
};

exports.scorePost = async (req, res) => {
    const { player, game, seconds } = req.body;

    //console.log(player);
    //console.log(game);
    //console.log(seconds);

    const result = await pool.query("INSERT INTO player (username, time_score, date, game_id) VALUES ($1, $2, NOW(), $3) RETURNING *", 
      [player, seconds, game]);
    const playerId = result.rows[0].player_id;

    res.json({
        redirect: `/scores/?game=${game}&playerId=${playerId}`
    });
};

