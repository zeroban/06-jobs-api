const Tires = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')


const getAllTires = async (req, res) => {
    const tires = await Tires.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ tires, count: tires.length })
}

const getTire = async (req, res) => {
    // searches for the userID and tireID to make sure they match
    const { user: { userId }, params: { id: tireID }, } = req

    // will locate the tireID that was created by the user searching
    const tires = await Tires.findOne({ _id: tireID, createdBy: userId })

    if (!tires) {
        throw new NotFoundError(`No tire found with ${tireID}`)
    }
    res.status(StatusCodes.OK).json({ tires })
}

const createTire = async (req, res) => {
    req.body.createdBy = req.user.userId
    const tires = await Tires.create(req.body)
    res.status(StatusCodes.CREATED).json({ tires })
}

const updateTire = async (req, res) => {
    // searches for the userID and tireID to make sure they match
    const {
        body: { brand, size, location, price, quantity },
        user: { userId },
        params: { id: tireID },
    } = req

    // will check for blank fields
    if (brand === "" || size === "" || location === "" || price === "" || quantity === "") {
        throw new BadRequestError(`Be sure that all fields are filled in. Can not be null/blank`)
    }

    const tires = await Tires.findByIdAndUpdate({ _id: tireID, createdBy: userId }, req.body, { new: true, runValidators: true })

    if (!tires) {
        throw new NotFoundError(`No tire found with ID: ${tireID}`)
    }
    res.status(StatusCodes.OK).json({ tires })

}

const deleteTire = async (req, res) => {
    // searches for the userID and tireID to make sure they match
    const { user: { userId }, params: { id: tireID }, } = req

    const tires = await Tires.findByIdAndRemove({
        _id: tireID,
        createdBy: userId
    })
    if (!tires) {
        throw new NotFoundError(`No tire found with ID: ${tireID}`)
    }
    // res.status(StatusCodes.OK).send()
    res.status(StatusCodes.OK).json({ msg: "The entry was deleted." });
}




module.exports = {
    getAllTires,
    getTire,
    createTire,
    updateTire,
    deleteTire,


}
