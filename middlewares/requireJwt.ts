import passport from 'passport';

const requireJwt = passport.authenticate('jwt', { session: false });

export default requireJwt;
