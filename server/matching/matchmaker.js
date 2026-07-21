const Room = require('../models/Room');
const User = require('../models/User');

const PROMPTS = [
  "What's one thing from this week you couldn't tell your manager?",
  "When did you last feel genuinely proud of your work?",
  "What made you open this app today?",
  "What's the thing nobody on your team talks about but everyone feels?",
  "What's draining you most right now?",
  "When did you last feel out of your depth — and what happened?",
  "What would you change about your team if you could?",
  "What's something you're pretending is fine but isn't?"
];

const getRandomPrompt = () => {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
};

const generateRoomNumber = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const getLevelScore = (level) => {
  const scores = { junior: 1, mid: 2, senior: 3, staff: 4 };
  return scores[level] || 1;
};

const isWithinOneTier = (levelA, levelB) => {
  return Math.abs(getLevelScore(levelA) - getLevelScore(levelB)) <= 1;
};

const isOnCooldown = (user, otherUserId) => {
  const now = new Date();
  return user.cooldowns?.some(
    c => c.userId.toString() === otherUserId.toString() && c.until > now
  );
};

const getVentListenBalance = (participants) => {
  const venters = participants.filter(p => p.intent === 'vent').length;
  const listeners = participants.filter(p => p.intent === 'listen').length;
  return { venters, listeners };
};

// Main matching function — call this when a user enters the queue
const findOrCreateRoom = async (user) => {
  try {
    // Look for an existing waiting room that fits this user
    const waitingRooms = await Room.find({ status: 'waiting' });

    for (const room of waitingRooms) {
      const participants = room.participants;

      // Skip if room is full
      if (participants.length >= room.maxParticipants) continue;

      // Check level compatibility with all participants
      const levelOk = participants.every(p =>
        isWithinOneTier(user.level, p.level)
      );
      if (!levelOk) continue;

      // Check cooldowns — don't put same two people together twice in a week
      const cooldownOk = participants.every(p =>
        !isOnCooldown(user, p.userId)
      );
      if (!cooldownOk) continue;

      // Check vent/listen balance
      const { venters, listeners } = getVentListenBalance(participants);
      if (user.intent === 'vent' && venters >= 4) continue;
      if (user.intent === 'listen' && listeners >= 3) continue;

      // This room works — add the user
      room.participants.push({
        userId: user._id,
        handle: user.handle,
        level: user.level,
        stack: user.stack,
        intent: user.intent,
        joinedAt: new Date()
      });

      
   // If room is now full, activate it
      if (room.participants.length >= room.maxParticipants) {
        room.status = 'active';
        room.startedAt = new Date();
      }
      // If minimum 2 people and room has been waiting 2+ minutes, activate anyway
      const waitTime = new Date() - room.createdAt;
      if (room.participants.length >= 2 && waitTime > 2 * 60 * 1000) {
        room.status = 'active';
        room.startedAt = new Date();
      }

      await room.save();
      return room;
    }

    // No suitable room found — create a new one
    let roomNumber = generateRoomNumber();
    let exists = await Room.findOne({ roomNumber });
    while (exists) {
      roomNumber = generateRoomNumber();
      exists = await Room.findOne({ roomNumber });
    }

    const newRoom = await Room.create({
      roomNumber,
      prompt: getRandomPrompt(),
      participants: [{
        userId: user._id,
        handle: user.handle,
        level: user.level,
        stack: user.stack,
        intent: user.intent,
        joinedAt: new Date()
      }],
      status: 'waiting'
    });

    return newRoom;

  } catch (error) {
    console.error('Matchmaker error:', error);
    throw error;
  }
};

// Call this after a session ends to set cooldowns between all participants
const setCooldowns = async (roomId) => {
  try {
    const room = await Room.findById(roomId);
    if (!room) return;

    const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const participantIds = room.participants.map(p => p.userId);

    for (const participantId of participantIds) {
      const otherIds = participantIds.filter(
        id => id.toString() !== participantId.toString()
      );

      await User.findByIdAndUpdate(participantId, {
        $push: {
          cooldowns: otherIds.map(id => ({
            userId: id,
            until: oneWeekFromNow
          }))
        }
      });
    }
  } catch (error) {
    console.error('Cooldown error:', error);
  }
};

module.exports = { findOrCreateRoom, setCooldowns };