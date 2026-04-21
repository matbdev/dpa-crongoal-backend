import passport from 'passport';

const requireJwt = passport.authenticate('jwtAuth', { session: false });

export default requireJwt;
