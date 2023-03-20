require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fileapis = require('../middlewares/fileapis');
const API_URL = process.env.API_URL;
const { upload } = require('../middlewares/multer');
const { match_2arr } = require('../middlewares/index');
// router.get('/home', (req, res, next) => {
//     return res.render('pages/client/home', {
//         layout: 'main'
//     })
// })

router.get('/home', (req, res, next) => {
    req.session.table_ID = 'B1',
    req.session.bill_ID = 'BILL0001'
    return res.redirect('/client/menu');
})

router.post('/create-order', async (req, res, next) => {
    const { table_ID, bill_ID } = req.session;
    const { data } = req.body;
    // console.log(data)

    // return res.json(data);
    let body = JSON.stringify({
        table_ID, bill_ID,
        data: data
    })

    
    await fetch(API_URL + 'orders/create-order/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: body 
    })
    .then(async result => {
        result = await result.json();
        return res.send(result)
    })
    .catch(err => {
        return res.sendStatus(500);
    })
})

router.get('/menu', async (req, res, next) => {
    const { table_ID , bill_ID } = req.session;
    
    await fetch(API_URL + "products/get-menu", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(async (result) => {
            result = await result.json();
            
            if (result.success) {
                let products = result.data;
                
                let orders = [];
                if (products.length != 0) {
                    orders = products.map(p => {
                        return {
                            pid: p.product_ID,
                            pname: p.product_name,
                            pimg: p.image_link,
                            price: p.product_price,
                        }
                    })
                }

                return res.render('pages/clients/menu', {
                    layout: 'main',
                    success: req.flash('success') || '',
                    error: req.flash('error') || '',
                    orders: orders,
                    table_ID, bill_ID
                })
            }
        })
        .catch(err => {
            return res.render('pages/clients/menu', {
                layout: 'main'
            })
        })
    
})


router.get('/place-order', async (req, res, next) => {
    // console.log(req)
    console.log(req.data)
    await fetch(API_URL + 'product')
})

module.exports = router;