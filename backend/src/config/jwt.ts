const jwtConfig = {
  secret: process.env.JWT_SECRET as string,
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

export const getJwtConfig = (): { secret: string; expiresIn: string } => {
  if (!jwtConfig.secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production');
    }
    jwtConfig.secret = 'dev-secret-do-not-use-in-production';
  }
  return jwtConfig;
};
