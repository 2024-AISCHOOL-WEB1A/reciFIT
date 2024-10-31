require("dotenv").config();
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// 카카오 로그인 전략
passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_REDIRECT_URI,
    },
    (req, accessToken, refreshToken, profile, done) => {
      return done(null, {
        accessToken,
        refreshToken,
        profile,
      });
    }
  )
);

// 구글 로그인 전략
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      passReqToCallback: true,
      prompt: "select_account",
    },
    (req, accessToken, refreshToken, profile, done) => {
      return done(null, {
        accessToken,
        refreshToken,
        profile,
      });
    }
  )
);

module.exports = passport;
