import { Request, Response, NextFunction } from 'express';
import { auth } from '../firebaseAdmin';


export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const token = authHeader.replace('Bearer ', '');
  

  try {
    const decodedToken = await auth.verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch {
        return res.status(401).json({ error: 'Invalid auth token' });
  }
}
