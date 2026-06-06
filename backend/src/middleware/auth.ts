import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader=req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message:'Authorization header missing'})
    }
    const token=authHeader.split(' ')[1]
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as { id: number, email: string }
        (req as any).userId=decoded.id
        next()
    }
    catch(err){
        return res.status(401).json({message:'Invalid token'})
    }
}