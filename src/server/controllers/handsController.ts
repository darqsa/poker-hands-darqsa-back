import { NextFunction, Request, Response } from "express";
import Hand from "../../database/models/Hand";
import User from "../../database/models/User";
import createCustomError from "../../utils/createCustomError";
import { CustomRequest } from "../types/interfaces";

export const loadHands = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hands = await Hand.find();

    res.status(200).json({ hands });
  } catch (error) {
    const customError = createCustomError(
      400,
      "Could not get hands",
      "Could not get hands"
    );
    next(customError);
  }
};

export const createHand = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const hand = req.body;

  try {
    const newHand = await Hand.create(hand);

    const user = await User.findById(hand.owner);
    await User.findByIdAndUpdate(hand.owner, {
      hands: [...user.hands, newHand.id],
    });

    res.status(201).json("Hand created successfully");
  } catch (error) {
    const customError = createCustomError(
      400,
      "Error creating new Hand",
      "Error creating new Hand"
    );
    next(customError);
  }
};

export const deleteHand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { handId } = req.params;

  try {
    await Hand.findByIdAndDelete(handId);

    res.status(201).json("Hand deleted successfully");
  } catch (error) {
    const customError = createCustomError(
      400,
      "Error deleting Hand",
      "Error deleting  Hand"
    );
    next(customError);
  }
};

export const loadHandById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { handId } = req.params;
  try {
    const hand = await Hand.findById(handId);

    res.status(201).json(hand);
  } catch (error) {
    const customError = createCustomError(
      400,
      "Couldn't find hand",
      "Couldn't find hand"
    );
    next(customError);
  }
};
