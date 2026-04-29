import express from 'express';
import { getSearchHistory, saveSearchHistory } from '../controllers/searchHistory.controller';

const searchHistoryRouter = express.Router();

searchHistoryRouter.post("/save-history",saveSearchHistory);
searchHistoryRouter.get("/gethistory", getSearchHistory);

export default searchHistoryRouter;