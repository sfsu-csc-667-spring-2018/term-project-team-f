const models = require('../../models')

module.exports.populate = function(gameId) {
  let gamepiece = {
    game_id: gameId,
    piece_id: 1,
    x: 1,
    y: 1
  }

  Piece = models.game_pieces.create(gamepiece)
    .catch(err => {
      console.log(err)
    })
}

module.exports.getPieces = function(gameId) {
  models.game_pieces.findAll({
    where: {
      game_id: gameId
    }
  }).then(data => {
    return data;
  }).catch(err => {
    console.log(err)
  })
}