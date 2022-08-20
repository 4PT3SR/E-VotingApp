const { randomUUID } = require('crypto');
const User = require('../models/userModel');
const AppError = require('../utils/AppError')
const axios = require('axios')


exports.payment = async(req,res,next) => {
    const user = req.user;
    const jsonData = {
        tx_ref: `learnGrazac-tx-${randomUUID()}`,
        amount: "10000",
        currency: "NGN",
        redirect_url: `${req.protocol}://${req.get('host')}/learngrazac/api/payment/verify`,
        meta: {
            userId: user._id
        },
        customer: {
            email: `${user.email}`,
            name: `${user.last_name} ${user.first_name}`
        }
    }

try {
    const response = await axios.post("https://api.flutterwave.com/v3/payments",jsonData, {
        headers: {
            'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`
        }});  
    // console.log(response)

    // res.status(200).json({message:'Success'});
    // console.log(response.data.data)
    res.status(200).json({status:'Success',message:`${response.data.data.link}`});
} catch (error) {
    // console.log(err.code);
    // console.log(error);
    next(error);
    // console.log(err.response.body);
}



//     } catch (error) {
//         next(error);
//     }
}

exports.verifyPayment = async (req,res,next) => {
    try {
        // const user = req.user;
       const transaction_id = req.query.transaction_id;
        let response = await axios.get(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
            }});

            const flwRes = response.data.data;
            // console.log(flwRes)
            if(flwRes.status === "successful" && flwRes.amount === 10000 && flwRes.currency === 'NGN') {
                // console.log('heya')
                let user = await User.findOne({_id: flwRes.meta.userId,status:'Free'});
                    if(!user) throw new AppError('Invalid Transaction',400);
                user.status = 'Subscribed';
                await user.save();
                res.status(200).json({status:'Success',message:'Payment Successful'});
            } else {
                throw new AppError('Payment not Successful',400)
            }
        

    } catch (error) {
        next(error)
    }
}