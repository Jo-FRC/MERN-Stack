const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator'); // /check

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // We have a reference to the user req.user.id linked in the Profile model
    const profile = await Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar']);

    if(!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });

      res.json(profile);
    }
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
// auth and check are the middleware in this case
router.post('/', [ auth, [
  check('status', 'Status is required.')
    .not()
    .isEmpty(),
  check('skills', 'Skills is required')
  .not()
  .isEmpty()
  ]
],
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }
  // destructuring req.body
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram
  } = req.body;

  // Build profile object
  const profileFields = {};
  // We have a reference to the user req.user.id linked in the Profile model
  profileFields.user = req.user.id;
  if(company) profileFields.company = company;
  if(website) profileFields.website = website;
  if(bio) profileFields.bio = bio;
  if(status) profileFields.status = status;
  if(githubusername) profileFields.githubusername = githubusername;
  if(skills) {
    // we have to turn a sting into an array and trim it in case of spaces after the comma
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }
  // Build social object
  profileFields.social = {};
  // if we don't add that social is an obj it will return an error saying cannot find youtube of undefined
  if(youtube) profileFields.social.youtube = youtube;
  if(twitter) profileFields.social.twitter = twitter;
  if(facebook) profileFields.social.facebook = facebook;
  if(linkedin) profileFields.social.company = linkedin;
  if(instagram) profileFields.social.instagram = instagram;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if(profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields},
        { new: true }
      );

      return res.json(profile);
    }

    // Create
    profile = new Profile(profileFields);

    await profile.save();
    res.json(profile);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get all profile by User ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);

    if(!profile)
      return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch(err) {
    console.error(err.message);
    if(err.name == 'CastError') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // todo remove user posts
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted.'});
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put('/experience', [ auth,
  [
    check('title', 'Title is required')
      .not()
      .isEmpty(),
    check('company', 'Company is required')
      .not()
      .isEmpty(),
    check('from', 'Start date is required')
      .not()
      .isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }

  // destructuring
  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  // Since value and variable name are the same you don't need to assign it like this: title: title
  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Since experience is an array we can use array methods
    // Instead of using push we can use unshift to put the newst to the beginning
    profile.experience.unshift(newExp);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index for experience
    const removeIndex = profile.experience.map(item => item.id)
      .indexOf(req.params.exp_id);

      profile.experience.splice(removeIndex, 1);

      await profile.save();

      res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
