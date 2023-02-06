const Payment = require('./payment.model')
const {User} = require('../users/users.model')

module.exports = {
    userPayment : async (req, res) =>{
        const { paymentID, planName, validity, amount} = req.body
        const { _id } = req.params

        try {
            const data = Payment({
                payment_refNumber : paymentID,
                plam : planName,
                validity : validity,
                amount : amount,
                userId : _id
            })

            const makePayment = await data.save()

            if (!makePayment) {
                return res.status(403).json({
                    Error : [
                        {
                            message : `payment Unsuccessful`
                        }
                    ]
                })
            } else {
                const update_user_info = await User.findByIdAndUpdate(
                    _id,
                    {
                        $set : {
                            payment : makePayment
                        }
                    },
                    { new : true }
                )

                if (update_user_info) {
                    return res.status(200).json({
                        message : `Payment Successful`
                    })
                }
            }
        } catch (error) {
            console.log(error.message)
            return res.status(400).json({
                Error : [
                    {
                        error : error.message,
                        message :  `Please contact adminator`
                    }
                ]
            })
        }
    }
}