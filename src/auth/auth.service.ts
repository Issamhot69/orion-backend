import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../memory/database.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private db: DatabaseService) {}

  async register(data: { name: string; email: string; password: string; company: string }) {
    const existing = await this.db.findUserByEmail(data.email);
    if (existing) throw new Error('Email déjà utilisé');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.db.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      company: data.company,
    });

    const token = this.generateToken(user);
    return { user: { id: user.id, name: user.name, email: user.email, company: user.company }, token };
  }

  async login(email: string, password: string) {
    const user = await this.db.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const token = this.generateToken(user);
    return { user: { id: user.id, name: user.name, email: user.email, company: user.company }, token };
  }

  generateToken(user: any) {
    return jwt.sign(
      { id: user.id, email: user.email, companyId: user.company_id },
      process.env.JWT_SECRET || 'orion-secret-key',
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET || 'orion-secret-key');
  }
}
