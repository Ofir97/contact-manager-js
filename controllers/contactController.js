const asyncHandler = require('express-async-handler')
const contactModel = require('../models/contact')
const {constants} = require('../constants')

//@desc Get all contacts
//@route GET /api/contacts
//@acess private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await contactModel.find({user_id: req.user.id})
    res.status(200).json(contacts)
})

//@desc Create new contact
//@route POST /api/contacts/:id
//@acess private
const createContact = asyncHandler(async (req, res) => {
    const {name, email, phone} = req.body
    if (!name || !email || !phone) {
        console.log('error')
        res.status(constants.VALIDATION_ERROR)
        throw new Error('All fields are mandatory')
    }
    const contact = await contactModel.create({
        name, 
        email, 
        phone,
        user_id: req.user.id
    })

    res.status(201).json(contact)
})

//@desc Get contact
//@route GET /api/contacts/:id
//@acess private
const getContact = asyncHandler(async (req, res) => {
    console.log({user_id: req.user.id, _id: req.params.id})
    const contact = await contactModel.findOne({user_id: req.user.id, _id: req.params.id})
    if (!contact) {
        res.status(constants.NOT_FOUND)
        throw new Error('Contact not found')
    }
    res.status(200).json(contact)
})

//@desc Update contact
//@route PUT /api/contacts/:id
//@acess private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await contactModel.findOne({user_id: req.user.id, _id: req.params.id})

    if (!contact) {
        res.status(constants.NOT_FOUND);
        throw new Error('Contact not found')
    }
    const updatedContact = await contactModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}    
    )

    res.status(200).json(updatedContact)
})

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@acess private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await contactModel.findOne({user_id: req.user.id, _id: req.params.id})
    console.log(contact)
    if (!contact) {
        res.status(constants.NOT_FOUND)
        throw new Error('Contact not found')
    }
    await contactModel.deleteOne({_id: contact.id})
    res.status(200).json({message: `Delete contact for ${req.params.id}`})
})

module.exports = {
    getContacts,
    createContact, 
    getContact, 
    updateContact, 
    deleteContact
}