import { NextFunction } from "express";
import { Model } from "mongoose";
import { Item, ItemType } from "../models/Item";
import { UserType } from "../models/User";

export function usePagination(
  model: Model<UserType | ItemType>,
  population?: String,
  populators?: Object
) {
  return async (req: any, res: any, next: any) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const region = req.query.region;
    const itemCase = req.query.case;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results: {
      next?: { page: number; limit: number };
      previous?: { page: number; limit: number };
      results?: any;
    } = {};

    try {
      const itemCount = await model.find({ region, case: itemCase });

      const queriedResults = await model
        .find({ region, case: itemCase })
        .limit(limit)
        .skip(startIndex)
        .sort({ date: -1 })
        .exec();

      if (endIndex < itemCount.length) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit,
        };
      }

      results.results = queriedResults;
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}
