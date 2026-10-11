import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createNotification } from "../services/notificationService.js";

// =======================
// Generate JWT Token
// =======================

const generateToken = (id) => {

    return jwt.sign(

        { id },

        process.env.JWT_SECRET,

        {

            expiresIn: "7d"

        }

    );

};


// =======================
// REGISTER USER
// =======================

export const registerUser = async (req, res) => {

    try {

        const {

            name,
            email,
            phone,
            password

        } = req.body;


        if (

            !name ||
            !email ||
            !phone ||
            !password

        ) {

            return res.status(400).json({

                success: false,

                message: "Please fill all fields"

            });

        }


const existingEmail = await User.findOne({
    email,
    role: "customer"
});

if (existingEmail) {
    return res.status(400).json({
        success: false,
        message: "Customer email already exists"
    });
}



        const existingPhone = await User.findOne({

            phone

        });


        if (existingPhone) {

            return res.status(400).json({

                success: false,

                message: "Phone already exists"

            });

        }


        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(

            password,

            salt

        );


        const user = await User.create({

            name,

            email,

            phone,

            password: hashedPassword

        });


        const token = generateToken(

            user._id

        );


        res.status(201).json({

            success: true,

            message: "Registration Successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};




// =======================
// LOGIN USER
// =======================

export const loginUser = async (req, res) => {

    try {

        const {

            email,

            password

        } = req.body;


        if (

            !email ||

            !password

        ) {

            return res.status(400).json({

                success: false,

                message: "Please enter email and password"

            });

        }


        const user = await User.findOne({
    email,
    role: "customer"
});


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        const isMatch = await bcrypt.compare(

            password,

            user.password

        );


        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid Credentials"

            });

        }


        const token = generateToken(

            user._id

        );


        res.status(200).json({

            success: true,

            message: "Login Successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =======================
// ADMIN LOGIN
// =======================

export const adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Please enter email and password"
            });

        }

        const admin = await User.findOne({

            email,
            role: "admin"

        });

        if (!admin) {

            return res.status(404).json({

                success: false,
                message: "Admin not found"

            });

        }

        const match = await bcrypt.compare(

            password,
            admin.password

        );

        if (!match) {

            return res.status(401).json({

                success: false,
                message: "Invalid Credentials"

            });

        }

        const token = generateToken(admin._id);

        res.status(200).json({

            success: true,

            message: "Admin Login Successful",

            token,

            user: {

                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// =======================
// ADMIN REGISTER (ONE TIME)
// =======================

export const adminRegister = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password
        } = req.body;

        const existingEmail = await User.findOne({
    email,
    role: "admin"
});

if (existingEmail) {
    return res.status(400).json({
        success: false,
        message: "Admin email already exists"
    });
}
        const existingPhone = await User.findOne({
            phone
        });

        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: "Phone already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({

            name,

            email,

            phone,

            password: hashedPassword,

            role: "admin",

            isVerified: true

        });

        res.status(201).json({

            success: true,

            message: "Admin Created Successfully",

            admin

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =======================
// GET PROFILE
// =======================

export const getProfile = async (req, res) => {

    try {

        const user = await User.findById(

            req.user.id

        ).select("-password");


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        res.status(200).json({

            success: true,

            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

//

//vendior register
export const vendorRegister=async(req,res)=>{

try{

const{

fullName,

email,

phone,

businessName,

gstNumber,

address,

password

}=req.body;

if(

!fullName||

!email||

!phone||

!businessName||

!address||

!password

){

return res.status(400).json({

success:false,

message:"Please fill all fields"

});

}

const existing=

await User.findOne({

email,
    role: "vendor"

});

if(existing){

return res.status(400).json({

success:false,

message:"Vendor already exists"

});

}

const salt=

await bcrypt.genSalt(10);

const hashed=

await bcrypt.hash(

password,

salt

);

const vendor=

await User.create({

name:fullName,

email,

phone,

businessName,

gstNumber,

address,

password:hashed,

role:"vendor"

});

const token=

generateToken(

vendor._id

);

res.status(201).json({

success:true,

message:"Vendor Registered",

token,

user:vendor

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};

//vendor login
export const vendorLogin=async(req,res)=>{

try{

const{

email,

password

}=req.body;

if(

!email||

!password

){

return res.status(400).json({

success:false,

message:"Please enter credentials"

});

}

const vendor=

await User.findOne({

email,

role:"vendor"

});

if(!vendor){

return res.status(404).json({

success:false,

message:"Vendor not found"

});

}

const match=

await bcrypt.compare(

password,

vendor.password

);

if(!match){

return res.status(401).json({

success:false,

message:"Invalid Credentials"

});

}

const token=

generateToken(

vendor._id

);

res.json({

success:true,

token,

user:vendor

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};


await createNotification({

  recipientType: "admin",

  type: "CUSTOMER_REGISTERED",

  title: "New customer registered",

  message:
    `${user.name || "A new customer"} has registered on NextTGrains.`,

  entityType: "user",

  entityId: user._id,

  metadata: {
    customerId: user._id,
    name: user.name,
    email: user.email,
  },

});