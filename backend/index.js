import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import searchRouter from "./routes/search.routes.js";
import searchHistoryRouter from "./routes/searchHistory.route.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRouter);
app.use("/api/search", searchRouter);
app.use("/api/history",searchHistoryRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});