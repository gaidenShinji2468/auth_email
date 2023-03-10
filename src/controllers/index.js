const catchError = require("../utils/catchError");

class Controller {
  constructor(Schema) {
    this.Schema = Schema;
  }

  getAll() {
    return catchError(async (req, res) => {
      const data = await this.Schema.findAll();

      res.status(200).json({
        statusCode: 200,
	message: "Read Success",
	data
      });
    });
  }

  getOne() {
    return catchError(async (req, res) => {
      const {id} = req.params;
      const data = await this.Schema.findByPk(id);

      if(!data)
	res.status(404).json({
          statusCode: 404,
	  message: "Not Found"
	});

      res.status(200).json({
        statusCode: 200,
	message: "Read Success",
	data
      });
    });
  }

  create() {
    return catchError(async (req, res) => {
      const data = req.body;
      const created = await this.Schema.create(data);

      res.status(201).json({
        statusCode: 201,
	message: "Created Success",
	data: created
      });
    });
  }

  update() {
    return catchError(async (req, res) => {
      const {id} = req.params;
      const data = req.body;
      const updated = await this.Schema.update(data, {
        where: {id},
	returning: true
      });

      if(!updated[1].length)
	res.status(404).json({
          statusCode: 404,
	  message: "Not Found"
	});

      res.status(200).json({
        statusCode: 200,
	message: "Updated Success",
	data: updated[1][0]
      });
    });
  }

  remove() {
    return catchError(async (req, res) => {
      const {id} = req.params;
      const removed = await this.Schema.destroy({
        where: {id},
	returnin: true
      });

      if(!removed)
	res.status(404).json({
          statusCode: 404,
	  message: "Not Found"
	});

      res.sendStatus(204);
    });
  }
};

module.exports = Controller;
