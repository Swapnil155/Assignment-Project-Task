require('../../Database/DB')
const {User, UserDetails} = require('./users.model')
const bcrypt = require('bcrypt')

const sendEmailOTP =async (email) =>{
    let isExist = await userSchema.findOne({email:email})
    
    if (!isExist) {
        return {
            message : `user not found`,
        }
    } else {
        const _id = isExist._id
        const otp = Math.round(4)
        console.log(otp)
        const updateOTP = await userSchema.findByIdAndUpdate(_id,
            {
                $push : {
                    pin : otp
                }
            },{ new : true})

        return {
            message : `otp send Successfully`,
            user : updateOTP
        }
    }
}

module.exports = {

    userRegistration : async (req, res) =>{
        
        
        const { fullname, email, dob, location, password } = req.body

        let isExist = await User.findOne({email: email})

        if (isExist) {
            return res.status(400).json({
                Error : [
                    {
                        email : email,
                        inputType : `email`,
                        message : `User already exist`
                    }
                ]
            })
        } else {
            const salt = await bcrypt.genSalt(10)
            const hashpassword =  await bcrypt.hash(password, salt)

            console.info(`salt: ${salt} \n hashpassword : ${hashpassword}`)

            try {

                const userDetails = UserDetails({
                    fullname : fullname,
                    location : location,
                    DOB : dob,
                })

                const data = userSchema({
                    email : email,
                    password : password,
                    user_status : `1`
                })

                const userdata = await data.save()
                console.info(`User Successfully \n ${userdata}`)

                //============ send a email otp =======================
                //======================================================
                // const result = sendEmailOTP(email)

                // if (!result) {
                //     return res.status(400).json({
                //         Error : [
                //             {
                //                 inputType : `pin`,
                //                 message : `Pin not Send`
                //             }
                //         ]
                //     })
                // } else {
                //     return res.status(200).json({
                //         message : `Pin send to Autherised mail address`
                //     })
                // }

                if (userdata) {
                    return res.status(200).json({
                        message : `Sucessfully inserted`,
                        user : userdata
                    })
                }
                
                
            } catch (error) {
                console.log(error.message)
                return res.status(503).json({
                    Error : [
                        {
                            error : error.message,
                            message : `Please contact to adminstator`
                        }
                    ]
                })
            }
        }
    },

    userLogin : async (req, res) => {
        
        const { email, password } = req.body

        try {

            const userData = await userSchema.findOne({email : email})

            if (!userData) {
                return res.status(400).json({
                    Error : [
                        {
                            inputType : `email`,
                            message : `Email invalid`
                        }
                    ]
                })
            } else {

                if (userData.user_status) {

                    let isMatch = await bcrypt.compare(password, userData.password)

                    if (!isMatch) {
                        return res.status(401).json({
                            Error : [
                                {
                                    inputType : `password`,
                                    message : `Password is invalid`
                                }
                            ]
                        })
                    } else {
                        return res.status(200).json({
                            message : `Successfully login`,
                            user : userData
                        })
                    }
                    
                } else {
                    return res.status(200).json({
                        Error : [
                            {
                                inputType : `email`,
                                message : `Your account as been deleted please contact us`
                            }
                        ]
                        })
                }
                
            }
            
        } catch (error) {
            console.log(error.message)
            return res.status(503).json({
                    Error : [
                        {
                            error : error.message,
                            message : `Please contact to adminstator`
                        }
                    ]
                })
        }
    },

    userPinAuthentication : async (req,res) => {

        const {email, pin} = req.body

        try {

            let isExist = await userSchema.findOne({email : email})

            if (!isExist) {
                return res.status(400).json({
                    Error : [
                        {
                            message : `user not exist`
                        }
                    ]
                })
            } else {
                
                let pinExists = await userSchema.exists({pin:pin})

                if (pinExists) {
                    return res.status(200).json({
                        message : `Welcome Back`,
                        user : isExist
                    })
                } else {
                    return res.status(401).json({
                        Error : [
                            {
                                inputType : `pin`,
                                message : `Pin dose not match`
                            }
                        ]
                    })
                }
            }
            
        } catch (error) {
            console.log(error.message)
            return res.status(503).json({
                    Error : [
                        {
                            error : error.message,
                            message : `Please contact to adminstator`
                        }
                    ]
                })
        }

       
    },

    userResentOtp : async (req, res) => {
        const {email} = req.body
        const result = sendEmailOTP(email)

        if (!result) {
            return res.status(400).json({
                Error : [
                    {
                        inputType : `pin`,
                        message : `Pin not Send`
                    }
                ]
            })
        } else {
            return res.status(200).json({
                message : `Pin send to Autherised mail address`
            })
        }
    },

    userUploadFiles :  async (req, res) =>{
        const {_id} = req.params
        const { gender } = req.body

        if (req.files === undefined) {
            return res.status(400).json({
                Error : [
                    {
                        message : `You must select a file`
                    }
                ]
            })
        } else {
            const userImage = req.files.profileImage;
            const userVideo = req.files.video

            const UpdateMedia = await userSchema.findByIdAndUpdate(
                _id,
                {
                    $set : {
                        media : {
                            image : `http://localhost:5000/${req.files.profileImage[0].path}`,
                            video : `http://localhost:5000/${req.files.video[0].path}`
                        }
                    }
                },{new:true}
            )

            if(!UpdateMedia){
                return res.status(200).json({
                    Error : [
                        {
                            message : `Failed`,
                            data : UpdateMedia
                        }
                    ]
                })
            }else{
                return res.status(200).json({
                    message: `Files Successfully inserted`,
                    data: UpdateMedia
                })
            }
        }
    },

    userBioAndLinks : async (req, res) =>{
        const {boi, linkedln, facebook} = req.body
        const {_id} = req.params

        try {

            const updateBioAndLinks = await userSchema.findByIdAndUpdate(
                _id,
                {
                    $set: {
                        bio : boi,
                        links : {
                            linkedln : linkedln,
                            facebook : facebook
                        }
                    }
                },
                { new : true }
            )

            if (!updateBioAndLinks) {
                return res.status(200).json({
                    Error : [
                        {
                            message : `Data Not found`
                        }
                    ]
                })
            } else {
                return res.status(200).json({
                    Error : [
                        {
                            message : `Data update successfully`,
                            _id : _id,
                            user : updateBioAndLinks
                        }
                    ]
                })
            }
            
        } catch (error) {
            console.log(error.message)
            return res.status(503).json({
                    Error : [
                        {
                            error : error.message,
                            message : `Please contact to adminstator`
                        }
                    ]
                })
        }


    },

    updateOperation : async (req, res) => {
        const {_id, option} = req.params;
        const body = req.body

        try {
            switch (option) {
                case "personal-details":
                    const updatePersonalDetails = await userSchema.findByIdAndUpdate(
                        _id,
                        {
                            $set : {
                                fullname : body.fullname,
                                email : body.email,
                                DOB : body.dob,
                                location : body.location
                            }
                        },
                        { new:true }
                    )

                    if (!updatePersonalDetails) {
                        return res.status(200).json({
                            Error : [
                                {
                                    message : `Data Not found`
                                }
                            ]
                        })
                    } else {
                        return res.status(200).json({
                            Error : [
                                {
                                    message : `Data update successfully`,
                                    _id : _id,
                                    user : updatePersonalDetails
                                }
                            ]
                        })
                    }

                break;

                case "change-password":
                    const changePassword = await userSchema.findByIdAndUpdate() 

                break;

            
                default:
                    break;
            }
            
        } catch (error) {
            console.log(error.message)
            return    res.status(503).json({
                    Error : [
                        {
                            error : error.message,
                            message : `Please contact to adminstator`
                        }
                    ]
                })
        }
    }

}