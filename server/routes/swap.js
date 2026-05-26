import express from 'express';
import Schedule from '../models/Schedule.js';
import Swap from '../models/Swap.js';
import { startOfWeek } from '../utils/date.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { teamId, fromMemberId, toMemberId, weekStart, reason } = req.body;

    if (!teamId || !fromMemberId || !toMemberId || !weekStart) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const parsedWeekStart = new Date(weekStart);
    if (isNaN(parsedWeekStart.getTime())) {
      return res.status(400).json({ error: 'Invalid weekStart date' });
    }

    const normalizedWeekStart = startOfWeek(parsedWeekStart);

    let schedule = await Schedule.findOne({ teamId, weekStart: normalizedWeekStart });
    if (!schedule) {
      schedule = new Schedule({
        teamId,
        weekStart: normalizedWeekStart,
        memberId: toMemberId,
        status: 'active',
      });
    } else {
      schedule.memberId = toMemberId;
      schedule.status = 'active';
    }

    await schedule.save();

    const swapLog = new Swap({
      teamId,
      fromMemberId,
      toMemberId,
      weekStart: normalizedWeekStart,
      reason: reason || '',
      performedBy: req.user?._id || null,
    });
    await swapLog.save();

    const populatedSchedule = await Schedule.findById(schedule._id).populate('teamId memberId');
    res.status(200).json(populatedSchedule);
  } catch (err) {
    console.error('Swap error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
