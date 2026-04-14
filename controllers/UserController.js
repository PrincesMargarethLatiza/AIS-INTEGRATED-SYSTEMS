import * as UserModel from '../models/UserModel.js';


export const register = async (req, res) => {
    const {name,
        birthdate,
        address,
        program,
        studentStatus,
        email, 
        password}= req.body;
    
    try{
        const userProfile = {name, birthdate, address, program, studentStatus};
        const users = await UserModel.createUser(userProfile, email, password);
        res.status(200).json({success: true, message: users});
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: [{result : "A new account has been created!"}]
        });
    }
    
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await UserModel.login(email, password);
        res.status(200).json({
            success: true,
            message: [
                {result: "Login successful",token},
            ]
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};